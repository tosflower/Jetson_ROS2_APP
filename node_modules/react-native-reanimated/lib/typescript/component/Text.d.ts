import type { ComponentProps, ComponentRef } from 'react';
import { Text } from 'react-native';
import { type AnimatedComponentType } from '../createAnimatedComponent';
type AnimatedTextComplement = ComponentRef<typeof Text> & {
    getNode(): ComponentRef<typeof Text>;
};
export declare const AnimatedText: AnimatedComponentType<Readonly<ComponentProps<typeof Text>>, ComponentRef<typeof Text>>;
export type AnimatedText = typeof AnimatedText & AnimatedTextComplement;
export {};
//# sourceMappingURL=Text.d.ts.map