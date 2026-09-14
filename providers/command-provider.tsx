import { router, usePathname } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useGateway } from './gateway-provider';

export type Spec = { cwd: string; command: string; setup: string };
export type Checked = Spec & { id: string; target: string };
export type Run = Spec & {
  id: string; state: string; message: string; successful: boolean; started_at: number;
  returncode?: number | null; kind?: 'command' | 'build'; target?: string;
};
export type Preset = Spec & { id: string; name: string };
export type DefaultOption = Spec & { id: string; name: string; file: string; configured: boolean };
export type Snapshot = { active: Run | null; active_runs: Run[]; history: Run[]; presets: Preset[]; defaults: DefaultOption[] };
export type DirectoryEntry = { name: string; path: string; directory: boolean; editable: boolean };
export type Directory = { cwd: string; parent: string; entries: DirectoryEntry[]; truncated: boolean };
export type YamlFile = { path: string; content: string; mtime_ns: string; package: string; package_path: string; workspace: string };

export const runStates: Record<string, string> = {
  starting: '启动中', running: '运行中', stopping: '停止中', stopped: '已停止',
  completed: '正常完成', failed: '失败', interrupted: '状态未知',
};

export const fallbackDefaults: DefaultOption[] = [
  { id: 'car_system', name: '小车系统', file: 'run_launch.py', configured: false, cwd: '', command: 'ros2 launch wheel_perception run_launch.py', setup: '' },
  { id: 'bluetooth_system', name: '蓝牙节点', file: 'sub.py', configured: false, cwd: '/home/lee/wheel/wheel_cuda/src/wheel_perception/scripts', command: 'python3 /home/lee/wheel/wheel_cuda/src/wheel_perception/scripts/sub.py', setup: '' },
];

type CommandContextValue = {
  snapshot?: Snapshot;
  busy: boolean;
  online: boolean;
  message: string;
  cwd: string;
  command: string;
  setup: string;
  directory?: Directory;
  checked?: Checked;
  editingDefault?: DefaultOption;
  configurationName: string;
  presetName: string;
  terminalIds: string[];
  selectedRunId?: string;
  terminalLogs: Record<string, string>;
  fileDirectory?: Directory;
  browsePath: string;
  yamlFile?: YamlFile;
  yamlDraft: string;
  yamlDirty: boolean;
  buildSetup: string;
  setPresetName: (value: string) => void;
  setBrowsePath: (value: string) => void;
  setYamlDraft: (value: string) => void;
  setBuildSetup: (value: string) => void;
  setConfigurationName: (value: string) => void;
  editCwd: (value: string) => void;
  editCommand: (value: string) => void;
  editSetup: (value: string) => void;
  refresh: () => Promise<void>;
  start: (spec: Spec) => Promise<void>;
  loadSpec: (spec: Spec, option?: DefaultOption) => void;
  confirmDirectory: () => Promise<void>;
  validateCommand: () => Promise<void>;
  startChecked: () => Promise<void>;
  saveDefault: () => Promise<void>;
  createDefault: () => Promise<void>;
  deleteDefault: (id: string) => Promise<void>;
  runFromTerminal: () => Promise<void>;
  selectTerminal: (id?: string) => void;
  closeTerminal: (id: string) => void;
  stopRun: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  openWorkingDirectoryBrowser: () => Promise<void>;
  chooseWorkingDirectory: () => void;
  openBrowseRoot: () => void;
  openDirectory: (path?: string) => Promise<void>;
  openEntry: (entry: DirectoryEntry) => Promise<void>;
  saveCurrentYaml: () => Promise<YamlFile>;
  buildCurrentYaml: () => Promise<void>;
  closeYaml: () => void;
  discardYaml: () => void;
  deletePreset: (id: string) => Promise<void>;
  addPreset: (runId: string) => Promise<void>;
};

const CommandContext = React.createContext<CommandContextValue | null>(null);

