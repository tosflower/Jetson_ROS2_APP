'use strict';

import { deepEqual } from "../../utils/index.js";
import { normalizeCSSTransitionProperties } from "../normalization/index.js";
import { runCSSTransition, unregisterCSSTransition } from "../proxy.js";
export default class CSSTransitionsManager {
  // All props from the previous update
  prevProps = null;
  // Stores all properties for which transition was triggered before
  // and which haven't been cleaned up yet (null if no transition was attached before)
  propsWithTransitions = new Set();
  // Indicates whether a CSS transition is currently attached to the view
  hasTransition = false;
  constructor(shadowNodeWrapper, viewTag) {
    this.viewTag = viewTag;
    this.shadowNodeWrapper = shadowNodeWrapper;
  }

  /**
   * @returns Whether this update detached a running transition (its props were
   *   removed, or normalized to an empty config, e.g. when duration is 0).
   */
  update(transitionProperties, nextProps = {}) {
    const transitionConfig = transitionProperties && normalizeCSSTransitionProperties(transitionProperties);
    const prevProps = this.prevProps;
    this.prevProps = nextProps;

    // If there were no previous props, the view is just mounted so we
    // don't trigger any transitions yet. Also, when there is no transition
    // config, we don't trigger any transitions.
    if (!prevProps || !transitionConfig) {
      if (this.hasTransition) {
        this.detach();
        return true;
      }
      return false;
    }

    // Trigger transition for changed properties only
    const config = this.processTransitionConfig(prevProps, nextProps, transitionConfig);
    if (Object.keys(config).length) {
      runCSSTransition(this.shadowNodeWrapper, config);
      this.hasTransition = true;
    }
    return false;
  }
  unmountCleanup() {
    // noop
  }
  detach() {
    unregisterCSSTransition(this.viewTag);
    this.propsWithTransitions.clear();
    this.hasTransition = false;
  }
  processTransitionConfig(oldProps, newProps, newTransitionConfig) {
    const result = {};
    const specificProperties = newTransitionConfig.specificProperties;
    const isAllowedProperty = property => !specificProperties || specificProperties.has(property);
    const getPropertySettings = property => newTransitionConfig.settings[property] ?? newTransitionConfig.settings.all;
    const triggerTransition = property => {
      result[property] = {
        ...getPropertySettings(property),
        value: [oldProps[property], newProps[property]]
      };
      this.propsWithTransitions.add(property);
    };

    // Get property changes which we want to trigger transitions for
    for (const key in newProps) {
      if (isAllowedProperty(key) && !deepEqual(newProps[key], oldProps[key])) {
        triggerTransition(key);
      }
    }

    // Handle old props; for no longer allowed ones, cancel the transition
    // immediately; for ones that are allowed but were removed, trigger a transition
    // to undefined (to the default value for the property).
    for (const key in oldProps) {
      if (!isAllowedProperty(key)) {
        if (this.propsWithTransitions.has(key)) {
          // If a property was transitioned before but is no longer allowed,
          // we need to clear it up immediately
          result[key] = null;
          this.propsWithTransitions.delete(key);
        }
      } else if (!(key in newProps)) {
        // Property was removed from props but is still allowed
        triggerTransition(key);
      }
    }
    return result;
  }
}
//# sourceMappingURL=CSSTransitionsManager.js.map