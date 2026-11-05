import type { ComponentType } from 'react';
import type { ParamListBase, StackNavigationState } from '../react-navigation/native';
import { type StackNavigationConfig, type StackNavigatorCreateProps, type StackNavigationOptions, type StandardStackNavigationEventMap } from '../react-navigation/stack';
import type { StandardNavigatorCreatePropsFactoryDeps } from '../standard-navigation/types';
import { Screen } from '../views/Screen';
export * from '../react-navigation/stack';
/**
 * Creates the props required to integrate Expo Router's JavaScript stack navigator.
 *
 * @param dependencies The navigation state and dispatch functions provided to a `createProps`
 * factory.
 * @returns The JavaScript stack navigator props.
 *
 * @example
 * ```tsx
 * import { StackRouter, integrateWithRouter } from 'expo-router';
 * import { createJSStackProps } from 'expo-router/js-stack';
 * import { navigator } from './navigator';
 *
 * export const Stack = integrateWithRouter(navigator, StackRouter, {
 *   createProps: createJSStackProps,
 * });
 * ```
 */
export declare function createJSStackProps(args: StandardNavigatorCreatePropsFactoryDeps<StackNavigationState<ParamListBase>>): StackNavigatorCreateProps;
/**
 * Renders a JavaScript-based stack navigator.
 *
 * @hideType
 */
declare const Stack: ComponentType<Omit<Omit<Omit<import("..").StandardUseNavigationBuilderOptions<StackNavigationState<ParamListBase>, StackNavigationOptions, StandardStackNavigationEventMap>, "initialRouteName"> & Omit<StackNavigationConfig, "initialRouteName"> & Omit<object, "initialRouteName"> & {
    unstable_screenErrorBoundary?: React.ComponentType<import("..").ErrorBoundaryProps>;
}, "children"> & Partial<Pick<Omit<import("..").StandardUseNavigationBuilderOptions<StackNavigationState<ParamListBase>, StackNavigationOptions, StandardStackNavigationEventMap>, "initialRouteName"> & Omit<StackNavigationConfig, "initialRouteName"> & Omit<object, "initialRouteName"> & {
    unstable_screenErrorBoundary?: React.ComponentType<import("..").ErrorBoundaryProps>;
}, "children">> & import("react").RefAttributes<unknown>, "initialRouteName">> & {
    Screen: typeof Screen;
    Protected: import("react").FunctionComponent<import("../views/Protected").ProtectedProps>;
};
export { Stack };
export default Stack;
