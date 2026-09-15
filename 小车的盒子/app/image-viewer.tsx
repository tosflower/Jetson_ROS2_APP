import { router, Stack } from 'expo-router';
import { Pressable, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGateway } from '@/providers/gateway-provider';
import ZoomableImage from '@/ui/zoomable-image';

/** 全屏页直接读取现有图像流；打开、旋转和关闭都不重新连接网关。 */
export default function ImageViewerScreen(): React.JSX.Element {
  const gateway = useGateway();
  const insets = useSafeAreaInsets();
  const close = (): void => {
    if (router.canGoBack()) router.back();
    else router.replace('/monitor/images');
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#000000', paddingLeft: insets.left, paddingRight: insets.right, paddingBottom: Math.max(8, insets.bottom) }}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{
        title: '图像预览',
        headerStyle: { backgroundColor: '#000000' },
        headerTintColor: '#FFFFFF',
        headerShadowVisible: false,
        headerBackVisible: false,
        // Android 的原生 Stack 需要页面级样式；iOS 使用上面的 StatusBar，兼容 Expo Go 的宿主配置。
        ...(process.env.EXPO_OS === 'android' ? { statusBarStyle: 'light' as const } : {}),
        headerLeft: () => <Pressable accessibilityRole="button" accessibilityLabel="关闭全屏图像" onPress={close} style={({ pressed }) => ({ minWidth: 48, minHeight: 48, justifyContent: 'center', opacity: pressed ? 0.6 : 1 })}>
          <Text style={{ color: '#64A8FF', fontSize: 17, fontWeight: '600' }}>完成</Text>
        </Pressable>,
      }} />
      <View style={{ paddingHorizontal: 20, paddingBottom: 12, gap: 4 }}>
        <Text selectable numberOfLines={2} style={{ color: '#F5F5F7', fontSize: 14, fontWeight: '500' }}>{gateway.selectedTopic?.name ?? '尚未选择图像话题'}</Text>
        <Text selectable style={{ color: '#A1A1AA', fontSize: 12, fontVariant: ['tabular-nums'] }}>
          {gateway.gatewayState === '已连接'
            ? gateway.imageFrame ? `${gateway.fps.toFixed(1)} FPS · 双指缩放，放大后拖动` : '等待所选话题发布图像'
            : gateway.imageFrame ? '连接已断开 · 保留最后画面' : gateway.lastMessage}
        </Text>
      </View>
      {gateway.imageFrame ? <ZoomableImage
        key={`${gateway.selectedTopic?.name}:${gateway.selectedTopic?.message_type}`}
        uri={gateway.imageFrame.uri}
        tag={gateway.imageFrame.tag}
        onFrameLoaded={gateway.onFrameLoaded}
      /> : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Text selectable style={{ color: '#A1A1AA', fontSize: 15, textAlign: 'center' }}>{gateway.selectedTopic ? '图像到达后会自动显示' : '返回图像页，选择要查看的话题'}</Text>
      </View>}
    </View>
  );
}
