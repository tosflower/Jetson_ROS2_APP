import type { UnknownRecord } from '../../../common';
import type { NormalizedCSSTimingFunction } from '../../easing';
import type { CSSAnimationDirection, CSSAnimationFillMode, CSSAnimationPlayState } from '../../types';
type CSSPropKeyframe<V> = {
    offset: number;
    value: V;
}[];
export type PropsWithKeyframes<TProps = UnknownRecord> = {
    [P in keyof TProps]: TProps[P] extends (infer U) | undefined ? U extends object ? U extends Array<any> ? CSSPropKeyframe<U> : {
        [K in keyof U]: PropsWithKeyframes<U[K]>;
    } : P extends 'transform' ? never : CSSPropKeyframe<U> : never;
};
export type NormalizedCSSKeyframeTimingFunctions = Record<number, NormalizedCSSTimingFunction>;
export type NormalizedCSSAnimationKeyframesConfig = {
    propKeyframes: PropsWithKeyframes;
    keyframeTimingFunctions: NormalizedCSSKeyframeTimingFunctions;
};
export type NormalizedSingleCSSAnimationSettings = {
    duration: number;
    timingFunction: NormalizedCSSTimingFunction;
    delay: number;
    iterationCount: number;
    direction: CSSAnimationDirection;
    fillMode: CSSAnimationFillMode;
    playState: CSSAnimationPlayState;
};
export type CSSAnimationUpdates = {
    animationNames?: string[];
    newAnimationSettings?: Record<number, NormalizedSingleCSSAnimationSettings>;
    settingsUpdates?: Record<number, Partial<NormalizedSingleCSSAnimationSettings>>;
};
export {};
//# sourceMappingURL=animation.d.ts.map