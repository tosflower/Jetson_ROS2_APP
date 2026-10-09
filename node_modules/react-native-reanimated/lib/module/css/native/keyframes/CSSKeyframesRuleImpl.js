'use strict';

import { CSSKeyframesRuleBase } from "../../models/index.js";
import { normalizeAnimationKeyframes } from "../normalization/index.js";
export default class CSSKeyframesRuleImpl extends CSSKeyframesRuleBase {
  normalizedKeyframesCache_ = {};
  constructor(keyframes, cssText) {
    super(keyframes, cssText);
  }
  getNormalizedKeyframesConfig(compoundComponentName) {
    this.normalizedKeyframesCache_[compoundComponentName] ??= normalizeAnimationKeyframes(this.cssRules, compoundComponentName);
    return this.normalizedKeyframesCache_[compoundComponentName];
  }
}
//# sourceMappingURL=CSSKeyframesRuleImpl.js.map