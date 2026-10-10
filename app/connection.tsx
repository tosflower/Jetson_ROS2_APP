import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useGateway } from '@/providers/gateway-provider';
import { Field, NativeButton, Screen, Section, StatusBanner } from '@/ui/primitives';
import { spacing, useThemeColors } from '@/ui/tokens';

export default function ConnectionScreen(): React.JSX.Element {
  const colors = useThemeColors();
  const gateway = useGateway();
  const [password, setPassword] = useState('');
  const [showManualAddress, setShowManualAddress] = useState(false);
  const connected = gateway.gatewayState === '已连接' && gateway.sessionReady;
  useEffect(() => {
    // 密码认证和 WebSocket 首帧认证都成功后，直接进入启动选项。
    if (connected) router.replace('/launch');
  }, [connected]);
  return (
    <Screen>
      <View style={{ gap: spacing.sm }}>
        <Text selectable style={{ color: colors.label, fontSize: 24, fontWeight: '700' }}>小车的盒子</Text>
        <Text selectable style={{ color: colors.secondaryLabel, fontSize: 15, lineHeight: 21 }}>连接同一局域网中的开发板网关。</Text>
      </View>
      <Section title="网关">
        <View style={{ padding: spacing.lg, gap: spacing.lg }}>
          <Text selectable style={{ color: colors.secondaryLabel, fontSize: 14 }}>
            {gateway.discoveryState === 'found'
              ? `已发现 Jetson：${gateway.gatewayAddress}`
              : gateway.discoveryState === 'searching' ? '正在查找 Jetson…' : '未自动找到 Jetson，请填写网关地址'}
          </Text>
          {showManualAddress || gateway.discoveryState === 'manual'
            ? <Field value={gateway.gatewayAddress} onChangeText={gateway.setGatewayAddress} keyboardType="url" autoCapitalize="none" placeholder="例如 10.42.0.1:8080" />
            : null}
          <NativeButton label={gateway.discoveryState === 'searching' ? '查找中…' : '重新查找 Jetson'} variant="text"
            disabled={gateway.discoveryState === 'searching'} onPress={() => { setShowManualAddress(false); void gateway.rediscoverGateway(); }} />
          {gateway.discoveryState === 'found' && !showManualAddress
            ? <NativeButton label="手动修改地址" variant="text" onPress={() => setShowManualAddress(true)} /> : null}
          <Field value={password} onChangeText={setPassword} secureTextEntry placeholder="Ubuntu 用户密码（需有 sudo 权限）" returnKeyType="go" onSubmitEditing={() => { if (password.trim() && gateway.discoveryState !== 'searching') { void gateway.checkGateway(password).finally(() => setPassword('')); } }} />
          <Text selectable style={{ color: colors.tertiaryLabel, fontSize: 12, lineHeight: 17 }}>密码只用于验证，不保存在手机或网关。请仅在可信局域网使用，不要将网关暴露到公网。</Text>
          <NativeButton label={gateway.gatewayState === '连接中' ? '正在验证并连接…' : '验证密码并连接'} onPress={() => { void gateway.checkGateway(password).finally(() => setPassword('')); }} disabled={gateway.discoveryState === 'searching' || gateway.gatewayState === '连接中' || !gateway.gatewayAddress.trim() || !password.trim()} />
          <StatusBanner message={gateway.lastMessage} tone={connected ? 'success' : gateway.gatewayState === '错误' ? 'danger' : 'neutral'} />
        </View>
      </Section>
    </Screen>
  );
}
