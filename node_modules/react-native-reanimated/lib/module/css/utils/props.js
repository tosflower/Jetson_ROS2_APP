'use strict';

import { isEmptyObject, isSupportedStyleProp, logger } from "../../common/index.js";
import { isSharedValue } from "../../isSharedValue.js";
import { isAnimationProp, isCSSKeyframesObject, isCSSKeyframesRule, isPseudoSelectorValue, isTransitionCallbackProp, isTransitionProp } from "./guards.js";
export function filterCSSAndStyleProperties(style) {
  const animationProperties = {};
  let transitionProperties = {};
  const transitionCallbacks = {};
  const filteredStyle = {};
  const pseudoStylesBySelector = {};

  // The CSS / transition / animation buckets are strongly typed but at this
  // point we are dynamically splitting an opaque style object by prop name;
  // values are validated downstream by the normalizers.
  for (const [prop, value] of Object.entries(style)) {
    if (value === undefined) {
      // If the user explicitly sets a property to undefined (e.g. when they want
      // to remove CSS transition or animation), we treat the property as if it was not
      // present in the style object.
      continue;
    }
    if (isAnimationProp(prop)) {
      // TODO - add support for animation shorthand
      animationProperties[prop] = value;
    } else if (isTransitionProp(prop)) {
      // If there is a shorthand `transition` property, all properties specified
      // before are ignored and only these specified later are taken into account
      // and override ones from the shorthand
      if (prop === 'transition') {
        transitionProperties = {
          transition: value
        };
      } else {
        transitionProperties[prop] = value;
      }
    } else if (isTransitionCallbackProp(prop)) {
      transitionCallbacks[prop] = value;
    } else if (isSharedValue(value)) {
      continue;
    } else if (isPseudoSelectorValue(value)) {
      const defaultValue = value.default;
      if (defaultValue !== undefined) {
        filteredStyle[prop] = defaultValue;
      }
      for (const [selector, selectorValue] of Object.entries(value)) {
        if (selector === 'default') {
          continue;
        }
        const branch = pseudoStylesBySelector[selector] ??= {
          selectorStyle: {},
          defaultStyle: {}
        };
        branch.selectorStyle[prop] = selectorValue;
        branch.defaultStyle[prop] = defaultValue;
      }
    } else if (isEmptyObject(value) && isSupportedStyleProp(prop)) {
      throw new Error(`[Reanimated] Invalid value for "${prop}": an empty object is not a valid style value.`);
    } else {
      filteredStyle[prop] = value;
    }
  }

  // Return animationProperties only if at least one animationName contains
  // valid keyframes
  const animationName = animationProperties.animationName;
  const hasAnimationName = animationName && (Array.isArray(animationName) ? animationName : [animationName]).every(keyframes => keyframes === 'none' ? false : isCSSKeyframesRule(keyframes) || isCSSKeyframesObject(keyframes));
  const finalAnimationConfig = hasAnimationName ? {
    ...animationProperties,
    animationName
  } : null;

  // Return transitionProperties only if the transitionProperty is present
  const hasTransitionConfig = Object.keys(transitionProperties).length > 0;
  const finalTransitionConfig = hasTransitionConfig ? transitionProperties : null;
  const hasPseudoStyles = Object.keys(pseudoStylesBySelector).length > 0;
  const finalPseudoStyles = hasPseudoStyles ? pseudoStylesBySelector : null;
  const hasTransitionCallbacks = Object.keys(transitionCallbacks).length > 0;
  const finalTransitionCallbacks = hasTransitionCallbacks ? transitionCallbacks : null;
  if (__DEV__) {
    validateCSSAnimationProps(animationProperties);
    validateCSSTransitionProps(transitionProperties);
    validateCSSTransitionCallbacks(transitionCallbacks, hasTransitionConfig);
  }
  return [finalAnimationConfig, finalTransitionConfig, finalPseudoStyles, finalTransitionCallbacks, filteredStyle];
}
function validateCSSAnimationProps(props) {
  // Check if animationDuration is missing when animationName is present
  if (!('animationDuration' in props) && 'animationName' in props) {
    logger.warn('animationDuration was not specified for CSS animation. The default duration is 0s.\n' + 'Have you forgotten to pass the animationDuration?');
  }
}
function validateCSSTransitionProps(props) {
  // Check if transitionDuration is missing when transitionProperty is present
  if (!('transitionDuration' in props) && 'transitionProperty' in props) {
    logger.warn('transitionDuration was not specified for CSS transition. The default duration is 0s.\n' + 'Have you forgotten to pass the transitionDuration?');
  }
}
function validateCSSTransitionCallbacks(callbacks, hasTransitionConfig) {
  // Transition callbacks are driven by an actual CSS transition; without any
  // transition property configured there is nothing that could ever fire them.
  const callbackNames = Object.keys(callbacks);
  if (callbackNames.length === 0 || hasTransitionConfig) {
    return;
  }
  const isPlural = callbackNames.length > 1;
  logger.warn(`CSS transition ${isPlural ? 'callbacks' : 'callback'} (${callbackNames.join(', ')}) ` + `${isPlural ? 'were' : 'was'} provided without any CSS transition properties ` + `(e.g. transitionDuration), so ${isPlural ? 'they' : 'it'} will never be called.`);
}
//# sourceMappingURL=props.js.map