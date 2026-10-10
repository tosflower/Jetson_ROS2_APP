'use strict';

import { hasSuffix } from "../../common/index.js";
import { webPropsBuilder } from "../../common/web/index.js";
import { getWebSvgPropsBuilder } from "../svg/web/index.js";
import { normalizeWebKeyframes } from "./normalization/index.js";
import { parseTimingFunction } from "./utils.js";
export function processKeyframeDefinitions(definitions, svgElementTag = '') {
  const propsBuilder = getWebSvgPropsBuilder(svgElementTag) ?? webPropsBuilder;

  // Whole-set fixups (strokeDasharray endpoints, open/closed path Z-padding)
  // before serializing each block.
  const keyframes = normalizeWebKeyframes(definitions);
  return Object.entries(keyframes).reduce((acc, [timestamp, rules]) => {
    const step = hasSuffix(timestamp) ? timestamp : `${parseFloat(timestamp) * 100}%`;
    const processedBlock = processKeyframeBlock(rules, propsBuilder);
    if (!processedBlock) {
      return acc;
    }
    acc.push(`${step} { ${processedBlock} }`);
    return acc;
  }, []).join(' ');
}
function processKeyframeBlock({
  animationTimingFunction,
  ...rules
}, propsBuilder) {
  const style = propsBuilder.build(rules);
  if (!style) {
    return null;
  }
  return animationTimingFunction ? `animation-timing-function: ${parseTimingFunction(animationTimingFunction)}; ${style}` : style;
}
//# sourceMappingURL=animationParser.js.map