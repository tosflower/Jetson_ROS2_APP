import * as React from 'react';
import type { NavigationAction, NavigationState, ParamListBase, PartialState, Router } from '../routers';
import { type AddListener } from './NavigationBuilderContext';
import type { Descriptor, DescriptorRouteProp, EventMapBase, EventMapCore, NavigationHelpers, NavigationProp, RouteConfig, RouteProp } from './types';
import type { NavigationEventEmitter } from './useEventEmitter';
export type ScreenConfigWithParent<State extends NavigationState, ScreenOptions extends {}, EventMap extends EventMapBase> = {
    options: (ScreenOptionsOrCallback<ScreenOptions> | undefined)[] | undefined;
    layout: ScreenLayout<ScreenOptions> | undefined;
    props: RouteConfig<ParamListBase, string, State, ScreenOptions, EventMap, unknown>;
};
type ScreenLayout<ScreenOptions extends {}> = (props: {
    route: RouteProp<ParamListBase, string>;
    options: ScreenOptions;
    navigation: any;
    theme: ReactNavigation.Theme;
    children: React.ReactElement;
}) => React.ReactElement;
type ScreenOptionsOrCallback<ScreenOptions extends {}> = ScreenOptions | ((props: {
    route: DescriptorRouteProp<ParamListBase, string>;
    navigation: any;
    theme: ReactNavigation.Theme;
}) => ScreenOptions);
type Options<State extends NavigationState, ScreenOptions extends {}, EventMap extends EventMapBase> = {
    routes: State['routes'];
    routeNames: State['routeNames'];
    screens: Record<string, ScreenConfigWithParent<State, ScreenOptions, EventMap>>;
    activityEnabled: boolean | number | undefined;
    activityDefaultThreshold: number;
    navigation: NavigationHelpers<ParamListBase>;
    screenOptions: ScreenOptionsOrCallback<ScreenOptions> | undefined;
    screenLayout: ScreenLayout<ScreenOptions> | undefined;
    state: State;
    addListener: AddListener;
    router: Router<State, NavigationAction>;
    emitter: NavigationEventEmitter<EventMapCore<State>>;
};
/**
 * Hook to create descriptor objects for the child routes.
 *
 * A descriptor object provides 3 things:
 * - Helper method to render a screen
 * - Options specified by the screen for the navigator
 * - Navigation object intended for the route
 */
export declare function useDescriptors<State extends NavigationState, ActionHelpers extends Record<string, () => void>, ScreenOptions extends {}, EventMap extends EventMapBase>({ routes, routeNames, screens, activityEnabled, activityDefaultThreshold, navigation, screenOptions, screenLayout, state, addListener, router, emitter, }: Options<State, ScreenOptions, EventMap>): {
    describe: (route: DescriptorRouteProp<ParamListBase, string>) => Descriptor<ScreenOptions, Omit<{
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
        reset(state: State | PartialState<State>): void;
        goBack(): void;
        isFocused(): boolean;
        canGoBack(): boolean;
        getId(): string | undefined;
        getParent<T = NavigationHelpers<ParamListBase, {}> | undefined>(id?: string): T;
        getState(): State;
    } & import("./types").PrivateValueStore<[ParamListBase, unknown, unknown]>, "getParent"> & {
        getParent<T = NavigationProp<ParamListBase, string, string | undefined, Readonly<{
            key: string;
            routeKeySeq: number;
            index: number;
            routeNames: string[];
            history?: unknown[];
            routes: import("..").NavigationRoute<ParamListBase, string>[];
            type?: string;
            stale: false;
        }>, {}, {}> | undefined>(id?: string | undefined): T;
        setOptions(options: Partial<ScreenOptions>): void;
    } & {
        setParams(params: Partial<object | undefined>): void;
        replaceParams(params: object | undefined): void;
    } & import("./types").EventConsumer<EventMap & EventMapCore<State>> & import("./types").PrivateValueStore<[ParamListBase, string, EventMap]> & ActionHelpers, RouteProp<ParamListBase>>;
    descriptors: Record<string, Descriptor<ScreenOptions, Omit<{
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
        reset(state: State | PartialState<State>): void;
        goBack(): void;
        isFocused(): boolean;
        canGoBack(): boolean;
        getId(): string | undefined;
        getParent<T = NavigationHelpers<ParamListBase, {}> | undefined>(id?: string): T;
        getState(): State;
    } & import("./types").PrivateValueStore<[ParamListBase, unknown, unknown]>, "getParent"> & {
        getParent<T = NavigationProp<ParamListBase, string, string | undefined, Readonly<{
            key: string;
            routeKeySeq: number;
            index: number;
            routeNames: string[];
            history?: unknown[];
            routes: import("..").NavigationRoute<ParamListBase, string>[];
            type?: string;
            stale: false;
        }>, {}, {}> | undefined>(id?: string | undefined): T;
        setOptions(options: Partial<ScreenOptions>): void;
    } & {
        setParams(params: Partial<object | undefined>): void;
        replaceParams(params: object | undefined): void;
    } & import("./types").EventConsumer<EventMap & EventMapCore<State>> & import("./types").PrivateValueStore<[ParamListBase, string, EventMap]> & ActionHelpers, RouteProp<ParamListBase>>>;
};
export {};
