import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useRosbridge } from '@/providers/rosbridge-provider';
import { ActionButton, Field, Screen, Section, StatusBanner } from '@/ui/primitives';
import { spacing } from '@/ui/tokens';

export default function TestScreen(): React.JSX.Element {
  const rosbridge = useRosbridge();
  const openTerminalAfterConnectRef = useRef(false);
  const active = ['connecting', 'connected', 'reconnecting'].includes(rosbridge.connectionState);
  const tone = rosbridge.connectionState === 'connected'
    ? 'success'
    : rosbridge.connectionState === 'reconnecting'
      ? 'warning'
      : rosbridge.connectionState === 'error'
        ? 'danger'
        : 'neutral';

  useEffect(() => {
    if (rosbridge.connectionState !== 'connected' || !openTerminalAfterConnectRef.current) return;
    openTerminalAfterConnectRef.current = false;
    router.push('/test/output');
  }, [rosbridge.connectionState]);

  const connectAndOpenTerminal = (): void => {
    if (rosbridge.connectionState === 'connected') {
      router.push('/test/output');
      return;
    }
    openTerminalAfterConnectRef.current = true;
    rosbridge.connect();
  };

  return (
    <Screen>
      <Section
        title="rosbridge 连接"
        footer="Phone Gateway 继续使用 8080；此连接独立访问 9090，专用于 GPS、航向、IMU 和磁力计。"
      >
        <View style={{ padding: spacing.lg, gap: spacing.md }}>
          <Field
            value={rosbridge.address}
            onChangeText={rosbridge.setAddress}
            keyboardType="url"
            autoCapitalize="none"
            placeholder="ws://10.42.0.1:9090"
          />
          <ActionButton
            label={rosbridge.connectionState === 'connected' ? '打开传感器终端' : '连接并打开终端'}
            onPress={connectAndOpenTerminal}
            disabled={rosbridge.connectionState === 'connecting'}
          />
          <ActionButton label="断开 rosbridge" secondary onPress={rosbridge.disconnect} disabled={!active} />
          <StatusBanner message={rosbridge.statusMessage} tone={tone} />
        </View>
      </Section>
    </Screen>
  );
}
