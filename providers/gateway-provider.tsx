import Constants from 'expo-constants';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FrameMetadata, LatencySummary, LatencyTracker } from '@/latency';

export type GatewayState = '未连接' | '连接中' | '已连接' | '错误';
export type ImageTopic = { name: string; message_type: string; publishers?: number; supported?: boolean };

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
  message?: string;
};

export type GatewayContextValue = {
  gatewayAddress: string;
  setGatewayAddress: (value: string) => void;
  connectedBase: string;
  gatewayState: GatewayState;
  sessionReady: boolean;
  lastMessage: string;
  capabilities: string[];
  authToken?: string;
  checkGateway: (password: string) => Promise<void>;
  requestPower: (password: string, action: 'reboot' | 'poweroff') => Promise<void>;
  disconnect: () => void;
  selectedTopic?: ImageTopic;
  topics: ImageTopic[];
  topicName: string;
  setTopicName: (value: string) => void;
  topicType: string;
  setTopicType: (value: string) => void;
  topicMessage: string;
  refreshTopics: () => Promise<void>;
  selectTopic: (topic: ImageTopic) => void;
  imageFrame?: { uri: string; tag: number };
  fps: number;
  latency: Record<string, LatencySummary>;
  lastLatencyAt?: number;
  debugNow: number;
  onFrameLoaded: (tag: number) => void;
  resetRunLatency: () => void;
};

declare const process: { env: { EXPO_PUBLIC_GATEWAY_ADDRESS?: string } };

const GATEWAY_PORT = 8080;
const FALLBACK_GATEWAY_ADDRESS = `192.168.1.100:${GATEWAY_PORT}`;

function normalizeHttpBase(value: string): string {
  const trimmed = value.trim().replace(/\/$/, '');
  return trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `http://${trimmed}`;
}

function websocketUrl(httpBase: string, topic?: ImageTopic): string {
  const query = topic
    ? `topic=${encodeURIComponent(topic.name)}&message_type=${encodeURIComponent(topic.message_type)}`
    : 'stream=0';
  return `${httpBase.replace(/^http/, 'ws')}/ws/mobile?${query}`;
}

function isPrivateIpv4(hostname: string): boolean {
  const octets = hostname.split('.').map(Number);
  if (octets.length !== 4 || octets.some((value) => !Number.isInteger(value) || value < 0 || value > 255)) return false;
  return octets[0] === 10
    || (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31)
    || (octets[0] === 192 && octets[1] === 168);
}

/** Expo Go 中仅复用私有网段的 Metro 主机，避免把公网 tunnel 域名误当作 Jetson。 */
function detectGatewayAddress(): string | undefined {
  const hostUri = Constants.expoConfig?.hostUri ?? Constants.expoGoConfig?.debuggerHost;
  if (!hostUri) return undefined;
  try {
    const url = new URL(hostUri.includes('://') ? hostUri : `http://${hostUri}`);
    return isPrivateIpv4(url.hostname) ? `${url.hostname}:${GATEWAY_PORT}` : undefined;
  } catch {
    return undefined;
  }
}

const detectedAddress = detectGatewayAddress();
const configuredAddress = process.env.EXPO_PUBLIC_GATEWAY_ADDRESS?.trim();
const initialAddress = detectedAddress ?? configuredAddress ?? FALLBACK_GATEWAY_ADDRESS;
const initialMessage = detectedAddress
  ? `已自动识别网关地址 ${detectedAddress}`
  : configuredAddress
    ? `已使用构建配置的网关地址 ${configuredAddress}`
    : '未识别到局域网 IP，请手动填写网关地址';

const GatewayContext = React.createContext<GatewayContextValue | null>(null);

