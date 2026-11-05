import type { HostInstance } from 'react-native';
import type { InstanceOrElement } from '../commonTypes';
import type { AnimatedRef } from './commonTypes';
/**
 * Lets you get a reference of a view that you can use inside a worklet.
 *
 * @returns An object with a `.current` property which contains an instance of
 *   the reference object.
 * @see https://docs.swmansion.com/react-native-reanimated/docs/core/useAnimatedRef
 */
export declare function useAnimatedRef<TRef extends InstanceOrElement = HostInstance>(): AnimatedRef<TRef>;
//# sourceMappingURL=useAnimatedRef.d.ts.map