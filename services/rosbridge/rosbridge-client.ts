import {
  normalizeRosbridgeUrl,
  parseRosbridgeMessage,
  type RosbridgeSubscribeOptions,
} from './protocol';

export type RosbridgeConnectionState =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'error';

type SocketLike = {
  readyState: number;
  onopen: (() => void) | null;
  onmessage: ((event: { data: unknown }) => void) | null;
  onerror: (() => void) | null;
  onclose: ((event: { code?: number; reason?: string }) => void) | null;
  send: (data: string) => void;
  close: () => void;
};

type RosbridgeClientOptions = {
  createSocket?: (url: string) => SocketLike;
  reconnectDelaysMs?: readonly number[];
  connectionTimeoutMs?: number;
  onStateChange?: (state: RosbridgeConnectionState) => void;
  onError?: (message: string) => void;
};

type Subscription = {
  id: string;
  topic: string;
  type: string;
  callback: (msg: Record<string, unknown>) => void;
  options: RosbridgeSubscribeOptions;
};

type Advertisement = {
  id: string;
  topic: string;
  type: string;
};

type PendingService = {
  resolve: (value: unknown) => void;
  reject: (reason: Error) => void;
  timer: ReturnType<typeof setTimeout>;
};

const SOCKET_OPEN = 1;
const DEFAULT_RECONNECT_DELAYS_MS = [1000, 2000, 4000, 8000] as const;

/**
 * App 内唯一直接持有 rosbridge WebSocket 的客户端。
 * 当前支持 Topic 订阅/发布和 Service 调用；Action 留待后续阶段。
 */
export class RosbridgeClient {
  private readonly createSocket: (url: string) => SocketLike;
  private readonly reconnectDelaysMs: readonly number[];
  private readonly connectionTimeoutMs: number;
  private readonly onStateChange?: (state: RosbridgeConnectionState) => void;
  private readonly onError?: (message: string) => void;
  private readonly subscriptions = new Map<string, Subscription>();
  private readonly advertisements = new Map<string, Advertisement>();
  private readonly pendingServices = new Map<string, PendingService>();
  private socket: SocketLike | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private connectionTimer: ReturnType<typeof setTimeout> | null = null;
  private connectionState: RosbridgeConnectionState = 'idle';
  private url: string | null = null;
  private authToken: string | null = null;
  private shouldReconnect = false;
  private reconnectAttempt = 0;
  private nextSubscriptionId = 0;
  private nextServiceId = 0;
  private pendingReject: ((reason?: unknown) => void) | null = null;

  constructor(options: RosbridgeClientOptions = {}) {
    this.createSocket = options.createSocket
      ?? ((url) => new WebSocket(url) as unknown as SocketLike);
    this.reconnectDelaysMs = options.reconnectDelaysMs?.length
      ? options.reconnectDelaysMs
      : DEFAULT_RECONNECT_DELAYS_MS;
    this.connectionTimeoutMs = options.connectionTimeoutMs ?? 10000;
    this.onStateChange = options.onStateChange;
    this.onError = options.onError;
  }

  connect(value: string, authToken?: string): Promise<void> {
    let normalizedUrl: string;
    try {
      normalizedUrl = normalizeRosbridgeUrl(value);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'rosbridge 地址无效';
      this.reportError(message);
      return Promise.reject(error);
    }

    if (this.shouldReconnect && this.url === normalizedUrl && this.authToken === (authToken ?? null)) {
      if (this.connectionState === 'connected') return Promise.resolve();
      if (this.socket || this.reconnectTimer) return Promise.resolve();
    }

    this.shouldReconnect = false;
    this.clearReconnectTimer();
    this.closeCurrentSocket();
    this.url = normalizedUrl;
    this.authToken = authToken ?? null;
    this.shouldReconnect = true;
    this.reconnectAttempt = 0;
    return this.openSocket('connecting');
  }

  disconnect(): void {
    this.shouldReconnect = false;
    this.clearReconnectTimer();
    if (this.isSocketOpen()) {
      this.advertisements.forEach((advertisement) => this.sendUnadvertise(advertisement));
    }
    this.closeCurrentSocket();
    this.transition('disconnected');
  }

  subscribe(
    topic: string,
    type: string,
    callback: (msg: Record<string, unknown>) => void,
    options: RosbridgeSubscribeOptions = {},
  ): () => void {
    if (!topic.startsWith('/') || !type.trim()) throw new Error('Topic 名必须以 / 开头，且消息类型不能为空');
    const id = `sub:${++this.nextSubscriptionId}:${topic}`;
    const subscription = { id, topic, type, callback, options };
    this.subscriptions.set(id, subscription);
    if (this.isSocketOpen()) this.sendSubscribe(subscription);

    let active = true;
    return () => {
      if (!active) return;
      active = false;
      this.subscriptions.delete(id);
      if (this.isSocketOpen()) this.send({ op: 'unsubscribe', id, topic });
    };
  }

