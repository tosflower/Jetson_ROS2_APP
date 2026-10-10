'use strict';

import { useEffect } from 'react';
import { useFrameCallback } from "./useFrameCallback.js";
import { useSharedValue } from "./useSharedValue.js";

/**
 * Lets you access the current frame timestamp as a [Shared
 * Value](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#shared-value).
 *
 * For best performance, prefer to re-use a single `useTimestamp` timer instead
 * of creating multiple ones.
 *
 * @param isActive - Whether the timestamp should update. Defaults to `true`.
 * @returns A shared value that updates every frame with the time elapsed since
 *   the first frame.
 * @see https://docs.swmansion.com/react-native-reanimated/docs/advanced/useTimestamp
 */
export function useTimestamp(isActive = true) {
  const timestamp = useSharedValue(0);
  const frameCallback = useFrameCallback(({
    timeSinceFirstFrame
  }) => {
    'worklet';

    timestamp.value = timeSinceFirstFrame;
  }, isActive);
  useEffect(() => {
    frameCallback.setActive(isActive);
  }, [isActive, frameCallback]);
  return timestamp;
}
//# sourceMappingURL=useTimestamp.js.map