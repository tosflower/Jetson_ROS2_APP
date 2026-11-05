import type { ComponentProps } from 'react';
import { type DrawerNavigationOptions } from '../react-navigation/drawer';
import type { DrawerNavigatorConfig, StandardDrawerNavigationEventMap } from '../react-navigation/drawer/navigators/createDrawerNavigator';
import { type DrawerNavigationState, type DrawerRouterOptions, type ParamListBase } from '../react-navigation/native';
export declare const Drawer: import("react").ForwardRefExoticComponent<Omit<Omit<import("..").StandardUseNavigationBuilderOptions<DrawerNavigationState<ParamListBase>, DrawerNavigationOptions, StandardDrawerNavigationEventMap>, "initialRouteName"> & Omit<DrawerNavigatorConfig, "initialRouteName"> & Omit<DrawerRouterOptions, "initialRouteName"> & {
    unstable_screenErrorBoundary?: React.ComponentType<import("..").ErrorBoundaryProps>;
}, "children"> & Partial<Pick<Omit<import("..").StandardUseNavigationBuilderOptions<DrawerNavigationState<ParamListBase>, DrawerNavigationOptions, StandardDrawerNavigationEventMap>, "initialRouteName"> & Omit<DrawerNavigatorConfig, "initialRouteName"> & Omit<DrawerRouterOptions, "initialRouteName"> & {
    unstable_screenErrorBoundary?: React.ComponentType<import("..").ErrorBoundaryProps>;
}, "children">> & import("react").RefAttributes<unknown>> & {
    Screen: (props: import("..").ScreenProps<DrawerNavigationOptions, DrawerNavigationState<ParamListBase>, StandardDrawerNavigationEventMap>) => null;
    Protected: typeof import("../views/Protected").Protected;
};
export type DrawerNavigatorProps = ComponentProps<typeof Drawer>;
export default Drawer;
