import { type PropsWithChildren } from 'react';
import type { ParamListBase, StackNavigationState } from '../../react-navigation/native';
import type { NativeStackNavigationOptions, NativeStackNavigationEventMap } from '../../react-navigation/native-stack';
import type { ScreenProps as BaseScreenProps } from '../../useScreens';
import { StackTitle } from './StackTitle';
import { StackScreenBackButton } from './screen';
type StackBaseScreenProps = BaseScreenProps<NativeStackNavigationOptions, StackNavigationState<ParamListBase>, NativeStackNavigationEventMap>;
export interface StackScreenProps extends PropsWithChildren {
    /** Name is required when used inside a Layout component. */
    name?: StackBaseScreenProps['name'];
    /**
     * Overrides React Activity behavior inherited from the stack. A number specifies how many
     * screens must be above this route before its content is hidden.
     *
     * Only supported when used inside a Layout component.
     */
    activityEnabled?: StackBaseScreenProps['activityEnabled'];
    /**
     * Options to configure the screen.
     *
     * Accepts an object or a function returning an object.
     * The function form `options={({ route }) => ({})}` is only supported when used inside a Layout component.
     * When used inside a page component, pass an options object directly.
     */
    options?: StackBaseScreenProps['options'];
    /**
     * Listeners for navigation events.
     *
     * Only supported when used inside a Layout component.
     */
    listeners?: StackBaseScreenProps['listeners'];
    /**
     * Function to determine a unique ID for the screen.
     * @deprecated Use `dangerouslySingular` instead.
     *
     * Only supported when used inside a Layout component.
     */
    getId?: StackBaseScreenProps['getId'];
    /**
     * When enabled, the navigator will reuse an existing screen instead of pushing a new one.
     *
     * Only supported when used inside a Layout component.
     */
    dangerouslySingular?: StackBaseScreenProps['dangerouslySingular'];
}
/**
 * Component used to define a screen in a native stack navigator.
 *
 * Can be used in the `_layout.tsx` files, or directly in page components.
 *
 * When configuring header inside page components, prefer using `Stack.Title`, `Stack.Toolbar`, `Stack.Header` and `Stack.Screen.*` components.
 *
 * @example
 * ```tsx app/_layout.tsx
 * import { Stack } from 'expo-router';
 *
 * export default function Layout() {
 *   return (
 *     <Stack>
 *       <Stack.Screen
 *         name="home"
 *         options={{ title: 'Home' }}
 *       />
 *    </Stack>
 *  );
 * }
 * ```
 */
export declare const StackScreen: (({ children, options, ...rest }: StackScreenProps) => import("react").JSX.Element) & {
    /**
     * @deprecated Use `Stack.Title` instead.
     */
    Title: typeof StackTitle;
    BackButton: typeof StackScreenBackButton;
};
export declare function validateStackPresentation(options: NativeStackNavigationOptions): NativeStackNavigationOptions;
export declare function validateStackPresentation<F extends (...args: never[]) => NativeStackNavigationOptions>(options: F): F;
export declare function appendScreenStackPropsToOptions(options: NativeStackNavigationOptions, props: StackScreenProps): NativeStackNavigationOptions;
export {};