/** 所有命令状态位于 Router 之上，切换 Tab 或返回页面不会中断日志轮询和编辑草稿。 */
export function CommandProvider({ children }: React.PropsWithChildren): React.JSX.Element {
  const { connectedBase, sessionReady, authToken, resetRunLatency } = useGateway();
  const pathname = usePathname();
  const [editingDefault, setEditingDefault] = useState<DefaultOption>();
  const [configurationName, setConfigurationName] = useState('');
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
  const currentRunId = useRef<string | undefined>(undefined);
  // 用户关闭标签仅影响手机界面；记录其 ID，避免轮询把运行中的标签立即加回来。
  const closedTerminalIds = useRef(new Set<string>());

  const api = useCallback(async <T,>(path: string, body?: object, method?: string): Promise<T> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(`${connectedBase}/api/commands${path}`, {
        method: method ?? (body ? 'POST' : 'GET'),
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
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
  }, [authToken, connectedBase]);

  const refreshLog = useCallback(async (runId: string): Promise<void> => {
    try {
      const result = await api<{ id: string; logs: string }>(`/logs/${runId}`);
      setTerminalLogs((current) => ({ ...current, [result.id]: result.logs }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '读取终端输出失败');
    }
  }, [api]);

  const refresh = useCallback(async (): Promise<void> => {
    if (!sessionReady) return;
    const sequence = ++requestSequence.current;
    try {
      const data = await api<Snapshot>('');
      if (sequence !== requestSequence.current) return;
      setSnapshot(data);
      const latest = data.active_runs[data.active_runs.length - 1] ?? data.history[0];
      if (latest?.id !== currentRunId.current) {
        currentRunId.current = latest?.id;
        resetRunLatency();
      }
      const knownIds = new Set(data.history.map((run) => run.id));
      closedTerminalIds.current.forEach((id) => {
        if (!knownIds.has(id)) closedTerminalIds.current.delete(id);
      });
      const terminalCandidates = data.active_runs.length
        ? data.active_runs.map((run) => run.id).filter((id) => !closedTerminalIds.current.has(id))
        : latest && !closedTerminalIds.current.has(latest.id) ? [latest.id] : [];
      setTerminalIds((current) => Array.from(new Set([
        ...current.filter((id) => knownIds.has(id)), ...terminalCandidates,
      ])));
      setSelectedRunId((current) => current && knownIds.has(current) ? current : latest?.id);
      setOnline(true);
    } catch (error) {
      if (sequence === requestSequence.current) {
        setOnline(false);
        setMessage(error instanceof Error ? error.message : '读取命令状态失败');
      }
    }
  }, [api, resetRunLatency, sessionReady]);

  useEffect(() => {
    if (!sessionReady) {
      setOnline(false);
      return undefined;
    }
    let disposed = false;
    let timer: ReturnType<typeof setTimeout>;
    const poll = async (): Promise<void> => {
      if (!busyRef.current) {
        await refresh();
        if ((pathname.endsWith('/terminals') || pathname.endsWith('/images')) && selectedRunId) {
          await refreshLog(selectedRunId);
        }
      }
      const interval = pathname.endsWith('/terminals') ? 500 : pathname.endsWith('/images') ? 1000 : 2000;
      if (!disposed) timer = setTimeout(() => void poll(), interval);
    };
    void poll();
    return () => { disposed = true; clearTimeout(timer); requestSequence.current += 1; };
  }, [pathname, refresh, refreshLog, selectedRunId, sessionReady]);

  const perform = useCallback(async <T,>(work: () => Promise<T>): Promise<T> => {
    if (busyRef.current) throw new Error('已有操作正在进行');
    busyRef.current = true;
    requestSequence.current += 1;
    setBusy(true);
    try {
      return await work();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '操作失败');
      throw error;
    } finally {
      await refresh();
      busyRef.current = false;
      setBusy(false);
    }
  }, [refresh]);

  const openTerminal = useCallback((run: Run): void => {
    closedTerminalIds.current.delete(run.id);
    setTerminalIds((current) => Array.from(new Set([...current, run.id])));
    setSelectedRunId(run.id);
    void refreshLog(run.id);
    router.push('/monitor/terminals');
  }, [refreshLog]);

  const start = useCallback(async (spec: Spec): Promise<void> => {
    await perform(async () => {
      const approved = await api<Checked>('/validate', spec);
      const result = await api<Run>('/start', { id: approved.id });
      setMessage(result.message);
      currentRunId.current = result.id;
      resetRunLatency();
      openTerminal(result);
    });
  }, [api, openTerminal, perform, resetRunLatency]);

  const loadSpec = useCallback((spec: Spec, option?: DefaultOption): void => {
    setEditingDefault(option);
    setConfigurationName(option?.name ?? '');
    revision.current += 1;
    setCwd(spec.cwd);
    setCommand(spec.command);
    setSetup(spec.setup);
    setChecked(undefined);
    setDirectory(undefined);
    setMessage('已填入保存的命令，请重新确认目录，再校验并启动。');
    router.push('/launch/configuration/command');
  }, []);

  const edit = (setter: (value: string) => void, value: string, cwdChanged = false): void => {
    revision.current += 1;
    setter(value);
    setChecked(undefined);
    if (cwdChanged) setDirectory(undefined);
  };

  const confirmDirectory = async (): Promise<void> => {
    await perform(async () => {
      const version = revision.current;
      const result = await api<Directory>('/directory', { cwd });
      if (version !== revision.current) return;
      setCwd(result.cwd);
      setDirectory(result);
      setChecked(undefined);
      setMessage(`已确认目录：${result.cwd}`);
    });
  };

  const validateCommand = async (): Promise<void> => {
    await perform(async () => {
      const version = revision.current;
      setChecked(undefined);
      const result = await api<Checked>('/validate', { cwd, command, setup });
      if (version !== revision.current) return;
      setChecked(result);
      setMessage('校验通过，可以启动。');
    });
  };

  const startChecked = async (): Promise<void> => {
    if (!checked) return;
    await perform(async () => {
      const result = await api<Run>('/start', { id: checked.id });
      setMessage(result.message);
      currentRunId.current = result.id;
      resetRunLatency();
      openTerminal(result);
    });
  };

  const saveDefault = async (): Promise<void> => {
    if (!checked || !editingDefault) return;
    await perform(async () => {
      await api(`/defaults/${editingDefault.id}`, { name: configurationName.trim(), cwd, command, setup });
      setMessage('启动配置已保存，之后可一键运行');
      router.replace('/launch');
    });
  };

  const createDefault = async (): Promise<void> => {
    const created = await perform(() => api<DefaultOption>('/defaults', { name: '新启动配置' }));
    loadSpec(created, created);
    setMessage('已新建启动配置，请填写名称、目录和命令');
  };

  const deleteDefault = async (id: string): Promise<void> => {
    await perform(async () => {
      await api(`/defaults/${id}`, undefined, 'DELETE');
      setEditingDefault(undefined);
      setConfigurationName('');
      setMessage('启动配置已删除');
      router.replace('/launch/configuration');
    });
  };

  const runFromTerminal = async (): Promise<void> => {
    await perform(async () => {
      const approved = await api<Checked>('/validate', { cwd, command, setup });
      setChecked(approved);
      const result = await api<Run>('/start', { id: approved.id });
      setMessage(result.message);
      currentRunId.current = result.id;
      resetRunLatency();
      openTerminal(result);
    });
  };

  const selectTerminal = (id?: string): void => {
    if (id) {
      closedTerminalIds.current.delete(id);
      setTerminalIds((current) => Array.from(new Set([...current, id])));
    }
    setSelectedRunId(id);
    if (id) void refreshLog(id);
  };

  const closeTerminal = (id: string): void => {
    closedTerminalIds.current.add(id);
    const remaining = terminalIds.filter((item) => item !== id);
    setTerminalIds(remaining);
    if (selectedRunId === id) setSelectedRunId(remaining[remaining.length - 1]);
  };

  const stopRun = async (id: string): Promise<void> => {
    await perform(async () => {
      const result = await api<Run>('/stop', { id });
      setMessage(result.message);
    });
  };

  const clearHistory = async (): Promise<void> => {
    await perform(async () => {
      const result = await api<{ deleted: number; retained_ids: string[]; snapshot: Snapshot }>('/history', undefined, 'DELETE');
      if (!Array.isArray(result.retained_ids) || !result.snapshot) {
        throw new Error('Jetson 网关版本过旧，请同步整个 gateway 目录并重启服务');
      }
      const retained = new Set(result.retained_ids);
      // 直接采用删除响应中的快照，避免慢速旧轮询把已删除记录重新写回界面。
      setSnapshot(result.snapshot);
      setTerminalIds((current) => current.filter((id) => retained.has(id)));
      setSelectedRunId((current) => current && retained.has(current) ? current : result.retained_ids[0]);
      setTerminalLogs((current) => Object.fromEntries(
        Object.entries(current).filter(([id]) => retained.has(id)),
      ));
      setMessage(result.deleted ? `已清除 ${result.deleted} 条历史记录` : '没有可清除的历史记录');
    });
  };

  const openWorkingDirectoryBrowser = async (): Promise<void> => {
    await perform(async () => {
      // 空路径从文件系统根目录开始，避免假设 Jetson 的用户名。
      const result = await api<Directory>('/directory', { cwd: cwd.trim() || '/' });
      setFileDirectory(result);
      setBrowsePath(result.cwd);
      setMessage(`请选择工作目录：${result.cwd}`);
      router.push('/launch/configuration/directory');
    });
  };

  const chooseWorkingDirectory = (): void => {
    if (!fileDirectory) return;
    revision.current += 1;
    setCwd(fileDirectory.cwd);
    setDirectory(fileDirectory);
    setChecked(undefined);
    setMessage(`已选择工作目录：${fileDirectory.cwd}`);
    router.back();
  };

  const openBrowseRoot = (): void => {
    setBrowsePath(cwd || snapshot?.defaults.find((item) => item.configured)?.cwd || '');
    router.push('/launch/configuration/files');
  };

  const openDirectory = async (path = browsePath): Promise<void> => {
    await perform(async () => {
      const result = await api<Directory>('/directory', { cwd: path });
      setFileDirectory(result);
      setBrowsePath(result.cwd);
      setMessage(`正在浏览：${result.cwd}`);
    });
  };

  const openEntry = async (entry: DirectoryEntry): Promise<void> => {
    await perform(async () => {
      if (entry.directory) {
        const result = await api<Directory>('/directory', { cwd: entry.path });
        setFileDirectory(result);
        setBrowsePath(result.cwd);
        return;
      }
      const result = await api<YamlFile>('/files/read', { path: entry.path });
      setYamlFile(result);
      setYamlDraft(result.content);
      setMessage(`已打开：${result.path}`);
      router.push('/launch/configuration/yaml-editor');
    });
  };

  const saveCurrentYaml = useCallback(async (): Promise<YamlFile> => {
    if (!yamlFile) throw new Error('尚未打开 YAML 文件');
    const saved = await api<YamlFile>('/files/save', {
      path: yamlFile.path, content: yamlDraft, expected_mtime_ns: yamlFile.mtime_ns,
    });
    setYamlFile(saved);
    setYamlDraft(saved.content);
    setMessage(`已保存：${saved.path}`);
    return saved;
  }, [api, yamlDraft, yamlFile]);

  const buildCurrentYaml = async (): Promise<void> => {
    if (!yamlFile) return;
    await perform(async () => {
      const saved = yamlDraft !== yamlFile.content ? await saveCurrentYaml() : yamlFile;
      const result = await api<Run>('/build', { path: saved.path, setup: buildSetup });
      setReturnAfterBuildId(result.id);
      setMessage(`正在编译 ${saved.package}`);
      openTerminal(result);
    });
  };

  useEffect(() => {
    if (!returnAfterBuildId || !snapshot) return undefined;
    const build = snapshot.history.find((run) => run.id === returnAfterBuildId);
    if (!build || ['starting', 'running', 'stopping'].includes(build.state)) return undefined;
    const timer = setTimeout(() => {
      setReturnAfterBuildId(undefined);
      setMessage(build.state === 'completed' ? '编译完成，已返回启动页面' : `编译未成功：${build.message}`);
      router.replace('/launch');
    }, 1200);
    return () => clearTimeout(timer);
  }, [returnAfterBuildId, snapshot]);

  const discardYaml = (): void => {
    setYamlFile(undefined);
    setYamlDraft('');
  };

  const closeYaml = (): void => router.back();

  const deletePreset = async (id: string): Promise<void> => {
    await perform(async () => {
      await api(`/presets/${id}`, undefined, 'DELETE');
      setMessage('预设已删除');
    });
  };

  const addPreset = async (runId: string): Promise<void> => {
    await perform(async () => {
      await api('/presets', { id: runId, name: presetName.trim() });
      setMessage('已保存预设');
    });
  };

  const value: CommandContextValue = {
    snapshot, busy, online, message, cwd, command, setup, directory, checked, editingDefault,
    configurationName,
    presetName, terminalIds, selectedRunId, terminalLogs, fileDirectory, browsePath, yamlFile,
    yamlDraft, yamlDirty: !!yamlFile && yamlDraft !== yamlFile.content, buildSetup,
    setPresetName, setBrowsePath, setYamlDraft, setBuildSetup, setConfigurationName,
    editCwd: (value) => edit(setCwd, value, true),
    editCommand: (value) => edit(setCommand, value),
    editSetup: (value) => edit(setSetup, value),
    refresh, start, loadSpec, confirmDirectory, validateCommand, startChecked, saveDefault,
    createDefault, deleteDefault,
    runFromTerminal, selectTerminal, closeTerminal, stopRun, clearHistory,
    openWorkingDirectoryBrowser, chooseWorkingDirectory, openBrowseRoot, openDirectory,
    openEntry, saveCurrentYaml, buildCurrentYaml, closeYaml, discardYaml, deletePreset, addPreset,
  };
  return <CommandContext value={value}>{children}</CommandContext>;
}

export function useCommands(): CommandContextValue {
  const value = React.use(CommandContext);
  if (!value) throw new Error('useCommands 必须在 CommandProvider 内使用');
  return value;
}
