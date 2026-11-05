import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { loadAmapCredentials, saveAmapCredentials } from '@/services/amap-credentials';
import { ActionButton, Field, Screen, Section, StatusBanner } from '@/ui/primitives';
import { spacing, useThemeColors } from '@/ui/tokens';

export default function AmapSettingsScreen(): React.JSX.Element {
  const colors = useThemeColors();
  const [apiKey, setApiKey] = useState('');
  const [securityJsCode, setSecurityJsCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    void loadAmapCredentials().then((credentials) => {
      setApiKey(credentials.apiKey);
      setSecurityJsCode(credentials.securityJsCode);
    }).catch(() => setMessage('读取本机高德配置失败'));
  }, []);

  const save = async (): Promise<void> => {
    setBusy(true);
    try {
      await saveAmapCredentials({ apiKey, securityJsCode });
      router.back();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '保存高德配置失败');
    } finally {
      setBusy(false);
    }
  };

  return <Screen>
    <Section title="高德 Web JS API" footer="需要在高德开放平台创建 Web 端（JS API）Key，并为该 Key 配置安全密钥。">
      <View style={{ padding: spacing.lg, gap: spacing.md }}>
        <Text selectable style={{ color: colors.secondaryLabel, fontSize: 14 }}>配置保存后返回地图页即可加载底图与原有路线规划功能。</Text>
        <Field value={apiKey} onChangeText={setApiKey} autoCapitalize="none" placeholder="Web JS API Key" />
        <Field value={securityJsCode} onChangeText={setSecurityJsCode} autoCapitalize="none" secureTextEntry placeholder="安全密钥" />
        <ActionButton label="保存并返回地图" disabled={busy || !apiKey.trim() || !securityJsCode.trim()} onPress={() => void save()} />
        {message ? <StatusBanner message={message} tone="warning" /> : null}
      </View>
    </Section>
  </Screen>;
}
