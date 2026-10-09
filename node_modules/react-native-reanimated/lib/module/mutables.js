'use strict';

import { createShareable, createSynchronizable, runOnUISync, scheduleOnUI, UIRuntimeId } from 'react-native-worklets';
import { IS_JEST, logger, SHOULD_BE_USE_WEB } from "./common/index.js";
import { getStaticFeatureFlag } from "./featureFlags/index.js";
import { isFirstReactRender, isReactRendering } from "./reactUtils.js";
import { valueSetter } from "./valueSetter.js";
function shouldWarnAboutAccessDuringRender() {
  return __DEV__ && isReactRendering() && !isFirstReactRender();
}
function checkInvalidReadDuringRender() {
  if (shouldWarnAboutAccessDuringRender()) {
    logger.warn("Reading from `value` during component render. Please ensure that you don't access the `value` property nor use `get` method of a shared value while React is rendering a component.", {
      strict: true
    });
  }
}
function checkInvalidWriteDuringRender() {
  if (shouldWarnAboutAccessDuringRender()) {
    logger.warn("Writing to `value` during component render. Please ensure that you don't access the `value` property nor use `set` method of a shared value while React is rendering a component.", {
      strict: true
    });
  }
}
/**
 * Adds `get` and `set` methods to the mutable object to handle access to
 * `value` property.
 *
 * React Compiler disallows modifying return values of hooks. Even though
 * assignment to `value` is a setter invocation, Compiler's static analysis
 * doesn't detect it. That's why we provide a second API for users using the
 * Compiler.
 */
function addCompilerSafeGetAndSet(mutable) {
  'worklet';

  Object.defineProperties(mutable, {
    get: {
      value() {
        return mutable.value;
      },
      configurable: false,
      enumerable: false
    },
    set: {
      value(newValue) {
        if (typeof newValue === 'function' &&
        // If we have an animation definition, we don't want to call it here.
        !newValue.__isAnimationDefinition) {
          mutable.value = newValue(mutable.value);
        } else {
          mutable.value = newValue;
        }
      },
      configurable: false,
      enumerable: false
    }
  });
}
function mutableHostDecorator(mutable, dirtyFlag) {
  'worklet';

  const listeners = new Map();
  let value = mutable.value;
  let isDirty = false;
  Object.defineProperties(mutable, {
    value: {
      get() {
        return value;
      },
      set(newValue) {
        valueSetter(mutable, newValue);
      },
      enumerable: true,
      configurable: true
    },
    _value: {
      get() {
        return value;
      },
      set(newValue) {
        if (!isDirty) {
          this.setDirty(true);
        }
        value = newValue;
        listeners.forEach(listener => {
          listener(newValue);
        });
      }
    },
    modify: {
      value: (modifier, forceUpdate = true) => {
        valueSetter(mutable, modifier !== undefined ? modifier(value) : value, forceUpdate);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    addListener: {
      value: (id, listener) => {
        listeners.set(id, listener);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    removeListener: {
      value: id => {
        listeners.delete(id);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    setDirty: {
      value: dirty => {
        dirtyFlag?.setBlocking(dirty);
        isDirty = dirty;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _animation: {
      value: null,
      writable: true,
      enumerable: true,
      configurable: true
    },
    _isReanimatedSharedValue: {
      value: true,
      writable: true,
      enumerable: true,
      configurable: true
    }
  });
  addCompilerSafeGetAndSet(mutable);
  return mutable;
}
const USE_SYNCHRONIZABLE_FOR_MUTABLES = getStaticFeatureFlag('USE_SYNCHRONIZABLE_FOR_MUTABLES');
function mutableGuestDecorator(initial, mutable, dirtyFlag) {
  'worklet';

  let latest = initial;
  Object.defineProperties(mutable, {
    value: {
      get() {
        if (globalThis.__RUNTIME_KIND === 1) {
          checkInvalidReadDuringRender();
        }
        if (globalThis.__RUNTIME_KIND !== 1 || dirtyFlag === undefined) {
          latest = mutable.getSync();
        } else if (dirtyFlag.getBlocking()) {
          const uiValueGetter = svArg => runOnUISync(sv => {
            sv.setDirty?.(false);
            return sv.value;
          }, svArg);
          latest = uiValueGetter(mutable);
        }
        return latest;
      },
      set(newValue) {
        if (globalThis.__RUNTIME_KIND === 1) {
          checkInvalidWriteDuringRender();
          scheduleOnUI(() => {
            mutable.value = newValue;
          });
        } else {
          mutable.setAsync(newValue);
        }
      },
      enumerable: true,
      configurable: true
    },
    _value: {
      get() {
        throw new Error('[Reanimated] Reading from `_value` directly is only possible on the UI runtime. Perhaps you wanted to access `value` instead?');
      },
      set(_newValue) {
        throw new Error('[Reanimated] Setting `_value` directly is only possible on the UI runtime. Perhaps you wanted to assign to `value` instead?');
      }
    },
    modify: {
      value: (modifier, forceUpdate = true) => {
        scheduleOnUI(() => {
          mutable.modify(modifier, forceUpdate);
        });
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    addListener: {
      value: () => {
        throw new Error('[Reanimated] Adding listeners is only possible on the UI runtime.');
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    removeListener: {
      value: () => {
        throw new Error('[Reanimated] Removing listeners is only possible on the UI runtime.');
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _isReanimatedSharedValue: {
      value: true,
      writable: true,
      enumerable: true,
      configurable: true
    }
  });
  addCompilerSafeGetAndSet(mutable);
  return mutable;
}
function makeMutableWeb(initial) {
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
    _isReanimatedSharedValue: true
  };

  // Hide `_value` from accidental enumeration.
  Object.defineProperty(mutable, '_value', {
    configurable: false,
    enumerable: false
  });
  addCompilerSafeGetAndSet(mutable);
  if (IS_JEST) {
    mutable.toJSON = () => mutableToJSON(value);
  }
  return mutable;
}
function makeMutableNative(initial) {
  const dirtyFlag = USE_SYNCHRONIZABLE_FOR_MUTABLES ? createSynchronizable(false) : undefined;
  const shareable = createShareable(UIRuntimeId, initial, {
    hostDecorator: shareableHost => {
      'worklet';

      return mutableHostDecorator(shareableHost, dirtyFlag);
    },
    guestDecorator: shareableGuest => {
      'worklet';

      return mutableGuestDecorator(initial, shareableGuest, dirtyFlag);
    }
  });
  return shareable;
}
export const makeMutable = SHOULD_BE_USE_WEB ? makeMutableWeb : makeMutableNative;
function mutableToJSON(value) {
  return JSON.stringify(value);
}

/** @deprecated Used only in `animationsManager.ts`. Don't use. */
export function makeMutableUI(initial) {
  'worklet';

  const mutable = mutableHostDecorator({
    value: initial
  });
  return mutable;
}
//# sourceMappingURL=mutables.js.map