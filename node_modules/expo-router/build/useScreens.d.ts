import React from 'react';
import type { RouteNode } from './Route';
import { type GuardedRedirects } from './layouts/GuardContext';
import type { BottomTabNavigationEventMap } from './react-navigation/bottom-tabs';
import { type DescriptorRouteProp, type EventMapBase, type NavigationProp, type NavigationState, type ParamListBase, type RouteProp, type RouteSource, type ScreenListeners } from './react-navigation/native';
import type { NativeStackNavigationEventMap } from './react-navigation/native-stack';
import type { UnknownOutputParams } from './types';
declare module 'react' {
    function lazy<T extends React.ComponentType<any>>(load: () => PromiseLike<{
        default: T;
    }> | Promise<{
        default: T;
    }>): React.LazyExoticComponent<T>;
}
export type ScreenProps<TOptions extends Record<string, any> = Record<string, any>, TState extends NavigationState = NavigationState, TEventMap extends EventMapBase = EventMapBase> = {
    /** Name is required when used inside a Layout component. */
    name?: string;
    options?: TOptions | ((prop: {
        route: DescriptorRouteProp<ParamListBase, string>;
        navigation: any;
    }) => TOptions);
    listeners?: ScreenListeners<TState, TEventMap> | ((prop: {
        route: RouteProp<ParamListBase, string>;
        navigation: any;
    }) => ScreenListeners<TState, TEventMap>);
    getId?: ({ params }: {
        params?: Record<string, any>;
    }) => string | undefined;
    dangerouslySingular?: SingularOptions;
    /**
     * Overrides React Activity behavior inherited from the navigator. For stack navigators, a number
     * specifies how many screens must be above this route before its content is hidden.
     */
    activityEnabled?: TState extends {
        type?: 'stack';
    } ? boolean | number : boolean;
};
export type SingularOptions = boolean | ((name: string, params: UnknownOutputParams) => string | undefined);
/**
 * @returns React Navigation screens sorted by the `route` property.
 */
export declare function useSortedScreens<TOptions extends object, TState extends NavigationState, TEventMap extends EventMapBase>(order: ScreenProps<TOptions, TState, TEventMap>[], guardedRedirects?: GuardedRedirects): React.ReactNode[];
/** Wrap the component with various enhancements and add access to child routes. */
export declare function getQualifiedRouteComponent(value: RouteNode): React.ComponentType<any> | {
    ({ route, navigation, ...props }: {
        route?: RouteProp<ParamListBase, string>;
        navigation: Omit<NavigationProp<ParamListBase, string, undefined, NavigationState, object, NativeStackNavigationEventMap | BottomTabNavigationEventMap>, "getState"> & {
            getState(): NavigationState | undefined;
        };
    }): React.JSX.Element;
    displayName: string;
};
export declare function screenOptionsFactory<TOptions extends object = Record<string, any>>(route: RouteNode, options?: ScreenProps<TOptions>['options'], isGuarded?: boolean): ScreenProps<TOptions>['options'];
export declare function routeToScreen<TOptions extends object, TState extends NavigationState, TEventMap extends EventMapBase>(route: RouteNode, { options, getId, ...props }?: Partial<ScreenProps<TOptions, TState, TEventMap>>, isGuarded?: boolean, routeSource?: RouteSource): React.JSX.Element;
export { getSingularId } from './utils/getSingularId';
