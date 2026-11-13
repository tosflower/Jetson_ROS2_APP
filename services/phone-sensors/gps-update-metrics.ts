/** 采样和回调接收均来自 Android elapsedRealtime，同一时基不受系统校时影响。 */
export type NativeLocationTiming = { sampleMonotonicMs: number; receivedMonotonicMs: number };

export type GpsUpdateTiming = {
  sampleIntervalMs: number | null;
  timeBasis: 'native' | 'js';
  callbackIntervalMs: number | null;
  arrivalAgeMs: number | null;
  previousArrivalAgeMs: number | null;
  updateCycleMs: number | null;
  meanUpdateCycleMs: number | null;
  completedCycles: number;
};

/** 只统计已完成的更新周期：上一条采样生成，到下一条新定位被 App 收到。 */
export class GpsUpdateMetrics {
  private previous: { timestamp: number; receivedMonotonicMs: number; arrivalAgeMs: number; timeBasis: 'native' | 'js' } | null = null;
  private cycleSumMs = 0;
  private latest: GpsUpdateTiming = {
    callbackIntervalMs: null, arrivalAgeMs: null, previousArrivalAgeMs: null, updateCycleMs: null,
    meanUpdateCycleMs: null, completedCycles: 0,
    sampleIntervalMs: null, timeBasis: 'js',
  };

  record(timestamp: number, receivedUnixMs: number, receivedMonotonicMs: number, nativeTiming?: NativeLocationTiming): GpsUpdateTiming {
    const timeBasis = nativeTiming ? 'native' : 'js';
    const sampleTime = nativeTiming?.sampleMonotonicMs ?? timestamp;
    const receivedTime = nativeTiming?.receivedMonotonicMs ?? receivedMonotonicMs;
    const invalidNativeTime = nativeTiming && (!Number.isFinite(sampleTime) || sampleTime <= 0
      || !Number.isFinite(receivedTime) || receivedTime < sampleTime);
    if (!Number.isFinite(timestamp) || timestamp <= 0 || !Number.isFinite(receivedUnixMs)
      || !Number.isFinite(receivedMonotonicMs) || invalidNativeTime
      || (!nativeTiming && timestamp > receivedUnixMs + 2000)) {
      this.previous = null;
      this.latest = { ...this.latest, timeBasis, sampleIntervalMs: null, callbackIntervalMs: null,
        arrivalAgeMs: null, previousArrivalAgeMs: null, updateCycleMs: null };
      return this.latest;
    }
    // 兼容旧安装包与默认 Expo 链路，但不能把不同计时基准拼成一个周期。
    if (this.previous && this.previous.timeBasis !== timeBasis) this.previous = null;
    // 重复和倒序位置不是下一条新定位，不能用它们刷新周期基线。
    if (this.previous && sampleTime <= this.previous.timestamp) return this.latest;
    const arrivalAgeMs = nativeTiming ? receivedTime - sampleTime : Math.max(0, receivedUnixMs - timestamp);
    const sampleIntervalMs = this.previous ? sampleTime - this.previous.timestamp : null;
    const interval = this.previous ? receivedTime - this.previous.receivedMonotonicMs : null;
    const callbackIntervalMs = interval !== null && interval >= 0 ? interval : null;
    // 必须与上一条的到达包龄配对；当前新位置的包龄属于下一个周期。
    const updateCycleMs = this.previous && callbackIntervalMs !== null
      ? this.previous.arrivalAgeMs + callbackIntervalMs : null;
    const completedCycles = this.latest.completedCycles + (updateCycleMs === null ? 0 : 1);
    if (updateCycleMs !== null) this.cycleSumMs += updateCycleMs;
    this.latest = {
      callbackIntervalMs, arrivalAgeMs, updateCycleMs, completedCycles, sampleIntervalMs, timeBasis,
      previousArrivalAgeMs: callbackIntervalMs !== null ? this.previous?.arrivalAgeMs ?? null : null,
      meanUpdateCycleMs: completedCycles ? this.cycleSumMs / completedCycles : null,
    };
    this.previous = { timestamp: sampleTime, receivedMonotonicMs: receivedTime, arrivalAgeMs, timeBasis };
    return this.latest;
  }
}