  getConnectionState(): RosbridgeConnectionState {
    return this.connectionState;
  }

  advertise(topic: string, type: string): void {
    this.validateTopicAndType(topic, type);
    const current = this.advertisements.get(topic);
    if (current?.type === type) return;
    if (current && this.isSocketOpen()) this.sendUnadvertise(current);

    const advertisement = { id: `adv:${topic}`, topic, type };
    this.advertisements.set(topic, advertisement);
    if (this.isSocketOpen()) this.sendAdvertise(advertisement);
  }

  unadvertise(topic: string): void {
    const advertisement = this.advertisements.get(topic);
    if (!advertisement) return;
    this.advertisements.delete(topic);
    if (this.isSocketOpen()) this.sendUnadvertise(advertisement);
  }

  publish<TMessage extends object>(topic: string, msg: TMessage): void {
    if (!this.advertisements.has(topic)) throw new Error(`Topic ${topic} 尚未 advertise`);
    if (!this.isSocketOpen() || this.connectionState !== 'connected') {
      throw new Error('rosbridge 未连接，消息未发送');
    }
    this.send({ op: 'publish', topic, msg });
  }

  callService<TArgs extends object, TResult>(
    service: string,
    args: TArgs,
    timeoutMs = 5000,
  ): Promise<TResult> {
    if (!service.startsWith('/')) return Promise.reject(new Error('Service 名必须以 / 开头'));
    if (!this.isSocketOpen() || this.connectionState !== 'connected') {
      return Promise.reject(new Error('rosbridge 未连接，Service 请求未发送'));
    }
    if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
      return Promise.reject(new Error('Service 超时时间必须大于 0'));
    }

