import type { AnimationConfigFunction, EntryAnimationsValues, ExitAnimationsValues, IEntryAnimationBuilder, IExitAnimationBuilder } from '../../commonTypes';
import type { BaseAnimationBuilder } from '../animationBuilder';
import { ComplexAnimationBuilder } from '../animationBuilder';
import type { Rotate, TransformsConfig, TranslateX, TranslateY } from './types';
/**
 * Rotate to bottom from left edge. You can modify the behavior by chaining
 * methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `entering` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#rotate
 */
export declare class RotateInDownLeft extends ComplexAnimationBuilder<{
    opacity: number;
} & TransformsConfig<[Rotate, TranslateX, TranslateY]>> implements IEntryAnimationBuilder {
    static presetName: string;
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<EntryAnimationsValues>;
}
/**
 * Rotate to bottom from right edge. You can modify the behavior by chaining
 * methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `entering` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#rotate
 */
export declare class RotateInDownRight extends ComplexAnimationBuilder<{
    opacity: number;
} & TransformsConfig<[Rotate, TranslateX, TranslateY]>> implements IEntryAnimationBuilder {
    static presetName: string;
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<EntryAnimationsValues>;
}
/**
 * Rotate to top from left edge. You can modify the behavior by chaining methods
 * like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `entering` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#rotate
 */
export declare class RotateInUpLeft extends ComplexAnimationBuilder<{
    opacity: number;
} & TransformsConfig<[Rotate, TranslateX, TranslateY]>> implements IEntryAnimationBuilder {
    static presetName: string;
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<EntryAnimationsValues>;
}
/**
 * Rotate to top from right edge. You can modify the behavior by chaining
 * methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `entering` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#rotate
 */
export declare class RotateInUpRight extends ComplexAnimationBuilder<{
    opacity: number;
} & TransformsConfig<[Rotate, TranslateX, TranslateY]>> implements IEntryAnimationBuilder {
    static presetName: string;
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<EntryAnimationsValues>;
}
/**
 * Rotate to bottom from left edge. You can modify the behavior by chaining
 * methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `exiting` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#rotate
 */
export declare class RotateOutDownLeft extends ComplexAnimationBuilder<{
    opacity: number;
} & TransformsConfig<[Rotate, TranslateX, TranslateY]>> implements IExitAnimationBuilder {
    static presetName: string;
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<ExitAnimationsValues>;
}
/**
 * Rotate to bottom from right edge. You can modify the behavior by chaining
 * methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `exiting` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#rotate
 */
export declare class RotateOutDownRight extends ComplexAnimationBuilder<{
    opacity: number;
} & TransformsConfig<[Rotate, TranslateX, TranslateY]>> implements IExitAnimationBuilder {
    static presetName: string;
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<ExitAnimationsValues>;
}
/**
 * Rotate to top from left edge. You can modify the behavior by chaining methods
 * like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `exiting` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#rotate
 */
export declare class RotateOutUpLeft extends ComplexAnimationBuilder<{
    opacity: number;
} & TransformsConfig<[Rotate, TranslateX, TranslateY]>> implements IExitAnimationBuilder {
    static presetName: string;
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<ExitAnimationsValues>;
}
/**
 * Rotate to top from right edge. You can modify the behavior by chaining
 * methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `exiting` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#rotate
 */
export declare class RotateOutUpRight extends ComplexAnimationBuilder<{
    opacity: number;
} & TransformsConfig<[Rotate, TranslateX, TranslateY]>> implements IExitAnimationBuilder {
    static presetName: string;
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<ExitAnimationsValues>;
}
//# sourceMappingURL=Rotate.d.ts.map