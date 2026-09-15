import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useGateway } from './gateway-provider';
import { RosbridgeClient, type RosbridgeConnectionState } from '@/services/rosbridge/rosbridge-client';
import { normalizeRosbridgeUrl, rosbridgeUrlFromGateway } from '@/services/rosbridge/protocol';

type RosbridgeContextValue = {
  address: string;
  setAddress: (value: string) => void;
  connectionState: RosbridgeConnectionState;
  statusMessage: string;
  advertiseTopic: (topic: string, type: string) => void;
  unadvertiseTopic: (topic: string) => void;
  publishTopic: <TMessage extends object>(topic: string, message: TMessage) => void;
  callService: <TArgs extends object, TResult>(
    service: string,
    args: TArgs,
    timeoutMs?: number,
  ) => Promise<TResult>;
  connect: () => void;
  disconnect: () => void;
};

declare const process: { env: { EXPO_PUBLIC_ROSBRIDGE_URL?: string } };

const ADDRESS_STORAGE_KEY = 'rosbridge-address';
const RosbridgeContext = React.createContext<RosbridgeContextValue | null>(null);

export function RosbridgeProvider({ children }: React.PropsWithChildren): React.JSX.Element {
  const gateway = useGateway();
  const configuredAddress = process.env.EXPO_PUBLIC_ROSBRIDGE_URL?.trim();
  const [address, setAddressState] = useState(
    configuredAddress || rosbridgeUrlFromGateway(gateway.gatewayAddress),
  );
  const [connectionState, setConnectionState] = useState<RosbridgeConnectionState>('idle');
  const [lastError, setLastError] = useState<string>();
  const addressRef = useRef(address);
  const shouldConnectRef = useRef(false);
  const addressTouchedRef = useRef(false);
  const clientRef = useRef<RosbridgeClient | null>(null);

  if (!clientRef.current) {
    clientRef.current = new RosbridgeClient({
      onStateChange: (state) => {
        setConnectionState(state);
        if (state === 'connected') setLastError(undefined);
      },
      onError: setLastError,
    });
  }
  const client = clientRef.current;

  useEffect(() => {
    void SecureStore.getItemAsync(ADDRESS_STORAGE_KEY).then((savedAddress) => {
      if (!addressTouchedRef.current && savedAddress) {
        addressRef.current = savedAddress;
        setAddressState(savedAddress);
      }
    });
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      // 系统恢复到前台时复用同一客户端；connect() 会拒绝创建重复连接。
      if (state === 'active' && shouldConnectRef.current) {
        void client.connect(addressRef.current).catch(() => undefined);
      }
    });
    return () => subscription.remove();
  }, [client]);

  useEffect(() => () => client.disconnect(), [client]);

  const setAddress = useCallback((value: string): void => {
    addressTouchedRef.current = true;
    shouldConnectRef.current = false;
    client.disconnect();
    addressRef.current = value;
    setAddressState(value);
    setLastError(undefined);
  }, [client]);

  const connect = useCallback((): void => {
    try {
      const normalized = normalizeRosbridgeUrl(addressRef.current);
      addressTouchedRef.current = true;
      addressRef.current = normalized;
      setAddressState(normalized);
      setLastError(undefined);
      shouldConnectRef.current = true;
      void SecureStore.setItemAsync(ADDRESS_STORAGE_KEY, normalized);
      void client.connect(normalized).catch(() => undefined);
    } catch (error) {
      shouldConnectRef.current = false;
      setLastError(error instanceof Error ? error.message : 'rosbridge 地址无效');
      setConnectionState('error');
    }
  }, [client]);

  const disconnect = useCallback((): void => {
    shouldConnectRef.current = false;
    client.disconnect();
  }, [client]);

  // GPS、航向、IMU 和磁力计共用这组方法，WebSocket 始终只由 RosbridgeClient 持有。
  const advertiseTopic = useCallback((topic: string, type: string): void => {
    client.advertise(topic, type);
  }, [client]);
  const unadvertiseTopic = useCallback((topic: string): void => {
    client.unadvertise(topic);
  }, [client]);
  const publishTopic = useCallback(<TMessage extends object,>(topic: string, message: TMessage): void => {
    client.publish(topic, message);
  }, [client]);
  const callService = useCallback(<TArgs extends object, TResult,>(
    service: string,
    args: TArgs,
    timeoutMs?: number,
  ): Promise<TResult> => client.callService<TArgs, TResult>(service, args, timeoutMs), [client]);

  const statusMessage = connectionState === 'connected'
    ? `已连接 ${addressRef.current}；GPS、航向、IMU 和磁力计共用此 WebSocket`
    : connectionState === 'connecting'
      ? `正在连接 ${addressRef.current}`
      : connectionState === 'reconnecting'
        ? `${lastError ? `${lastError}；` : '连接已中断；'}将按 1、2、4、8 秒间隔自动重连`
        : connectionState === 'disconnected'
          ? '已断开 rosbridge'
          : connectionState === 'error'
            ? lastError ?? 'rosbridge 连接错误'
            : '尚未连接 rosbridge';

  const value: RosbridgeContextValue = {
    address,
    setAddress,
    connectionState,
    statusMessage,
    advertiseTopic,
    unadvertiseTopic,
    publishTopic,
    callService,
    connect,
    disconnect,
  };
  return <RosbridgeContext value={value}>{children}</RosbridgeContext>;
}

export function useRosbridge(): RosbridgeContextValue {
  const value = React.use(RosbridgeContext);
  if (!value) throw new Error('useRosbridge 必须在 RosbridgeProvider 内使用');
  return value;
}
