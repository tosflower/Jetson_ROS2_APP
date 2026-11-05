import type { ComponentProps } from 'react';
import { type MaterialTopTabNavigatorCreateProps } from '../react-navigation/material-top-tabs/navigators/createMaterialTopTabNavigator';
import type { MaterialTopTabNavigationConfig, MaterialTopTabNavigationEventMap, MaterialTopTabNavigationOptions } from '../react-navigation/material-top-tabs/types';
import { type ParamListBase, type TabNavigationState, type TabRouterOptions } from '../react-navigation/native';
import type { StandardNavigatorCreatePropsFactoryDeps } from '../standard-navigation/types';
export * from '../react-navigation/material-top-tabs';
/**
 * Creates the props required to integrate Expo Router's JavaScript top tabs navigator.
 *
 * @param dependencies The navigation state and dispatch functions provided to a `createProps`
 * factory.
 * @returns The JavaScript top tabs navigator props.
 *
 * @example
 * ```tsx
 * import { TabRouter, integrateWithRouter } from 'expo-router';
 * import { createJSTopTabsProps } from 'expo-router/js-top-tabs';
 * import { navigator } from './navigator';
 *
 * export const TopTabs = integrateWithRouter(navigator, TabRouter, {
 *   createProps: createJSTopTabsProps,
 * });
 * ```
 */
export declare function createJSTopTabsProps(args: StandardNavigatorCreatePropsFactoryDeps<TabNavigationState<ParamListBase>>): MaterialTopTabNavigatorCreateProps;
declare const TopTabs: import("react").ForwardRefExoticComponent<Omit<Omit<import("..").StandardUseNavigationBuilderOptions<TabNavigationState<ParamListBase>, MaterialTopTabNavigationOptions, MaterialTopTabNavigationEventMap>, "initialRouteName"> & Omit<MaterialTopTabNavigationConfig, "initialRouteName"> & Omit<TabRouterOptions, "initialRouteName"> & {
    unstable_screenErrorBoundary?: React.ComponentType<import("..").ErrorBoundaryProps>;
}, "children"> & Partial<Pick<Omit<import("..").StandardUseNavigationBuilderOptions<TabNavigationState<ParamListBase>, MaterialTopTabNavigationOptions, MaterialTopTabNavigationEventMap>, "initialRouteName"> & Omit<MaterialTopTabNavigationConfig, "initialRouteName"> & Omit<TabRouterOptions, "initialRouteName"> & {
    unstable_screenErrorBoundary?: React.ComponentType<import("..").ErrorBoundaryProps>;
}, "children">> & import("react").RefAttributes<unknown>> & {
    Screen: (props: import("..").ScreenProps<MaterialTopTabNavigationOptions, TabNavigationState<ParamListBase>, MaterialTopTabNavigationEventMap>) => null;
    Protected: typeof import("../views/Protected").Protected;
};
export type JSTopTabsProps = ComponentProps<typeof TopTabs>;
export { TopTabs };
export default TopTabs;
