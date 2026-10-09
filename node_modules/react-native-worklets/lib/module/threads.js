'use strict';

import { IS_JEST } from './platformChecker';
import { mockedRequestAnimationFrame } from "./runLoop/uiRuntime/mockedRequestAnimationFrame.js";
export function scheduleOnUI(worklet, ...args) {
  enqueueUI(worklet, args);
}
export function runOnUI(worklet) {
  return (...args) => {
    scheduleOnUI(worklet, ...args);
  };
}
export function runOnUISync() {
  throw new Error('[Worklets] `runOnUISync` is not supported on web.');
}
export function executeOnUIRuntimeSync() {
  throw new Error('[Worklets] `executeOnUIRuntimeSync` is not supported on web.');
}
export function runOnJS(fun) {
  return (...args) => scheduleOnRN(fun, ...args);
}
export function scheduleOnRN(fun, ...args) {
  queueMicrotask(args.length ? () => fun(...args) : fun);
}
export function runOnUIAsync(worklet, ...args) {
  return new Promise(resolve => {
    enqueueUI(worklet, args, resolve);
  });
}
let runOnUIQueue = [];
function enqueueUI(worklet, args, resolve) {
  if (IS_JEST) {
    mockedRequestAnimationFrame(() => {
      const result = worklet(...args);
      resolve?.(result);
    });
  } else {
    const job = [worklet, args, resolve];
    runOnUIQueue.push(job);
    if (runOnUIQueue.length === 1) {
      flushUIQueue();
    }
  }
}
function flushUIQueue() {
  queueMicrotask(() => {
    const queue = runOnUIQueue;
    runOnUIQueue = [];
    requestAnimationFrameImpl(() => {
      queue.forEach(([workletFunction, workletArgs, jobResolve]) => {
        const result = workletFunction(...workletArgs);
        if (jobResolve) {
          jobResolve(result);
        }
      });
    });
  });
}
const requestAnimationFrameImpl = !globalThis.requestAnimationFrame ? mockedRequestAnimationFrame : globalThis.requestAnimationFrame;
//# sourceMappingURL=threads.js.map