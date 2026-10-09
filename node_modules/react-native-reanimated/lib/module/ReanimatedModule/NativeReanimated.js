/* eslint-disable @typescript-eslint/no-empty-function */
'use strict';

import { getUIRuntimeHolder, getUISchedulerHolder } from 'react-native-worklets';
import { SHOULD_BE_USE_WEB } from "../common/index.js";
import { getShadowNodeWrapperFromRef } from '../fabricUtils';
import { checkCppVersion } from "../platform-specific/checkCppVersion.js";
import { jsVersion } from "../platform-specific/jsVersion.js";
import { assertWorkletsVersion } from "../platform-specific/workletsVersion.js";
import { ReanimatedTurboModule } from "../specs/index.js";
export function createNativeReanimatedModule() {
  return new NativeReanimatedModule();
}
function assertSingleReanimatedInstance() {
  if (global._REANIMATED_VERSION_JS !== undefined && global._REANIMATED_VERSION_JS !== jsVersion) {
    throw new Error(`[Reanimated] Another instance of Reanimated was detected.
See \`https://docs.swmansion.com/react-native-reanimated/docs/guides/troubleshooting#another-instance-of-reanimated-was-detected\` for more details. Previous: ${global._REANIMATED_VERSION_JS}, current: ${jsVersion}.`);
  }
}
class NativeReanimatedModule {
  /**
   * We keep the instance of `WorkletsModule` here to keep correct coupling of
   * the modules and initialization order.
   */
  #reanimatedModuleProxy;
  constructor() {
    // These checks have to split since version checking depend on the execution order
    if (__DEV__) {
      assertSingleReanimatedInstance();
      assertWorkletsVersion();
    }
    global._REANIMATED_VERSION_JS = jsVersion;
    if (ReanimatedTurboModule) {
      const status = installTurboModule();
      if (!status) {
        // This path means that React Native has failed on reload.
        // We don't want to throw any errors to not mislead the users
        // that the problem is related to Reanimated.
        // We install a DummyReanimatedModuleProxy instead.
        this.#reanimatedModuleProxy = new DummyReanimatedModuleProxy();
        return;
      }
    }
    if (global.__reanimatedModuleProxy === undefined) {
      throw new Error(`[Reanimated] Native part of Reanimated doesn't seem to be initialized.
See https://docs.swmansion.com/react-native-reanimated/docs/guides/troubleshooting#native-part-of-reanimated-doesnt-seem-to-be-initialized for more details.`);
    }
    if (__DEV__ && !globalThis.RN$Bridgeless && !SHOULD_BE_USE_WEB) {
      throw new Error('[Reanimated] Reanimated 4 supports only the React Native New Architecture and web.');
    }
    if (__DEV__) {
      checkCppVersion();
    }
    this.#reanimatedModuleProxy = global.__reanimatedModuleProxy;
  }
  registerSensor(sensorType, interval, iosReferenceFrame, handler) {
    return this.#reanimatedModuleProxy.registerSensor(sensorType, interval, iosReferenceFrame, handler);
  }
  unregisterSensor(sensorId) {
    return this.#reanimatedModuleProxy.unregisterSensor(sensorId);
  }
  registerEventHandler(eventHandler, eventName, emitterReactTag) {
    return this.#reanimatedModuleProxy.registerEventHandler(eventHandler, eventName, emitterReactTag);
  }
  unregisterEventHandler(id) {
    return this.#reanimatedModuleProxy.unregisterEventHandler(id);
  }
  getViewProp(viewTag, propName, component, callback) {
    const shadowNodeWrapper = getShadowNodeWrapperFromRef(component);
    return this.#reanimatedModuleProxy.getViewProp(shadowNodeWrapper, propName, callback);
  }
  configureLayoutAnimationBatch(layoutAnimationsBatch) {
    this.#reanimatedModuleProxy.configureLayoutAnimationBatch(layoutAnimationsBatch);
  }
  setShouldAnimateExitingForTag(viewTag, shouldAnimate) {
    this.#reanimatedModuleProxy.setShouldAnimateExitingForTag(viewTag, shouldAnimate);
  }
  getStaticFeatureFlag(name) {
    return this.#reanimatedModuleProxy.getStaticFeatureFlag(name);
  }
  setDynamicFeatureFlag(name, value) {
    this.#reanimatedModuleProxy.setDynamicFeatureFlag(name, value);
  }
  subscribeForKeyboardEvents(handler, isStatusBarTranslucent, isNavigationBarTranslucent) {
    return this.#reanimatedModuleProxy.subscribeForKeyboardEvents(handler, isStatusBarTranslucent, isNavigationBarTranslucent);
  }
  unsubscribeFromKeyboardEvents(listenerId) {
    this.#reanimatedModuleProxy.unsubscribeFromKeyboardEvents(listenerId);
  }
  setViewStyle(viewTag, style) {
    this.#reanimatedModuleProxy.setViewStyle(viewTag, style);
  }
  markNodeAsRemovable(shadowNodeWrapper) {
    this.#reanimatedModuleProxy.markNodeAsRemovable(shadowNodeWrapper);
  }
  unmarkNodeAsRemovable(viewTag) {
    this.#reanimatedModuleProxy.unmarkNodeAsRemovable(viewTag);
  }
  registerCSSKeyframes(animationName, compoundComponentName, keyframesConfig) {
    this.#reanimatedModuleProxy.registerCSSKeyframes(animationName, compoundComponentName, keyframesConfig);
  }
  unregisterCSSKeyframes(animationName, compoundComponentName) {
    this.#reanimatedModuleProxy.unregisterCSSKeyframes(animationName, compoundComponentName);
  }
  applyCSSAnimations(shadowNodeWrapper, compoundComponentName, animationUpdates) {
    this.#reanimatedModuleProxy.applyCSSAnimations(shadowNodeWrapper, compoundComponentName, animationUpdates);
  }
  unregisterCSSAnimations(viewTag) {
    this.#reanimatedModuleProxy.unregisterCSSAnimations(viewTag);
  }
  runCSSTransition(shadowNodeWrapper, transitionConfig) {
    this.#reanimatedModuleProxy.runCSSTransition(shadowNodeWrapper, transitionConfig);
  }
  unregisterCSSTransition(viewTag) {
    this.#reanimatedModuleProxy.unregisterCSSTransition(viewTag);
  }
  getSettledUpdates() {
    return this.#reanimatedModuleProxy.getSettledUpdates();
  }
  registerPseudoStyles(shadowNodeWrapper, config) {
    this.#reanimatedModuleProxy.registerPseudoStyles(shadowNodeWrapper, config);
  }
  unregisterPseudoStyles(viewTag) {
    this.#reanimatedModuleProxy.unregisterPseudoStyles(viewTag);
  }
}
class DummyReanimatedModuleProxy {
  configureLayoutAnimationBatch() {}
  setShouldAnimateExitingForTag() {}
  getStaticFeatureFlag() {
    return false;
  }
  setDynamicFeatureFlag() {}
  subscribeForKeyboardEvents() {
    return -1;
  }
  unsubscribeFromKeyboardEvents() {}
  setViewStyle() {}
  markNodeAsRemovable() {}
  unmarkNodeAsRemovable() {}
  registerCSSKeyframes() {}
  unregisterCSSKeyframes() {}
  applyCSSAnimations() {}
  registerCSSAnimations() {}
  updateCSSAnimations() {}
  unregisterCSSAnimations() {}
  runCSSTransition() {}
  unregisterCSSTransition() {}
  registerSensor() {
    return -1;
  }
  unregisterSensor() {}
  registerEventHandler() {
    return -1;
  }
  unregisterEventHandler() {}
  getViewProp() {
    return null;
  }
  getSettledUpdates() {
    return [];
  }
  registerPseudoStyles() {}
  unregisterPseudoStyles() {}
}
function installTurboModule() {
  if (globalThis.__reanimatedModuleProxy) {
    return true;
  }
  globalThis.__UI_WORKLET_RUNTIME_HOLDER = getUIRuntimeHolder();
  globalThis.__UI_SCHEDULER_HOLDER = getUISchedulerHolder();
  const status = ReanimatedTurboModule.installTurboModule();
  delete globalThis.__UI_WORKLET_RUNTIME_HOLDER;
  delete globalThis.__UI_SCHEDULER_HOLDER;
  return status;
}
//# sourceMappingURL=NativeReanimated.js.map