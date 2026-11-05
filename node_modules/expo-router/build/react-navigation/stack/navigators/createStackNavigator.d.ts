import * as React from 'react';
import { type Route } from '../../native';
import type { StackNavigationEventMap, StackNavigationOptions } from '../types';
export interface StackNavigatorCreateProps {
    isPreloaded: (key: string) => boolean;
    isRemovalPrevented: (key: string) => boolean;
    pop: (count: number, sourceRouteKey: string) => void;
    removeRoutes: (routeNames: string[]) => void;
    restoreRoute: (route: Route<string>) => boolean;
    subscribePopToTopOnParentTabPress: () => (() => void) | undefined;
}
export type StandardStackNavigationEventMap = {
    [Event in keyof StackNavigationEventMap]: StackNavigationEventMap[Event] & {
        canPreventDefault: false;
    };
};
/**
 * Creates a JavaScript stack navigator compatible with `standard-navigation`.
 */
export declare const unstable_createStandardStackNavigator: {
    readonly type: "standard";
    readonly version: 1;
    readonly NavigatorContent: React.ComponentType<import("standard-navigation").NavigatorArgs<StackNavigationOptions, StandardStackNavigationEventMap> & Omit<StackNavigatorCreateProps, keyof import("standard-navigation").NavigatorArgs<NavigatorOptions, NavigatorEventMap>>>;
};
