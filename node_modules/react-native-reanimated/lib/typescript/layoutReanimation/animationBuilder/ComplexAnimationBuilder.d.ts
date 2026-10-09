import type { AnimationFunction, EasingFunction, LayoutAnimationAndConfig, StyleProps } from '../../commonTypes';
import type { EasingFunctionFactory } from '../../Easing';
import { BaseAnimationBuilder } from './BaseAnimationBuilder';
/**
 * `this` constraint for static modifiers on {@link AnimationConfigBuilder}.
 * Represents a subclass constructor exposing the shared config-only static API
 * inherited from {@link BaseAnimationBuilder}. The modifiers bind `this` to a
 * concrete subtype of this so the chain preserves the receiver's instance type
 * (e.g. `SharedTransition.springify(...)` stays a `SharedTransition`) instead
 * of collapsing to `AnimationConfigBuilder`.
 */
type AnimationConfigBuilderClass = typeof BaseAnimationBuilder & (new () => AnimationConfigBuilder);
export declare class AnimationConfigBuilder extends BaseAnimationBuilder {
    easingV?: EasingFunction | EasingFunctionFactory;
    rotateV?: string;
    type?: AnimationFunction;
    dampingV?: number;
    dampingRatioV?: number;
    massV?: number;
    stiffnessV?: number;
    overshootClampingV?: number;
    energyThresholdV?: number;
    static createInstance: <T extends typeof BaseAnimationBuilder>(this: T) => InstanceType<T>;
    /**
     * Lets you change the easing curve of the animation. Can be chained alongside
     * other [layout animation
     * modifiers](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#layout-animation-modifier).
     *
     * @param easingFunction - An easing function which defines the animation
     *   curve.
     */
    static easing<T extends AnimationConfigBuilderClass>(this: T, easingFunction: EasingFunction | EasingFunctionFactory): InstanceType<T>;
    easing(easingFunction: EasingFunction | EasingFunctionFactory): this;
    /**
     * Lets you rotate the element. Can be chained alongside other [layout
     * animation
     * modifiers](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#layout-animation-modifier).
     *
     * @param degree - The rotation degree.
     */
    static rotate<T extends AnimationConfigBuilderClass>(this: T, degree: string): InstanceType<T>;
    rotate(degree: string): this;
    /**
     * Enables the spring-based animation configuration. Can be chained alongside
     * other [layout animation
     * modifiers](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#layout-animation-modifier).
     *
     * @param duration - An optional duration of the spring animation (in
     *   milliseconds).
     */
    static springify<T extends AnimationConfigBuilderClass>(this: T, duration?: number): InstanceType<T>;
    springify(duration?: number): this;
    /**
     * Lets you adjust the spring animation damping ratio. Can be chained
     * alongside other [layout animation
     * modifiers](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#layout-animation-modifier).
     *
     * @param dampingRatio - How damped the spring is.
     */
    static dampingRatio<T extends AnimationConfigBuilderClass>(this: T, dampingRatio: number): InstanceType<T>;
    dampingRatio(value: number): this;
    /**
     * Lets you adjust the spring animation damping. Can be chained alongside
     * other [layout animation
     * modifiers](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#layout-animation-modifier).
     *
     * @param value - Decides how quickly a spring stops moving. Higher damping
     *   means the spring will come to rest faster.
     */
    static damping<T extends AnimationConfigBuilderClass>(this: T, value: number): InstanceType<T>;
    damping(damping: number): this;
    /**
     * Lets you adjust the spring animation mass. Can be chained alongside other
     * [layout animation
     * modifiers](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#layout-animation-modifier).
     *
     * @param mass - The weight of the spring. Reducing this value makes the
     *   animation faster.
     */
    static mass<T extends AnimationConfigBuilderClass>(this: T, mass: number): InstanceType<T>;
    mass(mass: number): this;
    /**
     * Lets you adjust the stiffness of the spring animation. Can be chained
     * alongside other [layout animation
     * modifiers](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#layout-animation-modifier).
     *
     * @param stiffness - How bouncy the spring is.
     */
    static stiffness<T extends AnimationConfigBuilderClass>(this: T, stiffness: number): InstanceType<T>;
    stiffness(stiffness: number): this;
    /**
     * Lets you adjust overshoot clamping of the spring. Can be chained alongside
     * other [layout animation
     * modifiers](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#layout-animation-modifier).
     *
     * @param overshootClamping - Whether a spring can bounce over the final
     *   position.
     */
    static overshootClamping<T extends AnimationConfigBuilderClass>(this: T, overshootClamping: number): InstanceType<T>;
    overshootClamping(overshootClamping: number): this;
    /**
     * @deprecated Use {@link energyThreshold} instead. This method currently does
     *   nothing and will be removed in the upcoming major version.
     */
    static restDisplacementThreshold<T extends AnimationConfigBuilderClass>(this: T, _restDisplacementThreshold: number): InstanceType<T>;
    /**
     * @deprecated Use {@link energyThreshold} instead. This method currently does
     *   nothing and will be removed in the upcoming major version.
     */
    restDisplacementThreshold(_restDisplacementThreshold: number): this;
    /**
     * @deprecated Use {@link energyThreshold} instead. This method currently does
     *   nothing and will be removed in a future version.
     */
    static restSpeedThreshold<T extends AnimationConfigBuilderClass>(this: T, _restSpeedThreshold: number): InstanceType<T>;
    /**
     * @deprecated Use {@link energyThreshold} instead. This method currently does
     *   nothing and will be removed in a future version.
     */
    restSpeedThreshold(_restSpeedThreshold: number): this;
    /**
     * Lets you adjust the energy threshold level to stop the spring animation.
     * Can be chained alongside other [layout animation
     * modifiers](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#layout-animation-modifier).
     *
     * @param energyThreshold - Relative energy threshold below which the spring
     *   will snap to `toValue` without further oscillations. Defaults to 6e-9.
     */
    static energyThreshold<T extends AnimationConfigBuilderClass>(this: T, energyThreshold: number): InstanceType<T>;
    energyThreshold(energyThreshold: number): this;
    getAnimationAndConfig(): LayoutAnimationAndConfig;
}
/**
 * `this` type for static methods on {@link ComplexAnimationBuilder}. Represents
 * a subclass constructor preserving the concrete `TValues` type for
 * initial/target value override methods.
 */
type ComplexAnimationBuilderClass<TValues> = typeof BaseAnimationBuilder & (new () => ComplexAnimationBuilder<TValues>);
export declare class ComplexAnimationBuilder<TValues = StyleProps> extends AnimationConfigBuilder {
    initialValues?: Partial<TValues>;
    targetValues?: Partial<TValues>;
    /**
     * Lets you override the initial properties of the animation
     *
     * @param values - An object containing the styles to override.
     */
    static withInitialValues<TValues>(this: ComplexAnimationBuilderClass<TValues>, values: Partial<TValues>): ComplexAnimationBuilder<TValues>;
    withInitialValues(values: Partial<TValues>): this;
    /**
     * Lets you override the target properties of the animation
     *
     * @param values - An object containing the styles to override.
     */
    static withTargetValues<TValues>(this: ComplexAnimationBuilderClass<TValues>, values: Partial<TValues>): ComplexAnimationBuilder<TValues>;
    withTargetValues(values: Partial<TValues>): this;
}
export {};
//# sourceMappingURL=ComplexAnimationBuilder.d.ts.map