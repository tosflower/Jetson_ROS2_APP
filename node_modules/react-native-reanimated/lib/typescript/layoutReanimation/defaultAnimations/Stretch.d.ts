import type { EntryExitAnimationFunction, IEntryExitAnimationBuilder } from '../../commonTypes';
import type { BaseAnimationBuilder } from '../animationBuilder';
import { ComplexAnimationBuilder } from '../animationBuilder';
import type { ScaleX, ScaleY, TransformsConfig } from './types';
/**
 * Stretch animation on the X axis. You can modify the behavior by chaining
 * methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `entering` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations/#stretch
 */
export declare class StretchInX extends ComplexAnimationBuilder<TransformsConfig<[ScaleX]>> implements IEntryExitAnimationBuilder {
    static presetName: string;
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => EntryExitAnimationFunction;
}
/**
 * Stretch animation on the Y axis. You can modify the behavior by chaining
 * methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `entering` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations/#stretch
 */
export declare class StretchInY extends ComplexAnimationBuilder<TransformsConfig<[ScaleY]>> implements IEntryExitAnimationBuilder {
    static presetName: string;
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => EntryExitAnimationFunction;
}
/**
 * Stretch animation on the X axis. You can modify the behavior by chaining
 * methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `exiting` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations/#stretch
 */
export declare class StretchOutX extends ComplexAnimationBuilder<TransformsConfig<[ScaleX]>> implements IEntryExitAnimationBuilder {
    static presetName: string;
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => EntryExitAnimationFunction;
}
/**
 * Stretch animation on the Y axis. You can modify the behavior by chaining
 * methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `exiting` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations/#stretch
 */
export declare class StretchOutY extends ComplexAnimationBuilder<TransformsConfig<[ScaleY]>> implements IEntryExitAnimationBuilder {
    static presetName: string;
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => EntryExitAnimationFunction;
}
//# sourceMappingURL=Stretch.d.ts.map