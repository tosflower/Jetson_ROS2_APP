import { type NavigationAction, type NavigationState, type ParamListBase, type Router } from '../routers';
import type { NavigationHelpers, NavigationProp } from './types';
import type { NavigationEventEmitter } from './useEventEmitter';
type Options<State extends NavigationState, ScreenOptions extends object, EventMap extends Record<string, any>> = {
    routes: State['routes'];
    routeNames: State['routeNames'];
    navigation: NavigationHelpers<ParamListBase> & Partial<NavigationProp<ParamListBase, string, any, any, any>>;
    setOptions: (cb: (options: Record<string, ScreenOptions>) => Record<string, ScreenOptions>) => void;
    router: Router<State, NavigationAction>;
    emitter: NavigationEventEmitter<EventMap>;
};
type NavigationItem<State extends NavigationState, ScreenOptions extends object, EventMap extends Record<string, any>> = NavigationProp<ParamListBase, string, string | undefined, State, ScreenOptions, EventMap>;
/**
 * Hook to cache navigation objects for each screen in the navigator.
 * It's important to cache them to make sure navigation objects don't change between renders.
 * This lets us apply optimizations like `React.memo` to minimize re-rendering screens.
 * Exception: a route's navigation object changes identity once when the route is promoted from
 * preloaded to active.
 * TODO(@ubax): consider resolving `isPreloaded` at call time to keep one object per route.
 */
export declare function useNavigationCache<State extends NavigationState, ScreenOptions extends object, EventMap extends Record<string, any>, ActionHelpers extends Record<string, () => void>>({ routes, routeNames, navigation, setOptions, router, emitter, }: Options<State, ScreenOptions, EventMap>): (route: {
    key: string;
    name: string;
}, isPreloaded: boolean) => NavigationItem<State, ScreenOptions, EventMap>;
export {};
