'use strict';

import { camelizeKebabCase, kebabizeCamelCase } from "../../../common/index.js";
import { normalizeCSSTransitionProperties } from "../normalization/index.js";
import { maybeAddSuffixes, parseTimingFunction } from "../utils.js";
const TRANSITION_EVENT_NAME = {
  onTransitionRun: 'transitionrun',
  onTransitionStart: 'transitionstart',
  onTransitionEnd: 'transitionend',
  onTransitionCancel: 'transitioncancel'
};
const CALLBACK_PROPS = Object.keys(TRANSITION_EVENT_NAME);
export default class CSSTransitionsManager {
  isAttached = false;
  callbacks = {};
  attachedStateListeners = new Map();
  constructor(element) {
    this.element = element;
  }
  update(transitionProperties, callbacks = null) {
    // Keep listeners tied to callback presence (not transition presence) so a
    // `transitioncancel` emitted while detaching still reaches the user.
    this.syncStateListeners(callbacks ?? {});
    if (!transitionProperties) {
      this.detach();
      return;
    }
    this.setElementTransition(transitionProperties);
    this.isAttached = true;
  }
  unmountCleanup() {
    this.syncStateListeners({});
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
  syncStateListeners(callbacks) {
    this.callbacks = callbacks;
    for (const prop of CALLBACK_PROPS) {
      const eventName = TRANSITION_EVENT_NAME[prop];
      const hasCallback = typeof callbacks[prop] === 'function';
      const listener = this.attachedStateListeners.get(prop);
      if (hasCallback && !listener) {
        const newListener = this.createStateListener(prop);
        this.attachedStateListeners.set(prop, newListener);
        this.element.addEventListener(eventName, newListener);
      } else if (!hasCallback && listener) {
        this.element.removeEventListener(eventName, listener);
        this.attachedStateListeners.delete(prop);
      }
    }
  }
  createStateListener(prop) {
    return event => {
      const transitionEvent = event;
      // Transition events bubble; only handle this element's own transitions.
      if (transitionEvent.target !== this.element) {
        return;
      }
      const payload = {
        propertyName: camelizeKebabCase(transitionEvent.propertyName),
        elapsedTime: transitionEvent.elapsedTime
      };
      this.callbacks[prop]?.(payload);
    };
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