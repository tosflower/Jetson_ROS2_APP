import React from 'react';
import { Animated, type StyleProp, type ViewStyle } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps, BottomTabDescriptorMap, BottomTabViewState } from '../types';
type Props = BottomTabBarProps & {
    style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
};
type Options = {
    state: BottomTabViewState;
    descriptors: BottomTabDescriptorMap;
    dimensions: {
        height: number;
        width: number;
    };
};
export declare const getTabBarHeight: ({ state, descriptors, dimensions, insets, style, }: Options & {
    insets: EdgeInsets;
    style: Animated.WithAnimatedValue<StyleProp<ViewStyle>> | undefined;
}) => number;
export declare function BottomTabBar({ state, descriptors, emitter, navigateToTab, insets, style }: Props): React.JSX.Element;
export {};
