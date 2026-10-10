import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Constants from 'expo-constants';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import CommandPanel, { CommandPage, Run } from './CommandPanel';
import BufferedImage from './BufferedImage';
import { FrameMetadata, LatencyTracker, LatencySummary, latencyLabels } from './latency';
import {
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type GatewayState = '未连接' | '连接中' | '已连接' | '错误';
type Page = 'connect' | CommandPage | 'image' | 'report';
type NavigationGuard = (continueNavigation: () => void) => void;
type ImageTopic = { name: string; message_type: string; publishers?: number; supported?: boolean };
type LaunchState = 'stopped' | 'running' | 'failed';

type GatewayEvent = {
  type: 'frame' | 'image' | 'status' | 'log' | 'clock_pong' | 'latency_result';
  connection_ready?: boolean;
  frame_id?: number;
  send_mono_ms?: number;
  latency_ms?: Record<string, number>;
  client_ms?: number;
  server_receive_ms?: number;
  server_send_ms?: number;
  jpeg_base64?: string;
  fps?: number;
  launch_state?: LaunchState;
  message?: string;
};

// Expo 在打包时替换 EXPO_PUBLIC 环境变量；移动端无需 Node 全局类型。
declare const process: { env: { EXPO_PUBLIC_GATEWAY_ADDRESS?: string } };

const GATEWAY_PORT = 8080;
const FALLBACK_GATEWAY_ADDRESS = `192.168.1.100:${GATEWAY_PORT}`;
const CONFIGURED_GATEWAY_ADDRESS = process.env.EXPO_PUBLIC_GATEWAY_ADDRESS?.trim();

/**
 * 将用户输入的地址规范化为 HTTP 基地址。
 * 示例输入：192.168.1.10:8080、http://192.168.1.10:8080。
 */
function normalizeHttpBase(value: string): string {
  const trimmed = value.trim().replace(/\/$/, '');
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `http://${trimmed}`;
}

function websocketUrl(httpBase: string, topic?: ImageTopic): string {
  const query = topic ? `topic=${encodeURIComponent(topic.name)}&message_type=${encodeURIComponent(topic.message_type)}` : 'stream=0';
  return `${httpBase.replace(/^http/, 'ws')}/ws/mobile?${query}`;
}

/** 判断 IPv4 地址是否属于手机通常可以直接访问的私有局域网。 */
function isPrivateIpv4(hostname: string): boolean {
  const octets = hostname.split('.').map(Number);
  if (octets.length !== 4 || octets.some((value) => !Number.isInteger(value) || value < 0 || value > 255)) {
    return false;
  }
  return (
    octets[0] === 10
    || (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31)
    || (octets[0] === 192 && octets[1] === 168)
  );
}

/**
 * Expo Go 扫码后，hostUri 指向提供 JS Bundle 的电脑。
 * 网关和 Metro 位于同一台电脑，因此复用主机 IP，并把端口替换为 8080。
 */
function detectGatewayAddress(): string | undefined {
  const hostUri = Constants.expoConfig?.hostUri ?? Constants.expoGoConfig?.debuggerHost;
  if (!hostUri) {
    return undefined;
  }

  try {
    const url = new URL(hostUri.includes('://') ? hostUri : `http://${hostUri}`);
    if (!isPrivateIpv4(url.hostname)) {
      // tunnel 模式返回公网域名，该域名无法直接访问本地 8080 网关。
      return undefined;
    }
    return `${url.hostname}:${GATEWAY_PORT}`;
  } catch {
    return undefined;
  }
}

const detectedGatewayAddress = detectGatewayAddress();
// Expo Go 优先使用 Metro 主机地址；EAS 独立包使用构建时配置的网关地址。
const initialGatewayAddress = detectedGatewayAddress
  ?? CONFIGURED_GATEWAY_ADDRESS
  ?? FALLBACK_GATEWAY_ADDRESS;
const initialGatewayMessage = detectedGatewayAddress
  ? `已自动识别网关地址 ${detectedGatewayAddress}`
  : CONFIGURED_GATEWAY_ADDRESS
    ? `已使用构建配置的网关地址 ${CONFIGURED_GATEWAY_ADDRESS}`
    : '未识别到局域网 IP，请手动填写网关地址';

/** 安卓边到边布局统一由原生安全区域处理，兼容刘海与手势/三键导航。 */
export default function App(): React.JSX.Element {
  return <SafeAreaProvider><GatewayApp /></SafeAreaProvider>;
}

function GatewayApp(): React.JSX.Element {
  const [page, setPage] = useState<Page>('connect');
  const pageHistoryRef = useRef<Page[]>([]);
  const pageScrollOffsetsRef = useRef<Partial<Record<Page, number>>>({});
  const navigationGuardRef = useRef<NavigationGuard | undefined>(undefined);
  const scrollRef = useRef<ScrollView>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<ImageTopic>();
  const [topics, setTopics] = useState<ImageTopic[]>([]);
  const [topicName, setTopicName] = useState('');
  const [topicType, setTopicType] = useState('sensor_msgs/msg/CompressedImage');
  const [topicMessage, setTopicMessage] = useState('');
  const [run, setRun] = useState<Run | null>(null);
  const runIdRef = useRef<string | undefined>(undefined);
  const connectionEpoch = useRef(0);
  const socketCleanup = useRef<() => void>(() => {});
  const [gatewayAddress, setGatewayAddress] = useState(initialGatewayAddress);
  const [connectedBase, setConnectedBase] = useState(normalizeHttpBase(initialGatewayAddress));
  const [gatewayState, setGatewayState] = useState<GatewayState>('未连接');
  const [imageFrame, setImageFrame] = useState<{ uri: string; tag: number }>();
  const [fps, setFps] = useState(0);
  const [lastMessage, setLastMessage] = useState(initialGatewayMessage);
  const [latency, setLatency] = useState<Record<string, LatencySummary>>({});
  const [lastLatencyAt, setLastLatencyAt] = useState<number>();
  const [debugNow, setDebugNow] = useState(0);
  const trackerRef = useRef(new LatencyTracker());
  const sequenceRef = useRef(0);
  const frameTimingRef = useRef(new Map<number, {
    meta: FrameMetadata; received: number; converted: number; network?: number;
    socket: WebSocket;
  }>());
  const loadedAtRef = useRef<number | undefined>(undefined);
  const socketRef = useRef<WebSocket | null>(null);

  /** 记录真实翻页顺序，使返回操作能恢复上一画面及其现有状态。 */
  const navigate = useCallback((target: Page): void => {
    if (page === target) return;
    const commit = (): void => {
      pageHistoryRef.current.push(page);
      setPage(target);
    };
    if (navigationGuardRef.current) navigationGuardRef.current(commit);
    else commit();
  }, [page]);

  const goBack = useCallback((): void => {
    const commit = (): void => setPage(pageHistoryRef.current.pop()
      ?? (page === 'connect' ? 'connect' : 'tasks'));
    if (navigationGuardRef.current) navigationGuardRef.current(commit);
    else commit();
  }, [page]);

  const registerNavigationGuard = useCallback((guard: NavigationGuard | undefined): void => {
    navigationGuardRef.current = guard;
  }, []);

  const onFrameLoaded = useCallback((tag: number): void => {
    const frame = frameTimingRef.current.get(tag);
    frameTimingRef.current.delete(tag);
    if (!frame || socketRef.current !== frame.socket) return;
    const now = performance.now();
    loadedAtRef.current = now;
    const values: Record<string, number> = {
      image_load_ms: now - frame.converted,
      receive_to_load_ms: now - frame.received,
    };
    const phases = frame.meta.latency_ms;
    const chain = ['perception_total_ms', 'ros_delivery_ms', 'image_convert_ms',
      'resize_ms', 'jpeg_encode_ms', 'broadcast_wait_ms'];
    if (frame.network !== undefined && phases
        && chain.every((key) => Number.isFinite(phases[key]) && phases[key] >= 0)) {
      values.pipeline_to_load_estimate_ms = chain.reduce((sum, key) => sum + phases[key], 0)
        + frame.network + now - frame.received;
    }
    trackerRef.current.add(values);

    if (frame.meta.frame_id !== undefined && frame.socket.readyState === WebSocket.OPEN) {
      frame.socket.send(JSON.stringify({ type: 'frame_ack', frame_id: frame.meta.frame_id, stage: 'loaded' }));
    }
  }, []);

  useEffect(() => {
    // Debug 每秒刷新，避免每帧统计表重绘增加 UI 负担。
    const timer = setInterval(() => {
      setLatency(trackerRef.current.snapshot());
      setLastLatencyAt(loadedAtRef.current);
      setDebugNow(performance.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const disconnect = useCallback((): void => {
    connectionEpoch.current += 1;
    socketCleanup.current();
    const socket = socketRef.current;
    socketRef.current = null;
    socket?.close();
  }, []);

  const connectToGateway = useCallback((address: string, topic?: ImageTopic): void => {
    disconnect();
    trackerRef.current = new LatencyTracker();
    frameTimingRef.current.clear();
    setLatency({});
    setLastLatencyAt(undefined);
    loadedAtRef.current = undefined;
    setImageFrame(undefined);
    setFps(0);
    const base = normalizeHttpBase(address);
    setConnectedBase(base);
    setGatewayState('连接中');
    setLastMessage(`正在连接 ${websocketUrl(base, topic)}`);

    try {
      const socket = new WebSocket(websocketUrl(base, topic));
      socket.binaryType = 'blob';
      socketRef.current = socket;

      let pendingFrame: { blob: Blob; meta: FrameMetadata; received: number; network?: number } | null = null;
      let nextMetadata: FrameMetadata = {};
      let pingTimer: ReturnType<typeof setInterval> | undefined;
      let isReadingFrame = false;
      let hasConnectionError = false;
      const connectionTimer = setTimeout(() => {
        if (socketRef.current !== socket) return;
        hasConnectionError = true;
        setGatewayState('错误'); setLastMessage('连接超时，请检查网关地址和服务版本');
        socket.close();
      }, 10000);
      socketCleanup.current = () => {
        clearTimeout(connectionTimer);
        if (pingTimer !== undefined) clearInterval(pingTimer);
        pendingFrame = null;
      };

      const decodeLatestFrame = (): void => {
        if (isReadingFrame || !pendingFrame) {
          return;
        }
        const frame = pendingFrame;
        pendingFrame = null;
        isReadingFrame = true;
        const conversionStart = performance.now();

        const reader = new FileReader();
        reader.onloadend = () => {
          if (socketRef.current === socket && typeof reader.result === 'string') {
            // WebSocket Blob 没有 MIME 类型时，补成 Image 可识别的 JPEG Data URI。
            const jpegUri = reader.result.replace(
              /^data:[^;]*;base64,/,
              'data:image/jpeg;base64,',
            );
            const converted = performance.now();
            const tag = ++sequenceRef.current;
            frameTimingRef.current.set(tag, {
              meta: frame.meta, received: frame.received, converted,
              network: frame.network, socket,
            });
            // 被最新帧策略丢弃的帧不会触发 onLoad，限制诊断缓存大小。
            while (frameTimingRef.current.size > 128) {
              frameTimingRef.current.delete(frameTimingRef.current.keys().next().value!);
            }
            trackerRef.current.add({
              blob_wait_ms: conversionStart - frame.received,
              blob_convert_ms: converted - conversionStart,
            });
            setImageFrame({ uri: jpegUri, tag });
          }
          isReadingFrame = false;
          decodeLatestFrame();
        };
        reader.readAsDataURL(frame.blob);
      };

      // 网关周期性发送状态，也可在此处扩展心跳与配对令牌。
      socket.onopen = () => {
        if (socketRef.current !== socket) return;

        const ping = (): void => {
          if (socketRef.current !== socket || socket.readyState !== WebSocket.OPEN) return;
          const client_ms = performance.now();
          trackerRef.current.probe(client_ms);
          socket.send(JSON.stringify({ type: 'clock_ping', client_ms }));
        };
        ping();
        pingTimer = setInterval(ping, 2000);
      };
      socket.onmessage = (event: MessageEvent<string | Blob>) => {
        if (socketRef.current !== socket) return;
        const received = performance.now();
        if (event.data instanceof Blob) {
          // 解码期间覆盖 pendingFrame，保证始终追赶最新画面而不是积压旧帧。
          const meta = nextMetadata;
          nextMetadata = {};
          const network = trackerRef.current.network(meta.send_mono_ms, received);
          trackerRef.current.add(meta.latency_ms ?? {});
          if (network !== undefined) trackerRef.current.add({ network_estimate_ms: network });
          if (meta.frame_id !== undefined && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'frame_ack', frame_id: meta.frame_id, stage: 'received' }));
          }
          pendingFrame = { blob: event.data, meta, received, network };
          decodeLatestFrame();
          return;
        }
        try {
          const data = JSON.parse(event.data) as GatewayEvent;
          if (data.connection_ready) {
            clearTimeout(connectionTimer);
            setGatewayState('已连接'); setLastMessage('连接成功'); setSessionReady(true);
          }
          if (data.type === 'clock_pong') {
            trackerRef.current.pong(data.client_ms!, data.server_receive_ms!, data.server_send_ms!, received);
          }
          if (data.type === 'latency_result') trackerRef.current.add(data.latency_ms ?? {});
          if (data.type === 'frame') {
            nextMetadata = data;
            setFps(data.fps ?? 0);
          }
          // 保留旧 base64 网关兼容，便于平滑切换服务进程。
          if (data.type === 'image' && data.jpeg_base64) {
            setImageFrame({ uri: `data:image/jpeg;base64,${data.jpeg_base64}`, tag: ++sequenceRef.current });
            setFps(data.fps ?? 0);
          }
          if (data.type === 'status' || data.type === 'log') {
            setLastMessage(data.message ?? '网关状态已更新');

          }
        } catch {
          setLastMessage('收到无法识别的网关消息');
        }
      };
      socket.onerror = () => {
        if (socketRef.current !== socket) return;
        hasConnectionError = true;
        setGatewayState('错误');
        setLastMessage('无法连接网关，请检查热点、IP 地址和端口');
      };
      socket.onclose = () => {
        clearTimeout(connectionTimer);
        if (pingTimer !== undefined) clearInterval(pingTimer);
        pendingFrame = null;
        if (socketRef.current === socket) {
          socketRef.current = null;
          // 连接失败时 onerror 会紧接着触发 onclose，保留“错误”以免掩盖真实状态。
          if (!hasConnectionError) {
            setGatewayState('未连接');
            setLastMessage('网关连接已断开');
          }
        }
      };
    } catch {
      setGatewayState('错误');
      setLastMessage('网关地址格式错误');
    }
  }, [disconnect]);

  useEffect(() => {
    Keyboard.dismiss();
    // 页面状态由父组件保留；返回时同时恢复用户上次浏览的位置。
    const frame = requestAnimationFrame(() => scrollRef.current?.scrollTo({
      y: pageScrollOffsetsRef.current[page] ?? 0,
      animated: false,
    }));
    return () => cancelAnimationFrame(frame);
  }, [page]);

  // 初始页仅填写地址，用户点击连接后才访问网关。
  useEffect(() => disconnect, [disconnect]);

  const checkGateway = async (): Promise<void> => {
    disconnect();
    setSessionReady(false); setSelectedTopic(undefined); setRun(null); runIdRef.current = undefined;
    setGatewayState('连接中'); setLastMessage('正在确认网关…');
    const epoch = connectionEpoch.current;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const base = normalizeHttpBase(gatewayAddress);
      const url = new URL(base);
      if (!['http:', 'https:'].includes(url.protocol) || !url.hostname) throw new Error('请输入有效网关地址');
      const response = await fetch(`${base}/health`, { signal: controller.signal });
      const result = await response.json();
      if (!response.ok || result.status !== 'ok') throw new Error('网关健康检查失败');
      if (!['commands', 'defaults', 'image_topics', 'latency', 'multi_terminal', 'yaml_editor', 'build']
        .every((name) => result.capabilities?.includes(name))) {
        throw new Error('请重启并更新 Jetson 网关：当前服务缺少多终端或参数编辑接口');
      }
      if (epoch !== connectionEpoch.current) return;
      connectToGateway(base);
    } catch (error) {
      if (epoch !== connectionEpoch.current) return;
      setGatewayState('错误'); setLastMessage(error instanceof Error ? error.message : '连接失败');
    } finally { clearTimeout(timer); }
  };

  const onRun = useCallback((value: Run | null): void => {
    setRun(value);
    if (value?.id === runIdRef.current) return;
    runIdRef.current = value?.id;
    // 不把上一次任务的延时样本归给本次任务。
    trackerRef.current = new LatencyTracker();
    frameTimingRef.current.clear(); loadedAtRef.current = undefined;
    setLatency({}); setLastLatencyAt(undefined);
  }, []);

  useEffect(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (page === 'connect') return false;
      goBack();
      return true;
    });
    return () => listener.remove();
  }, [goBack, page]);

  const refreshTopics = useCallback(async (): Promise<void> => {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000);
      try {
        const response = await fetch(`${connectedBase}/api/images/topics`, { signal: controller.signal });
        const result = await response.json();
        if (!response.ok) throw new Error('读取图像话题失败');
        setTopics(result.topics);
        setTopicMessage(result.topics.length ? '选择下面的话题，或手动输入名称' : '尚未发现图片话题，可先运行任务再刷新');
      } finally { clearTimeout(timer); }
    } catch (error) { setTopicMessage(error instanceof Error ? error.message : '读取话题失败'); }
  }, [connectedBase]);

  useEffect(() => {
    if (page !== 'image') return undefined;
    const initial = setTimeout(() => void refreshTopics(), 0);
    // 类似 rqt 的话题浏览器：运行节点出现或退出后，列表会自动更新。
    const timer = setInterval(() => void refreshTopics(), 2000);
    return () => { clearTimeout(initial); clearInterval(timer); };
  }, [page, refreshTopics]);

  const selectTopic = (topic: ImageTopic): void => {
    if (!topic.name.trim().startsWith('/')) { setTopicMessage('请输入以 / 开头的完整话题名'); return; }
    const selected = { ...topic, name: topic.name.trim() };
    setSelectedTopic(selected); setTopicName(selected.name); setTopicType(selected.message_type);
    connectToGateway(connectedBase, selected);
  };

  const latencyPanel = useMemo(() => (
    <View style={styles.card}>
          <Text style={styles.label}>延时报告 · ms</Text>
          <Text style={styles.status}>
            最近 300 样本 · 当前 / 平均 / P95 / 最大
            {lastLatencyAt === undefined ? '\n等待带计时信息的图像' : `\n最近加载：${Math.max(0, (debugNow - lastLatencyAt) / 1000).toFixed(1)} 秒前`}
          </Text>
          {Object.entries(latencyLabels).map(([key, label]) => {
            const value = latency[key];
            return (
              <View key={key}>
                <Text style={styles.status}>{label}</Text>
                <Text style={styles.fps}>{value
                  ? `${value.latest.toFixed(1)} / ${value.mean.toFixed(1)} / ${value.p95.toFixed(1)} / ${value.max.toFixed(1)}`
                  : '—'}</Text>
              </View>
            );
          })}
          <Text style={styles.status}>
            单向延迟使用最近 15 秒最低 RTT 样本估算时钟偏移，网络不对称时有误差。
            回执往返包含 JPEG 发送及回程；onLoad 是原生图片加载完成，尚非屏幕实际呈现。
            缺少计时信息时显示 —；感知合计包含上方感知分段，请勿重复相加。
          </Text>
        </View>
  ), [latency, lastLatencyAt, debugNow]);

  const visibleTopics = useMemo(() => {
    const keyword = topicName.trim().toLowerCase();
    if (!keyword) return topics;
    return topics.filter((topic) => topic.name.toLowerCase().includes(keyword));
  }, [topics, topicName]);

  const button = (label: string, action: () => void, disabled = false): React.JSX.Element => (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={action} style={[styles.secondaryButton, disabled && { opacity: .4 }]}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag" scrollEventThrottle={16}
        onScroll={(event) => { pageScrollOffsetsRef.current[page] = event.nativeEvent.contentOffset.y; }}>
        <Text style={styles.title}>{page === 'connect' ? '连接 Jetson' : page === 'image' ? '图像可视化' : page === 'report' ? '延时报告' : page === 'terminal' ? '多终端' : page === 'files' ? '参数文件' : '任务控制'}</Text>
        {page !== 'connect' && button('‹ 返回上一画面', goBack)}
        {page === 'connect' ? <View style={styles.card}>
          <Text style={styles.label}>网关地址</Text>
          <TextInput autoCapitalize="none" autoCorrect={false} keyboardType="url"
            onChangeText={(value) => {
              disconnect(); setGatewayAddress(value); setSessionReady(false); setGatewayState('未连接');
            }} placeholder="例如 10.42.0.1:8080" placeholderTextColor="#77839a"
            style={styles.input} value={gatewayAddress} />
          {button('连接网关', () => void checkGateway(), gatewayState === '连接中' || !gatewayAddress.trim())}
          <Text style={gatewayState === '已连接' ? styles.fps : styles.status}>
            {gatewayState === '已连接' ? '连接成功' : lastMessage}
          </Text>
          {button('下一页 · 选择任务', () => navigate('tasks'), gatewayState !== '已连接' || !sessionReady)}
        </View> : <>
          <Text style={styles.status}>{connectedBase} · {gatewayState}</Text>
          {gatewayState !== '已连接' && <View style={styles.card}>
            <Text style={styles.status}>{lastMessage}</Text>
            {button('返回连接页', () => navigate('connect'))}
          </View>}
        </>}
        {sessionReady && <View style={['tasks', 'custom', 'history', 'terminal', 'files'].includes(page) ? undefined : styles.hidden}>
          <CommandPanel key={connectedBase} base={connectedBase}
            page={['tasks', 'custom', 'history', 'terminal', 'files'].includes(page) ? page as CommandPage : 'tasks'}
            navigate={navigate} visualize={() => navigate('image')} report={() => navigate('report')}
            onRun={onRun} registerNavigationGuard={registerNavigationGuard} />
        </View>}
        {page === 'image' && <View style={styles.card}>
          <Text style={styles.label}>选择图片话题</Text>
          {button('刷新话题列表', () => void refreshTopics())}
          <Text style={styles.status}>{topicMessage}</Text>
          <TextInput value={topicName} onChangeText={setTopicName} autoCorrect={false} autoCapitalize="none"
            placeholder="输入关键词筛选，或输入完整 /话题名" placeholderTextColor="#77839a" style={styles.input} />
          <Text style={styles.status}>显示 {visibleTopics.length} / {topics.length} 个可视化图像话题</Text>
          {visibleTopics.map((topic) => <View key={`${topic.name}:${topic.message_type}`}>
            {button(topic.name, () => selectTopic(topic), topic.supported === false)}
            <Text style={styles.status}>{topic.message_type} · 发布者 {topic.publishers ?? '未知'}
              {topic.supported === false ? ' · 网关缺少 cv_bridge / OpenCV' : ''}</Text>
          </View>)}
          <View style={styles.actionRow}>
            {button(`${topicType.endsWith('/CompressedImage') ? '✓ ' : ''}压缩图像`, () => setTopicType('sensor_msgs/msg/CompressedImage'))}
            {button(`${topicType.endsWith('/Image') ? '✓ ' : ''}原始图像`, () => setTopicType('sensor_msgs/msg/Image'))}
          </View>
          {button('订阅并显示', () => selectTopic({ name: topicName, message_type: topicType }), !topicName.trim())}
          {button('查看延时报告', () => navigate('report'), !run)}
        </View>}
        {selectedTopic && <View style={page === 'image' ? styles.card : styles.hidden}>
          <Text style={styles.label}>{selectedTopic.name}</Text>
          <Text style={styles.fps}>{fps > 0 ? `${fps.toFixed(1)} FPS` : '等待图像'}
            {lastLatencyAt !== undefined ? ` · 最近加载 ${Math.max(0, (debugNow - lastLatencyAt) / 1000).toFixed(1)} 秒前` : ''}</Text>
          <Text style={styles.status}>{lastMessage}</Text>
          <View style={styles.imageBox}>
            {imageFrame ? <BufferedImage uri={imageFrame.uri} tag={imageFrame.tag} onFrameLoaded={onFrameLoaded} />
              : <Text style={styles.emptyImageText}>等待所选话题发布图像</Text>}
          </View>
        </View>}
        {page === 'report' && <>
          <View style={styles.card}>
            <Text selectable style={styles.label}>{run?.command ?? '尚未运行任务'}</Text>
            <Text style={styles.status}>{selectedTopic ? `话题：${selectedTopic.name}` : '尚未选择图片话题；请选择话题并接收图像后查看图像延时。'}</Text>
            <Text style={styles.status}>切换任务或话题会重新统计。停止任务后保留本次会话样本，重启 App 不保留报告。</Text>
            {button('前往图像可视化', () => navigate('image'))}
          </View>
          {latencyPanel}
        </>}
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hidden: { display: 'none' },
  safeArea: { flex: 1, backgroundColor: '#0a1220' },
  page: { gap: 16, padding: 18, width: '100%', maxWidth: 760, alignSelf: 'center', paddingBottom: 28 },
  title: { color: '#f5f8ff', fontSize: 26, fontWeight: '700' },
  subtitle: { color: '#9cacc6', fontSize: 14, marginTop: -10 },
  card: { backgroundColor: '#121f34', borderColor: '#233956', borderRadius: 14, borderWidth: 1, gap: 10, padding: 14 },
  label: { color: '#eaf2ff', fontSize: 16, fontWeight: '600' },
  input: { backgroundColor: '#091321', borderColor: '#2c486c', borderRadius: 9, borderWidth: 1, color: '#f5f8ff', fontSize: 15, padding: 12 },
  secondaryButton: { alignItems: 'center', backgroundColor: '#285b96', borderRadius: 9, padding: 12, minHeight: 48, justifyContent: 'center' },
  startButton: { alignItems: 'center', backgroundColor: '#157a58', borderRadius: 9, flex: 1, padding: 12 },
  stopButton: { alignItems: 'center', backgroundColor: '#a53d4c', borderRadius: 9, flex: 1, padding: 12 },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '700', textAlign: 'center', flexShrink: 1 },
  status: { color: '#a9bad3', fontSize: 12, lineHeight: 17 },
  presetDescription: { color: '#a9bad3', fontSize: 12, marginTop: 3 },
  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  imageHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  fps: { color: '#71d5ad', fontSize: 13, fontWeight: '700' },
  imageBox: { alignItems: 'center', aspectRatio: 4 / 3, backgroundColor: '#07101c', borderRadius: 10, justifyContent: 'center', overflow: 'hidden' },
  emptyImageText: { color: '#77839a', fontSize: 14, padding: 28, textAlign: 'center' },
});
