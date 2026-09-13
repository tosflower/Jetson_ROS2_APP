import { router, useIsFocused } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BufferedImage from '@/BufferedImage';
import TerminalWindow from '@/TerminalWindow';
import { useCommands } from '@/providers/command-provider';
import { useGateway } from '@/providers/gateway-provider';
import { EmptyState, Field, Row, Screen, Section, StatusBanner } from '@/ui/primitives';
import { spacing, useThemeColors } from '@/ui/tokens';

export default function ImagesScreen(): React.JSX.Element {
  const gateway = useGateway();
  const commands = useCommands();
  const colors = useThemeColors();
  const focused = useIsFocused();
  const { width, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  // 使用可用宽度判断分栏；旋转只改变布局，不重建订阅或图片组件。
  const columns = (width - insets.left - insets.right) / Math.max(1, fontScale) >= 900;
  const refreshTopics = gateway.refreshTopics;
  useEffect(() => {
    if (!focused) return;
    void refreshTopics();
    const timer = setInterval(() => void refreshTopics(), 2000);
    return () => clearInterval(timer);
  }, [focused, refreshTopics]);

  const imageTopics = useMemo(() => [...gateway.topics].sort((left, right) => {
    // 同名话题优先展示压缩传输，其他情况保持按名称排列，接近 rqt 的浏览体验。
    const byName = left.name.localeCompare(right.name);
    if (byName !== 0) return byName;
    return left.message_type.endsWith('/CompressedImage') ? -1 : 1;
  }), [gateway.topics]);
  const visibleTopics = useMemo(() => {
    const keyword = gateway.topicName.trim().toLowerCase();
    return keyword
      ? imageTopics.filter((topic) => topic.name.toLowerCase().includes(keyword))
      : imageTopics;
  }, [imageTopics, gateway.topicName]);
  const runs = commands.snapshot?.history ?? [];
  const terminalRun = runs.find((run) => run.id === commands.selectedRunId)
    ?? commands.snapshot?.active_runs.at(-1)
    ?? runs[0];

  const preview = <View style={{ flex: columns ? 1 : undefined, minWidth: 0, gap: spacing.xxl }}>
    <Section title="图像预览" footer={gateway.selectedTopic ? '轻点画面全屏查看，双指缩放查看细节。' : undefined}>
      {gateway.selectedTopic ? <View style={{ padding: spacing.lg, gap: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.sm }}>
          <Text selectable style={{ flex: 1, minWidth: 120, color: colors.label, fontSize: 16, fontWeight: '600' }}>{gateway.selectedTopic.name}</Text>
          <Text selectable style={{ color: gateway.gatewayState === '已连接' ? colors.success : colors.secondaryLabel, fontSize: 13, fontWeight: '600', fontVariant: ['tabular-nums'] }}>
            {gateway.gatewayState === '已连接' && gateway.fps > 0 ? `${gateway.fps.toFixed(1)} FPS` : gateway.gatewayState === '已连接' ? '等待图像' : '已离线'}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="全屏查看图像"
          accessibilityHint="打开后可以双指缩放、拖动画面和双击还原"
          onPress={() => router.push('/image-viewer')}
          style={({ pressed }) => ({ aspectRatio: 4 / 3, backgroundColor: '#000000', borderRadius: 12, borderCurve: 'continuous', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', opacity: pressed ? 0.85 : 1 })}
        >
          {gateway.imageFrame
            ? <BufferedImage uri={gateway.imageFrame.uri} tag={gateway.imageFrame.tag} active={focused} onFrameLoaded={gateway.onFrameLoaded} />
            : <Text style={{ color: '#A1A1AA', padding: spacing.xl, textAlign: 'center' }}>等待所选话题发布图像</Text>}
          <View pointerEvents="none" style={{ position: 'absolute', right: 12, bottom: 12, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 24, backgroundColor: 'rgba(28,28,30,0.82)' }}>
            <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '600' }}>全屏查看 ↗</Text>
          </View>
        </Pressable>
        {gateway.gatewayState !== '已连接' ? <StatusBanner message={gateway.lastMessage} tone="warning" /> : null}
      </View> : <EmptyState title="选择图像话题" detail="支持 ROS 原始图像和压缩图像，选择后画面会在这里显示。" />}
    </Section>
    <Section title="终端信息">
      <View style={{ padding: spacing.lg }}>
        <TerminalWindow run={terminalRun} logs={terminalRun ? commands.terminalLogs[terminalRun.id] ?? '' : ''} message={commands.message} />
      </View>
    </Section>
  </View>;

  const topicBrowser = <View style={{ width: columns ? 340 : '100%', gap: spacing.xxl }}>
    <Section title="图像话题" footer="像 rqt 一样每 2 秒自动查找 Image 与 CompressedImage，无需手动刷新。">
      <View style={{ padding: spacing.lg, gap: spacing.sm }}>
        <Field value={gateway.topicName} onChangeText={gateway.setTopicName} autoCapitalize="none" placeholder="查找图像话题" />
      </View>
      {visibleTopics.map((topic, index) => (
        <Row
          key={`${topic.name}:${topic.message_type}`}
          label={topic.name}
          value={topic.supported === false ? '缺少转换依赖' : gateway.selectedTopic?.name === topic.name && gateway.selectedTopic.message_type === topic.message_type ? '已订阅' : `${topic.publishers ?? 0} 个发布者`}
          detail={topic.message_type.endsWith('/CompressedImage') ? '压缩图像' : '原始图像'}
          onPress={topic.supported === false ? undefined : () => gateway.selectTopic(topic)}
          last={index === visibleTopics.length - 1}
        />
      ))}
      {!visibleTopics.length ? <EmptyState
        title={imageTopics.length ? '没有匹配的话题' : '没有可以查看的可视化'}
        detail={imageTopics.length ? '请尝试输入其他话题关键词。' : '当前 ROS 图中未发现 sensor_msgs/msg/Image 或 CompressedImage 话题。'}
      /> : null}
    </Section>
    <StatusBanner message={gateway.topicMessage || gateway.lastMessage} tone={imageTopics.some((topic) => topic.supported !== false) ? 'neutral' : 'warning'} />
  </View>;

  return <Screen wide>
    <View style={{ flexDirection: columns ? 'row-reverse' : 'column', alignItems: 'stretch', gap: spacing.xxl }}>
      {preview}
      {topicBrowser}
    </View>
  </Screen>;
}
