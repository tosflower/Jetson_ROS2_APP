import { useCallback, useEffect, useRef, useState } from 'react';
import TerminalWindow from './TerminalWindow';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

type Spec = { cwd: string; command: string; setup: string };
type Checked = Spec & { id: string; target: string };
export type Run = Spec & { id: string; state: string; message: string; successful: boolean; started_at: number; returncode?: number | null; kind?: 'command' | 'build'; target?: string };
type Preset = Spec & { id: string; name: string };
type DefaultOption = Spec & { id: string; name: string; file: string; configured: boolean };
export type CommandPage = 'tasks' | 'custom' | 'history' | 'terminal' | 'files';
type Snapshot = { active: Run | null; active_runs: Run[]; history: Run[]; presets: Preset[]; defaults: DefaultOption[] };
type Directory = { cwd: string; parent: string; entries: { name: string; path: string; directory: boolean; editable: boolean }[]; truncated: boolean };
type YamlFile = { path: string; content: string; mtime_ns: string; package: string; package_path: string; workspace: string };
type NavigationGuard = (continueNavigation: () => void) => void;
const states: Record<string, string> = {
  starting: '启动中', running: '运行中', stopping: '停止中', stopped: '已停止',
  completed: '正常完成', failed: '失败', interrupted: '状态未知',
};

