import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { usePhoneSensors } from '@/providers/phone-sensors-provider';
import { useRosbridge } from '@/providers/rosbridge-provider';
import type { PhoneSensorStream } from '@/services/phone-sensors/history';
import {
  PHONE_GPS_TOPIC,
  PHONE_GPS_TYPE,
  PHONE_HEADING_TOPIC,
  PHONE_HEADING_TYPE,
  PHONE_IMU_TOPIC,
  PHONE_IMU_TYPE,
  PHONE_MAGNETIC_FIELD_TOPIC,
  PHONE_MAGNETIC_FIELD_TYPE,
} from '@/services/rosbridge/protocol';
import { ActionButton, Screen, Section, StatusBanner } from '@/ui/primitives';
import { SensorTerminal } from '@/ui/sensor-terminal';
import { spacing, useThemeColors } from '@/ui/tokens';

const terminalDefinitions = {
  gps: { title: 'GPS', topic: PHONE_GPS_TOPIC, type: PHONE_GPS_TYPE },
  heading: { title: '航向', topic: PHONE_HEADING_TOPIC, type: PHONE_HEADING_TYPE },
  imu: { title: 'IMU', topic: PHONE_IMU_TOPIC, type: PHONE_IMU_TYPE },
  magnetic: {
    title: '磁力计',
    topic: PHONE_MAGNETIC_FIELD_TOPIC,
    type: PHONE_MAGNETIC_FIELD_TYPE,
  },
} satisfies Record<PhoneSensorStream, { title: string; topic: string; type: string }>;

export default function SensorTerminalsScreen(): React.JSX.Element {
  const rosbridge = useRosbridge();
  const sensors = usePhoneSensors();
  const colors = useThemeColors();
  const [selectedTerminal, setSelectedTerminal] = useState<PhoneSensorStream>('gps');
  const tone = rosbridge.connectionState === 'connected'
    ? 'success'
    : rosbridge.connectionState === 'reconnecting'
      ? 'warning'
      : rosbridge.connectionState === 'error'
        ? 'danger'
        : 'neutral';
  const selectedDefinition = terminalDefinitions[selectedTerminal];
  const messagesByStream: Record<PhoneSensorStream, typeof sensors.gpsMessages> = {
    gps: sensors.gpsMessages,
    heading: sensors.headingMessages,
    imu: sensors.imuMessages,
    magnetic: sensors.magneticMessages,
  };
  const countsByStream: Record<PhoneSensorStream, number> = {
    gps: sensors.gpsSentCount,
    heading: sensors.headingSentCount,
    imu: sensors.imuSentCount,
    magnetic: sensors.magneticSentCount,
  };
  const selectedMessages = messagesByStream[selectedTerminal];
  const selectedCount = countsByStream[selectedTerminal];

  return (
    <Screen wide>
      <StatusBanner message={rosbridge.statusMessage} tone={tone} />
      <Section
        title="手机传感器"
        footer="GPS、航向、IMU 和磁力计共用同一个 rosbridge WebSocket。App 进入后台或连接中断时暂停，恢复后自动继续。"
      >
        <View style={{ padding: spacing.lg, gap: spacing.md }}>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <View style={{ flex: 1 }}>
              <ActionButton
                label="启动全部传感器"
                disabled={rosbridge.connectionState !== 'connected' || (sensors.gpsEnabled && sensors.headingEnabled && sensors.imuEnabled)}
                onPress={sensors.startAll}
              />
            </View>
            <View style={{ flex: 1 }}>
              <ActionButton
                label="停止全部"
                secondary
                disabled={!sensors.gpsEnabled && !sensors.headingEnabled && !sensors.imuEnabled}
                onPress={sensors.stopAll}
              />
            </View>
          </View>
          <StatusBanner
            message={sensors.gpsStatus}
            tone={sensors.gpsState === 'active' ? 'success' : sensors.gpsState === 'error' ? 'danger' : sensors.gpsState === 'paused' ? 'warning' : 'neutral'}
          />
          <ActionButton
            label={sensors.gpsEnabled ? '停止 GPS' : '启动 GPS'}
            secondary={sensors.gpsEnabled}
            disabled={rosbridge.connectionState !== 'connected' && !sensors.gpsEnabled}
            onPress={sensors.gpsEnabled ? sensors.stopGps : sensors.startGps}
          />
          <StatusBanner
            message={sensors.headingStatus}
            tone={sensors.headingState === 'active' ? 'success' : sensors.headingState === 'error' ? 'danger' : sensors.headingState === 'paused' ? 'warning' : 'neutral'}
          />
          <ActionButton
            label={sensors.headingEnabled ? '停止航向' : '启动航向'}
            secondary={sensors.headingEnabled}
            disabled={rosbridge.connectionState !== 'connected' && !sensors.headingEnabled}
            onPress={sensors.headingEnabled ? sensors.stopHeading : sensors.startHeading}
          />
          <StatusBanner
            message={sensors.imuStatus}
            tone={sensors.imuState === 'active' ? 'success' : sensors.imuState === 'error' ? 'danger' : sensors.imuState === 'paused' ? 'warning' : 'neutral'}
          />
          <ActionButton
            label={sensors.imuEnabled ? '停止 IMU / 磁力计' : '启动 IMU / 磁力计'}
            secondary={sensors.imuEnabled}
            disabled={rosbridge.connectionState !== 'connected' && !sensors.imuEnabled}
            onPress={sensors.imuEnabled ? sensors.stopImu : sensors.startImu}
          />
        </View>
      </Section>

      <View style={{ gap: spacing.sm }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 6 }}
        >
          {(Object.keys(terminalDefinitions) as PhoneSensorStream[]).map((stream) => {
            const selected = selectedTerminal === stream;
            const definition = terminalDefinitions[stream];
            const count = countsByStream[stream];
            return (
              <Pressable
                key={stream}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                onPress={() => setSelectedTerminal(stream)}
                style={({ pressed }) => ({
                  minHeight: 48,
                  minWidth: 112,
                  paddingHorizontal: 14,
                  justifyContent: 'center',
                  backgroundColor: selected ? colors.elevated : colors.surface,
                  borderRadius: 10,
                  borderCurve: 'continuous',
                  borderWidth: 1,
                  borderColor: selected ? colors.primary : colors.separator,
                  opacity: pressed ? 0.72 : 1,
                })}
              >
                <Text selectable style={{ color: colors.label, fontSize: 14, fontWeight: selected ? '600' : '400' }}>
                  {definition.title} · {count}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <SensorTerminal
          key={selectedTerminal}
          title={selectedDefinition.title}
          topic={selectedDefinition.topic}
          type={selectedDefinition.type}
          messages={selectedMessages}
          totalCount={selectedCount}
          onClear={() => sensors.clearHistory(selectedTerminal)}
        />
      </View>

      <ActionButton
        label="清除四个终端历史"
        destructive
        disabled={!sensors.gpsMessages.length && !sensors.headingMessages.length && !sensors.imuMessages.length && !sensors.magneticMessages.length}
        onPress={() => Alert.alert(
          '清除传感器终端历史？',
          '将清空 GPS、航向、IMU 和磁力计的手机端显示缓存，不会停止发布。',
          [
            { text: '取消', style: 'cancel' },
            { text: '清除', style: 'destructive', onPress: () => sensors.clearHistory() },
          ],
        )}
      />
      <ActionButton
        label="断开 rosbridge"
        destructive
        disabled={['idle', 'disconnected'].includes(rosbridge.connectionState)}
        onPress={rosbridge.disconnect}
      />
      <ActionButton label="返回连接设置" secondary onPress={() => router.back()} />
    </Screen>
  );
}
