import type { BottomTabNavigationOptions } from '../react-navigation/bottom-tabs';
import type { DefaultNavigatorOptions, NavigationAction, NavigationProp, ParamListBase, TabActionHelpers, TabNavigationState, TabRouterOptions, useNavigationBuilder } from '../react-navigation/native';
import type { TriggerMap } from './common';
export type ExpoTabsProps = ExpoTabsNavigatorOptions;
export type ExpoTabsNavigatorScreenOptions = {
    detachInactiveScreens?: boolean;
    unmountOnBlur?: boolean;
    /**
     * @deprecated This option has no effect in Expo Router.
     */
    freezeOnBlur?: boolean;
    lazy?: boolean;
};
export type ExpoTabsNavigatorOptions = Omit<DefaultNavigatorOptions<ParamListBase, string | undefined, TabNavigationState<ParamListBase>, ExpoTabsScreenOptions, TabNavigationEventMap, ExpoTabsNavigationProp<ParamListBase>> & TabRouterOptions & ExpoTabsNavigatorScreenOptions, 'initialRouteName'>;
export type ExpoTabsNavigationProp<ParamList extends ParamListBase, RouteName extends keyof ParamList = keyof ParamList, NavigatorID extends string | undefined = undefined> = NavigationProp<ParamList, RouteName, NavigatorID, TabNavigationState<ParamListBase>, ExpoTabsScreenOptions, TabNavigationEventMap>;
export type ExpoTabsScreenOptions = Pick<BottomTabNavigationOptions, 'title' | 'lazy' | 'freezeOnBlur' | 'hidden'> & {
    params?: object;
    title: string;
    action: NavigationAction;
};
export type TabNavigationEventMap = {
    /**
     * Event which fires on tapping on the tab in the tab bar.
     */
    tabPress: {
        data: undefined;
        canPreventDefault: true;
    };
    /**
     * Event which fires on long press on the tab in the tab bar.
     */
    tabLongPress: {
        data: undefined;
    };
};
/**
 * The result of the tab navigation builder used by Expo Router's custom tabs.
 *
 * @see [Custom tabs](/router/advanced/custom-tabs/) for building a tab bar and
 * [Custom navigators](/router/advanced/custom-navigators/) for navigator integration.
 */
export type TabsContextValue = ReturnType<typeof useNavigationBuilder<TabNavigationState<any>, TabRouterOptions, TabActionHelpers<ParamListBase>, ExpoTabsNavigatorScreenOptions, TabNavigationEventMap>>;
export type TabContextValue = TabsDescriptor['options'];
export declare const TabContext: import("react").Context<ExpoTabsNavigatorScreenOptions>;
/**
 * @hidden
 */
export declare const TabTriggerMapContext: import("react").Context<TriggerMap>;
/**
 * @hidden
 */
export declare const TabNavigatorStatesContext: import("react").Context<Record<string, TabNavigationState<any>>>;
/**
 * @hidden
 */
export declare const TabsDescriptorsContext: import("react").Context<Record<string, import("../react-navigation").Descriptor<ExpoTabsNavigatorScreenOptions, Omit<{
    dispatch(action: NavigationAction): void;
    dispatchSync(action: NavigationAction): void;
    navigate<RouteName extends string>(...args: RouteName extends unknown ? [screen: RouteName, params?: object | undefined, options?: {
        merge?: boolean;
        pop?: boolean;
    } | undefined] : never): void;
    navigate<RouteName extends string>(options: RouteName extends unknown ? {
        name: RouteName;
        params: object | undefined;
        path?: string;
        merge?: boolean;
        pop?: boolean;
    } : never): void;
    preload<RouteName extends string>(...args: RouteName extends unknown ? [screen: RouteName, params?: object | undefined] : never): void;
    reset(state: TabNavigationState<any> | import("../react-navigation").PartialState<TabNavigationState<any>>): void;
    goBack(): void;
    isFocused(): boolean;
    canGoBack(): boolean;
    getId(): string | undefined;
    getParent<T = import("../react-navigation").NavigationHelpers<ParamListBase, {}> | undefined>(id?: string): T;
    getState(): TabNavigationState<any>;
} & import("../react-navigation").PrivateValueStore<[ParamListBase, unknown, unknown]>, "getParent"> & {
    getParent<T = NavigationProp<ParamListBase, string, string | undefined, Readonly<{
        key: string;
        routeKeySeq: number;
        index: number;
        routeNames: string[];
        history?: unknown[];
        routes: import("../react-navigation").NavigationRoute<ParamListBase, string>[];
        type?: string;
        stale: false;
    }>, {}, {}> | undefined>(id?: string | undefined): T;
    setOptions(options: Partial<ExpoTabsNavigatorScreenOptions>): void;
} & {
    setParams(params: Partial<object | undefined>): void;
    replaceParams(params: object | undefined): void;
} & import("../react-navigation").EventConsumer<TabNavigationEventMap & import("../react-navigation").EventMapCore<TabNavigationState<any>>> & import("../react-navigation").PrivateValueStore<[ParamListBase, string, TabNavigationEventMap]> & TabActionHelpers<ParamListBase>, import("../react-navigation").RouteProp<ParamListBase>>>>;
/**
 * @hidden
 */
export declare const TabsNavigatorContext: import("react").Context<({
    dispatch(action: NavigationAction): void;
    dispatchSync(action: NavigationAction): void;
    navigate<RouteName extends string>(...args: RouteName extends unknown ? [screen: RouteName, params?: object | undefined, options?: {
        merge?: boolean;
        pop?: boolean;
    } | undefined] : never): void;
    navigate<RouteName extends string>(options: RouteName extends unknown ? {
        name: RouteName;
        params: object | undefined;
        path?: string;
        merge?: boolean;
        pop?: boolean;
    } : never): void;
    preload<RouteName extends string>(...args: RouteName extends unknown ? [screen: RouteName, params?: object | undefined] : never): void;
    reset(state: Readonly<{
        key: string;
        routeKeySeq: number;
        index: number;
        routeNames: string[];
        history?: unknown[];
        routes: import("../react-navigation").NavigationRoute<ParamListBase, string>[];
        type?: string;
        stale: false;
    }> | import("../react-navigation").PartialState<Readonly<{
        key: string;
        routeKeySeq: number;
        index: number;
        routeNames: string[];
        history?: unknown[];
        routes: import("../react-navigation").NavigationRoute<ParamListBase, string>[];
        type?: string;
        stale: false;
    }>>): void;
    goBack(): void;
    isFocused(): boolean;
    canGoBack(): boolean;
    getId(): string | undefined;
    getParent<T = import("../react-navigation").NavigationHelpers<ParamListBase, {}> | undefined>(id?: string): T;
    getState(): Readonly<{
        key: string;
        routeKeySeq: number;
        index: number;
        routeNames: string[];
        history?: unknown[];
        routes: import("../react-navigation").NavigationRoute<ParamListBase, string>[];
        type?: string;
        stale: false;
    }>;
} & import("../react-navigation").PrivateValueStore<[ParamListBase, unknown, unknown]> & import("../react-navigation").EventEmitter<TabNavigationEventMap> & {
    setParams(params: Partial<object | undefined>): void;
    replaceParams(params: object | undefined): void;
} & TabActionHelpers<ParamListBase>) | null>;
/**
 * @hidden
 */
export declare const TabsStateContext: import("react").Context<TabNavigationState<any>>;
export type Route = TabNavigationState<ParamListBase>['routes'][number];
export type TabsDescriptor = TabsContextValue['descriptors'][number];
