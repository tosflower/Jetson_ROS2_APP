import type { ComponentProps, ComponentRef } from 'react';
import { Image } from 'react-native';
import { type AnimatedComponentType } from '../createAnimatedComponent';
type AnimatedImageComplement = ComponentRef<typeof Image> & {
    getNode(): ComponentRef<typeof Image>;
};
export declare const AnimatedImage: AnimatedComponentType<Readonly<ComponentProps<typeof Image>>, ComponentRef<typeof Image>>;
export type AnimatedImage = typeof AnimatedImage & AnimatedImageComplement;
export {};
//# sourceMappingURL=Image.d.ts.map