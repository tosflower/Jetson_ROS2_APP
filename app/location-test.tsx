import { useFocusEffect } from 'expo-router';
import * as Location from 'expo-location';
import { useKeepAwake } from 'expo-keep-awake';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Share, Text, View } from 'react-native';
import { locationProbe, type ProbeProvider, type ProbeSnapshot, type ProbeSummary } from '@/modules/location-probe';
import { usePhoneSensors } from '@/providers/phone-sensors-provider';
import { NativeButton, Row, Screen, Section, StatusBanner } from '@/ui/primitives';
import { spacing, useThemeColors } from '@/ui/tokens';

const seconds = (milliseconds: number | null | undefined): string =>
  milliseconds == null ? '—' : `${(milliseconds / 1000).toFixed(3)} 秒`;
const summary = (value: ProbeSummary | undefined): string => value?.count
  ? `${seconds(value.meanMs)} / ${seconds(value.maxMs)}` : '—';

export default function LocationTestScreen(): React.JSX.Element {
  useKeepAwake('location-probe', { suppressDeactivateWarnings: true });
  const colors = useThemeColors();
  const sensors = usePhoneSensors();
  const sensorsRef = useRef(sensors);
  sensorsRef.current = sensors;
  const [mode, setMode] = useState<'gps' | 'network' | 'both'>('both');
  const [snapshot, setSnapshot] = useState<ProbeSnapshot | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const lastSnapshotId = useRef(0);
  const focused = useRef(false);
  const [deliveryMs, setDeliveryMs] = useState<number | null>(null);
  const acceptSnapshot = useCallback((next: ProbeSnapshot): void => {
    if (next.id < lastSnapshotId.current) return;
    lastSnapshotId.current = next.id;
    setSnapshot(next);
    setDeliveryMs(Math.max(0, Date.now() - next.createdAtMs));
  }, []);

  useEffect(() => {
    if (!locationProbe) return;
    let active = true;
    const subscription = locationProbe.addListener('onSnapshot', (next) => { if (active) acceptSnapshot(next); });
    void locationProbe.getStatusAsync().then((next) => { if (active) acceptSnapshot(next); }).catch((reason: unknown) => {
      if (active) setError(reason instanceof Error ? reason.message : '无法读取定位测试状态');
    });
    return () => { active = false; subscription.remove(); };
  }, [acceptSnapshot]);

  useFocusEffect(useCallback(() => {
    focused.current = true;
    if (!locationProbe) return () => { focused.current = false; };
    // 测试时暂停本 App 的普通定位/IMU监听；离开页面后恢复用户原来的采集开关。
    const previous = { gps: sensorsRef.current.gpsEnabled, heading: sensorsRef.current.headingEnabled,
      imu: sensorsRef.current.imuEnabled };
    sensorsRef.current.stopAll();
    return () => {
      focused.current = false;
      void locationProbe?.stopAsync().catch(() => {});
      if (previous.gps) sensorsRef.current.startGps();
      if (previous.heading) sensorsRef.current.startHeading();
      if (previous.imu) sensorsRef.current.startImu();
    };
  }, []));

  const start = async (): Promise<void> => {
    if (!locationProbe) return;
    setBusy(true);
    setError('');
    try {
      if (!await Location.hasServicesEnabledAsync()) throw new Error('请先打开系统位置信息开关');
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) throw new Error('需要允许定位权限；GNSS 还需要精确位置权限');
      // 权限对话框返回前可能已经离开页面，不允许迟到结果重新启动测试。
      if (!focused.current) return;
      const providers: ProbeProvider[] = mode === 'both' ? ['gps', 'network'] : [mode];
      acceptSnapshot(await locationProbe.startAsync(providers, 1000));
    } catch (reason) { setError(reason instanceof Error ? reason.message : '启动测试失败'); }
    finally { setBusy(false); }
  };
  const stop = async (): Promise<void> => {
    if (!locationProbe) return;
    setBusy(true);
    try { acceptSnapshot(await locationProbe.stopAsync()); }
    catch (reason) { setError(reason instanceof Error ? reason.message : '停止测试失败'); }
    finally { setBusy(false); }
  };
  const share = async (): Promise<void> => {
    if (!locationProbe) return;
    try { await Share.share({ title: '本机定位测试 CSV', message: await locationProbe.getLogAsync() }); }
    catch (reason) { setError(reason instanceof Error ? reason.message : '分享日志失败'); }
  };

  return (
    <Screen wide>
      <Section title="本机定位测试" footer="请求间隔为 1 秒，实际更新由系统决定。请在露天开阔处保持前台，网络定位测试时保持 WLAN 联网并开启 WLAN 扫描。">
        <View style={{ padding: spacing.lg, gap: spacing.md }}>
          <Text selectable style={{ color: colors.label, fontSize: 17, fontWeight: '600' }}>分别测量 GNSS 与网络定位</Text>
          <Text selectable style={{ color: colors.secondaryLabel, lineHeight: 21 }}>
            本页直接读取系统定位回调，不经过地图、坐标转换或开发板。测试时暂停本 App 的常规传感器采集，离开后恢复。
          </Text>
          {!locationProbe ? <StatusBanner tone="warning" message="此测试需要包含原生测试模块的 Android 安装包；普通 Expo Go、iPhone 和网页不支持分别测试这两个来源。" /> : null}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {([['gps', '仅 GNSS'], ['network', '仅网络'], ['both', '同时测试']] as const).map(([value, label]) => (
              <NativeButton key={value} label={label} variant={mode === value ? 'filled' : 'outlined'}
                disabled={busy || !!snapshot?.running} onPress={() => setMode(value)} />
            ))}
          </View>
          <NativeButton label={busy ? '正在处理…' : snapshot?.running ? '停止并保留结果' : '开始新一轮测试'}
            disabled={busy || !locationProbe} onPress={() => { void (snapshot?.running ? stop() : start()); }} />
          <NativeButton label="分享 CSV 日志" variant="outlined" disabled={!snapshot?.logCount}
            onPress={() => { void share(); }} />
          <StatusBanner message={error || snapshot?.reason || '请选择测试来源并开始，无需连接开发板'}
            tone={error ? 'danger' : snapshot?.running ? 'success' : 'neutral'} />
        </View>
      </Section>
      {snapshot ? <Section title="测试环境">
        <Row label="设备" value={`${snapshot.device} · API ${snapshot.apiLevel}`} />
        <Row label="系统声明 GNSS 硬件" value={snapshot.gpsHardware ? '支持' : '不支持'} />
        <Row label="权限" value={snapshot.finePermission ? '精确位置' : snapshot.coarsePermission ? '仅大致位置' : '未授权'} />
        <Row label="已运行" value={seconds(snapshot.elapsedMs)} />
        <Row label="原生状态传到界面的耗时" value={seconds(deliveryMs)} />
        <Row label="日志" value={`${snapshot.logCount} 条${snapshot.droppedLogCount ? `，已覆盖 ${snapshot.droppedLogCount} 条旧记录` : ''}`} last />
      </Section> : null}
      {snapshot?.providers.map((provider) => {
        const metrics = provider.metrics;
        const fix = provider.lastFix;
        return <Section key={provider.provider} title={provider.provider === 'gps' ? 'GNSS 卫星定位 · gps' : '网络定位 · network'}
          footer={provider.provider === 'network' ? 'network 是系统网络定位来源，不能仅凭该接口继续区分 WLAN 和基站。' : '有卫星状态不等于已经生成有效位置；请同时查看新采样数量。'}>
          <Row label="状态" value={provider.status} />
          <Row label="系统提供／已开启" value={`${provider.available ? '是' : '否'} / ${provider.enabled ? '是' : '否'}`} />
          <Row label="回调实际提供者" value={fix?.actualProvider ?? '—'} />
          {provider.provider === 'gps' ? <Row label="可见卫星／参与解算" value={`${snapshot.satellitesSeen ?? '—'} / ${snapshot.satellitesUsed ?? '—'}`} /> : null}
          <Row label="回调数／新采样数" value={`${metrics?.callbackCount ?? 0} / ${metrics?.newFixCount ?? 0}`} />
          <Row label="重复／倒序／无效时间戳" value={`${metrics?.duplicateCount ?? 0} / ${metrics?.outOfOrderCount ?? 0} / ${metrics?.invalidCount ?? 0}`} />
          <Row label="首次回调等待" value={seconds(metrics?.firstCallbackMs)} />
          <Row label="首次收到本轮生成的位置" value={seconds(metrics?.firstFreshFixMs)} />
          <Row label="最近回调间隔" value={seconds(metrics?.lastCallbackIntervalMs)} />
          <Row label="回调间隔：平均／最长" value={summary(metrics?.callbackIntervals)} />
          <Row label="最近新采样间隔" value={seconds(metrics?.lastSampleIntervalMs)} />
          <Row label="新采样间隔：平均／最长" value={summary(metrics?.sampleIntervals)} />
          <Row label="最近回调时包龄" value={seconds(metrics?.lastCallbackAgeMs)} />
          <Row label="新采样到达包龄：平均／最长" value={summary(metrics?.callbackAges)} />
          <Row label="最新有效位置当前包龄" value={seconds(metrics?.currentAgeMs)} />
          <Row label="距最后一次回调" value={seconds(metrics?.silenceMs)} />
          <Row label="定位精度" value={fix?.accuracyM == null ? '—' : `±${fix.accuracyM.toFixed(1)} 米`} />
          <Row label="WGS84 经度／纬度" value={fix ? `${fix.longitude.toFixed(6)} / ${fix.latitude.toFixed(6)}` : '—'} last />
        </Section>;
      })}
      {snapshot?.recentRows.length ? <Section title="最近回调原始记录" footer="顺序：请求来源、实际来源、事件、回调开机时钟ns、采样开机时钟ns、采样UTC毫秒、收到时包龄ms、精度m、纬度、经度。">
        <Text selectable style={{ padding: spacing.lg, color: colors.secondaryLabel, fontFamily: 'monospace', fontSize: 11, lineHeight: 17 }}>
          {snapshot.recentRows.join('\n')}
        </Text>
      </Section> : null}
      <Section title="如何判断结果">
        <Text selectable style={{ padding: spacing.lg, color: colors.secondaryLabel, lineHeight: 22 }}>
          新采样间隔长：本机收到的位置本身更新稀疏。到达包龄大：系统交给应用时已经是旧位置。原生指标正常但界面投递耗时大：界面或 JS 调度存在延迟。界面每秒刷新不代表定位每秒更新。
        </Text>
      </Section>
    </Screen>
  );
}
