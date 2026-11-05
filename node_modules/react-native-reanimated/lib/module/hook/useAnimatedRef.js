'use strict';

import { useAnimatedRefBase } from "./useAnimatedRefCommon.js";

/**
 * Lets you get a reference of a view that you can use inside a worklet.
 *
 * @returns An object with a `.current` property which contains an instance of
 *   the reference object.
 * @see https://docs.swmansion.com/react-native-reanimated/docs/core/useAnimatedRef
 */
export function useAnimatedRef() {
  return useAnimatedRefBase(ref => {
    if (ref.getScrollableNode) {
      return ref.getScrollableNode();
    }
    if (ref.getNativeScrollRef) {
      return ref.getNativeScrollRef();
    }
    return ref;
  });
}
//# sourceMappingURL=useAnimatedRef.js.map