    const id = `service:${++this.nextServiceId}:${service}`;
    return new Promise<TResult>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingServices.delete(id);
        reject(new Error(`Service ${service} 调用超时`));
      }, timeoutMs);
      this.pendingServices.set(id, {
        resolve: (value) => resolve(value as TResult),
        reject,
        timer,
      });
      this.send({ op: 'call_service', id, service, args });
    });
  }

  private openSocket(state: 'connecting' | 'reconnecting'): Promise<void> {
    if (!this.url || !this.shouldReconnect) return Promise.resolve();
    this.transition(state);

    return new Promise<void>((resolve, reject) => {
      this.pendingReject = reject;
      let socket: SocketLike;
      try {
        socket = this.createSocket(this.url!);
      } catch (error) {
        this.pendingReject = null;
        const message = error instanceof Error ? error.message : '无法创建 rosbridge 连接';
        this.reportError(message);
        this.scheduleReconnect();
        reject(error);
        return;
      }

      this.socket = socket;
      this.connectionTimer = setTimeout(() => {
        if (this.socket !== socket || this.connectionState === 'connected') return;
        this.reportError('rosbridge 连接超时，请检查 IP、端口和网络');
        this.closeCurrentSocket();
        this.scheduleReconnect();
      }, this.connectionTimeoutMs);
      const ready = (): void => {
        this.clearConnectionTimer();
        this.pendingReject = null;
        this.reconnectAttempt = 0;
        this.transition('connected');
        // 认证完成后再恢复订阅和发布，避免首帧在网关认证前到达。
        this.subscriptions.forEach((subscription) => this.sendSubscribe(subscription));
        this.advertisements.forEach((advertisement) => this.sendAdvertise(advertisement));
        resolve();
      };
      socket.onopen = () => {
        if (this.socket !== socket || !this.shouldReconnect) return;
        if (this.authToken) this.send({ op: 'auth', token: this.authToken });
        else ready();
      };
      socket.onmessage = (event) => {
        if (this.socket !== socket) return;
        if (this.authToken && this.connectionState !== 'connected') {
          // 内置手机桥需要确认登录令牌；独立 rosbridge 没有此握手。
          try {
            const response = JSON.parse(String(event.data)) as { op?: string; result?: boolean };
            if (response.op === 'auth_response' && response.result === true) ready();
          } catch { /* 非法认证响应交给连接超时处理。 */ }
          return;
        }
        const incoming = parseRosbridgeMessage(event.data);
        if (!incoming) return;
        if (incoming.op === 'status') {
          // 发布被网关拒绝时保留 WebSocket，并把原因交给手机界面显示。
          if (incoming.level === 'error') this.onError?.(incoming.msg);
          return;
        }
        if (incoming.op === 'service_response') {
          const pending = this.pendingServices.get(incoming.id);
          if (!pending) return;
          clearTimeout(pending.timer);
          this.pendingServices.delete(incoming.id);
          if (incoming.result) pending.resolve(incoming.values);
          else pending.reject(new Error(`Service ${incoming.service ?? incoming.id} 返回失败`));
          return;
        }
        this.subscriptions.forEach((subscription) => {
          if (subscription.topic !== incoming.topic) return;
          try {
            subscription.callback(incoming.msg);
          } catch {
            this.onError?.(`处理 ${incoming.topic} 消息时发生错误`);
          }
        });
      };
      socket.onerror = () => {
        if (this.socket !== socket) return;
        this.reportError('rosbridge 连接失败，请检查 IP、端口和网络');
      };
      socket.onclose = (event) => {
        if (this.socket !== socket) return;
        this.clearConnectionTimer();
        this.socket = null;
        const rejectPending = this.pendingReject;
        this.pendingReject = null;
        rejectPending?.(new Error(event.reason || `rosbridge 连接已关闭（${event.code ?? '未知代码'}）`));
        this.rejectPendingServices(new Error('rosbridge 连接已中断'));
        if (event.code === 1008) {
          this.shouldReconnect = false;
          this.reportError(event.reason || '手机桥认证失败');
        } else if (this.shouldReconnect) this.scheduleReconnect();
        else this.transition('disconnected');
      };
    });
  }

  private scheduleReconnect(): void {
    if (!this.shouldReconnect || this.reconnectTimer) return;
    const index = Math.min(this.reconnectAttempt, this.reconnectDelaysMs.length - 1);
    const delay = this.reconnectDelaysMs[index];
    this.reconnectAttempt += 1;
    this.transition('reconnecting');
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      void this.openSocket('reconnecting').catch(() => undefined);
    }, delay);
  }

  private sendSubscribe(subscription: Subscription): void {
    this.send({
      op: 'subscribe',
      id: subscription.id,
      topic: subscription.topic,
      type: subscription.type,
      throttle_rate: subscription.options.throttleRate ?? 0,
      queue_length: subscription.options.queueLength ?? 1,
    });
  }

  private sendAdvertise(advertisement: Advertisement): void {
    this.send({
      op: 'advertise',
      id: advertisement.id,
      topic: advertisement.topic,
      type: advertisement.type,
    });
  }

  private sendUnadvertise(advertisement: Advertisement): void {
    this.send({ op: 'unadvertise', id: advertisement.id, topic: advertisement.topic });
  }

  private validateTopicAndType(topic: string, type: string): void {
    if (!topic.startsWith('/') || !type.trim()) {
      throw new Error('Topic 名必须以 / 开头，且消息类型不能为空');
    }
  }

  private send(message: Record<string, unknown>): void {
    if (!this.isSocketOpen()) return;
    this.socket!.send(JSON.stringify(message));
  }

  private isSocketOpen(): boolean {
    return this.socket?.readyState === SOCKET_OPEN;
  }

  private closeCurrentSocket(): void {
    this.clearConnectionTimer();
    const socket = this.socket;
    this.socket = null;
    const rejectPending = this.pendingReject;
    this.pendingReject = null;
    rejectPending?.(new Error('rosbridge 连接已取消'));
    this.rejectPendingServices(new Error('rosbridge 连接已关闭'));
    if (!socket) return;
    socket.onopen = null;
    socket.onmessage = null;
    socket.onerror = null;
    socket.onclose = null;
    try {
      socket.close();
    } catch {
      // 已经关闭的原生 WebSocket 无需再次处理。
    }
  }

  private rejectPendingServices(error: Error): void {
    this.pendingServices.forEach((pending) => {
      clearTimeout(pending.timer);
      pending.reject(error);
    });
    this.pendingServices.clear();
  }

  private clearReconnectTimer(): void {
    if (!this.reconnectTimer) return;
    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
  }

  private clearConnectionTimer(): void {
    if (!this.connectionTimer) return;
    clearTimeout(this.connectionTimer);
    this.connectionTimer = null;
  }

  private transition(state: RosbridgeConnectionState): void {
    if (this.connectionState === state) return;
    this.connectionState = state;
    this.onStateChange?.(state);
  }

  private reportError(message: string): void {
    this.transition('error');
    this.onError?.(message);
  }
}