export function GatewayProvider({ children }: React.PropsWithChildren): React.JSX.Element {
  const [gatewayAddress, setGatewayAddressState] = useState(initialAddress);
  const [connectedBase, setConnectedBase] = useState(normalizeHttpBase(initialAddress));
  const [gatewayState, setGatewayState] = useState<GatewayState>('未连接');
  const [sessionReady, setSessionReady] = useState(false);
  const [lastMessage, setLastMessage] = useState(initialMessage);
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [authToken, setAuthToken] = useState<string>();
  const [selectedTopic, setSelectedTopic] = useState<ImageTopic>();
  const [topics, setTopics] = useState<ImageTopic[]>([]);
  const [topicName, setTopicName] = useState('');
  const [topicType, setTopicType] = useState('sensor_msgs/msg/CompressedImage');
  const [topicMessage, setTopicMessage] = useState('');
  const [imageFrame, setImageFrame] = useState<{ uri: string; tag: number }>();
  const [fps, setFps] = useState(0);
  const [latency, setLatency] = useState<Record<string, LatencySummary>>({});
  const [lastLatencyAt, setLastLatencyAt] = useState<number>();
  const [debugNow, setDebugNow] = useState(0);
  const connectionEpoch = useRef(0);
  const socketCleanup = useRef<() => void>(() => {});
  const socketRef = useRef<WebSocket | null>(null);
  const trackerRef = useRef(new LatencyTracker());
  const sequenceRef = useRef(0);
  const loadedAtRef = useRef<number | undefined>(undefined);
  const frameTimingRef = useRef(new Map<number, {
    meta: FrameMetadata; received: number; converted: number; network?: number; socket: WebSocket;
  }>());

  useEffect(() => {
    const timer = setInterval(() => {
      setLatency(trackerRef.current.snapshot());
      setLastLatencyAt(loadedAtRef.current);
      setDebugNow(performance.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const resetRunLatency = useCallback((): void => {
    trackerRef.current = new LatencyTracker();
    frameTimingRef.current.clear();
    loadedAtRef.current = undefined;
    setLatency({});
    setLastLatencyAt(undefined);
  }, []);

  const disconnect = useCallback((): void => {
    connectionEpoch.current += 1;
    socketCleanup.current();
    const socket = socketRef.current;
    socketRef.current = null;
    socket?.close();
  }, []);

  const connectToGateway = useCallback((address: string, token: string, topic?: ImageTopic): void => {
    disconnect();
    resetRunLatency();
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
      let reading = false;
      let connectionError = false;
      const connectionTimer = setTimeout(() => {
        if (socketRef.current !== socket) return;
        connectionError = true;
        setGatewayState('错误');
        setLastMessage('连接超时，请检查网关地址和服务版本');
        socket.close();
      }, 10000);
      socketCleanup.current = () => {
        clearTimeout(connectionTimer);
        if (pingTimer) clearInterval(pingTimer);
        pendingFrame = null;
      };

      const decodeLatestFrame = (): void => {
        if (reading || !pendingFrame) return;
        const frame = pendingFrame;
        pendingFrame = null;
        reading = true;
        const conversionStart = performance.now();
        const reader = new FileReader();
        reader.onloadend = () => {
          if (socketRef.current === socket && typeof reader.result === 'string') {
            const uri = reader.result.replace(/^data:[^;]*;base64,/, 'data:image/jpeg;base64,');
            const converted = performance.now();
            const tag = ++sequenceRef.current;
            frameTimingRef.current.set(tag, { meta: frame.meta, received: frame.received, converted, network: frame.network, socket });
            while (frameTimingRef.current.size > 128) {
              frameTimingRef.current.delete(frameTimingRef.current.keys().next().value!);
            }
            trackerRef.current.add({ blob_wait_ms: conversionStart - frame.received, blob_convert_ms: converted - conversionStart });
            setImageFrame({ uri, tag });
          }
          reading = false;
          decodeLatestFrame();
        };
        reader.readAsDataURL(frame.blob);
      };

      socket.onopen = () => {
        if (socketRef.current !== socket) return;
        // 首帧在 WebSocket 消息体中认证，避免把 Bearer token 放入 URL/访问日志。
        socket.send(JSON.stringify({ type: 'auth', token }));
        const ping = (): void => {
          if (socketRef.current !== socket || socket.readyState !== WebSocket.OPEN) return;
          const clientMs = performance.now();
          trackerRef.current.probe(clientMs);
          socket.send(JSON.stringify({ type: 'clock_ping', client_ms: clientMs }));
        };
        ping();
        pingTimer = setInterval(ping, 2000);
      };
      socket.onmessage = (event: MessageEvent<string | Blob>) => {
        if (socketRef.current !== socket) return;
        const received = performance.now();
        if (event.data instanceof Blob) {
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
            setGatewayState('已连接');
            setLastMessage('连接成功');
            setSessionReady(true);
          }
          if (data.type === 'clock_pong') trackerRef.current.pong(data.client_ms!, data.server_receive_ms!, data.server_send_ms!, received);
          if (data.type === 'latency_result') trackerRef.current.add(data.latency_ms ?? {});
          if (data.type === 'frame') {
            nextMetadata = data;
            setFps(data.fps ?? 0);
          }
          if (data.type === 'image' && data.jpeg_base64) {
            setImageFrame({ uri: `data:image/jpeg;base64,${data.jpeg_base64}`, tag: ++sequenceRef.current });
            setFps(data.fps ?? 0);
          }
          if (data.type === 'status' || data.type === 'log') setLastMessage(data.message ?? '网关状态已更新');
        } catch {
          setLastMessage('收到无法识别的网关消息');
        }
      };
      socket.onerror = () => {
        if (socketRef.current !== socket) return;
        connectionError = true;
        setGatewayState('错误');
        setLastMessage('无法连接网关，请检查热点、IP 地址和端口');
      };
      socket.onclose = () => {
        clearTimeout(connectionTimer);
        if (pingTimer) clearInterval(pingTimer);
        pendingFrame = null;
        if (socketRef.current === socket) {
          socketRef.current = null;
          if (!connectionError) {
            setGatewayState('未连接');
            setLastMessage('网关连接已断开');
          }
        }
      };
    } catch {
      setGatewayState('错误');
      setLastMessage('网关地址格式错误');
    }
  }, [disconnect, resetRunLatency]);

  useEffect(() => disconnect, [disconnect]);

  const setGatewayAddress = useCallback((value: string): void => {
    disconnect();
    setAuthToken(undefined);
    setGatewayAddressState(value);
    setSessionReady(false);
    setGatewayState('未连接');
  }, [disconnect]);

  const checkGateway = useCallback(async (password: string): Promise<void> => {
    disconnect();
    setSessionReady(false);
    setAuthToken(undefined);
    setSelectedTopic(undefined);
    setGatewayState('连接中');
    setLastMessage('正在验证 Ubuntu 密码并确认网关…');
    const epoch = connectionEpoch.current;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const base = normalizeHttpBase(gatewayAddress);
      const url = new URL(base);
      if (!['http:', 'https:'].includes(url.protocol) || !url.hostname) throw new Error('请输入有效网关地址');
      const loginResponse = await fetch(`${base}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        signal: controller.signal,
      });
      const loginResult = await loginResponse.json();
      if (!loginResponse.ok || typeof loginResult.token !== 'string') {
        throw new Error(typeof loginResult.detail === 'string' ? loginResult.detail : 'Ubuntu 密码验证失败');
      }
      const response = await fetch(`${base}/health`, { signal: controller.signal });
      const result = await response.json();
      if (!response.ok || result.status !== 'ok') throw new Error('网关健康检查失败');
      const required = ['commands', 'defaults', 'dynamic_defaults', 'history_clear', 'image_topics', 'latency', 'multi_terminal', 'yaml_editor', 'build', 'password_auth', 'system_power'];
      if (!required.every((name) => result.capabilities?.includes(name))) {
        throw new Error('请更新并重启 Jetson 网关：当前服务不支持动态启动配置或历史清理');
      }
      setCapabilities(Array.isArray(result.capabilities) ? result.capabilities : []);
      if (epoch === connectionEpoch.current) {
        setAuthToken(loginResult.token);
        connectToGateway(base, loginResult.token);
      }
    } catch (error) {
      if (epoch === connectionEpoch.current) {
        setGatewayState('错误');
        setLastMessage(error instanceof Error ? error.message : '连接失败');
      }
    } finally {
      clearTimeout(timer);
    }
  }, [connectToGateway, disconnect, gatewayAddress]);

  const requestPower = useCallback(async (password: string, action: 'reboot' | 'poweroff'): Promise<void> => {
    if (!authToken) throw new Error('请先连接并验证 Ubuntu 密码');
    const response = await fetch(`${connectedBase}/api/system/power`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ password, action }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(typeof result.detail === 'string' ? result.detail : '开发板电源操作失败');
    setLastMessage(action === 'reboot' ? '已接受重启请求，开发板即将离线' : '已接受关机请求，开发板即将离线');
    setGatewayState('连接中');
    setSessionReady(false);
    disconnect();
  }, [authToken, connectedBase, disconnect]);

  const refreshTopics = useCallback(async (): Promise<void> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(`${connectedBase}/api/images/topics`, {
        signal: controller.signal,
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
      });
      const result = await response.json();
      if (!response.ok) throw new Error('读取图像话题失败');
      setTopics(Array.isArray(result.topics) ? result.topics : []);
      const imageTopics: ImageTopic[] = Array.isArray(result.topics) ? result.topics : [];
      const availableCount = imageTopics.filter((topic) => topic.supported !== false).length;
      setTopicMessage(imageTopics.length
        ? `已发现 ${imageTopics.length} 个图像话题，${availableCount} 个可显示`
        : '没有可以查看的可视化：未发现 ROS 图像话题');
    } catch (error) {
      setTopicMessage(error instanceof Error ? error.message : '读取话题失败');
    } finally {
      clearTimeout(timer);
    }
  }, [authToken, connectedBase]);

  const selectTopic = useCallback((topic: ImageTopic): void => {
    if (!topic.name.trim().startsWith('/')) {
      setTopicMessage('请输入以 / 开头的完整话题名');
      return;
    }
    const selected = { ...topic, name: topic.name.trim() };
    setSelectedTopic(selected);
    setTopicName(selected.name);
    setTopicType(selected.message_type);
    if (!authToken) {
      setTopicMessage('认证会话已失效，请重新连接开发板');
      return;
    }
    connectToGateway(connectedBase, authToken, selected);
  }, [authToken, connectToGateway, connectedBase]);

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
    const chain = ['perception_total_ms', 'ros_delivery_ms', 'image_convert_ms', 'resize_ms', 'jpeg_encode_ms', 'broadcast_wait_ms'];
    if (frame.network !== undefined && phases && chain.every((key) => Number.isFinite(phases[key]) && phases[key] >= 0)) {
      values.pipeline_to_load_estimate_ms = chain.reduce((sum, key) => sum + phases[key], 0) + frame.network + now - frame.received;
    }
    trackerRef.current.add(values);
    if (frame.meta.frame_id !== undefined && frame.socket.readyState === WebSocket.OPEN) {
      frame.socket.send(JSON.stringify({ type: 'frame_ack', frame_id: frame.meta.frame_id, stage: 'loaded' }));
    }
  }, []);

  const value: GatewayContextValue = {
    gatewayAddress, setGatewayAddress, connectedBase, gatewayState, sessionReady, lastMessage, capabilities, authToken,
    checkGateway, requestPower, disconnect, selectedTopic, topics, topicName, setTopicName, topicType, setTopicType,
    topicMessage, refreshTopics, selectTopic, imageFrame, fps, latency, lastLatencyAt, debugNow,
    onFrameLoaded, resetRunLatency,
  };
  return <GatewayContext value={value}>{children}</GatewayContext>;
}

export function useGateway(): GatewayContextValue {
  const value = React.use(GatewayContext);
  if (!value) throw new Error('useGateway 必须在 GatewayProvider 内使用');
  return value;
}
