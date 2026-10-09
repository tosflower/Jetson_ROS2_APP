'use strict';

import { useEffect, useRef } from 'react';
import { isWorkletFunction, makeShareable } from 'react-native-worklets';
import { IS_WEB } from "../common/index.js";
function isBabelPluginEnabled(handlers) {
  if (!IS_WEB) {
    // Babel plugin must be enabled in all non-web environments.
    return true;
  }
  const handlerFunctions = Object.values(handlers);
  // If there is no function provided, we assume that the Babel plugin is enabled.
  return handlerFunctions.length === 0 || handlerFunctions.some(isWorkletFunction);
}
function ensureWorkletHandlers(handlers) {
  const nonWorkletNames = Object.entries(handlers).reduce((acc, [name, handler]) => {
    if (!isWorkletFunction(handler)) acc.push(name);
    return acc;
  }, []);
  if (nonWorkletNames.length > 0) {
    throw new Error(`[Reanimated] Passed handlers that are not worklets. Only worklet functions are allowed. Handlers "${nonWorkletNames.join(', ')}" are not worklets.`);
  }
}
const objectIs = typeof Object.is === 'function' ? Object.is : (x, y) => x === y && (x !== 0 || 1 / x === 1 / y) || Number.isNaN(x) && Number.isNaN(y);
function areWorkletClosuresEqual(next, prev) {
  const nextKeys = Object.keys(next);
  const prevKeys = Object.keys(prev);
  return prevKeys.length === nextKeys.length && prevKeys.every(key => key in next && objectIs(next[key], prev[key]));
}
function areWorkletsEqual(next, prev) {
  if (objectIs(next, prev)) {
    return true;
  }
  return next.__workletHash === prev.__workletHash && areWorkletClosuresEqual(next.__closure, prev.__closure);
}
function areWorkletHandlersEqual(next, prev) {
  if (!next || !prev) {
    return false;
  }
  const nextKeys = Object.keys(next);
  const prevKeys = Object.keys(prev);
  if (nextKeys.length !== prevKeys.length) {
    return false;
  }
  return nextKeys.every(key => {
    const nextValue = next[key];
    const prevValue = prev[key];
    if (!nextValue || !prevValue) {
      return false;
    }
    return areWorkletsEqual(nextValue, prevValue);
  });
}
function areDependenciesEqual(next, prev) {
  if (!next || !prev || next.length !== prev.length) {
    return false;
  }
  return next.every((value, index) => objectIs(value, prev[index]));
}

/**
 * Lets you find out whether the event handler dependencies have changed.
 *
 * @param handlers - An object of event handlers.
 * @param dependencies - An optional array of dependencies.
 * @returns An object containing a boolean indicating whether the dependencies
 *   have changed.
 * @see https://docs.swmansion.com/react-native-reanimated/docs/advanced/useHandler
 */
export function useHandler(handlers, dependencies) {
  'use no memo';

  const stateRef = useRef(null);
  if (stateRef.current === null) {
    stateRef.current = {
      context: undefined,
      prevHandlers: undefined,
      prevDependencies: []
    };
  }
  const state = stateRef.current;
  let doDependenciesDiffer = true;
  if (isBabelPluginEnabled(handlers)) {
    if (__DEV__) {
      ensureWorkletHandlers(handlers);
    }
    doDependenciesDiffer = !areWorkletHandlersEqual(handlers, state.prevHandlers);
  } else if (dependencies) {
    doDependenciesDiffer = !areDependenciesEqual(dependencies, state.prevDependencies);
  }

  // Write after commit to avoid corruption from interrupted renders (in case of concurrent mode).
  useEffect(() => {
    state.prevHandlers = handlers;
    state.prevDependencies = dependencies;
  });
  return {
    get context() {
      if (state.context === undefined) {
        state.context = makeShareable({});
      }
      return state.context;
    },
    doDependenciesDiffer
  };
}
//# sourceMappingURL=useHandler.js.map