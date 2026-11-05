import type { ComponentProps } from 'react';
import { type BottomTabNavigatorCreateProps } from '../react-navigation/bottom-tabs/navigators/createBottomTabNavigator';
import type { BottomTabNavigationConfig, BottomTabNavigationEventMap, BottomTabNavigationOptions } from '../react-navigation/bottom-tabs/types';
import { type ParamListBase, type TabNavigationState, type TabRouterOptions } from '../react-navigation/native';
import type { StandardNavigatorCreatePropsFactoryDeps } from '../standard-navigation/types';
import type { Href } from '../types';
export * from '../react-navigation/bottom-tabs';
export type TabsScreenOptions = BottomTabNavigationOptions & {
    href?: Href | null;
};
/**
 * Creates the props required to integrate Expo Router's JavaScript tabs navigator.
 *
 * @param dependencies The navigation state and dispatch function provided to a `createProps`
 * factory.
 * @returns The JavaScript tabs navigator props.
 *
 * @example
 * ```tsx
 * import { TabRouter, integrateWithRouter } from 'expo-router';
 * import { createJSTabsProps } from 'expo-router/js-tabs';
 * import { navigator } from './navigator';
 *
 * export const Tabs = integrateWithRouter(navigator, TabRouter, {
 *   createProps: createJSTabsProps,
 * });
 * ```
 */
export declare function createJSTabsProps(args: StandardNavigatorCreatePropsFactoryDeps<TabNavigationState<ParamListBase>>): BottomTabNavigatorCreateProps;
/**
 * Renders a tabs navigator.
 *
 * @hideType
 */
declare const Tabs: import("react").ForwardRefExoticComponent<Omit<Omit<import("..").StandardUseNavigationBuilderOptions<TabNavigationState<ParamListBase>, TabsScreenOptions, BottomTabNavigationEventMap>, "initialRouteName"> & Omit<BottomTabNavigationConfig, "initialRouteName"> & Omit<TabRouterOptions, "initialRouteName"> & {
    unstable_screenErrorBoundary?: React.ComponentType<import("..").ErrorBoundaryProps>;
}, "children"> & Partial<Pick<Omit<import("..").StandardUseNavigationBuilderOptions<TabNavigationState<ParamListBase>, TabsScreenOptions, BottomTabNavigationEventMap>, "initialRouteName"> & Omit<BottomTabNavigationConfig, "initialRouteName"> & Omit<TabRouterOptions, "initialRouteName"> & {
    unstable_screenErrorBoundary?: React.ComponentType<import("..").ErrorBoundaryProps>;
}, "children">> & import("react").RefAttributes<unknown>> & {
    Screen: (props: import("..").ScreenProps<TabsScreenOptions, TabNavigationState<ParamListBase>, BottomTabNavigationEventMap>) => null;
    Protected: typeof import("../views/Protected").Protected;
};
export type JSTabsProps = ComponentProps<typeof Tabs>;
export default Tabs;
