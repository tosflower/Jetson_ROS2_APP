'use strict';

export function setupTaskQueue() {
  'worklet';

  const queue = {
    timeoutCallbacks: new Map()
  };
  globalThis._taskQueue = queue;
  globalThis.__runTimeoutCallback = function (handlerId) {
    const task = queue.timeoutCallbacks.get(handlerId);
    task?.();
    queue.timeoutCallbacks.delete(handlerId);
  };
}
export function pushTask(callback, handlerId, delay) {
  'worklet';

  const queue = globalThis._taskQueue;
  queue.timeoutCallbacks.set(handlerId, callback);
  globalThis._scheduleTimeoutCallback(delay, handlerId);
}
//# sourceMappingURL=taskQueue.js.map