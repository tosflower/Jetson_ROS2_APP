import React from 'react';
import { type ParamListBase, type TabNavigationState } from '../react-navigation/native';
import type { StandardNavigatorCreatePropsFactoryDeps } from '../standard-navigation/types';
import type { NativeTabsProps } from './types';
export declare const NativeTabsContext: React.Context<boolean>;
export interface NativeTabsNavigatorCreateProps {
    isPreloaded: (key: string) => boolean;
    isRemovalPrevented: (key: string) => boolean;
    routeNames: string[];
    preload: (name: string) => void;
    navigateSync: (name: string) => void;
}
/**
 * Creates the props required to integrate Expo Router's native tabs navigator.
 *
 * @param args The navigation state and dispatch functions provided to a `createProps`
 * factory.
 * @returns The native tabs navigator props.
 *
 * @example
 * ```tsx
 * import { TabRouter, integrateWithRouter } from 'expo-router';
 * import { createNativeTabsProps } from 'expo-router/unstable-native-tabs';
 * import { navigator } from './navigator';
 *
 * export const NativeTabs = integrateWithRouter(navigator, TabRouter, {
 *   createProps: createNativeTabsProps,
 * });
 * ```
 */
export declare function createNativeTabsProps(args: StandardNavigatorCreatePropsFactoryDeps<TabNavigationState<ParamListBase>>): NativeTabsNavigatorCreateProps;
export declare function NativeTabsNavigatorWrapper(props: NativeTabsProps): React.JSX.Element;
