import type { ComponentProps, ComponentType, ForwardRefExoticComponent, PropsWithoutRef, ReactNode, RefAttributes } from 'react';
import type { EventMapBase, NavigationState } from '../react-navigation/native';
import type { PickPartial } from '../types';
import type { ScreenProps } from '../useScreens';
import { Protected } from '../views/Protected';
import { type GuardedRedirects } from './GuardContext';
export declare function useFilterScreenChildren<TOptions extends object = Record<string, any>, TState extends NavigationState = NavigationState, TEventMap extends EventMapBase = EventMapBase>(children: ReactNode, { isCustomNavigator, contextKey, }?: {
    isCustomNavigator?: boolean;
    /** Used for sending developer hints */
    contextKey?: string;
}): {
    screens: (ScreenProps<TOptions, TState, TEventMap> & {
        name: string;
    })[];
    children: any[];
    guardedRedirects: GuardedRedirects;
};
/**
 * Returns a navigator that automatically injects matched routes and renders nothing when there are no children.
 * Return type with `children` prop optional.
 *
 * Enables use of other built-in React Navigation navigators and other navigators built with the React Navigation custom navigator API.
 *
 * @deprecated Use `integrateWithRouter` instead.
 *
 * @param Nav - The navigator component to wrap.
 * @param processScreens - A function that processes the screens before passing them to the navigator.
 * It must preserve every screen name exactly once because guards are associated with the original
 * screen names.
 *
 *  @example
 * ```tsx app/_layout.tsx
 * import { ParamListBase, TabNavigationState } from "@react-navigation/native";
 * import {
 *   createMaterialTopTabNavigator,
 *   MaterialTopTabNavigationOptions,
 *   MaterialTopTabNavigationEventMap,
 * } from "@react-navigation/material-top-tabs";
 * import { withLayoutContext } from "expo-router";
 *
 * const MaterialTopTabs = createMaterialTopTabNavigator();
 *
 * const ExpoRouterMaterialTopTabs = withLayoutContext<
 *   MaterialTopTabNavigationOptions,
 *   typeof MaterialTopTabs.Navigator,
 *   TabNavigationState<ParamListBase>,
 *   MaterialTopTabNavigationEventMap
 * >(MaterialTopTabs.Navigator);

 * export default function TabLayout() {
 *   return <ExpoRouterMaterialTopTabs />;
 * }
 * ```
 */
export declare function withLayoutContext<TOptions extends object = Record<string, any>, T extends ComponentType<any> = ComponentType<any>, TState extends NavigationState = NavigationState, TEventMap extends EventMapBase = EventMapBase>(Nav: T, processScreens?: (screens: (ScreenProps<TOptions, TState, TEventMap> & {
    name: string;
})[]) => (ScreenProps<TOptions, TState, TEventMap> & {
    name: string;
})[]): ForwardRefExoticComponent<PropsWithoutRef<PickPartial<ComponentProps<T>, "children">> & RefAttributes<unknown>> & {
    Screen: (props: ScreenProps<TOptions, TState, TEventMap>) => null;
    Protected: typeof Protected;
};
