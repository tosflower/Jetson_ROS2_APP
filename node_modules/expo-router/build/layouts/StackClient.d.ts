import type { ComponentProps } from 'react';
import { type StandardNativeStackEventMap } from '../fork/native-stack/createNativeStackNavigator';
import { type ParamListBase, type StackNavigationState, type StackRouterOptions } from '../react-navigation/native';
import type { NativeStackNavigationOptions } from '../react-navigation/native-stack';
import type { NativeStackNavigationConfig } from '../react-navigation/native-stack/types';
import { Protected } from '../views/Protected';
import { type StackScreenProps, StackSearchBar, StackTitle } from './stack-utils';
declare const RNStack: import("react").ForwardRefExoticComponent<Omit<Omit<import("..").StandardUseNavigationBuilderOptions<StackNavigationState<ParamListBase>, NativeStackNavigationOptions, StandardNativeStackEventMap>, "initialRouteName"> & Omit<NativeStackNavigationConfig, "initialRouteName"> & Omit<StackRouterOptions, "initialRouteName"> & {
    unstable_screenErrorBoundary?: React.ComponentType<import("..").ErrorBoundaryProps>;
}, "children"> & Partial<Pick<Omit<import("..").StandardUseNavigationBuilderOptions<StackNavigationState<ParamListBase>, NativeStackNavigationOptions, StandardNativeStackEventMap>, "initialRouteName"> & Omit<NativeStackNavigationConfig, "initialRouteName"> & Omit<StackRouterOptions, "initialRouteName"> & {
    unstable_screenErrorBoundary?: React.ComponentType<import("..").ErrorBoundaryProps>;
}, "children">> & import("react").RefAttributes<unknown>> & {
    Screen: (props: import("..").ScreenProps<NativeStackNavigationOptions, StackNavigationState<ParamListBase>, StandardNativeStackEventMap>) => null;
    Protected: typeof Protected;
};
/**
 * Renders a native stack navigator.
 *
 * @hideType
 */
declare const Stack: ((props: ComponentProps<typeof RNStack>) => import("react").JSX.Element) & {
    Screen: (({ children, options, ...rest }: StackScreenProps) => import("react").JSX.Element) & {
        Title: typeof StackTitle;
        BackButton: typeof import("./stack-utils").StackScreenBackButton;
    };
    Protected: import("react").FunctionComponent<import("../views/Protected").ProtectedProps>;
    Header: typeof import("./stack-utils/StackHeaderComponent").StackHeaderComponent;
    SearchBar: typeof StackSearchBar;
    Title: typeof StackTitle;
    Toolbar: {
        (props: import("./stack-utils").StackToolbarProps): import("react").JSX.Element;
        Button: import("react").FC<import("./stack-utils").StackToolbarButtonProps>;
        Menu: import("react").FC<import("./stack-utils").StackToolbarMenuProps>;
        MenuAction: import("react").FC<import("./stack-utils").StackToolbarMenuActionProps>;
        SearchBarSlot: import("react").FC<import("./stack-utils").StackToolbarSearchBarSlotProps>;
        Spacer: import("react").FC<import("./stack-utils").StackToolbarSpacerProps>;
        View: import("react").FC<import("./stack-utils").StackToolbarViewProps>;
        Label: import("react").FC<import("./stack-utils").StackToolbarLabelProps>;
        Icon: import("react").FC<import("./stack-utils").StackToolbarIconProps>;
        Badge: import("react").FC<import("./stack-utils").StackToolbarBadgeProps>;
    };
};
export { StackRouter, stackRouterOverride } from './stack-router';
export default Stack;
