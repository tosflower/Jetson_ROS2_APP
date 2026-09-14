import Constants from 'expo-constants';
import { Text } from 'react-native';
import { Screen, Section } from '@/ui/primitives';
import { spacing, useThemeColors } from '@/ui/tokens';

export default function AboutScreen(): React.JSX.Element {
  const colors = useThemeColors();
  return <Screen><Section title="应用信息"><Text selectable style={{ color: colors.label, fontSize: 17, lineHeight: 26, padding: spacing.lg }}>小车的盒子{'\n'}<Text style={{ color: colors.secondaryLabel, fontSize: 14 }}>版本 {Constants.expoConfig?.version ?? '0.1.0'}{`\n`}Expo SDK {Constants.expoConfig?.sdkVersion ?? '57'}</Text></Text></Section><Text selectable style={{ color: colors.tertiaryLabel, fontSize: 13, lineHeight: 19 }}>用于在局域网中启动、配置和监控 Jetson 上的受控 ROS2 与 Python 程序。</Text></Screen>;
}
