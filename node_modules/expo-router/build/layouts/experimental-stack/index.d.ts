import type { ComponentProps } from 'react';
import type { ParamListBase, StackNavigationState } from '../../react-navigation/native';
import { Protected } from '../../views/Protected';
import { type StandardExperimentalStackNavigationEventMap } from './createExperimentalStackNavigator';
import type { ExperimentalStackNavigationOptions } from './types';
declare const RNExperimentalStack: import("react").ForwardRefExoticComponent<Omit<Omit<import("../..").StandardUseNavigationBuilderOptions<StackNavigationState<ParamListBase>, ExperimentalStackNavigationOptions, StandardExperimentalStackNavigationEventMap>, "initialRouteName"> & Omit<object, "initialRouteName"> & {
    unstable_screenErrorBoundary?: React.ComponentType<import("../..").ErrorBoundaryProps>;
}, "children"> & Partial<Pick<Omit<import("../..").StandardUseNavigationBuilderOptions<StackNavigationState<ParamListBase>, ExperimentalStackNavigationOptions, StandardExperimentalStackNavigationEventMap>, "initialRouteName"> & Omit<object, "initialRouteName"> & {
    unstable_screenErrorBoundary?: React.ComponentType<import("../..").ErrorBoundaryProps>;
}, "children">> & import("react").RefAttributes<unknown>> & {
    Screen: (props: import("../..").ScreenProps<ExperimentalStackNavigationOptions, StackNavigationState<ParamListBase>, StandardExperimentalStackNavigationEventMap>) => null;
    Protected: typeof Protected;
};
/**
 * Renders the new `react-native-screens/experimental` native stack.
 *
 * Sibling to `Stack`. Native-only — on web it falls back to the standard `Stack`.
 * Opt-in per navigator: replace `<Stack />` with `<ExperimentalStack />` in the
 * specific layout you want to migrate.
 *
 * @experimental
 */
declare const ExperimentalStack: ((props: ComponentProps<typeof RNExperimentalStack>) => import("react").JSX.Element) & {
    Screen: (({ children, options, ...rest }: import("../stack-utils").StackScreenProps) => import("react").JSX.Element) & {
        Title: typeof import("../stack-utils").StackTitle;
        BackButton: typeof import("../stack-utils").StackScreenBackButton;
    };
    Protected: import("react").FunctionComponent<import("../../views/Protected").ProtectedProps>;
};
export { ExperimentalStack };
export default ExperimentalStack;
export type { ExperimentalStackNavigationOptions, ExperimentalStackNavigationEventMap, ExperimentalStackNavigationProp, ExperimentalStackScreenProps, ExperimentalStackNavigationHelpers, } from './types';
