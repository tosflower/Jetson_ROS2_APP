import type { ComponentProps, ComponentRef, ComponentType, ReactNode, Ref, RefAttributes } from 'react';
import type { FlatList, FlatListProps, TextInput } from 'react-native';
import type { InstanceOrElement, SharedValueDisableContravariance } from '../commonTypes';
import type { CSSCallbackProps } from '../css/types';
import type { AnimatedProps } from '../helperTypes';
import type { AnimatedRef } from '../hook';
import type { ExtractElementRef } from '../hook/commonTypes';
import type { Options } from './AnimatedComponent';
import type { InitialComponentProps } from './commonTypes';
type AnimatedComponentRef<TInstance> = Ref<ExtractElementRef<TInstance>> | (TInstance extends InstanceOrElement ? AnimatedRef<TInstance> : never) | AnimatedRef;
export type AnimatedComponentType<Props extends object = object, Instance = unknown, ExtraProps extends object = object> = {
    (props: Omit<AnimatedProps<Props>, 'ref'> & CSSCallbackProps & ExtraProps & {
        ref?: AnimatedComponentRef<Instance>;
    }): ReactNode;
    (props: Omit<AnimatedProps<Props>, 'ref'> & CSSCallbackProps & ExtraProps & RefAttributes<ExtractElementRef<Instance>>): ReactNode;
};
type AnimatableComponent<C extends ComponentType<any>> = C & {
    jsProps?: string[];
};
/**
 * Lets you create an Animated version of any React Native component.
 *
 * @param Component - The component you want to make animatable.
 * @param options - Optional configuration object containing:
 *
 *   - `setNativeProps`: Function to set native props
 *   - `jsProps`: String array to select which props should be animated on JS
 *
 * @returns A component that Reanimated is capable of animating.
 * @see https://docs.swmansion.com/react-native-reanimated/docs/core/createAnimatedComponent
 */
export declare function createAnimatedComponent<TInstance extends AnimatableComponent<ComponentType<any>>>(Component: TInstance extends typeof FlatList<infer _> | typeof TextInput ? never : TInstance, options?: Options<InitialComponentProps>): AnimatedComponentType<Readonly<ComponentProps<TInstance>>, TInstance>;
/**
 * `text` is the native prop backing `TextInput`'s value. It's not part of
 * `TextInputProps`, but Reanimated can update it directly, so the animated
 * `TextInput` accepts it as a shared value. Static strings are still disallowed
 * - use `value` or `defaultValue` for those. It's added only to the inline
 * props (not to the base component props) so that `useAnimatedProps`, which
 * supplies raw values, keeps accepting `{ text: string }`.
 */
export declare function createAnimatedComponent(Component: typeof TextInput, options?: Options<InitialComponentProps>): AnimatedComponentType<Readonly<ComponentProps<typeof TextInput>>, typeof TextInput, {
    text?: SharedValueDisableContravariance<string>;
}>;
/**
 * @deprecated Please use `Animated.FlatList` component instead of calling
 *   `Animated.createAnimatedComponent(FlatList)` manually.
 */
export declare function createAnimatedComponent<T = any>(Component: typeof FlatList<T>, options?: Options<InitialComponentProps>): AnimatedComponentType<Readonly<FlatListProps<T>>, ComponentRef<typeof FlatList<T>>>;
export {};
//# sourceMappingURL=createAnimatedComponent.d.ts.map