export declare function scheduleOnUI<Args extends unknown[], ReturnValue>(worklet: (...args: Args) => ReturnValue, ...args: Args): void;
export declare function runOnUI<Args extends unknown[], ReturnValue>(worklet: (...args: Args) => ReturnValue): (...args: Args) => void;
export declare function runOnUISync<Args extends unknown[], ReturnValue>(worklet: (...args: Args) => ReturnValue, ...args: Args): ReturnValue;
export declare function executeOnUIRuntimeSync<Args extends unknown[], ReturnValue>(worklet: (...args: Args) => ReturnValue): (...args: Args) => ReturnValue;
export declare function runOnJS<Args extends unknown[], ReturnValue>(fun: (...args: Args) => ReturnValue): (...args: Args) => void;
export declare function scheduleOnRN<Args extends unknown[], ReturnValue>(fun: (...args: Args) => ReturnValue, ...args: Args): void;
export declare function runOnUIAsync<Args extends unknown[], ReturnValue>(worklet: (...args: Args) => ReturnValue, ...args: Args): Promise<ReturnValue>;
/**
 * Returns the id of the thread which currently executes JavaScript on the
 * calling Runtime.
 *
 * @returns The id of the current thread.
 * @see https://docs.swmansion.com/react-native-worklets/docs/utility/getCurrentThreadId
 */
export declare function getCurrentThreadId(): string;
//# sourceMappingURL=threads.d.ts.map