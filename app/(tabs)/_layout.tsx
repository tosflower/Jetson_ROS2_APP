import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useThemeColors } from '@/ui/tokens';

export default function TabLayout(): React.JSX.Element {
  const colors = useThemeColors();
  return (
    <NativeTabs tintColor={colors.primary} backgroundColor={colors.grouped} tabBarRespectsIMEInsets>
      <NativeTabs.Trigger name="monitor">
        <NativeTabs.Trigger.Icon sf={{ default: 'waveform.path.ecg', selected: 'waveform.path.ecg' }} md="monitor_heart" />
        <NativeTabs.Trigger.Label>监控</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      {/* 地图使用原生 SafeAreaView 计算可用区域，避免再叠加 WebView 自动 inset。 */}
      <NativeTabs.Trigger name="test" disableAutomaticContentInsets>
        <NativeTabs.Trigger.Icon sf={{ default: 'map', selected: 'map.fill' }} md="map" />
        <NativeTabs.Trigger.Label>地图</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon sf={{ default: 'gearshape', selected: 'gearshape.fill' }} md="settings" />
        <NativeTabs.Trigger.Label>设置</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
