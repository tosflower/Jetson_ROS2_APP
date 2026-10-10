'use strict';

import { getPropsBuilder, getSeparatelyInterpolatedNestedProperties, isDefined } from "../../../../common/index.js";
import { offsetOf } from "../../../utils/index.js";
import { normalizeTimingFunction } from "../common/index.js";
export const ERROR_MESSAGES = {
  invalidOffsetType: selector => `Invalid keyframe selector "${selector}". Only numbers, percentages, "from", and "to" are supported.`,
  invalidOffsetRange: selector => `Invalid keyframe selector "${selector}". Expected a number between 0 and 1 or a percentage between 0% and 100%.`
};
export function normalizeKeyframeSelector(keyframeSelector) {
  const selectors = typeof keyframeSelector === 'string' ? keyframeSelector.split(',').map(k => k.trim()) : [keyframeSelector];
  return selectors.map(selector => {
    const offset = offsetOf(selector);
    if (offset === null) {
      throw new Error(`[Reanimated] ${ERROR_MESSAGES.invalidOffsetType(selector)}`);
    }
    if (offset < 0 || offset > 1) {
      throw new Error(`[Reanimated] ${ERROR_MESSAGES.invalidOffsetRange(selector)}`);
    }
    return offset;
  });
}
export function processKeyframes(keyframes, propsBuilder) {
  return Object.entries(keyframes).flatMap(([selector, {
    animationTimingFunction = undefined,
    ...props
  } = {}]) => {
    const normalizedProps = propsBuilder.build(props);
    if (!normalizedProps) {
      return [];
    }
    return normalizeKeyframeSelector(selector).map(offset => ({
      offset,
      props: normalizedProps,
      ...(animationTimingFunction && {
        timingFunction: animationTimingFunction
      })
    }));
  }).sort((a, b) => a.offset - b.offset).reduce((acc, keyframe) => {
    const lastKeyframe = acc[acc.length - 1];
    if (lastKeyframe && lastKeyframe.offset === keyframe.offset) {
      lastKeyframe.props = {
        ...lastKeyframe.props,
        ...keyframe.props
      };
      lastKeyframe.timingFunction = keyframe.timingFunction;
    } else {
      acc.push(keyframe);
    }
    return acc;
  }, []);
}
function processProps(offset, props, keyframeProps, separatelyInterpolatedNestedProperties) {
  for (const [property, value] of Object.entries(props)) {
    if (!isDefined(value)) {
      continue;
    }
    if (/* this object type check is correct as it accepts records and arrays */
    typeof value === 'object' && separatelyInterpolatedNestedProperties.has(property)) {
      const subBuilder = keyframeProps[property] ??= Array.isArray(value) ? [] : {};
      processProps(offset, value, subBuilder, separatelyInterpolatedNestedProperties);
      continue;
    }
    const entries = keyframeProps[property] ??= [];
    entries.push({
      offset,
      value
    });
  }
}
export function normalizeAnimationKeyframes(keyframes, compoundComponentName) {
  const propsBuilder = getPropsBuilder(compoundComponentName);
  const separatelyInterpolatedNestedProperties = getSeparatelyInterpolatedNestedProperties(compoundComponentName);
  const propKeyframes = {};
  const timingFunctions = {};
  processKeyframes(keyframes, propsBuilder).forEach(({
    offset,
    props,
    timingFunction
  }) => {
    processProps(offset, props, propKeyframes, separatelyInterpolatedNestedProperties);
    if (timingFunction && offset < 1) {
      timingFunctions[offset] = normalizeTimingFunction(timingFunction);
    }
  });
  return {
    propKeyframes,
    keyframeTimingFunctions: timingFunctions
  };
}
//# sourceMappingURL=keyframes.js.map