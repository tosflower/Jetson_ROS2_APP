import Constants from 'expo-constants';
import { Text } from 'react-native';
import { Screen, Section } from '@/ui/primitives';
import { spacing, useThemeColors } from '@/ui/tokens';

export default function AboutScreen(): React.JSX.Element {
  const colors = useThemeColors();
  return <Screen><Section title="应用信息"><Text selectable style={{ color: colors.label, fontSize: 17, lineHeight: 26, padding: spacing.lg }}>小车的盒子{'\n'}<Text style={{ color: colors.secondaryLabel, fontSize: 14 }}>版本 {Constants.expoConfig?.version ?? '0.1.0'}{`\n`}Expo SDK {Constants.expoConfig?.sdkVersion ?? '57'}</Text></Text></Section><Text selectable style={{ color: colors.tertiaryLabel, fontSize: 13, lineHeight: 19 }}>用于连接 Jetson 网关、查看终端日志与图像，并传输手机定位和地图导航信息。</Text></Screen>;
}
