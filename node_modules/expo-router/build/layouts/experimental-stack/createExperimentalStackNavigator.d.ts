import * as React from 'react';
import type { ExperimentalStackNavigationEventMap, ExperimentalStackNavigationOptions } from './types';
export interface ExperimentalStackNavigatorCreateProps {
    isPreloaded: (key: string) => boolean;
    isRemovalPrevented: (key: string) => boolean;
    pop: (count: number, sourceRouteKey: string) => void;
    removeRoutes: (routeNames: string[]) => void;
    subscribePopToTopOnParentTabPress: () => (() => void) | undefined;
}
export type StandardExperimentalStackNavigationEventMap = {
    [Event in keyof ExperimentalStackNavigationEventMap]: ExperimentalStackNavigationEventMap[Event] & {
        canPreventDefault: false;
    };
};
export declare const createStandardExperimentalStackNavigator: {
    readonly type: "standard";
    readonly version: 1;
    readonly NavigatorContent: React.ComponentType<import("standard-navigation").NavigatorArgs<ExperimentalStackNavigationOptions, StandardExperimentalStackNavigationEventMap> & Omit<ExperimentalStackNavigatorCreateProps, keyof import("standard-navigation").NavigatorArgs<NavigatorOptions, NavigatorEventMap>>>;
};
