import type { Coordinate, PositionSample } from './route-geometry';

type Convert = (position: Coordinate, done: (position: Coordinate | null) => void) => void;

/** 单个转换请求在途；GPS 继续更新时仅替换待处理样本，不取消正在转换的有效采样。 */
export class CoordinateConverter {
  private pending: PositionSample | null = null;
  private busy = false;
  private disposed = false;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private cached: { raw: Coordinate; converted: Coordinate } | null = null;

  constructor(
    private readonly convert: Convert,
    private readonly onSample: (sample: PositionSample) => void,
    private readonly onError: () => void,
    private readonly timeoutMs = 5000,
  ) {}

  submit(sample: PositionSample): void {
    if (this.disposed) return;
    this.pending = sample;
    this.drain();
  }

  dispose(): void {
    this.disposed = true;
    this.pending = null;
    if (this.timer) clearTimeout(this.timer);
  }

  private drain(): void {
    if (this.disposed || this.busy || !this.pending) return;
    const sample = this.pending;
    this.pending = null;
    const same = (a: Coordinate, b: Coordinate): boolean => a[0] === b[0] && a[1] === b[1];
    if (this.cached && same(this.cached.raw, sample.position)) {
      this.onSample({ ...sample, position: this.cached.converted });
      return;
    }
    this.busy = true;
    let settled = false;
    const finish = (position: Coordinate | null): void => {
      if (settled || this.disposed) return;
      settled = true;
      if (this.timer) clearTimeout(this.timer);
      this.timer = null;
      this.busy = false;
      if (position) {
        this.cached = { raw: sample.position, converted: position };
        // 位置未变时可使用同一转换结果，并携带最新 GPS 时间戳/速度/精度。
        const current = this.pending && same(this.pending.position, sample.position) ? this.pending : sample;
        if (current === this.pending) this.pending = null;
        this.onSample({ ...current, position });
      } else this.onError();
      this.drain();
    };
    this.timer = setTimeout(() => finish(null), this.timeoutMs);
    try { this.convert(sample.position, finish); } catch { finish(null); }
  }
}
