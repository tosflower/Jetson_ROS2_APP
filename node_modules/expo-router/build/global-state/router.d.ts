import type { Href, RoutePath, RouteInputParams } from '../types';
import type { RoutingIntent } from './routingQueue';
import type { LinkToOptions, NavigationOptions, NavigationTransitionMode, TransitionOptions } from './types';
export declare function reload(): void;
export declare function canGoBack(): boolean;
export declare function canDismiss(): boolean;
export declare function setParams(params?: Record<string, undefined | string | number | (string | number)[]>): any;
/**
 * Returns `router` object for imperative navigation API.
 *
 * @example
 *```tsx
 * import { router } from 'expo-router';
 * import { Text } from 'react-native';
 *
 * export default function Route() {
 *
 *  return (
 *   <Text onPress={() => router.push('/home')}>Go Home</Text>
 *  );
 *}
 * ```
 */
export type ImperativeRouter = {
    /**
     * Goes back in the navigation history.
     */
    back: (options?: TransitionOptions) => void;
    /**
     * Navigates to a route in the navigator's history if it supports invoking the `back` function.
     */
    canGoBack: () => boolean;
    /**
     * Navigates to the provided [`href`](#hreft) using a push operation if possible.
     */
    push: (href: Href, options?: NavigationOptions) => void;
    /**
     * Navigates to the provided [`href`](#hreft).
     */
    navigate: (href: Href, options?: NavigationOptions) => void;
    /**
     * Navigates to route without appending to the history. Can be used with
     * [`useFocusEffect`](#usefocuseffecteffect-do_not_pass_a_second_prop)
     * to redirect imperatively to a new screen.
     *
     * @see [Using `useRouter()` hook](/router/reference/redirects/) to redirect.
     * */
    replace: (href: Href, options?: NavigationOptions) => void;
    /**
     * Navigates to a stack lower than the current screen using the provided count if possible, otherwise 1.
     *
     * If the current screen is the only route, it will dismiss the entire stack.
     */
    dismiss: (count?: number, options?: TransitionOptions) => void;
    /**
     * Dismisses screens until the provided href is reached. If the href is not found, it will instead replace the current screen with the provided `href`.
     */
    dismissTo: (href: Href, options?: NavigationOptions) => void;
    /**
     * Returns to the first screen of the closest stack, dismissing all screens
     * above it.
     */
    dismissAll: (options?: TransitionOptions) => void;
    /**
     * Checks if it is possible to dismiss the current screen. Returns `true` if the
     * router is within the stack with more than one screen in stack's history.
     *
     */
    canDismiss: () => boolean;
    /**
     * Updates the current route's query params.
     */
    setParams: <T extends RoutePath>(params: Partial<RouteInputParams<T>>) => void;
    /**
     * Reloads the currently mounted route in experimental server mode. This can be used to re-fetch data.
     * @hidden
     */
    reload: () => void;
    /**
     * Prefetches a route in the background before navigating to it.
     */
    prefetch: (href: Href, options?: NavigationOptions) => void;
    /**
     * Configures which queued navigation operations use React transitions. The default is
     * `preload-only`; `never` cannot be overridden by individual operations.
     *
     * @experimental
     */
    setTransitionMode: (mode: NavigationTransitionMode) => void;
};
/**
 * @hidden
 */
type InternalRouter = ImperativeRouter & {
    goBack: (options?: TransitionOptions) => void;
    linkTo: (href: Href | string, options?: LinkToOptions) => void;
};
export declare function createImperativeRouter(enqueue: (intent: RoutingIntent) => void, setTransitionMode: (mode: NavigationTransitionMode) => void): InternalRouter;
export declare function getDefaultTransitionMode(): NavigationTransitionMode;
export declare const unboundRouter: InternalRouter;
export declare const router: InternalRouter;
export declare const navigate: (...args: Parameters<InternalRouter["navigate"]>) => void;
export declare const push: (...args: Parameters<InternalRouter["push"]>) => void;
export declare const dismiss: (...args: Parameters<InternalRouter["dismiss"]>) => void;
export declare const dismissAll: (...args: Parameters<InternalRouter["dismissAll"]>) => void;
export declare const dismissTo: (...args: Parameters<InternalRouter["dismissTo"]>) => void;
export declare const replace: (...args: Parameters<InternalRouter["replace"]>) => void;
export declare const goBack: (...args: Parameters<InternalRouter["goBack"]>) => void;
export declare const prefetch: (...args: Parameters<InternalRouter["prefetch"]>) => void;
export declare const linkTo: (...args: Parameters<InternalRouter["linkTo"]>) => void;
export {};
