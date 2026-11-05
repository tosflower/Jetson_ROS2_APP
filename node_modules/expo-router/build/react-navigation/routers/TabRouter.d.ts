import { type RouteState } from './attachRouteState';
import { type CommonNavigationAction, type DefaultRouterOptions, type NavigationState, type ParamListBase } from './types';
export type TabActionType = {
    type: 'JUMP_TO';
    payload: {
        name: string;
        params?: object;
        state?: RouteState;
    };
    source?: string;
    target?: string;
} | {
    type: 'REPLACE';
    payload: {
        name: string;
        params?: object;
        state?: RouteState;
    };
    source?: string;
    target?: string;
} | {
    type: 'PUSH';
    payload: {
        name: string;
        params?: object;
        state?: RouteState;
    };
    source?: string;
    target?: string;
};
export type BackBehavior = 'firstRoute' | 'initialRoute' | 'order' | 'history' | 'fullHistory' | 'none';
export type TabRouterOptions = DefaultRouterOptions & {
    /**
     * Control how going back should behave
     * - `firstRoute` - return to the first defined route
     * - `initialRoute` - return to the route from `initialRouteName`
     * - `order` - return to the route defined before the focused route
     * - `history` - return to last visited route; if the same route is visited multiple times, the older entries are dropped from the history
     * - `fullHistory` - return to last visited route; doesn't drop duplicate entries unlike `history` - matches behavior of web pages
     * - `none` - do not handle going back
     */
    backBehavior?: BackBehavior;
};
export type TabNavigationState<ParamList extends ParamListBase> = Omit<NavigationState<ParamList>, 'history'> & {
    /**
     * Type of the router, in this case, it's tab.
     */
    type?: 'tab';
    /**
     * List of previously visited route keys.
     */
    history?: {
        type: 'route';
        key: string;
        params?: object | undefined;
    }[];
};
export type TabActionHelpers<ParamList extends ParamListBase> = {
    /**
     * Replaces the current tab with another tab.
     *
     * @param screen Name of the tab that will replace the current one.
     * @param [params] Params object for the new tab.
     */
    replace<RouteName extends keyof ParamList>(...args: RouteName extends unknown ? undefined extends ParamList[RouteName] ? [screen: RouteName, params?: ParamList[RouteName]] : [screen: RouteName, params: ParamList[RouteName]] : never): void;
    /**
     * Jump to an existing tab.
     *
     * @param screen Name of the route to jump to.
     * @param [params] Params object for the route.
     */
    jumpTo<RouteName extends keyof ParamList>(...args: RouteName extends unknown ? undefined extends ParamList[RouteName] ? [screen: RouteName, params?: ParamList[RouteName]] : [screen: RouteName, params: ParamList[RouteName]] : never): void;
};
type TabNavigationStateWithHistory = TabNavigationState<ParamListBase> & Required<Pick<TabNavigationState<ParamListBase>, 'history'>>;
export declare const TabActions: {
    jumpTo(name: string, params?: object): {
        readonly type: "JUMP_TO";
        readonly payload: {
            readonly name: string;
            readonly params: object | undefined;
        };
    };
    replace(name: string, params?: object): {
        readonly type: "REPLACE";
        readonly payload: {
            readonly name: string;
            readonly params: object | undefined;
        };
    };
};
export declare const ensureStateHistory: (state: TabNavigationState<ParamListBase>, backBehavior: BackBehavior, initialRouteName: string | undefined) => TabNavigationStateWithHistory;
/**
 * TabRouter is considered an internal implementation and its behavior may change without a notice between expo-router's version
 */
export declare const TabRouter: (options: TabRouterOptions) => import("./extendRouter").ExtendedRouter<TabNavigationState<ParamListBase>, CommonNavigationAction | TabActionType>;
export {};
