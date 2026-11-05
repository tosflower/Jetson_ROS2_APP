import { type ComponentType } from 'react';
import { withLayoutContext } from '../layouts/withLayoutContext';
import { type DefaultRouterOptions, type NavigationAction, type NavigationState, type RouterFactory } from '../react-navigation/native';
import type { IntegrateWithRouterOptions, NavigatorContentProps, StandardNavigator, StandardNavigatorEventMapBase, StandardRouterNavigatorProps, StandardUseNavigationBuilderOptions } from './types';
export type { IntegrateWithRouterOptions, NavigatorContentProps, StandardNavigatorDescriptor, StandardNavigatorEmit, StandardNavigatorEventMapBase, StandardUseNavigationBuilderOptions, } from './types';
export { IsWithinNativeNavigator } from './IsWithinNativeNavigator';
type IntegrateWithRouterOptionsTuple<State extends NavigationState, CreateProps extends object, NavigatorOptions extends object, EventMap extends StandardNavigatorEventMapBase> = [keyof CreateProps] extends [never] ? [options?: IntegrateWithRouterOptions<State, CreateProps, NavigatorOptions, EventMap>] : [options: IntegrateWithRouterOptions<State, CreateProps, NavigatorOptions, EventMap>];
type StandardRouterNavigatorComponent<NavigatorOptions extends object, State extends NavigationState, EventMap extends StandardNavigatorEventMapBase, NavigatorProps extends object, RouterOptions extends DefaultRouterOptions> = ReturnType<typeof withLayoutContext<NavigatorOptions, ComponentType<StandardRouterNavigatorProps<State, NavigatorOptions, EventMap, NavigatorProps, RouterOptions>>, State, EventMap>>;
/**
 * Creates a [`standard-navigation`](https://www.npmjs.com/package/standard-navigation) navigator and
 * wires it into Expo Router in one step. Use `integrateWithRouter` instead if you already
 * have a navigator from `createStandardNavigator`.
 * Props declared in both `NavigatorProps` and `CreateProps` are intersected, so incompatible types
 * produce `never` rather than a type error at this call.
 *
 * @param NavigatorContent Renders the navigator UI; receives the standard-navigation `state`,
 * `descriptors`, `actions`, and `emitter`.
 * @param router The router factory to use. For example, `StackRouter` or `TabRouter`.
 * @param options See `IntegrateWithRouterOptions`.
 *
 * @example
 * ```tsx
 * import { createStandardRouterNavigator, TabRouter } from 'expo-router';
 *
 * export const Tabs = createStandardRouterNavigator(MyTabsContent, TabRouter);
 * ```
 */
export declare function createStandardRouterNavigator<NavigatorOptions extends object, State extends NavigationState, EventMap extends StandardNavigatorEventMapBase, NavigatorProps extends object, RouterOptions extends DefaultRouterOptions, CreateProps extends object = object>(NavigatorContent: ComponentType<NavigatorContentProps<NavigatorOptions, EventMap, NavigatorProps, CreateProps>>, router: RouterFactory<State, NavigationAction, RouterOptions>, ...options: IntegrateWithRouterOptionsTuple<State, NoInfer<CreateProps>, NavigatorOptions, EventMap>): StandardRouterNavigatorComponent<NavigatorOptions, State, EventMap, NavigatorProps, RouterOptions>;
/**
 * Wires an existing [`standard-navigation`](https://www.npmjs.com/package/standard-navigation)
 * navigator into Expo Router, returning a navigator component (with a `.Screen` child) usable as a
 * layout. Use `createStandardRouterNavigator` to create and integrate in one step.
 *
 * @param navigator The object returned by `createStandardNavigator(...)`.
 * @param router The router factory to use. For example, `StackRouter` or `TabRouter`.
 * @param options See `IntegrateWithRouterOptions`.
 *
 * @example
 * ```tsx
 * import { createStandardNavigator } from 'standard-navigation';
 * import { integrateWithRouter, TabRouter } from 'expo-router';
 *
 * const navigator = createStandardNavigator(MyTabsContent);
 * export const Tabs = integrateWithRouter(navigator, TabRouter);
 * ```
 */
export declare function integrateWithRouter<NavigatorOptions extends object, State extends NavigationState, EventMap extends StandardNavigatorEventMapBase, NavigatorProps extends object, RouterOptions extends DefaultRouterOptions, CreateProps extends object = object>(navigator: StandardNavigator<NavigatorOptions, EventMap, NavigatorProps & CreateProps>, router: RouterFactory<State, NavigationAction, RouterOptions>, ...[options]: IntegrateWithRouterOptionsTuple<State, NoInfer<CreateProps>, NavigatorOptions, EventMap>): import("react").ForwardRefExoticComponent<import("react").PropsWithoutRef<import("..").PickPartial<Omit<StandardUseNavigationBuilderOptions<State, NavigatorOptions, EventMap>, "initialRouteName"> & Omit<NavigatorProps, "initialRouteName"> & Omit<RouterOptions, "initialRouteName"> & {
    unstable_screenErrorBoundary?: React.ComponentType<import("..").ErrorBoundaryProps>;
}, "children">> & import("react").RefAttributes<unknown>> & {
    Screen: (props: import("..").ScreenProps<NavigatorOptions, State, EventMap>) => null;
    Protected: typeof import("../views/Protected").Protected;
};
/** @deprecated Use `createStandardRouterNavigator` instead. */
export declare const unstable_createStandardRouterNavigator: typeof createStandardRouterNavigator;
/** @deprecated Use `integrateWithRouter` instead. */
export declare const unstable_integrateWithRouter: typeof integrateWithRouter;
