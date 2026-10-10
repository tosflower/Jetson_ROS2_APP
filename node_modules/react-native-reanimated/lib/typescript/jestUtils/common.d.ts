import type { WorkletFunction } from 'react-native-worklets';
/**
 * Converts any callback function to a mock worklet function for testing
 * purposes. This function simulates a worklet by adding the required internal
 * properties.
 *
 * @param callback - Optional callback function to wrap as a worklet. If not
 *   provided, returns an empty worklet.
 * @returns A mock worklet function with the required worklet properties.
 */
export declare const worklet: <Args extends unknown[] = [], ReturnValue = void>(callback?: (...args: Args) => ReturnValue) => WorkletFunction<Args, ReturnValue>;
/** Creates a new worklet with the same hash and closure as the original. */
export declare const cloneWorklet: <Args extends unknown[] = [], ReturnValue = void>(original: WorkletFunction<Args, ReturnValue>) => WorkletFunction<Args, ReturnValue>;
//# sourceMappingURL=common.d.ts.map