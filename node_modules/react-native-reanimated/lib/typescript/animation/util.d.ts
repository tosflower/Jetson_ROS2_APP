import type { AnimationObject, EasingFunction, SharedValue } from '../commonTypes';
import type { EasingFunctionFactory } from '../Easing';
import type { StyleLayoutAnimation } from './commonTypes';
import type { AnimationToDecoration } from './utilCommon';
export { getReduceMotionForAnimation, getReduceMotionFromConfig, initialUpdaterRun, isValidLayoutAnimationProp, recognizePrefixSuffix, } from './utilCommon';
export declare function assertEasingIsWorklet(_easing: EasingFunction | EasingFunctionFactory): void;
export declare function defineAnimation<T extends AnimationObject | StyleLayoutAnimation, // type that's supposed to be returned
U extends AnimationObject | StyleLayoutAnimation = T>(starting: AnimationToDecoration<T, U>, factory: () => T): T;
/**
 * Lets you cancel a running animation paired to a shared value. The
 * cancellation is asynchronous.
 *
 * @param sharedValue - The shared value of a running animation that you want to
 *   cancel.
 * @see https://docs.swmansion.com/react-native-reanimated/docs/core/cancelAnimation
 */
export declare function cancelAnimation<TValue>(sharedValue: SharedValue<TValue>): void;
//# sourceMappingURL=util.d.ts.map