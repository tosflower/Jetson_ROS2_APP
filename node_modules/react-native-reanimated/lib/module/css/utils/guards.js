'use strict';

import { isNumber, isPercentage } from "../../common/index.js";
import { VALID_PARAMETRIZED_TIMING_FUNCTIONS, VALID_PREDEFINED_TIMING_FUNCTIONS } from "../constants/index.js";
export const isPredefinedTimingFunction = value => VALID_PREDEFINED_TIMING_FUNCTIONS.includes(value);
export const smellsLikeTimingFunction = value => isPredefinedTimingFunction(value) || VALID_PARAMETRIZED_TIMING_FUNCTIONS.includes(value.split('(')[0].trim());
export const isAnimationProp = key => {
  switch (key) {
    case 'animationName':
    case 'animationDuration':
    case 'animationTimingFunction':
    case 'animationDelay':
    case 'animationIterationCount':
    case 'animationDirection':
    case 'animationFillMode':
    case 'animationPlayState':
      return true;
    default:
      return false;
  }
};
export const isTransitionProp = key => {
  switch (key) {
    case 'transitionProperty':
    case 'transitionDuration':
    case 'transitionTimingFunction':
    case 'transitionDelay':
    case 'transitionBehavior':
    case 'transition':
      return true;
    default:
      return false;
  }
};
export const isTransitionCallbackProp = key => {
  switch (key) {
    case 'onTransitionRun':
    case 'onTransitionStart':
    case 'onTransitionEnd':
    case 'onTransitionCancel':
      return true;
    default:
      return false;
  }
};
export const isStepsModifier = value => {
  switch (value) {
    case 'jump-start':
    case 'start':
    case 'jump-end':
    case 'end':
    case 'jump-none':
    case 'jump-both':
      return true;
    default:
      return false;
  }
};
export const isCSSConfigProp = key => isTransitionProp(key) || isAnimationProp(key) || isTransitionCallbackProp(key);
export const isTimeUnit = value =>
// TODO: implement more strict check
typeof value === 'string' && (/^-?(\d+)?(\.\d+)?(ms|s)$/.test(value) || value === '0');
export const isLength = value => isNumber(value) || isPercentage(value);
export const isArrayOfLength = (value, length) => Array.isArray(value) && value.length === length;
export const isCSSKeyframesObject = value => typeof value === 'object' && Object.keys(value).length > 0;
export const isCSSKeyframesRule = value => typeof value === 'object' && 'cssRules' in value && 'cssText' in value;
export const isPseudoSelectorValue = value => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const keys = Object.keys(value);
  if (keys.length === 0) {
    return false;
  }
  return keys.every(key => key === 'default' || key.startsWith(':'));
};
//# sourceMappingURL=guards.js.map