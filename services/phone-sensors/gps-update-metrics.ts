export type GpsUpdateTiming = {
  callbackIntervalMs: number | null;
  arrivalAgeMs: number | null;
  previousArrivalAgeMs: number | null;
  updateCycleMs: number | null;
  meanUpdateCycleMs: number | null;
  completedCycles: number;
};

/** 只统计已完成的更新周期：上一条采样生成，到下一条新定位被 App 收到。 */
export class GpsUpdateMetrics {
  private previous: { timestamp: number; receivedMonotonicMs: number; arrivalAgeMs: number } | null = null;
  private cycleSumMs = 0;
  private latest: GpsUpdateTiming = {
    callbackIntervalMs: null, arrivalAgeMs: null, previousArrivalAgeMs: null, updateCycleMs: null,
    meanUpdateCycleMs: null, completedCycles: 0,
  };

  record(timestamp: number, receivedUnixMs: number, receivedMonotonicMs: number): GpsUpdateTiming {
    if (!Number.isFinite(timestamp) || timestamp <= 0 || !Number.isFinite(receivedUnixMs)
      || !Number.isFinite(receivedMonotonicMs) || timestamp > receivedUnixMs + 2000) {
      this.previous = null;
      this.latest = { ...this.latest, callbackIntervalMs: null, arrivalAgeMs: null, previousArrivalAgeMs: null, updateCycleMs: null };
      return this.latest;
    }
    // 重复和倒序位置不是下一条新定位，不能用它们刷新周期基线。
    if (this.previous && timestamp <= this.previous.timestamp) return this.latest;
    const arrivalAgeMs = Math.max(0, receivedUnixMs - timestamp);
    const interval = this.previous ? receivedMonotonicMs - this.previous.receivedMonotonicMs : null;
    const callbackIntervalMs = interval !== null && interval >= 0 ? interval : null;
    // 必须与上一条的到达包龄配对；当前新位置的包龄属于下一个周期。
    const updateCycleMs = this.previous && callbackIntervalMs !== null
      ? this.previous.arrivalAgeMs + callbackIntervalMs : null;
    const completedCycles = this.latest.completedCycles + (updateCycleMs === null ? 0 : 1);
    if (updateCycleMs !== null) this.cycleSumMs += updateCycleMs;
    this.latest = {
      callbackIntervalMs, arrivalAgeMs, updateCycleMs, completedCycles,
      previousArrivalAgeMs: callbackIntervalMs !== null ? this.previous?.arrivalAgeMs ?? null : null,
      meanUpdateCycleMs: completedCycles ? this.cycleSumMs / completedCycles : null,
    };
    this.previous = { timestamp, receivedMonotonicMs, arrivalAgeMs };
    return this.latest;
  }
}
