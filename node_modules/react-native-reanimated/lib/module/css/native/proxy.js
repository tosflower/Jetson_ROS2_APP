'use strict';

import { ReanimatedModule } from '../../ReanimatedModule';
// COMMON

export function setViewStyle(viewTag, style) {
  ReanimatedModule.setViewStyle(viewTag, style);
}
export function markNodeAsRemovable(shadowNodeWrapper) {
  ReanimatedModule.markNodeAsRemovable(shadowNodeWrapper);
}
export function unmarkNodeAsRemovable(viewTag) {
  ReanimatedModule.unmarkNodeAsRemovable(viewTag);
}

// ANIMATIONS

// Keyframes

export function registerCSSKeyframes(animationName, compoundComponentName, keyframesConfig) {
  ReanimatedModule.registerCSSKeyframes(animationName, compoundComponentName, keyframesConfig);
}
export function unregisterCSSKeyframes(animationName, compoundComponentName) {
  ReanimatedModule.unregisterCSSKeyframes(animationName, compoundComponentName);
}

// View animations

export function applyCSSAnimations(shadowNodeWrapper, compoundComponentName, animationUpdates) {
  ReanimatedModule.applyCSSAnimations(shadowNodeWrapper, compoundComponentName, animationUpdates);
}
export function unregisterCSSAnimations(viewTag) {
  ReanimatedModule.unregisterCSSAnimations(viewTag);
}

// TRANSITIONS

export function runCSSTransition(shadowNodeWrapper, transitionConfig) {
  ReanimatedModule.runCSSTransition(shadowNodeWrapper, transitionConfig);
}
export function unregisterCSSTransition(viewTag) {
  ReanimatedModule.unregisterCSSTransition(viewTag);
}
export function registerPseudoStyles(shadowNodeWrapper, config) {
  ReanimatedModule.registerPseudoStyles(shadowNodeWrapper, config);
}
export function unregisterPseudoStyles(viewTag) {
  ReanimatedModule.unregisterPseudoStyles(viewTag);
}
//# sourceMappingURL=proxy.js.map