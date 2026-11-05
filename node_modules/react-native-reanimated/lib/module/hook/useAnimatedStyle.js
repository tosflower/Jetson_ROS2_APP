'use strict';

import { useEffect, useRef } from 'react';
import { isWorkletFunction, makeShareable } from 'react-native-worklets';
import { initialUpdaterRun } from "../animation/index.js";
import { IS_JEST } from "../common/index.js";
import { startMapper, stopMapper } from "../core.js";
import { updateProps } from "../updateProps/index.js";
import { makeViewDescriptorsSet } from "../ViewDescriptorsSet.js";
import { buildWorkletsHash, checkSharedValueUsage, createAnimatedStyleHandle, prepareAnimation, runAnimations, styleUpdater } from "./useAnimatedStyleCommon.js";
import { useSharedValue } from "./useSharedValue.js";
import { isAnimated, shallowEqual, validateAnimatedStyles } from "./utils.js";
const updatePropsJestWrapper = IS_JEST ? (viewDescriptors, updates, animatedValues, adapters) => {
  adapters.forEach(adapter => {
    adapter(updates);
  });
  animatedValues.current.value = {
    ...animatedValues.current.value,
    ...updates
  };
  updateProps(viewDescriptors, updates);
} : undefined;
function jestStyleUpdater(viewDescriptors,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
updater, state, animationsActive,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
animatedValues, adapters, forceUpdate) {
  'worklet';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const animations = state.animations ?? {};
  const newValues = updater() ?? {};
  const oldValues = state.last;

  // extract animated props
  let hasAnimations = false;
  let frameTimestamp;
  Object.keys(animations).forEach(key => {
    const value = newValues[key];
    if (!isAnimated(value)) {
      delete animations[key];
    }
  });
  Object.keys(newValues).forEach(key => {
    const value = newValues[key];
    if (isAnimated(value)) {
      frameTimestamp = global.__frameTimestamp || global._getAnimationTimestamp();
      prepareAnimation(frameTimestamp, value, animations[key], oldValues[key]);
      animations[key] = value;
      hasAnimations = true;
    }
  });
  function frame(timestamp) {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const {
      animations,
      last,
      isAnimationCancelled
    } = state;
    if (isAnimationCancelled) {
      state.isAnimationRunning = false;
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates = {};
    let allFinished = true;
    Object.keys(animations).forEach(propName => {
      const finished = runAnimations(animations[propName], timestamp, propName, updates, animationsActive);
      if (finished) {
        last[propName] = updates[propName];
        delete animations[propName];
      } else {
        allFinished = false;
      }
    });
    if (Object.keys(updates).length) {
      updatePropsJestWrapper?.(viewDescriptors, updates, animatedValues, adapters);
    }
    if (!allFinished) {
      requestAnimationFrame(frame);
    } else {
      state.isAnimationRunning = false;
    }
  }
  if (hasAnimations) {
    state.animations = animations;
    if (!state.isAnimationRunning) {
      state.isAnimationCancelled = false;
      state.isAnimationRunning = true;
      frame(frameTimestamp);
    }
  } else {
    state.isAnimationCancelled = true;
    state.animations = [];
  }

  // calculate diff
  state.last = newValues;
  if (!shallowEqual(oldValues, newValues) || forceUpdate) {
    updatePropsJestWrapper?.(viewDescriptors, newValues, animatedValues, adapters);
  }
}
function animatedStyleHandleToJSON() {
  return '{}';
}

/**
 * Lets you create a styles object, similar to StyleSheet styles, which can be
 * animated using shared values.
 *
 * @param updater - A function returning an object with style properties you
 *   want to animate.
 * @param dependencies - An optional array of dependencies. Only relevant when
 *   using Reanimated without the Babel plugin on the Web.
 * @returns An animated style object which has to be passed to the `style`
 *   property of an Animated component you want to animate.
 * @see https://docs.swmansion.com/react-native-reanimated/docs/core/useAnimatedStyle
 */
// @ts-expect-error Public type definition which strips internals.

export function useAnimatedStyle(updater, dependencies, adapters, isAnimatedProps = false) {
  const animatedUpdaterData = useRef(null);
  let inputs = updater.__closure ?? [];
  if (!inputs.length && dependencies?.length) {
    // let web work without a Babel plugin
    inputs = dependencies;
  }
  if (__DEV__ && !inputs.length && !dependencies && !isWorkletFunction(updater)) {
    throw new Error(`[Reanimated] \`useAnimatedStyle\` was used without a dependency array or Babel plugin. Please explicitly pass a dependency array, or enable the Babel plugin.
For more, see the docs: \`https://docs.swmansion.com/react-native-reanimated/docs/guides/web-support#web-without-the-babel-plugin\`.`);
  }
  const adaptersArray = adapters ? Array.isArray(adapters) ? adapters : [adapters] : [];
  const adaptersHash = adapters ? buildWorkletsHash(adaptersArray) : null;
  const areAnimationsActive = useSharedValue(true);
  const jestAnimatedValues = useRef({});

  // build dependencies
  if (!dependencies) {
    dependencies = [...inputs, updater.__workletHash];
  } else {
    dependencies = [...dependencies, updater.__workletHash];
  }
  if (adaptersHash) {
    dependencies.push(adaptersHash);
  }
  if (!animatedUpdaterData.current) {
    const initialStyle = initialUpdaterRun(updater);
    if (__DEV__) {
      validateAnimatedStyles(initialStyle);
    }
    animatedUpdaterData.current = {
      initial: {
        value: initialStyle,
        updater
      },
      remoteState: makeShareable({
        last: initialStyle,
        animations: {},
        isAnimationCancelled: false,
        isAnimationRunning: false
      }),
      viewDescriptors: makeViewDescriptorsSet(),
      styleUpdaterContainer: {
        current: undefined
      }
    };
  }
  const {
    initial,
    remoteState,
    viewDescriptors
  } = animatedUpdaterData.current;
  const shareableViewDescriptors = viewDescriptors.shareableViewDescriptors;
  dependencies.push(shareableViewDescriptors);
  useEffect(() => {
    let fun;
    let updaterFn = updater;
    if (adapters) {
      updaterFn = () => {
        'worklet';

        const newValues = updater();
        adaptersArray.forEach(adapter => {
          adapter(newValues);
        });
        return newValues;
      };
    }
    if (IS_JEST) {
      fun = forceUpdate => {
        'worklet';

        jestStyleUpdater(shareableViewDescriptors, updater, remoteState, areAnimationsActive, jestAnimatedValues, adaptersArray, forceUpdate);
      };
    } else {
      fun = forceUpdate => {
        'worklet';

        styleUpdater(shareableViewDescriptors, updaterFn, remoteState, areAnimationsActive, isAnimatedProps, forceUpdate);
      };
    }
    if (animatedUpdaterData.current) {
      animatedUpdaterData.current.styleUpdaterContainer.current = fun;
    }
    const mapperId = startMapper(fun, inputs);
    return () => {
      stopMapper(mapperId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
  useEffect(() => {
    areAnimationsActive.value = true;
    return () => {
      areAnimationsActive.value = false;
    };
  }, [areAnimationsActive]);
  if (__DEV__) {
    checkSharedValueUsage(initial.value);
  }
  const animatedStyleHandle = useRef(null);
  if (!animatedStyleHandle.current) {
    const styleUpdaterContainer = animatedUpdaterData.current.styleUpdaterContainer;
    animatedStyleHandle.current = createAnimatedStyleHandle(IS_JEST ? {
      viewDescriptors,
      initial,
      jestAnimatedValues,
      toJSON: animatedStyleHandleToJSON
    } : {
      viewDescriptors,
      initial
    }, styleUpdaterContainer);
  }
  return animatedStyleHandle.current;
}
//# sourceMappingURL=useAnimatedStyle.js.map