'use strict';

import { RuntimeKind } from 'react-native-worklets';
import { decorateAnimation, IN_STYLE_UPDATER } from "./utilCommon.js";
export { getReduceMotionForAnimation, getReduceMotionFromConfig, initialUpdaterRun, isValidLayoutAnimationProp, recognizePrefixSuffix } from "./utilCommon.js";
export function assertEasingIsWorklet(_easing) {
  'worklet';

  return;
}
export function defineAnimation(starting, factory) {
  'worklet';

  if (globalThis.__RUNTIME_KIND === RuntimeKind.ReactNative && IN_STYLE_UPDATER.current) {
    return starting;
  }
  const create = () => {
    'worklet';

    const animation = factory();
    decorateAnimation(animation);
    return animation;
  };
  return create();
}

/**
 * Lets you cancel a running animation paired to a shared value. The
 * cancellation is asynchronous.
 *
 * @param sharedValue - The shared value of a running animation that you want to
 *   cancel.
 * @see https://docs.swmansion.com/react-native-reanimated/docs/core/cancelAnimation
 */
export function cancelAnimation(sharedValue) {
  // setting the current value cancels the animation if one is currently running
  sharedValue.value = sharedValue.value; // eslint-disable-line no-self-assign
}
//# sourceMappingURL=util.js.map