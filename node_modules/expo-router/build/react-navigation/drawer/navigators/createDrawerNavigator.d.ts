import type { DrawerNavigationState, ParamListBase } from '../../native';
import type { DrawerNavigationConfig, DrawerNavigationEventMap, DrawerNavigationHelpers, DrawerNavigationOptions } from '../types';
export interface DrawerNavigatorCreateProps {
    isPreloaded: (key: string) => boolean;
    isRemovalPrevented: (key: string) => boolean;
    drawerState: DrawerNavigationState<ParamListBase>;
    navigation: DrawerNavigationHelpers;
    preload: (name: string) => void;
}
export interface DrawerNavigatorConfig extends DrawerNavigationConfig {
    defaultStatus?: 'open' | 'closed';
}
export type DrawerNavigatorContentProps = DrawerNavigatorConfig & DrawerNavigatorCreateProps;
export type StandardDrawerNavigationEventMap = {
    [Event in keyof DrawerNavigationEventMap]: DrawerNavigationEventMap[Event] & {
        canPreventDefault: Event extends 'drawerItemPress' ? true : false;
    };
};
export declare const createStandardDrawerNavigator: {
    readonly type: "standard";
    readonly version: 1;
    readonly NavigatorContent: import("react").ComponentType<import("standard-navigation").NavigatorArgs<DrawerNavigationOptions, StandardDrawerNavigationEventMap> & Omit<DrawerNavigatorContentProps, keyof import("standard-navigation").NavigatorArgs<NavigatorOptions, NavigatorEventMap>>>;
};
