'use strict';

import AnimatedComponentImpl from './AnimatedComponent';

// eslint-disable-next-line @typescript-eslint/no-explicit-any

/**
 * Lets you create an Animated version of any React Native component.
 *
 * @param Component - The component you want to make animatable.
 * @param options - Optional configuration object containing:
 *
 *   - `setNativeProps`: Function to set native props
 *   - `jsProps`: String array to select which props should be animated on JS
 *
 * @returns A component that Reanimated is capable of animating.
 * @see https://docs.swmansion.com/react-native-reanimated/docs/core/createAnimatedComponent
 */

/**
 * `text` is the native prop backing `TextInput`'s value. It's not part of
 * `TextInputProps`, but Reanimated can update it directly, so the animated
 * `TextInput` accepts it as a shared value. Static strings are still disallowed
 * - use `value` or `defaultValue` for those. It's added only to the inline
 * props (not to the base component props) so that `useAnimatedProps`, which
 * supplies raw values, keeps accepting `{ text: string }`.
 */

/**
 * @deprecated Please use `Animated.FlatList` component instead of calling
 *   `Animated.createAnimatedComponent(FlatList)` manually.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { jsx as _jsx } from "react/jsx-runtime";
export function createAnimatedComponent(Component, options) {
  class AnimatedComponent extends AnimatedComponentImpl {
    static displayName = `AnimatedComponent(${Component.displayName || Component.name || 'Component'})`;
    constructor(props) {
      // User can override component-defined jsProps via options
      const jsProps = options?.jsProps ?? Component.jsProps;
      const modifiedOptions = jsProps?.length ? {
        ...options,
        jsProps
      } : options;
      super(Component, props, AnimatedComponent.displayName, modifiedOptions);
    }
  }
  const animatedComponent = props => /*#__PURE__*/_jsx(AnimatedComponent
  // TODO - fix broken reanimated types and remove type duplicates
  , {
    ...props,
    // Needed to prevent react from signing AnimatedComponent to the ref
    // (we want to handle the ref assignment in the AnimatedComponent)
    ref: null,
    ...(props.ref === null ? null : {
      forwardedRef: props.ref
    })
  });
  animatedComponent.displayName = Component.displayName || Component.name || 'Component';
  return animatedComponent;
}
//# sourceMappingURL=createAnimatedComponent.js.map