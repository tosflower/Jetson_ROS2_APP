import type { PredefinedTimingFunction, StepsModifier } from '../easing/types';
import type { CSSAnimationKeyframes, CSSAnimationProp, CSSCallbackProp, CSSConfigProp, CSSKeyframesRule, CSSTransitionProp, Repeat, TimeUnit } from '../types';
export declare const isPredefinedTimingFunction: (value: string) => value is PredefinedTimingFunction;
export declare const smellsLikeTimingFunction: (value: string) => boolean;
export declare const isAnimationProp: (key: string) => key is CSSAnimationProp;
export declare const isTransitionProp: (key: string) => key is CSSTransitionProp;
export declare const ANIMATION_CALLBACK_PROPS: readonly ["onCSSAnimationStart", "onCSSAnimationEnd", "onCSSAnimationIteration", "onCSSAnimationCancel"];
export declare const TRANSITION_CALLBACK_PROPS: readonly ["onCSSTransitionRun", "onCSSTransitionStart", "onCSSTransitionEnd", "onCSSTransitionCancel"];
export declare const isStepsModifier: (value: string) => value is StepsModifier;
export declare const isCSSConfigProp: (key: string) => key is CSSConfigProp;
export declare const isCSSCallbackProp: (key: string) => key is CSSCallbackProp;
export declare const isTimeUnit: (value: unknown) => value is TimeUnit;
export declare const isLength: (value: unknown) => value is `${number}%` | number;
export declare const isArrayOfLength: <T, L extends number>(value: T[], length: L) => value is Repeat<T, L>;
export declare const isCSSKeyframesObject: (value: object) => value is CSSAnimationKeyframes;
export declare const isCSSKeyframesRule: (value: object) => value is CSSKeyframesRule;
export declare const isPseudoSelectorValue: (value: unknown) => value is Record<string, unknown>;
//# sourceMappingURL=guards.d.ts.map