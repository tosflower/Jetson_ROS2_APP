import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { useCommands } from '@/providers/command-provider';
import { useGateway } from '@/providers/gateway-provider';
import { ActionButton, Field, Screen, Section, StatusBanner } from '@/ui/primitives';
import { spacing, useThemeColors } from '@/ui/tokens';

export default function DevicePowerScreen(): React.JSX.Element {
  const colors = useThemeColors();
  const gateway = useGateway();
  const commands = useCommands();
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const supported = gateway.capabilities.includes('system_power');
  const runPowerAction = (action: 'reboot' | 'poweroff'): void => {
    const label = action === 'reboot' ? '重启' : '关闭';
    Alert.alert(`确认${label}开发板？`, `这会立即结束所有运行程序，并使 ${gateway.connectedBase} 断开连接。`, [
      { text: '取消', style: 'cancel' },
      { text: `验证密码并${label}`, style: 'destructive', onPress: () => {
        setBusy(true);
        void gateway.requestPower(password, action)
          .then(() => setPassword(''))
          .catch((error: unknown) => Alert.alert('操作失败', error instanceof Error ? error.message : '电源操作失败'))
          .finally(() => setBusy(false));
      } },
    ]);
  };
  return <Screen>
    <Section title="目标设备">
      <View style={{ padding: spacing.lg, gap: spacing.sm }}>
        <Text selectable style={{ color: colors.label, fontSize: 17, fontWeight: '600' }}>{gateway.connectedBase}</Text>
        <Text selectable style={{ color: colors.secondaryLabel, fontSize: 14 }}>{commands.snapshot?.active_runs.length ?? 0} 个程序正在运行</Text>
      </View>
    </Section>
    <Section title="危险操作" footer="电源操作会终止所有 ROS2 与 Python 程序，并断开手机连接。">
      <View style={{ padding: spacing.lg, gap: spacing.md }}>
        <Field value={password} onChangeText={setPassword} secureTextEntry placeholder="再次输入 Ubuntu 密码" />
        <ActionButton label="重新启动开发板" destructive disabled={!supported || !password.trim() || busy || gateway.gatewayState !== '已连接'} onPress={() => runPowerAction('reboot')} />
        <ActionButton label="关闭开发板" destructive disabled={!supported || !password.trim() || busy || gateway.gatewayState !== '已连接'} onPress={() => runPowerAction('poweroff')} />
      </View>
    </Section>
    <StatusBanner message={supported ? '每次操作都会在 Ubuntu 上重新验证密码；密码不会保存在 App。' : '当前连接的网关不支持密码认证/电源控制，请先在 Jetson 更新并重启网关。'} tone={supported ? 'warning' : 'neutral'} />
  </Screen>;
}
