import type { NavigationAction } from '../routers';
export type PreventRemoveOptions = {
    /**
     * Whether removal prevention remains active while the screen is preloaded.
     * @default false
     */
    preventInPreloadedRoutes?: boolean;
};
/**
 * Prevents the screen from being removed while `preventRemove` is `true` and calls `callback`
 * with the blocked navigation action.
 *
 * To continue the blocked navigation action, set `preventRemove` to `false` and call the
 * callback's `repeat` function. To navigate somewhere else, set `preventRemove` to `false`, call
 * the returned `disablePrevention` function, and then navigate.
 *
 * On web, this hook also prevents the browser from unloading the page while `preventRemove` is
 * `true`.
 *
 * @example
 * ```tsx
 * const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);
 * usePreventRemove(hasUnsavedChanges, ({ repeat }) => {
 *   Alert.alert('Discard changes?', undefined, [
 *     { text: 'Cancel', style: 'cancel' },
 *     {
 *       text: 'Discard',
 *       style: 'destructive',
 *       onPress: () => {
 *         setHasUnsavedChanges(false);
 *         repeat();
 *       },
 *     },
 *   ]);
 * });
 * ```
 *
 * @param preventRemove Boolean indicating whether to prevent screen from being removed.
 * @param callback Optional function called when the screen was prevented from being removed.
 * @param options Options that configure removal prevention.
 */
export declare function usePreventRemove(preventRemove: boolean, callback?: (options: {
    data: {
        action: NavigationAction;
    };
    repeat: () => void;
}) => void, options?: PreventRemoveOptions): () => void;
