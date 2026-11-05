import React from 'react';
import type { NavigationState, ParamListBase } from '../routers';
type Selector<ParamList extends ParamListBase, T> = (state: NavigationState<ParamList>) => T;
/**
 * Hook to get a value from the current navigation state using a selector.
 *
 * @param selector Selector function to get a value from the state.
 */
export declare function useNavigationState<ParamList extends ParamListBase, T>(selector: Selector<ParamList, T>): T;
export declare const NavigatorStateContext: React.Context<Readonly<{
    key: string;
    routeKeySeq: number;
    index: number;
    routeNames: string[];
    history?: unknown[];
    routes: import("..").NavigationRoute<ParamListBase, string>[];
    type?: string;
    stale: false;
}> | undefined>;
export {};
