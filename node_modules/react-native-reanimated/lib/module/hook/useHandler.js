'use strict';

import { useEffect, useRef } from 'react';
import { isWorkletFunction, makeShareable } from 'react-native-worklets';
import { areDependenciesEqual, areWorkletHandlersEqual, ensureWorkletHandlers } from "./useHandlerCommon.js";
function isBabelPluginEnabled(handlers) {
  const handlerFunctions = Object.values(handlers);
  // If there is no function provided, we assume that the Babel plugin is enabled.
  return handlerFunctions.length === 0 || handlerFunctions.some(isWorkletFunction);
}

/**
 * Lets you find out whether the event handler dependencies have changed.
 *
 * @param handlers - An object of event handlers.
 * @param dependencies - An optional array of dependencies. Only relevant when
 *   using Reanimated without the Babel plugin on the Web.
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