/** 目录与校验结果绑定当前输入；记录存于所连接的 Jetson，避免混用不同机器的路径。 */
export default function CommandPanel({ base, page, navigate, visualize, report, onRun, registerNavigationGuard }: {
  base: string; page: CommandPage; navigate: (page: CommandPage) => void;
  visualize: () => void; report: () => void; onRun: (run: Run | null) => void;
  registerNavigationGuard: (guard: NavigationGuard | undefined) => void;
}): React.JSX.Element {
  const [editingDefault, setEditingDefault] = useState<DefaultOption>();
  const [cwd, setCwd] = useState('');
  const [command, setCommand] = useState('');
  const [setup, setSetup] = useState('');
  const [directory, setDirectory] = useState<Directory>();
  const [checked, setChecked] = useState<Checked>();
  const [snapshot, setSnapshot] = useState<Snapshot>();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('先输入 Jetson 上的工作目录并确认。');
  const [online, setOnline] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [terminalIds, setTerminalIds] = useState<string[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string>();
  const [terminalLogs, setTerminalLogs] = useState<Record<string, string>>({});
  const [fileDirectory, setFileDirectory] = useState<Directory>();
  const [browsePath, setBrowsePath] = useState('');
  const [yamlFile, setYamlFile] = useState<YamlFile>();
  const [yamlDraft, setYamlDraft] = useState('');
  const [buildSetup, setBuildSetup] = useState('');
  const [returnAfterBuildId, setReturnAfterBuildId] = useState<string>();
  const busyRef = useRef(false);
  const revision = useRef(0);
  const requestSequence = useRef(0);

  const api = useCallback(async <T,>(path: string, body?: object, method?: string): Promise<T> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(`${base}/api/commands${path}`, {
        method: method ?? (body ? 'POST' : 'GET'),
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(typeof result.detail === 'string'
        ? result.detail : `请求失败（${response.status}），请确认已更新 Jetson 网关`);
      return result as T;
    } finally {
      clearTimeout(timer);
    }
  }, [base]);

  useEffect(() => {
    if (!snapshot) return;
    const latestActive = snapshot.active_runs[snapshot.active_runs.length - 1];
    onRun(latestActive ?? snapshot.history[0] ?? null);
  }, [snapshot, onRun]);

  const refreshLog = useCallback(async (runId: string): Promise<void> => {
    try {
      const result = await api<{ id: string; logs: string }>(`/logs/${runId}`);
      setTerminalLogs((current) => ({ ...current, [result.id]: result.logs }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '读取终端输出失败');
    }
  }, [api]);

  const refresh = useCallback(async (): Promise<void> => {
    const sequence = ++requestSequence.current;
    try {
      const data = await api<Snapshot>('');
      if (sequence === requestSequence.current) {
        setSnapshot(data);
        if (data.active_runs.length) {
          setTerminalIds((current) => Array.from(new Set([
            ...current, ...data.active_runs.map((run) => run.id),
          ])));
          setSelectedRunId((current) => current ?? data.active_runs[data.active_runs.length - 1].id);
        }
        setOnline(true);
      }
    } catch (error) {
      if (sequence === requestSequence.current) {
        setOnline(false);
        setMessage(error instanceof Error ? error.message : '读取命令状态失败');
      }
    }
  }, [api]);

  useEffect(() => {
    let disposed = false;
    let timer: ReturnType<typeof setTimeout>;
    const poll = async (): Promise<void> => {
      if (!busyRef.current) {
        await refresh();
        if (page === 'terminal' && selectedRunId) await refreshLog(selectedRunId);
      }
      // 终端页提高刷新频率，使 stdout/stderr 接近实时显示；其他页降低轮询开销。
      if (!disposed) timer = setTimeout(() => void poll(), page === 'terminal' ? 500 : 2000);
    };
    void poll();
    return () => { disposed = true; clearTimeout(timer); requestSequence.current += 1; };
  }, [refresh, refreshLog, page, selectedRunId]);

  const perform = async (work: () => Promise<void>): Promise<void> => {
    if (busyRef.current) return;
    busyRef.current = true; requestSequence.current += 1;
    setBusy(true);
    try { await work(); } catch (error) {
      setMessage(error instanceof Error ? error.message : '操作失败');
    } finally {
      await refresh();
      busyRef.current = false; setBusy(false);
    }
  };

  const openTerminal = useCallback((run: Run): void => {
    setTerminalIds((current) => Array.from(new Set([...current, run.id])));
    setSelectedRunId(run.id);
    void refreshLog(run.id);
    navigate('terminal');
  }, [navigate, refreshLog]);

  const saveCurrentYaml = useCallback(async (): Promise<YamlFile> => {
    if (!yamlFile) throw new Error('尚未打开 YAML 文件');
    const saved = await api<YamlFile>('/files/save', {
      path: yamlFile.path,
      content: yamlDraft,
      expected_mtime_ns: yamlFile.mtime_ns,
    });
    setYamlFile(saved);
    setYamlDraft(saved.content);
    setMessage(`已保存：${saved.path}`);
    return saved;
  }, [api, yamlDraft, yamlFile]);

  const yamlDirty = !!yamlFile && yamlDraft !== yamlFile.content;

  useEffect(() => {
    if (page !== 'files' || !yamlDirty) {
      registerNavigationGuard(undefined);
      return undefined;
    }
    registerNavigationGuard((continueNavigation) => Alert.alert(
      '参数尚未保存',
      '是否先保存 YAML 修改？',
      [
        { text: '取消', style: 'cancel' },
        { text: '不保存', style: 'destructive', onPress: continueNavigation },
        { text: '保存', onPress: () => void saveCurrentYaml()
          .then(() => { registerNavigationGuard(undefined); continueNavigation(); })
          .catch((error) => setMessage(error instanceof Error ? error.message : '保存失败')) },
      ],
    ));
    return () => registerNavigationGuard(undefined);
  }, [page, registerNavigationGuard, saveCurrentYaml, yamlDirty]);

  useEffect(() => {
    if (!returnAfterBuildId || !snapshot) return undefined;
    const build = snapshot.history.find((run) => run.id === returnAfterBuildId);
    if (!build || ['starting', 'running', 'stopping'].includes(build.state)) return undefined;
    const timer = setTimeout(() => {
      setReturnAfterBuildId(undefined);
      setMessage(build.state === 'completed'
        ? '编译完成，已返回启动页面'
        : `编译未成功：${build.message}`);
      navigate('tasks');
    }, 1200);
    return () => clearTimeout(timer);
  }, [navigate, returnAfterBuildId, snapshot]);

  const edit = (setter: (value: string) => void, value: string, changeDirectory = false): void => {
    revision.current += 1;
    setter(value);
    setChecked(undefined);
    if (changeDirectory) setDirectory(undefined);
  };

  const load = (spec: Spec, option?: DefaultOption): void => {
    setEditingDefault(option);
    navigate('custom');
    revision.current += 1;
    setCwd(spec.cwd); setCommand(spec.command); setSetup(spec.setup);
    setChecked(undefined); setDirectory(undefined);
    setMessage('已填入保存的命令，请重新确认目录，再校验并启动。');
  };

  const button = (label: string, onPress: () => void, disabled = false, danger = false): React.JSX.Element => (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled: disabled || busy }} disabled={disabled || busy} onPress={onPress}
      style={[styles.button, danger && styles.danger, (disabled || busy) && styles.disabled]}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );

  const start = async (spec: Spec): Promise<void> => {
    // 已保存选项可一键执行，但服务器每次仍重新确认目录与文件。
    const approved = await api<Checked>('/validate', spec);
    const result = await api<Run>('/start', { id: approved.id });
    setMessage(result.message);
    onRun(result);
    openTerminal(result);
  };

  const runFromTerminal = async (): Promise<void> => {
    // 终端页仍通过服务端白名单校验，避免把手机输入直接交给 Shell。
    const approved = await api<Checked>('/validate', { cwd, command, setup });
    setChecked(approved);
    const result = await api<Run>('/start', { id: approved.id });
    setMessage(result.message);
    onRun(result);
    openTerminal(result);
  };

  const selectedRun = snapshot?.history.find((item) => item.id === selectedRunId);
  const terminalRuns = terminalIds
    .map((id) => snapshot?.history.find((item) => item.id === id))
    .filter((item): item is Run => item !== undefined);
  const activeIds = new Set(snapshot?.active_runs.map((item) => item.id) ?? []);
  const terminalLabel = (run: Run): string => {
    if (run.kind === 'build') return `build · ${run.target?.split('/').pop() ?? 'ROS包'}`;
    const parts = run.command.split(' ');
    return parts[parts.length - 1]?.split('/').pop() || 'terminal';
  };

  return <View style={styles.card}>
    {page === 'tasks' && <>
      <Text style={styles.title}>选择运行任务</Text>
      {(snapshot?.defaults ?? [
        { id: 'phone_test', name: '普通测试', file: 'phone_connect_launch.py', configured: false, cwd: '', command: 'ros2 launch phone_connect_launch.py', setup: '' },
        { id: 'perception', name: '运行感知系统', file: 'run_launch.py', configured: false, cwd: '', command: 'ros2 launch wheel_perception run_launch.py', setup: '' },
      ]).map((option, index) => <View key={option.id} style={styles.record}>
        <Text style={styles.title}>选项 {index + 1} · {option.name}</Text>
        <Text style={styles.note}>{option.file}</Text>
        <Text selectable style={styles.note}>{option.configured ? `${option.cwd}\n${option.command}` : '首次使用请配置 Jetson 文件目录'}</Text>
        {button(option.configured ? '开始运行' : '配置文件位置', () => option.configured
          ? void perform(() => start(option)) : load(option, option), !online)}
        {option.configured && button('修改路径 / 命令', () => load(option, option), !online)}
      </View>)}
      {button('＋ 添加自定义文件', () => load({ cwd: '', command: '', setup: '' }), !online)}
      {snapshot?.presets.map((preset) => <View key={preset.id} style={styles.record}>
        <Text style={styles.label}>{preset.name}</Text>
        <Text selectable style={styles.note}>{preset.cwd}\n{preset.command}</Text>
        {button('开始运行', () => void perform(() => start(preset)), !online)}
        {button('编辑此命令', () => load(preset))}
        {button('删除预设', () => void perform(async () => {
          await api(`/presets/${preset.id}`, undefined, 'DELETE'); setMessage('预设已删除');
        }), !online, true)}
      </View>)}
      {button('查看运行历史 / 添加预设', () => navigate('history'))}
      {button('查找 / 编辑 YAML 参数文件', () => {
        setBrowsePath(cwd || snapshot?.defaults.find((item) => item.configured)?.cwd || '');
        navigate('files');
      }, !online)}
    </>}
    {page === 'custom' && <>
    <Text style={styles.title}>{editingDefault ? `配置：${editingDefault.name}` : '添加自定义文件'}</Text>
    <Text style={styles.note}>工作目录和文件均位于 Jetson。</Text>
    <Text style={styles.label}>1. 确认工作目录</Text>
    <TextInput value={cwd} editable={!busy} onChangeText={(value) => edit(setCwd, value, true)}
      autoCapitalize="none" autoCorrect={false} placeholder="Jetson 绝对路径，例如 /home/用户名/工作区"
      placeholderTextColor="#77839a" style={styles.input} />
    {button('检查并确认目录', () => void perform(async () => {
      const version = revision.current;
      const result = await api<Directory>('/directory', { cwd });
      if (version !== revision.current) return;
      setCwd(result.cwd); setDirectory(result); setChecked(undefined);
      setMessage(`已确认目录：${result.cwd}`);
    }), !cwd.trim() || !online)}
    {directory && <View>
      <Text selectable style={styles.note}>已确认：{directory.cwd}</Text>
      <Text selectable style={styles.note}>{directory.entries.map((item) =>
        `${item.directory ? '[目录]' : '[文件]'} ${item.name}`).join('\n') || '空目录'}
        {directory.truncated ? '\n仅显示前 100 项' : ''}</Text>
    </View>}
    <Text style={styles.label}>2. 输入命令</Text>
    <TextInput value={command} editable={!busy} onChangeText={(value) => edit(setCommand, value)}
      autoCapitalize="none" autoCorrect={false} multiline placeholder="python3 scripts/node.py 或 ros2 launch 包名 文件名"
      placeholderTextColor="#77839a" style={styles.input} />
    <Text style={styles.note}>支持 ros2 launch、ros2 run、python3 文件.py 及参数。不要输入 cd、source 或 &&。</Text>
    <Text style={styles.label}>环境脚本（可选）</Text>
    <TextInput value={setup} editable={!busy} onChangeText={(value) => edit(setSetup, value)}
      autoCapitalize="none" autoCorrect={false} placeholder="例如 install/setup.bash；留空则继承网关环境"
      placeholderTextColor="#77839a" style={styles.input} />
    {button('校验命令并加入本次白名单', () => void perform(async () => {
      const version = revision.current;
      setChecked(undefined);
      const result = await api<Checked>('/validate', { cwd, command, setup });
      if (version !== revision.current) return;
      setChecked(result); setMessage('校验通过，可以启动。');
    }), !directory || !command.trim() || !online)}
    {checked && <Text selectable style={styles.note}>执行目录：{checked.cwd}{'\n'}文件：{checked.target}{'\n'}命令：{checked.command}</Text>}
    {button('启动已校验命令', () => void perform(async () => {
      if (!checked) return;
      const result = await api<Run>('/start', { id: checked.id });
      setMessage(result.message);
      onRun(result); openTerminal(result);
    }), !checked || !online)}
    {editingDefault && button('保存为默认选项', () => void perform(async () => {
      if (!checked) return;
      await api(`/defaults/${editingDefault.id}`, { cwd, command, setup });
      setMessage('默认选项已保存，之后可一键运行'); navigate('tasks');
    }), !checked || !online)}
    </>}
    {page !== 'history' && <>
    <Text style={styles.label}>运行中终端：{snapshot?.active_runs.length ?? 0} / 8</Text>
    <Text selectable style={styles.message}>{busy ? '处理中… ' : ''}{message}</Text>
    {page !== 'terminal' && button('打开多终端', () => navigate('terminal'))}
    {button('选择图像话题 / 可视化', visualize, !online)}
    {button('查看延时报告', report, !snapshot?.history.length)}
    </>}
    {page === 'terminal' && <>
      <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabRow}>
        {terminalRuns.map((run) => <View key={run.id}
          style={[styles.tab, selectedRunId === run.id && styles.activeTab]}>
          <Pressable onPress={() => { setSelectedRunId(run.id); void refreshLog(run.id); }}
            style={styles.tabLabelButton}>
            <Text numberOfLines={1} style={styles.tabText}>
              {activeIds.has(run.id) ? '● ' : ''}{terminalLabel(run)}
            </Text>
          </Pressable>
          <Pressable accessibilityLabel="关闭终端标签" onPress={() => {
            const remaining = terminalIds.filter((id) => id !== run.id);
            setTerminalIds(remaining);
            if (selectedRunId === run.id) setSelectedRunId(remaining[remaining.length - 1]);
          }} style={styles.closeTab}><Text style={styles.closeTabText}>×</Text></Pressable>
        </View>)}
        <Pressable accessibilityLabel="新建终端" onPress={() => setSelectedRunId(undefined)}
          style={[styles.tab, selectedRunId === undefined && styles.activeTab]}>
          <Text style={styles.tabText}>＋ 新终端</Text>
        </Pressable>
      </ScrollView>
      <TerminalWindow key={selectedRunId ?? 'new'} run={selectedRun}
        logs={selectedRunId ? terminalLogs[selectedRunId] ?? '' : ''} message={message} />
      {selectedRun && activeIds.has(selectedRun.id) && button('停止当前标签进程组', () => void perform(async () => {
        const result = await api<Run>('/stop', { id: selectedRun.id });
        setMessage(result.message);
      }), !online, true)}
      <Text style={styles.title}>在新终端运行命令</Text>
      <Text style={styles.note}>
        可直接输入 ros2 launch、ros2 run 或 python3 命令。工作目录相当于终端中的 cd，环境脚本相当于运行前 source。
      </Text>
      <TextInput value={cwd} editable={!busy}
        onChangeText={(value) => edit(setCwd, value, true)} autoCapitalize="none" autoCorrect={false}
        placeholder="工作目录，例如 /home/jetson/ros2_ws" placeholderTextColor="#77839a"
        style={styles.input} />
      <TextInput value={setup} editable={!busy}
        onChangeText={(value) => edit(setSetup, value)} autoCapitalize="none" autoCorrect={false}
        placeholder="可选：install/setup.bash" placeholderTextColor="#77839a" style={styles.input} />
      <TextInput value={command} editable={!busy}
        onChangeText={(value) => edit(setCommand, value)} autoCapitalize="none" autoCorrect={false}
        multiline blurOnSubmit={false} placeholder="ros2 launch 包名 文件.launch.py"
        placeholderTextColor="#77839a" style={[styles.input, styles.commandInput]} />
      {button('在新标签执行命令', () => void perform(runFromTerminal),
        !online || !cwd.trim() || !command.trim())}
      <Text style={styles.note}>
        最多同时运行 8 个受控进程；关闭标签不会停止进程。不接受 cd、source、管道、重定向或 &&。
      </Text>
    </>}
    {page === 'files' && <>
      {!yamlFile ? <>
        <Text style={styles.title}>查找 YAML 参数文件</Text>
        <Text style={styles.note}>从 Jetson 上的绝对目录开始，只开放 YAML 文件编辑。</Text>
        <TextInput value={browsePath} editable={!busy} onChangeText={setBrowsePath}
          autoCapitalize="none" autoCorrect={false} placeholder="例如 /home/jetson/wheel_ws/src"
          placeholderTextColor="#77839a" style={styles.input} />
        {button('打开目录', () => void perform(async () => {
          const result = await api<Directory>('/directory', { cwd: browsePath });
          setFileDirectory(result); setBrowsePath(result.cwd);
          setMessage(`正在浏览：${result.cwd}`);
        }), !browsePath.trim() || !online)}
        {fileDirectory && <View style={styles.fileList}>
          <Text selectable style={styles.note}>{fileDirectory.cwd}</Text>
          {fileDirectory.parent !== fileDirectory.cwd && button('📁 .. 上一级', () => void perform(async () => {
            const result = await api<Directory>('/directory', { cwd: fileDirectory.parent });
            setFileDirectory(result); setBrowsePath(result.cwd);
          }))}
          {fileDirectory.entries.filter((entry) => entry.directory || entry.editable).map((entry) =>
            button(`${entry.directory ? '📁' : '📝'} ${entry.name}`, () => void perform(async () => {
              if (entry.directory) {
                const result = await api<Directory>('/directory', { cwd: entry.path });
                setFileDirectory(result); setBrowsePath(result.cwd);
              } else {
                const result = await api<YamlFile>('/files/read', { path: entry.path });
                setYamlFile(result); setYamlDraft(result.content);
                setMessage(`已打开：${result.path}`);
              }
            }))) }
          {!fileDirectory.entries.some((entry) => entry.directory || entry.editable)
            && <Text style={styles.note}>当前目录没有子目录或 YAML 文件。</Text>}
        </View>}
      </> : <>
        <Text selectable style={styles.label}>{yamlFile.path}</Text>
        <Text selectable style={styles.note}>
          ROS 包：{yamlFile.package || '未识别'}{`\n`}工作区：{yamlFile.workspace || '未识别'}
        </Text>
        <TextInput value={yamlDraft} editable={!busy} onChangeText={setYamlDraft}
          autoCapitalize="none" autoCorrect={false} multiline blurOnSubmit={false}
          textAlignVertical="top" style={[styles.input, styles.yamlEditor]} />
        <Text style={yamlDirty ? styles.warning : styles.note}>
          {yamlDirty ? '● 有未保存修改' : '已与磁盘内容同步'}
        </Text>
        {button('仅保存 YAML', () => void perform(async () => { await saveCurrentYaml(); }), !yamlDirty || !online)}
        <TextInput value={buildSetup} editable={!busy} onChangeText={setBuildSetup}
          autoCapitalize="none" autoCorrect={false}
          placeholder="构建环境脚本（可选，例如 install/setup.bash）"
          placeholderTextColor="#77839a" style={styles.input} />
        {button('保存并编译所属 ROS 包', () => void perform(async () => {
          const saved = yamlDirty ? await saveCurrentYaml() : yamlFile;
          registerNavigationGuard(undefined);
          const result = await api<Run>('/build', { path: saved.path, setup: buildSetup });
          setReturnAfterBuildId(result.id);
          setMessage(`正在编译 ${saved.package}`);
          openTerminal(result);
        }), !yamlFile.package || !yamlFile.workspace || !online)}
        {button('关闭编辑器 / 返回文件列表', () => {
          const close = (): void => { setYamlFile(undefined); setYamlDraft(''); };
          if (!yamlDirty) { close(); return; }
          Alert.alert('参数尚未保存', '关闭前是否保存修改？', [
            { text: '取消', style: 'cancel' },
            { text: '不保存', style: 'destructive', onPress: close },
            { text: '保存', onPress: () => void saveCurrentYaml().then(close)
              .catch((error) => setMessage(error instanceof Error ? error.message : '保存失败')) },
          ]);
        })}
      </>}
    </>}
    {page === 'history' && <>
    <Text style={styles.title}>运行历史（最近 100 条）</Text>
    <Text style={styles.message}>{message}</Text>
    <TextInput value={presetName} onChangeText={setPresetName} placeholder="添加预设时使用的名称"
      placeholderTextColor="#77839a" style={styles.input} maxLength={80} />
    <Text style={styles.note}>成功启动 = 存活超过 1 秒或正常退出；不代表节点业务功能已验证。</Text>
    {snapshot?.history.map((run) => <View key={run.id} style={styles.record}>
      <Text style={styles.label}>{states[run.state] ?? run.state} · {new Date(run.started_at * 1000).toLocaleString()}</Text>
      <Text selectable style={styles.note}>{run.cwd}{'\n'}{run.command}{'\n'}{run.message}</Text>
      {button('载入此命令', () => load(run))}
      {run.successful && button('添加到预设', () => void perform(async () => {
        await api('/presets', { id: run.id, name: presetName.trim() });
        setMessage('已保存预设');
      }), !presetName.trim() || !online)}
    </View>)}
    </>}
  </View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#121f34', borderColor: '#233956', borderRadius: 14, borderWidth: 1, gap: 10, padding: 14 },
  title: { color: '#eaf2ff', fontSize: 18, fontWeight: '700' },
  label: { color: '#eaf2ff', fontSize: 14, fontWeight: '600' },
  note: { color: '#a9bad3', fontSize: 12, lineHeight: 18 },
  input: { backgroundColor: '#091321', borderColor: '#2c486c', borderRadius: 9, borderWidth: 1, color: '#f5f8ff', fontSize: 14, padding: 12 },
  commandInput: { minHeight: 72, textAlignVertical: 'top' },
  yamlEditor: { minHeight: 360, fontFamily: 'monospace', fontSize: 13 },
  button: { alignItems: 'center', backgroundColor: '#285b96', borderRadius: 9, padding: 12, minHeight: 48, justifyContent: 'center' },
  danger: { backgroundColor: '#a53d4c' },
  disabled: { opacity: 0.4 },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: '600', textAlign: 'center', flexShrink: 1 },
  message: { color: '#71d5ad', fontSize: 13 },
  warning: { color: '#f4c46b', fontSize: 13, fontWeight: '600' },
  record: { borderTopWidth: 1, borderColor: '#233956', paddingTop: 10, gap: 8 },
  fileList: { gap: 8 },
  tabRow: { alignItems: 'center', gap: 4, paddingBottom: 4 },
  tab: { alignItems: 'center', backgroundColor: '#17263a', borderColor: '#2f455f', borderRadius: 7,
    borderWidth: 1, flexDirection: 'row', minHeight: 44, paddingLeft: 10 },
  activeTab: { borderBottomColor: '#ef3f82', borderBottomWidth: 3, backgroundColor: '#26384d' },
  tabLabelButton: { justifyContent: 'center', minHeight: 42, maxWidth: 180 },
  tabText: { color: '#d8e4ee', fontSize: 12 },
  closeTab: { alignItems: 'center', justifyContent: 'center', minHeight: 42, minWidth: 38 },
  closeTabText: { color: '#9bacbf', fontSize: 20 },
  logBox: { backgroundColor: '#091321', padding: 8, gap: 6 },
});
