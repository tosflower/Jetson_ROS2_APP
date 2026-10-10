'use strict';

import { getCompoundComponentName, getPropsBuilder, IS_ANDROID } from "../../../common/index.js";
import { filterCSSAndStyleProperties } from "../../utils/index.js";
import { setViewStyle } from "../proxy.js";
import CSSAnimationsManager from "./CSSAnimationsManager.js";
import CSSPseudoStylesManager from "./CSSPseudoStylesManager.js";
import CSSTransitionsManager from "./CSSTransitionsManager.js";
export default class CSSManager {
  /**
   * True if the previous update had CSS transition props attached. On the next
   * update we still need to build `normalizedStyle` only on Android to revert
   * props applied during the transition to correct current values. (fixes
   * https://github.com/software-mansion/react-native-reanimated/issues/9218).
   */
  hadTransitionLastUpdate = false;
  constructor({
    shadowNodeWrapper,
    viewTag,
    reactViewName = 'RCTView'
  }, componentDisplayName = '') {
    const tag = this.viewTag = viewTag;
    const wrapper = shadowNodeWrapper;
    const compoundComponentName = getCompoundComponentName(reactViewName, componentDisplayName);
    this.propsBuilder = getPropsBuilder(compoundComponentName);
    this.cssAnimationsManager = new CSSAnimationsManager(wrapper, tag, compoundComponentName);
    this.cssTransitionsManager = new CSSTransitionsManager(wrapper, tag);
    this.cssPseudoStylesManager = new CSSPseudoStylesManager(wrapper, tag, this.propsBuilder);
  }
  update(style) {
    const [animationProperties, transitionProperties, pseudoStylesBySelector,, filteredStyle] = filterCSSAndStyleProperties(style);
    const hasAnimation = animationProperties !== null;
    const hasTransition = transitionProperties !== null;
    const normalizedStyle = hasAnimation || hasTransition || IS_ANDROID && this.hadTransitionLastUpdate ? this.propsBuilder.build(filteredStyle) : undefined;
    const transitionDetached = this.cssTransitionsManager.update(transitionProperties, normalizedStyle ?? {});

    // Record the committed style as the base so animations and (on Android) a
    // detaching transition can revert to it instead of interpolator defaults.
    if (normalizedStyle && (hasAnimation || IS_ANDROID && transitionDetached)) {
      setViewStyle(this.viewTag, normalizedStyle);
    }
    this.cssAnimationsManager.update(animationProperties);
    this.cssPseudoStylesManager.update(pseudoStylesBySelector, transitionProperties);
    this.hadTransitionLastUpdate = hasTransition;
  }
  unmountCleanup() {
    this.cssAnimationsManager.unmountCleanup();
    this.cssTransitionsManager.unmountCleanup();
    this.cssPseudoStylesManager.unmountCleanup();
  }
}
//# sourceMappingURL=CSSManager.js.map