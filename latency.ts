/** 延迟全部为 ms；两端使用各自单调时钟，通过最低 RTT 样本估计偏移。 */
export type LatencyValues = Record<string, number>;
export type FrameMetadata = {
  frame_id?: number;
  send_mono_ms?: number;
  latency_ms?: LatencyValues;
};
export type LatencySummary = { latest: number; mean: number; p95: number; max: number; count: number };
export const latencyLabels: Record<string, string> = {
  grab_ms: '取帧 / 里程计（含等待）',
  preprocess_ms: '预处理 / 内存拷贝',
  inference_ms: '模型推理',
  fusion_ms: '分割后处理 / 融合',
  cloud_publish_ms: '点云整理 / 发布',
  logic_ms: '感知逻辑 / 结果发布',
  visualization_ms: '可视化绘制',
  perception_total_ms: '感知合计',
  ros_delivery_ms: 'ROS2 发布 → 网关回调',
  image_convert_ms: '网关图像转换',
  resize_ms: '网关缩放',
  jpeg_encode_ms: 'JPEG 编码',
  broadcast_wait_ms: '网关等待发送',
  socket_write_ms: '网关 Socket 写入',
  clock_rtt_ms: '时钟探测 RTT',
  network_estimate_ms: '发送 → 手机接收（估算）',
  blob_wait_ms: '手机 Blob 排队',
  blob_convert_ms: '手机 Blob → Data URI',
  image_load_ms: '图片缓冲 / 原生加载',
  receive_to_load_ms: '手机接收 → onLoad',
  pipeline_to_load_estimate_ms: '感知开始 → onLoad（估算）',
  frame_received_ack_ms: '发图 → 接收回执往返',
  frame_loaded_ack_ms: '发图 → 加载回执往返',
};

export class LatencyTracker {
  private samples = new Map<string, number[]>();
  private probes = new Set<number>();
  private clocks: { offset: number; rtt: number; at: number }[] = [];

  probe(now: number): void {
    this.probes.add(now);
    if (this.probes.size > 8) this.probes.delete(this.probes.values().next().value!);
  }

  pong(client: number, receive: number, send: number, now: number): void {
    if (![client, receive, send, now].every(Number.isFinite) || !this.probes.delete(client)) return;
    const rtt = now - client - (send - receive);
    if (send < receive || rtt < 0 || rtt > 10000) return;
    this.clocks = this.clocks.filter((sample) => now - sample.at < 15000);
    this.clocks.push({ offset: ((receive - client) + (send - now)) / 2, rtt, at: now });
    this.add({ clock_rtt_ms: rtt });
  }

  network(send: number | undefined, now: number): number | undefined {
    this.clocks = this.clocks.filter((sample) => now - sample.at < 15000);
    if (!Number.isFinite(send) || !this.clocks.length) return undefined;
    const best = this.clocks.reduce((a, b) => a.rtt < b.rtt ? a : b);
    const value = now + best.offset - send!;
    // 不把负估计值钳制成 0；显示缺测以暴露时钟/链路不对称的不确定性。
    return Number.isFinite(value) && value >= 0 ? value : undefined;
  }

  add(values: LatencyValues): void {
    for (const [key, value] of Object.entries(values)) {
      if (!(key in latencyLabels) || !Number.isFinite(value) || value < 0) continue;
      const samples = this.samples.get(key) ?? [];
      samples.push(value);
      if (samples.length > 300) samples.shift();
      this.samples.set(key, samples);
    }
  }

  snapshot(): Record<string, LatencySummary> {
    return Object.fromEntries([...this.samples].map(([key, samples]) => {
      const sorted = [...samples].sort((a, b) => a - b);
      return [key, {
        latest: samples[samples.length - 1], mean: samples.reduce((a, b) => a + b, 0) / samples.length,
        p95: sorted[Math.ceil(samples.length * .95) - 1], max: sorted[sorted.length - 1], count: samples.length,
      }];
    }));
  }
}
