'use strict';

import { IS_WINDOW_AVAILABLE } from "./common/index.js";
import { createReducedMotionManager } from "./ReducedMotionCommon.js";
export function isReducedMotionEnabledInSystem() {
  return IS_WINDOW_AVAILABLE ?
  // @ts-ignore Fallback if `window` is undefined.
  window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
}
export const ReducedMotionManager = createReducedMotionManager(isReducedMotionEnabledInSystem());
//# sourceMappingURL=ReducedMotion.js.map