import { Link } from 'expo-router';
import { Text } from 'react-native';
import { Screen, Section } from '@/ui/primitives';
import { spacing, useThemeColors } from '@/ui/tokens';

export default function NotFoundScreen(): React.JSX.Element {
  const colors = useThemeColors();
  return <Screen><Section><Text selectable style={{ color: colors.label, fontSize: 17, padding: spacing.lg }}>找不到这个页面。</Text><Link href="/monitor" style={{ color: colors.primary, padding: spacing.lg }}>返回监控页</Link></Section></Screen>;
}
