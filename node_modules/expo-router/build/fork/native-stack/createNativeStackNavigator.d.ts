import * as React from 'react';
import { type NativeStackNavigationEventMap, type NativeStackNavigationOptions } from '../../react-navigation/native-stack';
export interface NativeStackNavigatorCreateProps {
    isPreloaded: (key: string) => boolean;
    isRemovalPrevented: (key: string) => boolean;
    pop: (count: number, sourceRouteKey: string) => void;
    removeRoutes: (routeNames: string[]) => void;
    /** Registers pop-to-top on parent tab press, or returns undefined without a tab parent. */
    subscribePopToTopOnParentTabPress: () => (() => void) | undefined;
}
export type StandardNativeStackEventMap = {
    [Event in keyof NativeStackNavigationEventMap]: NativeStackNavigationEventMap[Event] & {
        canPreventDefault: false;
    };
};
export declare const createStandardNativeStackNavigator: {
    readonly type: "standard";
    readonly version: 1;
    readonly NavigatorContent: React.ComponentType<import("standard-navigation").NavigatorArgs<NativeStackNavigationOptions, StandardNativeStackEventMap> & Omit<NativeStackNavigatorCreateProps, keyof import("standard-navigation").NavigatorArgs<NavigatorOptions, NavigatorEventMap>>>;
};
