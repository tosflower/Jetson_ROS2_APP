import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { Alert, Appearance, Switch, Text, useColorScheme, View } from 'react-native';
import { useCommands } from '@/providers/command-provider';
import { useGateway } from '@/providers/gateway-provider';
import { usePhoneSensors } from '@/providers/phone-sensors-provider';
import { Row, Screen, Section } from '@/ui/primitives';
import { spacing, useThemeColors } from '@/ui/tokens';

export default function SettingsScreen(): React.JSX.Element {
  const colors = useThemeColors();
  const gateway = useGateway();
  const commands = useCommands();
  const sensors = usePhoneSensors();
  const dark = useColorScheme() !== 'light';
  const sensorHistoryCount = sensors.gpsMessages.length
    + sensors.headingMessages.length
    + sensors.imuMessages.length
    + sensors.magneticMessages.length;
  return (
    <Screen>
      <Section title="连接">
        <Row label="网关地址" value={gateway.gatewayAddress} href="/settings/connection" />
        <Row label="连接状态" value={gateway.gatewayState} last />
      </Section>
      <Section title="应用">
        <Row label="运行中程序" value={`${commands.snapshot?.active_runs.length ?? 0}`} />
        <Row
          label="清除传感器监控历史"
          value={`${sensorHistoryCount} 条`}
          destructive
          onPress={() => Alert.alert(
            '清除传感器监控历史？',
            '这会清空 GPS、航向、IMU 和磁力计终端的当前会话数据，不会停止发布。',
            [
              { text: '取消', style: 'cancel' },
              { text: '清除', style: 'destructive', onPress: () => sensors.clearHistory() },
            ],
          )}
        />
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
      <Section title="开发板">
        <Row label="电源控制" detail="远程重启或关闭 Jetson" href="/settings/device-power" destructive last />
      </Section>
      <Section title="关于">
        <Row label="小车的盒子" value={Constants.expoConfig?.version ?? '0.1.0'} href="/settings/about" last />
      </Section>
    </Screen>
  );
}
