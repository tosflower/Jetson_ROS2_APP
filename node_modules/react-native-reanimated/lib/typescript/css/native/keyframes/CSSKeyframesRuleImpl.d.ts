import type { DefaultStyle } from '../../../hook/commonTypes';
import { CSSKeyframesRuleBase } from '../../models';
import type { CSSAnimationKeyframes } from '../../types';
import type { NormalizedCSSAnimationKeyframesConfig } from '../types';
export default class CSSKeyframesRuleImpl<S extends object = DefaultStyle> extends CSSKeyframesRuleBase<S> {
    private readonly normalizedKeyframesCache_;
    constructor(keyframes: CSSAnimationKeyframes<S>, cssText?: string);
    getNormalizedKeyframesConfig(compoundComponentName: string): NormalizedCSSAnimationKeyframesConfig;
}
//# sourceMappingURL=CSSKeyframesRuleImpl.d.ts.map