'use strict';

import { camelizeKebabCase, kebabizeCamelCase } from "../../../common/index.js";
import { normalizeCSSTransitionProperties } from "../normalization/index.js";
import { maybeAddSuffixes, parseTimingFunction } from "../utils.js";
import { CSSCallbackListeners } from "./CSSCallbackListeners.js";
const TRANSITION_EVENT_NAME = {
  onCSSTransitionRun: 'transitionrun',
  onCSSTransitionStart: 'transitionstart',
  onCSSTransitionEnd: 'transitionend',
  onCSSTransitionCancel: 'transitioncancel'
};
export default class CSSTransitionsManager {
  isAttached = false;
  constructor(element) {
    this.element = element;
    this.callbackListeners = new CSSCallbackListeners(element, TRANSITION_EVENT_NAME, event => {
      const transitionEvent = event;
      return {
        propertyName: camelizeKebabCase(transitionEvent.propertyName),
        elapsedTime: transitionEvent.elapsedTime
      };
    });
  }
  update(transitionProperties, callbacks = null) {
    // Keep listeners tied to callback presence (not transition presence) so a
    // `transitioncancel` emitted while detaching still reaches the user.
    this.callbackListeners.sync(callbacks ?? {});
    if (!transitionProperties) {
      this.detach();
      return;
    }
    this.setElementTransition(transitionProperties);
    this.isAttached = true;
  }
  unmountCleanup() {
    this.callbackListeners.detach();
  }
  detach() {
    if (!this.isAttached) {
      return;
    }
    this.element.style.transition = '';
    this.element.style.transitionProperty = '';
    this.element.style.transitionDuration = '';
    this.element.style.transitionDelay = '';
    this.element.style.transitionTimingFunction = '';
    // @ts-ignore this is correct
    this.element.style.transitionBehavior = '';
    this.isAttached = false;
  }
  setElementTransition(transitionProperties) {
    const normalizedProps = normalizeCSSTransitionProperties(transitionProperties);
    this.element.style.transitionProperty = normalizedProps.transitionProperty.map(kebabizeCamelCase).join(',');
    this.element.style.transitionDuration = maybeAddSuffixes(normalizedProps, 'transitionDuration', 'ms').join(',');
    this.element.style.transitionDelay = maybeAddSuffixes(normalizedProps, 'transitionDelay', 'ms').join(',');
    this.element.style.transitionTimingFunction = parseTimingFunction(normalizedProps.transitionTimingFunction);

    // @ts-ignore this is correct
    this.element.style.transitionBehavior = normalizedProps.transitionBehavior.map(kebabizeCamelCase).join(',');
  }
}
//# sourceMappingURL=CSSTransitionsManager.js.map