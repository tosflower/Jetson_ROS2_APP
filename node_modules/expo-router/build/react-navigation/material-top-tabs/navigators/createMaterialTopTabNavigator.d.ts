import type { MaterialTopTabNavigationConfig, MaterialTopTabNavigationEventMap, MaterialTopTabNavigationOptions } from '../types';
export interface MaterialTopTabNavigatorCreateProps {
    isPreloaded: (key: string) => boolean;
    isRemovalPrevented: (key: string) => boolean;
    routeNames: string[];
    preload: (name: string) => void;
    navigateToTabSync: (name: string, params: object | undefined) => void;
}
export type MaterialTopTabNavigatorContentProps = MaterialTopTabNavigationConfig & MaterialTopTabNavigatorCreateProps;
export declare const createStandardMaterialTopTabNavigator: {
    readonly type: "standard";
    readonly version: 1;
    readonly NavigatorContent: import("react").ComponentType<import("standard-navigation").NavigatorArgs<MaterialTopTabNavigationOptions, MaterialTopTabNavigationEventMap> & Omit<MaterialTopTabNavigatorContentProps, keyof import("standard-navigation").NavigatorArgs<NavigatorOptions, NavigatorEventMap>>>;
};
