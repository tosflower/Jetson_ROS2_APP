import { useState } from 'react';
import { Text, View } from 'react-native';
import { usePhoneSensors } from '@/providers/phone-sensors-provider';
import { LOCATION_MODE_LABELS, type LocationMode } from '@/services/phone-sensors/location-mode';
import { NativeButton, Row, Screen, Section, StatusBanner } from '@/ui/primitives';
import { spacing, useThemeColors } from '@/ui/tokens';

const modes: { value: LocationMode; detail: string }[] = [
  { value: 'auto', detail: '保留现有系统高精度自动定位，并用一次低功耗定位加快首次显示。' },
  { value: 'gnss', detail: '直接使用卫星定位，请求 1 秒更新。无需等待网络定位；需要精确位置权限和良好的卫星信号。' },
  { value: 'network', detail: '直接使用系统网络定位，请求 1 秒更新。适合室内或卫星信号不足时，需要系统网络定位可用。' },
];

export default function LocationSettingsScreen(): React.JSX.Element {
  const colors = useThemeColors();
  const sensors = usePhoneSensors();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const select = async (mode: LocationMode): Promise<void> => {
    setSaving(true);
    setMessage('');
    try {
      await sensors.setLocationMode(mode);
      setMessage('已保存，正在采集的定位会立即切换。');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '保存失败，请重新选择以重试');
    } finally { setSaving(false); }
  };
  const source = sensors.latestGps?.provider;
  return <Screen>
    <Section title="定位方式" footer="GNSS 与网络模式固定使用所选来源，来源不可用时会提示，不自动切换。实际更新频率由设备和系统决定，请求 1 秒不代表每秒必有新位置。">
      <Row label="当前模式" value={LOCATION_MODE_LABELS[sensors.locationMode]} />
      <Row label="最近定位来源" value={source === 'gps' ? 'GNSS' : source === 'network' ? '网络定位'
        : sensors.latestGps ? '系统自动（未提供具体来源）' : '等待定位'} last />
    </Section>
    {modes.map((mode) => <Section key={mode.value} title={LOCATION_MODE_LABELS[mode.value]}>
      <View style={{ padding: spacing.lg, gap: spacing.md }}>
        <Text selectable style={{ color: colors.secondaryLabel, lineHeight: 22 }}>{mode.detail}</Text>
        <NativeButton label={sensors.locationMode === mode.value ? '已选择' : '使用此模式'}
          variant={sensors.locationMode === mode.value ? 'filled' : 'outlined'}
          disabled={saving || (mode.value !== 'auto' && !sensors.directLocationSupported)}
          onPress={() => { void select(mode.value); }} />
      </View>
    </Section>)}
    {!sensors.directLocationSupported ? <StatusBanner tone="warning" message="指定 GNSS／网络来源需要新版 Android 安装包；当前环境支持默认自动模式。" /> : null}
    {message ? <StatusBanner message={message} /> : null}
    <StatusBanner message={sensors.gpsStatus} />
  </Screen>;
}
