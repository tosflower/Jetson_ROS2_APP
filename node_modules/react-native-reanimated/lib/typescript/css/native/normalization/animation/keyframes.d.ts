import type { NativePropsBuilder, UnknownRecord } from '../../../../common';
import type { CSSAnimationKeyframes, CSSAnimationKeyframeSelector, CSSAnimationTimingFunction } from '../../../types';
import type { NormalizedCSSAnimationKeyframesConfig } from '../../types';
export declare const ERROR_MESSAGES: {
    invalidOffsetType: (selector: CSSAnimationKeyframeSelector) => string;
    invalidOffsetRange: (selector: CSSAnimationKeyframeSelector) => string;
};
export declare function normalizeKeyframeSelector(keyframeSelector: CSSAnimationKeyframeSelector): number[];
type ProcessedKeyframes = Array<{
    offset: number;
    props: UnknownRecord;
    timingFunction?: CSSAnimationTimingFunction;
}>;
export declare function processKeyframes(keyframes: CSSAnimationKeyframes, propsBuilder: NativePropsBuilder): ProcessedKeyframes;
export declare function normalizeAnimationKeyframes(keyframes: CSSAnimationKeyframes, compoundComponentName: string): NormalizedCSSAnimationKeyframesConfig;
export {};
//# sourceMappingURL=keyframes.d.ts.map