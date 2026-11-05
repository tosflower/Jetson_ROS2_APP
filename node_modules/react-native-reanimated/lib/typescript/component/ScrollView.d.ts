import type { ComponentProps, ComponentRef } from 'react';
import React from 'react';
import { ScrollView } from 'react-native';
import type { SharedValue } from '../commonTypes';
import { type AnimatedComponentType } from '../createAnimatedComponent';
type AnimatedScrollViewComplement = ComponentRef<typeof ScrollView> & {
    getNode(): ComponentRef<typeof ScrollView>;
};
declare const AnimatedScrollViewComponent: AnimatedComponentType<Readonly<ComponentProps<typeof ScrollView>>, ComponentRef<typeof ScrollView>>;
export type AnimatedScrollViewProps = ComponentProps<typeof AnimatedScrollViewComponent> & {
    scrollViewOffset?: SharedValue<number>;
};
export declare function AnimatedScrollView({ scrollViewOffset, ref, ...restProps }: AnimatedScrollViewProps): React.JSX.Element;
export type AnimatedScrollView = AnimatedScrollViewComplement & typeof AnimatedScrollViewComponent;
export {};
//# sourceMappingURL=ScrollView.d.ts.map