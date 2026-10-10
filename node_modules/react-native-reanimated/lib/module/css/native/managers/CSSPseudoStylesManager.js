'use strict';

import { logger } from "../../../common/index.js";
import { NATIVE_PSEUDO_SELECTORS } from "../../constants/index.js";
import { deepEqual } from "../../utils/index.js";
import { normalizeCSSTransitionProperties } from "../normalization/index.js";
import { registerPseudoStyles, unregisterPseudoStyles } from "../proxy.js";
export default class CSSPseudoStylesManager {
  prevPseudoStylesBySelector = null;
  prevTransitionProperties = null;
  isRegistered = false;
  constructor(shadowNodeWrapper, viewTag, propsBuilder) {
    this.shadowNodeWrapper = shadowNodeWrapper;
    this.viewTag = viewTag;
    this.propsBuilder = propsBuilder;
  }
  update(pseudoStylesBySelector, transitionProperties) {
    if (deepEqual(pseudoStylesBySelector, this.prevPseudoStylesBySelector) && deepEqual(transitionProperties, this.prevTransitionProperties)) {
      return;
    }
    this.prevPseudoStylesBySelector = pseudoStylesBySelector;
    this.prevTransitionProperties = transitionProperties;
    if (this.isRegistered) {
      this.detach();
    }
    if (!pseudoStylesBySelector) {
      return;
    }
    const normalizedTransition = transitionProperties ? normalizeCSSTransitionProperties(transitionProperties) : null;
    const mergedDefaultStyle = {};
    for (const [selector, {
      defaultStyle
    }] of Object.entries(pseudoStylesBySelector)) {
      if (NATIVE_PSEUDO_SELECTORS.has(selector)) {
        Object.assign(mergedDefaultStyle, defaultStyle);
      }
    }
    const builtDefaultStyle = this.propsBuilder.build(mergedDefaultStyle, {
      includeUnprocessed: true
    });
    nullifyUndefinedValues(builtDefaultStyle);
    const selectors = [];
    for (const [selector, {
      selectorStyle
    }] of Object.entries(pseudoStylesBySelector)) {
      if (!NATIVE_PSEUDO_SELECTORS.has(selector)) {
        if (__DEV__) {
          logger.warn(`Pseudo selector "${selector}" is not supported on native and will be ignored.`);
        }
        continue;
      }
      selectors.push(this.buildPseudoStyleEntry(selector, selectorStyle, builtDefaultStyle, normalizedTransition));
    }
    if (selectors.length > 0) {
      registerPseudoStyles(this.shadowNodeWrapper, {
        defaultStyle: builtDefaultStyle,
        selectors
      });
      this.isRegistered = true;
    }
  }
  unmountCleanup() {
    if (this.isRegistered) {
      this.detach();
    }
    this.prevPseudoStylesBySelector = null;
    this.prevTransitionProperties = null;
  }
  detach() {
    unregisterPseudoStyles(this.viewTag);
    this.isRegistered = false;
  }
  buildPseudoStyleEntry(selector, selectorStyle, mergedDefaultStyle, normalizedTransition) {
    const builtSelectorStyle = this.propsBuilder.build(selectorStyle, {
      includeUnprocessed: true
    });
    nullifyUndefinedValues(builtSelectorStyle);
    const transition = {};
    for (const prop of Object.keys(builtSelectorStyle)) {
      const settings = getPropertyTransitionSettings(prop, normalizedTransition);
      transition[prop] = {
        value: [mergedDefaultStyle[prop], builtSelectorStyle[prop]],
        duration: settings?.duration ?? 0,
        delay: settings?.delay ?? 0,
        timingFunction: settings?.timingFunction ?? 'ease',
        allowDiscrete: settings?.allowDiscrete ?? false
      };
    }
    return {
      selector,
      selectorStyle: builtSelectorStyle,
      transition
    };
  }
}
function nullifyUndefinedValues(style) {
  for (const key in style) {
    if (style[key] === undefined) {
      style[key] = null;
    }
  }
}
function getPropertyTransitionSettings(prop, normalized) {
  if (!normalized) {
    return null;
  }
  if (normalized.specificProperties && !normalized.specificProperties.has(prop)) {
    return null;
  }
  return normalized.settings[prop] ?? normalized.settings.all ?? null;
}
//# sourceMappingURL=CSSPseudoStylesManager.js.map