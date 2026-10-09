import type { SharedValue } from '../commonTypes';
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
export declare function useTimestamp(isActive?: boolean): SharedValue<number>;
//# sourceMappingURL=useTimestamp.d.ts.map