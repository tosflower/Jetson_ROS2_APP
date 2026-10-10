import type { DefaultStyle } from '../../../hook/commonTypes';
import { CSSKeyframesRuleBase } from '../../models';
import type { CSSAnimationKeyframes } from '../../types';
export default class CSSKeyframesRuleImpl<S extends object = DefaultStyle> extends CSSKeyframesRuleBase<S> {
    private processedKeyframes_;
    constructor(keyframes: CSSAnimationKeyframes<S>, processedKeyframes?: string);
    get processedKeyframes(): string;
}
//# sourceMappingURL=CSSKeyframesRuleImpl.d.ts.map