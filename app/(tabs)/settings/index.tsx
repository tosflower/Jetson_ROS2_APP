import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { Appearance, Switch, Text, useColorScheme, View } from 'react-native';
import { useRosbridge } from '@/providers/rosbridge-provider';
import { useGateway } from '@/providers/gateway-provider';
import { Row, Screen, Section } from '@/ui/primitives';
import { spacing, useThemeColors } from '@/ui/tokens';

export default function SettingsScreen(): React.JSX.Element {
  const colors = useThemeColors();
  const gateway = useGateway();
  const rosbridge = useRosbridge();
  const dark = useColorScheme() !== 'light';
  return (
    <Screen>
      <Section title="连接">
        <Row label="网关地址" value={gateway.gatewayAddress} href="/settings/connection" />
        <Row label="连接状态" value={gateway.gatewayState} last />
      </Section>
      <Section title="应用">
        <Row label="GPS 传输" value={rosbridge.connectionState === 'connected' ? '已连接' : '未连接'} />
        <Row label="高德地图配置" detail="地图、地点搜索与路线规划" href="/settings/amap" />
        <View style={{ minHeight: 58, paddingHorizontal: spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text selectable style={{ color: colors.label, fontSize: 16 }}>深色外观</Text>
          <View style={{ height: 58, alignItems: 'center', justifyContent: 'center' }}>
            <Switch value={dark} onValueChange={(enabled) => {
              const mode = enabled ? 'dark' : 'light';
              Appearance.setColorScheme(mode);
              void SecureStore.setItemAsync('appearance-mode', mode);
            }} />
          </View>
        </View>
      </Section>
      <Section title="关于">
        <Row label="小车的盒子" value={Constants.expoConfig?.version ?? '0.1.0'} href="/settings/about" last />
      </Section>
    </Screen>
  );
}
