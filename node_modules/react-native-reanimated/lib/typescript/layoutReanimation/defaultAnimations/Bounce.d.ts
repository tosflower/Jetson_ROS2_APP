import type { EntryExitAnimationFunction, IEntryExitAnimationBuilder } from '../../commonTypes';
import type { BaseAnimationBuilder } from '../animationBuilder';
import { ComplexAnimationBuilder } from '../animationBuilder';
import type { Scale, TransformsConfig, TranslateX, TranslateY } from './types';
/**
 * Bounce entering animation. You can modify the behavior by chaining methods
 * like `.delay(300)` or `.duration(100)`.
 *
 * You pass it to the `entering` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#bounce
 */
export declare class BounceIn extends ComplexAnimationBuilder<TransformsConfig<[Scale]>> implements IEntryExitAnimationBuilder {
    static presetName: string;
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    static getDuration(): number;
    getDuration(): number;
    build: () => EntryExitAnimationFunction;
}
/**
 * Bounce from bottom animation. You can modify the behavior by chaining methods
 * like `.delay(300)` or `.duration(100)`.
 *
 * You pass it to the `entering` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#bounce
 */
export declare class BounceInDown extends ComplexAnimationBuilder<TransformsConfig<[TranslateY]>> implements IEntryExitAnimationBuilder {
    static presetName: string;
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    static getDuration(): number;
    getDuration(): number;
    build: () => EntryExitAnimationFunction;
}
/**
 * Bounce from top animation. You can modify the behavior by chaining methods
 * like `.delay(300)` or `.duration(100)`.
 *
 * You pass it to the `entering` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#bounce
 */
export declare class BounceInUp extends ComplexAnimationBuilder<TransformsConfig<[TranslateY]>> implements IEntryExitAnimationBuilder {
    static presetName: string;
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    static getDuration(): number;
    getDuration(): number;
    build: () => EntryExitAnimationFunction;
}
/**
 * Bounce from left animation. You can modify the behavior by chaining methods
 * like `.delay(300)` or `.duration(100)`.
 *
 * You pass it to the `entering` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#bounce
 */
export declare class BounceInLeft extends ComplexAnimationBuilder<TransformsConfig<[TranslateX]>> implements IEntryExitAnimationBuilder {
    static presetName: string;
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    static getDuration(): number;
    getDuration(): number;
    build: () => EntryExitAnimationFunction;
}
/**
 * Bounce from right animation. You can modify the behavior by chaining methods
 * like `.delay(300)` or `.duration(100)`.
 *
 * You pass it to the `entering` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#bounce
 */
export declare class BounceInRight extends ComplexAnimationBuilder<TransformsConfig<[TranslateX]>> implements IEntryExitAnimationBuilder {
    static presetName: string;
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    static getDuration(): number;
    getDuration(): number;
    build: () => EntryExitAnimationFunction;
}
/**
 * Bounce exiting animation. You can modify the behavior by chaining methods
 * like `.delay(300)` or `.duration(100)`.
 *
 * You pass it to the `exiting` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#bounce
 */
export declare class BounceOut extends ComplexAnimationBuilder<TransformsConfig<[Scale]>> implements IEntryExitAnimationBuilder {
    static presetName: string;
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    static getDuration(): number;
    getDuration(): number;
    build: () => EntryExitAnimationFunction;
}
/**
 * Bounce to bottom animation. You can modify the behavior by chaining methods
 * like `.delay(300)` or `.duration(100)`.
 *
 * You pass it to the `exiting` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#bounce
 */
export declare class BounceOutDown extends ComplexAnimationBuilder<TransformsConfig<[TranslateY]>> implements IEntryExitAnimationBuilder {
    static presetName: string;
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    static getDuration(): number;
    getDuration(): number;
    build: () => EntryExitAnimationFunction;
}
/**
 * Bounce to top animation. You can modify the behavior by chaining methods like
 * `.delay(300)` or `.duration(100)`.
 *
 * You pass it to the `exiting` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#bounce
 */
export declare class BounceOutUp extends ComplexAnimationBuilder<TransformsConfig<[TranslateY]>> implements IEntryExitAnimationBuilder {
    static presetName: string;
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    static getDuration(): number;
    getDuration(): number;
    build: () => EntryExitAnimationFunction;
}
/**
 * Bounce to left animation. You can modify the behavior by chaining methods
 * like `.delay(300)` or `.duration(100)`.
 *
 * You pass it to the `exiting` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#bounce
 */
export declare class BounceOutLeft extends ComplexAnimationBuilder<TransformsConfig<[TranslateX]>> implements IEntryExitAnimationBuilder {
    static presetName: string;
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    static getDuration(): number;
    getDuration(): number;
    build: () => EntryExitAnimationFunction;
}
/**
 * Bounce to right animation. You can modify the behavior by chaining methods
 * like `.delay(300)` or `.duration(100)`.
 *
 * You pass it to the `exiting` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#bounce
 */
export declare class BounceOutRight extends ComplexAnimationBuilder<TransformsConfig<[TranslateX]>> implements IEntryExitAnimationBuilder {
    static presetName: string;
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    static getDuration(): number;
    getDuration(): number;
    build: () => EntryExitAnimationFunction;
}
//# sourceMappingURL=Bounce.d.ts.map