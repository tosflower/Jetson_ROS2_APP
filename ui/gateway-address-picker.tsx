import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Field } from '@/ui/primitives';
import { JETSON_GATEWAY_OPTIONS } from '@/services/gateway-address-options';
import { useThemeColors } from '@/ui/tokens';

function selectedPreset(address: string): string | undefined {
  const normalized = address.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
  return JETSON_GATEWAY_OPTIONS.find((option) => normalized === option.ip || normalized === option.address)?.address;
}

/** 两个固定开发板地址与自定义地址共用一套选择界面。 */
export default function GatewayAddressPicker({ address, onChange }: {
  address: string;
  onChange: (address: string) => void;
}): React.JSX.Element {
  const colors = useThemeColors();
  const [customAddress, setCustomAddress] = useState(selectedPreset(address) ? '' : address);
  const preset = selectedPreset(address);
  useEffect(() => {
    if (!selectedPreset(address)) setCustomAddress(address);
  }, [address]);

  return <View style={{ gap: 8 }}>
    {JETSON_GATEWAY_OPTIONS.map((option) => {
      const selected = preset === option.address;
      return <Pressable key={option.address} accessibilityRole="radio" accessibilityState={{ selected }}
        accessibilityLabel={`${option.label}，${option.ip}`} onPress={() => { if (address !== option.address) onChange(option.address); }}
        style={({ pressed }) => ({ minHeight: 54, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 12,
          borderWidth: 1, borderColor: selected ? colors.primary : colors.separator, borderRadius: 12,
          backgroundColor: pressed ? colors.elevated : colors.input })}>
        <Text style={{ color: selected ? colors.primary : colors.secondaryLabel, fontSize: 20 }}>{selected ? '◉' : '○'}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.label, fontSize: 15, fontWeight: selected ? '600' : '400' }}>{option.label}</Text>
          <Text style={{ color: colors.secondaryLabel, fontSize: 12 }}>{option.ip}</Text>
        </View>
      </Pressable>;
    })}
    <Pressable accessibilityRole="radio" accessibilityState={{ selected: !preset }} accessibilityLabel="自定义网关地址"
      onPress={() => { if (preset) onChange(customAddress); }}
      style={({ pressed }) => ({ minHeight: 54, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 12,
        borderWidth: 1, borderColor: !preset ? colors.primary : colors.separator, borderRadius: 12,
        backgroundColor: pressed ? colors.elevated : colors.input })}>
      <Text style={{ color: !preset ? colors.primary : colors.secondaryLabel, fontSize: 20 }}>{!preset ? '◉' : '○'}</Text>
      <Text style={{ color: colors.label, fontSize: 15, fontWeight: !preset ? '600' : '400' }}>自定义</Text>
    </Pressable>
    {!preset ? <Field value={address} onChangeText={(value) => { setCustomAddress(value); onChange(value); }}
      keyboardType="url" autoCapitalize="none" placeholder="IP 地址或 IP:端口（默认 8080）" /> : null}
  </View>;
}
