'use strict';

export function valueSetter(mutable, value, forceUpdate = false) {
  'worklet';

  const previousAnimation = mutable._animation;
  if (previousAnimation) {
    mutable._animation = null;
    if (!previousAnimation.finished) {
      previousAnimation.cancelled = true;
      previousAnimation.callback?.(false);
    }
  }
  if (typeof value === 'function' || value !== null && typeof value === 'object' &&
  // TODO TYPESCRIPT fix this after fixing AnimationObject type
  value.onFrame !== undefined && value.onStart !== undefined) {
    const animation = typeof value === 'function' ?
    // TODO TYPESCRIPT fix this after fixing AnimationObject type
    value() :
    // TODO TYPESCRIPT fix this after fixing AnimationObject type
    value;
    // prevent setting again to the same value
    // and triggering the mappers that treat this value as an input
    // this happens when the animation's target value(stored in animation.current until animation.onStart is called) is set to the same value as a current one(this._value)
    // built in animations that are not higher order(withTiming, withSpring) hold target value in .current
    if (mutable._value === animation.current && !animation.isHigherOrder && !forceUpdate) {
      animation.callback?.(true);
      return;
    }
    // animated set
    const initializeAnimation = timestamp => {
      animation.onStart(animation, mutable.value, timestamp, previousAnimation);
    };
    const currentTimestamp = global.__frameTimestamp || global._getAnimationTimestamp();
    initializeAnimation(currentTimestamp);
    const step = timestamp => {
      if (animation.cancelled) {
        return;
      }
      const finished = animation.onFrame(animation, timestamp);
      animation.timestamp = timestamp;
      mutable._value = animation.current;
      if (finished) {
        animation.finished = true;
        animation.callback?.(true /* finished */);
      } else {
        requestAnimationFrame(step);
      }
    };
    mutable._animation = animation;
    step(currentTimestamp);
  } else {
    // prevent setting again to the same value
    // and triggering the mappers that treat this value as an input
    if (mutable._value === value && !forceUpdate) {
      return;
    }
    mutable._value = value;
  }
}
//# sourceMappingURL=valueSetter.js.map