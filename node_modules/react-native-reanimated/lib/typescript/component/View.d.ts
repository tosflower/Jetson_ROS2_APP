import type { ComponentProps, ComponentRef } from 'react';
import { View } from 'react-native';
import { type AnimatedComponentType } from '../createAnimatedComponent';
type AnimatedViewComplement = ComponentRef<typeof View> & {
    getNode(): ComponentRef<typeof View>;
};
export declare const AnimatedView: AnimatedComponentType<Readonly<ComponentProps<typeof View>>, ComponentRef<typeof View>>;
export type AnimatedView = typeof AnimatedView & AnimatedViewComplement;
export {};
//# sourceMappingURL=View.d.ts.map