import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useGateway } from '@/providers/gateway-provider';
import { ActionButton, Field, Screen, Section, StatusBanner } from '@/ui/primitives';
import { spacing, useThemeColors } from '@/ui/tokens';

export default function GatewaySettingsScreen(): React.JSX.Element {
  const colors = useThemeColors();
  const gateway = useGateway();
  const [password, setPassword] = useState('');
  const connected = gateway.gatewayState === '已连接' && gateway.sessionReady;
  useEffect(() => {
    // 从设置页重新认证成功时也遵循相同流程，返回启动选项。
    if (connected) router.replace('/launch');
  }, [connected]);
  return <Screen>
    <Section title="网关地址" footer="手机和 Jetson 必须位于可互相访问的局域网。">
      <View style={{ padding: spacing.lg, gap: spacing.md }}>
        <Field value={gateway.gatewayAddress} onChangeText={gateway.setGatewayAddress} keyboardType="url" autoCapitalize="none" placeholder="10.42.0.1:8080" />
        <Field value={password} onChangeText={setPassword} secureTextEntry placeholder="Ubuntu 用户密码" />
        <ActionButton label={gateway.gatewayState === '连接中' ? '正在验证并连接…' : '验证密码并连接'} disabled={gateway.gatewayState === '连接中' || !gateway.gatewayAddress.trim() || !password.trim()} onPress={() => { void gateway.checkGateway(password).finally(() => setPassword('')); }} />
        <StatusBanner message={gateway.lastMessage} tone={connected ? 'success' : gateway.gatewayState === '错误' ? 'danger' : 'neutral'} />
      </View>
    </Section>
    {!connected ? <View style={{ gap: spacing.sm }}><Text selectable style={{ color: colors.secondaryLabel, fontSize: 13 }}>连接中断不会停止 Jetson 上已经启动的程序。</Text><ActionButton label="返回独立连接页" secondary onPress={() => router.push('/connection')} /></View> : null}
  </Screen>;
}
