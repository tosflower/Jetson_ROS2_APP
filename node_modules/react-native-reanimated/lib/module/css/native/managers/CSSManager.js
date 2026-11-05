'use strict';

import { getCompoundComponentName, getPropsBuilder, IS_ANDROID } from "../../../common/index.js";
import { filterCSSAndStyleProperties, splitCSSCallbacks } from "../../utils/index.js";
import { setViewStyle } from "../proxy.js";
import CSSAnimationsManager from "./CSSAnimationsManager.js";
import CSSCallbacksManager from "./CSSCallbacksManager.js";
import CSSPseudoStylesManager from "./CSSPseudoStylesManager.js";
import CSSTransitionsManager from "./CSSTransitionsManager.js";
export default class CSSManager {
  cssCallbacksManager = null;
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
    this.cssPseudoStylesManager = new CSSPseudoStylesManager(wrapper, tag, this.propsBuilder, compoundComponentName);
  }
  update(style, props = {}) {
    const [animationProperties, transitionProperties, pseudoStylesBySelector, filteredStyle] = filterCSSAndStyleProperties(style);
    const hasAnimation = animationProperties !== null;
    const hasTransition = transitionProperties !== null;
    const hadAttachedAnimations = this.cssAnimationsManager.hasAttachedAnimations();
    const [animationCallbacks, transitionCallbacks] = splitCSSCallbacks(props);

    // Synced before either manager runs so a cancel emitted while detaching
    // still reaches the user.
    const {
      animationEventMask,
      transitionEventMask
    } = this.syncCallbacks(animationCallbacks, transitionCallbacks);
    const normalizedStyle = hasAnimation || hasTransition || hadAttachedAnimations || IS_ANDROID && this.hadTransitionLastUpdate ? this.propsBuilder.build(filteredStyle) : undefined;
    const transitionDetached = this.cssTransitionsManager.update(transitionProperties, normalizedStyle, transitionEventMask);

    // Record the committed style as the base so animations (including one
    // detached by this update) and, on Android, a property that leaves a
    // transition or a detaching transition revert to it instead of stale
    // values or interpolator defaults.
    if (normalizedStyle && (hasAnimation || hadAttachedAnimations || IS_ANDROID && (hasTransition || transitionDetached))) {
      setViewStyle(this.viewTag, normalizedStyle);
    }
    this.cssAnimationsManager.update(animationProperties, animationEventMask);
    this.cssPseudoStylesManager.update(pseudoStylesBySelector, transitionProperties);
    this.hadTransitionLastUpdate = hasTransition;
  }
  unmountCleanup() {
    this.cssCallbacksManager?.retire();
    this.cssAnimationsManager.unmountCleanup();
    this.cssTransitionsManager.unmountCleanup();
    this.cssPseudoStylesManager.unmountCleanup();
  }
  syncCallbacks(animationCallbacks, transitionCallbacks) {
    if (!this.cssCallbacksManager) {
      if (!animationCallbacks && !transitionCallbacks) {
        return {
          animationEventMask: 0,
          transitionEventMask: 0
        };
      }
      this.cssCallbacksManager = new CSSCallbacksManager(this.viewTag);
    }
    this.cssCallbacksManager.syncAnimationCallbacks(animationCallbacks);
    this.cssCallbacksManager.syncTransitionCallbacks(transitionCallbacks);
    return {
      animationEventMask: this.cssCallbacksManager.getAnimationEventMask(),
      transitionEventMask: this.cssCallbacksManager.getTransitionEventMask()
    };
  }
}
//# sourceMappingURL=CSSManager.js.map