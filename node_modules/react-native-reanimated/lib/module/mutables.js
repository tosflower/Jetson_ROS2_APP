'use strict';

import { IS_JEST } from "./common/index.js";
import { checkInvalidReadDuringRender, checkInvalidWriteDuringRender } from "./mutablesCommon.js";
import { valueSetter } from "./valueSetter.js";
function mutableToJSON(value) {
  return JSON.stringify(value);
}
export function makeMutable(initial) {
  let value = initial;
  const listeners = new Map();
  const mutable = {
    get value() {
      checkInvalidReadDuringRender();
      return value;
    },
    set value(newValue) {
      checkInvalidWriteDuringRender();
      valueSetter(mutable, newValue);
    },
    get() {
      return mutable.value;
    },
    set(newValue) {
      if (typeof newValue === 'function' && !newValue.__isAnimationDefinition) {
        mutable.value = newValue(mutable.value);
      } else {
        mutable.value = newValue;
      }
    },
    get _value() {
      return value;
    },
    set _value(newValue) {
      value = newValue;
      listeners.forEach(listener => {
        listener(newValue);
      });
    },
    modify: (modifier, forceUpdate = true) => {
      valueSetter(mutable, modifier !== undefined ? modifier(mutable.value) : mutable.value, forceUpdate);
    },
    addListener: (id, listener) => {
      listeners.set(id, listener);
    },
    removeListener: id => {
      listeners.delete(id);
    },
    setDirtyFlag: () => undefined,
    _isReanimatedSharedValue: true
  };

  // Hide `_value` from accidental enumeration.
  Object.defineProperties(mutable, {
    _value: {
      configurable: false,
      enumerable: false
    },
    get: {
      configurable: false,
      enumerable: false,
      writable: false
    },
    set: {
      configurable: false,
      enumerable: false,
      writable: false
    }
  });
  if (IS_JEST) {
    mutable.toJSON = () => mutableToJSON(value);
  }
  return mutable;
}
//# sourceMappingURL=mutables.js.map