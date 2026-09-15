import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useThemeColors } from '@/ui/tokens';

export default function TabLayout(): React.JSX.Element {
  const colors = useThemeColors();
  return (
    <NativeTabs tintColor={colors.primary} backgroundColor={colors.grouped} tabBarRespectsIMEInsets>
      <NativeTabs.Trigger name="launch">
        <NativeTabs.Trigger.Icon sf={{ default: 'play.circle', selected: 'play.circle.fill' }} md="play_circle" />
        <NativeTabs.Trigger.Label>启动</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="monitor">
        <NativeTabs.Trigger.Icon sf={{ default: 'waveform.path.ecg', selected: 'waveform.path.ecg' }} md="monitor_heart" />
        <NativeTabs.Trigger.Label>监控</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="history" role="history">
        <NativeTabs.Trigger.Icon sf={{ default: 'clock', selected: 'clock.fill' }} md="history" />
        <NativeTabs.Trigger.Label>历史</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="test">
        <NativeTabs.Trigger.Icon sf={{ default: 'antenna.radiowaves.left.and.right', selected: 'antenna.radiowaves.left.and.right' }} md="sensors" />
        <NativeTabs.Trigger.Label>测试</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon sf={{ default: 'gearshape', selected: 'gearshape.fill' }} md="settings" />
        <NativeTabs.Trigger.Label>设置</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
