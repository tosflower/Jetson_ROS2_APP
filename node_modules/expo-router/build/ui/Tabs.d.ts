import type { PropsWithChildren } from 'react';
import type { ViewProps } from 'react-native';
import type { DefaultNavigatorOptions, ParamListBase, TabActionHelpers, TabNavigationState, TabRouterOptions } from '../react-navigation/native';
import type { ExpoTabsScreenOptions, TabNavigationEventMap, TabsContextValue } from './TabContext';
import type { ScreenTrigger } from './common';
export * from './TabContext';
export * from './TabList';
export * from './TabSlot';
export * from './TabTrigger';
/**
 * Options to provide to the Tab Router.
 */
export type UseTabsOptions = Omit<DefaultNavigatorOptions<ParamListBase, any, TabNavigationState<any>, ExpoTabsScreenOptions, TabNavigationEventMap, any>, 'activityEnabled' | 'children' | 'initialRouteName'> & {
    activityEnabled?: boolean;
    backBehavior?: TabRouterOptions['backBehavior'];
};
export type TabsProps = ViewProps & {
    /** Forward props to child component and removes the extra `<View>`. Useful for custom wrappers. */
    asChild?: boolean;
    options?: UseTabsOptions;
    /**
     * Enables React Activity for tab screens. Inactive tabs are hidden while preserving their state.
     * @default false
     */
    activityEnabled?: boolean;
};
/**
 * Root component for the headless tabs.
 *
 * @see [`useTabsWithChildren`](#usetabswithchildrenoptions) for a hook version of this component.
 * @example
 * ```tsx
 * <Tabs>
 *  <TabSlot />
 *  <TabList>
 *   <TabTrigger name="home" href="/" />
 *  </TabList>
 * </Tabs>
 * ```
 */
export declare function Tabs(props: TabsProps): import("react").JSX.Element;
export type UseTabsWithChildrenOptions = PropsWithChildren<UseTabsOptions>;
export type UseTabsWithTriggersOptions = UseTabsOptions & {
    triggers: ScreenTrigger[];
};
/**
 * Hook version of `Tabs`. The returned NavigationContent component
 * should be rendered. Using the hook requires using the `<TabList />`
 * and `<TabTrigger />` components exported from Expo Router.
 *
 * The `useTabsWithTriggers()` hook can be used for custom components.
 *
 * @see [`Tabs`](#tabs) for the component version of this hook.
 * @example
 * ```tsx
 * export function MyTabs({ children }) {
 *  const { NavigationContent } = useTabsWithChildren({ children })
 *
 *  return <NavigationContent />
 * }
 * ```
 */
export declare function useTabsWithChildren(options: UseTabsWithChildrenOptions): {
    state: TabNavigationState<any>;
    navigation: {
        dispatch(action: import("..").NavigationAction): void;
        dispatchSync(action: import("..").NavigationAction): void;
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
    } & TabActionHelpers<ParamListBase>;
    describe: (route: import("../react-navigation").DescriptorRouteProp<ParamListBase, string>) => import("../react-navigation").Descriptor<import("./TabContext").ExpoTabsNavigatorScreenOptions, Omit<{
        dispatch(action: Readonly<{
            type: string;
            payload?: object;
            source?: string;
            target?: string;
        }>): void;
        dispatchSync(action: Readonly<{
            type: string;
            payload?: object;
            source?: string;
            target?: string;
        }>): void;
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
        getParent<T = import("../react-navigation").NavigationProp<ParamListBase, string, string | undefined, Readonly<{
            key: string;
            routeKeySeq: number;
            index: number;
            routeNames: string[];
            history?: unknown[];
            routes: import("../react-navigation").NavigationRoute<ParamListBase, string>[];
            type?: string;
            stale: false;
        }>, {}, {}> | undefined>(id?: string | undefined): T;
        setOptions(options: Partial<import("./TabContext").ExpoTabsNavigatorScreenOptions>): void;
    } & {
        setParams(params: Partial<object | undefined>): void;
        replaceParams(params: object | undefined): void;
    } & import("../react-navigation").EventConsumer<TabNavigationEventMap & import("../react-navigation").EventMapCore<TabNavigationState<any>>> & import("../react-navigation").PrivateValueStore<[ParamListBase, string, TabNavigationEventMap]> & TabActionHelpers<ParamListBase>, import("../react-navigation").RouteProp<ParamListBase>>;
    descriptors: Record<string, import("../react-navigation").Descriptor<import("./TabContext").ExpoTabsNavigatorScreenOptions, Omit<{
        dispatch(action: import("..").NavigationAction): void;
        dispatchSync(action: import("..").NavigationAction): void;
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
        getParent<T = import("../react-navigation").NavigationProp<ParamListBase, string, string | undefined, Readonly<{
            key: string;
            routeKeySeq: number;
            index: number;
            routeNames: string[];
            history?: unknown[];
            routes: import("../react-navigation").NavigationRoute<ParamListBase, string>[];
            type?: string;
            stale: false;
        }>, {}, {}> | undefined>(id?: string | undefined): T;
        setOptions(options: Partial<import("./TabContext").ExpoTabsNavigatorScreenOptions>): void;
    } & {
        setParams(params: Partial<object | undefined>): void;
        replaceParams(params: object | undefined): void;
    } & import("../react-navigation").EventConsumer<TabNavigationEventMap & import("../react-navigation").EventMapCore<TabNavigationState<any>>> & import("../react-navigation").PrivateValueStore<[ParamListBase, string, TabNavigationEventMap]> & TabActionHelpers<ParamListBase>, import("../react-navigation").RouteProp<ParamListBase>>>;
    NavigationContent: ({ children }: {
        children: React.ReactNode;
    }) => import("react").JSX.Element;
};
/**
 * Alternative hook version of `Tabs` that uses explicit triggers
 * instead of `children`.
 *
 * @see [`Tabs`](#tabs) for the component version of this hook.
 * @example
 * ```tsx
 * export function MyTabs({ children }) {
 *   const { NavigationContent } = useTabsWithChildren({ triggers: [] })
 *
 *   return <NavigationContent />
 * }
 * ```
 */
export declare function useTabsWithTriggers(options: UseTabsWithTriggersOptions): TabsContextValue;
