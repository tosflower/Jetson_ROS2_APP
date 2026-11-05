import { usePathname } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useGateway } from './gateway-provider';
import { useRosbridge } from './rosbridge-provider';
import { formatRosoutMessage, ROSOUT_TOPIC, ROSOUT_TYPE } from '@/services/rosbridge/rosout';

export const ROSOUT_TERMINAL_ID = '__rosout__';

export type MonitoredRun = {
  id: string; cwd: string; command: string; setup: string; state: string;
  message: string; started_at: number; returncode?: number | null;
  kind?: 'command' | 'build'; target?: string;
};

type Snapshot = { active_runs: MonitoredRun[]; history: MonitoredRun[] };
type MonitorContextValue = {
  snapshot?: Snapshot;
  online: boolean;
  message: string;
  terminalIds: string[];
  selectedRunId?: string;
  terminalLogs: Record<string, string>;
  rosoutLogs: string;
  rosConnected: boolean;
  selectTerminal: (id?: string) => void;
  closeTerminal: (id: string) => void;
};

const MonitorContext = React.createContext<MonitorContextValue | null>(null);

/** 只读取网关任务状态和终端日志，不向网关发送运行、停止或配置请求。 */
export function MonitorProvider({ children }: React.PropsWithChildren): React.JSX.Element {
  const { connectedBase, gatewayState, sessionReady, authToken } = useGateway();
  const { connectionState, subscribeTopic } = useRosbridge();
  const pathname = usePathname();
  const [snapshot, setSnapshot] = useState<Snapshot>();
  const [online, setOnline] = useState(false);
  const [message, setMessage] = useState('等待网关连接');
  const [terminalIds, setTerminalIds] = useState<string[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string>();
  const [terminalLogs, setTerminalLogs] = useState<Record<string, string>>({});
  const [rosoutLogs, setRosoutLogs] = useState('');
  const closedIds = useRef(new Set<string>());
  const selectedRef = useRef<string | undefined>(undefined);
  selectedRef.current = selectedRunId;

  useEffect(() => {
    if (!sessionReady) {
      setRosoutLogs('');
      return undefined;
    }
    // ROS2 的 /rosout 可覆盖在 Jetson 桌面或 SSH 中手动启动的 ROS 节点日志。
    return subscribeTopic(ROSOUT_TOPIC, ROSOUT_TYPE, (raw) => {
      const line = formatRosoutMessage(raw);
      if (line) setRosoutLogs((current) => (current + line).slice(-12000));
    }, { throttleRate: 100, queueLength: 10 });
  }, [sessionReady, subscribeTopic]);

  const read = useCallback(async <T,>(path: string): Promise<T> => {
    const response = await fetch(`${connectedBase}/api/commands${path}`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    });
    if (!response.ok) throw new Error(`读取监控信息失败（${response.status}）`);
    return response.json() as Promise<T>;
  }, [authToken, connectedBase]);

  useEffect(() => {
    if (!sessionReady || gatewayState !== '已连接') {
      setOnline(false);
      setMessage('等待网关连接');
      setSnapshot(undefined);
      setTerminalLogs({});
      setTerminalIds([]);
      setSelectedRunId(undefined);
      return undefined;
    }
    let disposed = false;
    let timer: ReturnType<typeof setTimeout>;
    const poll = async (): Promise<void> => {
      try {
        const data = await read<Snapshot>('');
        if (disposed) return;
        setSnapshot(data);
        setOnline(true);
        setMessage('终端日志订阅正常');
        const known = new Set(data.history.map((run) => run.id));
        const latest = data.active_runs.at(-1) ?? data.history[0];
        const candidates = data.active_runs.length ? data.active_runs : latest ? [latest] : [];
        setTerminalIds((current) => Array.from(new Set([
          ...current.filter((id) => known.has(id)),
          ...candidates.map((run) => run.id).filter((id) => !closedIds.current.has(id)),
        ])));
        setSelectedRunId((current) => current === ROSOUT_TERMINAL_ID
          || (current && known.has(current) && !closedIds.current.has(current))
          ? current : ROSOUT_TERMINAL_ID);
        const logId = selectedRef.current && known.has(selectedRef.current) ? selectedRef.current : latest?.id;
        if (logId && (pathname.endsWith('/terminals') || pathname.endsWith('/images'))) {
          const result = await read<{ id: string; logs: string }>(`/logs/${encodeURIComponent(logId)}`);
          if (!disposed) setTerminalLogs((current) => ({ ...current, [result.id]: result.logs }));
        }
      } catch (error) {
        if (!disposed) {
          setOnline(false);
          setMessage(error instanceof Error ? error.message : '读取终端信息失败');
        }
      }
      if (!disposed) timer = setTimeout(() => void poll(), pathname.endsWith('/terminals') ? 500 : pathname.endsWith('/images') ? 1000 : 2000);
    };
    void poll();
    return () => { disposed = true; clearTimeout(timer); };
  }, [gatewayState, pathname, read, sessionReady]);

  const selectTerminal = (id?: string): void => {
    if (id && id !== ROSOUT_TERMINAL_ID) {
      closedIds.current.delete(id);
      setTerminalIds((current) => Array.from(new Set([...current, id])));
    }
    setSelectedRunId(id);
  };
  const closeTerminal = (id: string): void => {
    closedIds.current.add(id);
    setTerminalIds((current) => {
      const remaining = current.filter((item) => item !== id);
      if (selectedRef.current === id) setSelectedRunId(remaining.at(-1) ?? ROSOUT_TERMINAL_ID);
      return remaining;
    });
  };

  return <MonitorContext value={{ snapshot, online, message, terminalIds, selectedRunId, terminalLogs,
    rosoutLogs, rosConnected: connectionState === 'connected', selectTerminal, closeTerminal }}>{children}</MonitorContext>;
}

export function useMonitor(): MonitorContextValue {
  const value = React.use(MonitorContext);
  if (!value) throw new Error('useMonitor 必须在 MonitorProvider 内使用');
  return value;
}
