import type { BottomTabNavigationConfig, BottomTabNavigationEventMap, BottomTabNavigationOptions } from '../types';
export interface BottomTabNavigatorCreateProps {
    isPreloaded: (key: string) => boolean;
    isRemovalPrevented: (key: string) => boolean;
    routeNames: string[];
    popNestedStackToTop: (routeKey: string) => void;
    preload: (name: string) => void;
}
export type BottomTabNavigatorContentProps = BottomTabNavigationConfig & BottomTabNavigatorCreateProps;
export declare const createStandardBottomTabNavigator: {
    readonly type: "standard";
    readonly version: 1;
    readonly NavigatorContent: import("react").ComponentType<import("standard-navigation").NavigatorArgs<BottomTabNavigationOptions, BottomTabNavigationEventMap> & Omit<BottomTabNavigatorContentProps, keyof import("standard-navigation").NavigatorArgs<NavigatorOptions, NavigatorEventMap>>>;
};
