'use strict';

import { withSequence, withTiming } from "../../animation/index.js";
import { ComplexAnimationBuilder } from "../animationBuilder/index.js";
import { animateTransformToValues, pickTransformValues, resolveTransformSlot } from "./utils.js";
/**
 * Entry from right animation with change in skew and opacity. You can modify
 * the behavior by chaining methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `entering` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#lightspeed
 */
export class LightSpeedInRight extends ComplexAnimationBuilder {
  static presetName = 'LightSpeedInRight';
  static createInstance() {
    return new LightSpeedInRight();
  }
  build = () => {
    const delayFunction = this.getDelayFunction();
    const animationAndConfig = this.getAnimationAndConfig();
    const [animation, config] = animationAndConfig;
    const delay = this.getDelay();
    const duration = this.getDuration();
    const callback = this.callbackV;
    const initialValues = this.initialValues;
    const targetValues = this.targetValues;
    const {
      value: targetTranslateX
    } = resolveTransformSlot({
      translateX: 0
    }, 0, targetValues);
    const {
      value: targetSkewX
    } = resolveTransformSlot({
      skewX: '0deg'
    }, 1, targetValues);
    return values => {
      'worklet';

      return {
        animations: {
          opacity: delayFunction(delay, withTiming(targetValues?.opacity ?? 1, {
            duration
          })),
          transform: [{
            translateX: delayFunction(delay, animation(targetTranslateX, {
              ...config,
              duration: duration * 0.7
            }))
          }, {
            skewX: delayFunction(delay, withSequence(withTiming('10deg', {
              duration: duration * 0.7
            }), withTiming('-5deg', {
              duration: duration * 0.15
            }), withTiming(targetSkewX, {
              duration: duration * 0.15
            })))
          }]
        },
        initialValues: {
          opacity: initialValues?.opacity ?? 0,
          transform: pickTransformValues([{
            translateX: values.windowWidth
          }, {
            skewX: '-45deg'
          }], initialValues)
        },
        callback
      };
    };
  };
}

/**
 * Entry from left animation with change in skew and opacity. You can modify the
 * behavior by chaining methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `entering` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#lightspeed
 */
export class LightSpeedInLeft extends ComplexAnimationBuilder {
  static presetName = 'LightSpeedInLeft';
  static createInstance() {
    return new LightSpeedInLeft();
  }
  build = () => {
    const delayFunction = this.getDelayFunction();
    const animationAndConfig = this.getAnimationAndConfig();
    const [animation, config] = animationAndConfig;
    const delay = this.getDelay();
    const duration = this.getDuration();
    const callback = this.callbackV;
    const initialValues = this.initialValues;
    const targetValues = this.targetValues;
    const {
      value: targetTranslateX
    } = resolveTransformSlot({
      translateX: 0
    }, 0, targetValues);
    const {
      value: targetSkewX
    } = resolveTransformSlot({
      skewX: '0deg'
    }, 1, targetValues);
    return values => {
      'worklet';

      return {
        animations: {
          opacity: delayFunction(delay, withTiming(targetValues?.opacity ?? 1, {
            duration
          })),
          transform: [{
            translateX: delayFunction(delay, animation(targetTranslateX, {
              ...config,
              duration: duration * 0.7
            }))
          }, {
            skewX: delayFunction(delay, withSequence(withTiming('-10deg', {
              duration: duration * 0.7
            }), withTiming('5deg', {
              duration: duration * 0.15
            }), withTiming(targetSkewX, {
              duration: duration * 0.15
            })))
          }]
        },
        initialValues: {
          opacity: initialValues?.opacity ?? 0,
          transform: pickTransformValues([{
            translateX: -values.windowWidth
          }, {
            skewX: '45deg'
          }], initialValues)
        },
        callback
      };
    };
  };
}

/**
 * Exit to right animation with change in skew and opacity. You can modify the
 * behavior by chaining methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `exiting` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#lightspeed
 */
export class LightSpeedOutRight extends ComplexAnimationBuilder {
  static presetName = 'LightSpeedOutRight';
  static createInstance() {
    return new LightSpeedOutRight();
  }
  build = () => {
    const delayFunction = this.getDelayFunction();
    const animationAndConfig = this.getAnimationAndConfig();
    const [animation, config] = animationAndConfig;
    const delay = this.getDelay();
    const callback = this.callbackV;
    const initialValues = this.initialValues;
    const targetValues = this.targetValues;
    return values => {
      'worklet';

      return {
        animations: {
          opacity: delayFunction(delay, animation(targetValues?.opacity ?? 0, config)),
          transform: animateTransformToValues([{
            translateX: values.windowWidth
          }, {
            skewX: '-45deg'
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        initialValues: {
          opacity: initialValues?.opacity ?? 1,
          transform: pickTransformValues([{
            translateX: 0
          }, {
            skewX: '0deg'
          }], initialValues)
        },
        callback
      };
    };
  };
}

/**
 * Exit to left animation with change in skew and opacity. You can modify the
 * behavior by chaining methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `exiting` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations/#lightspeed
 */
export class LightSpeedOutLeft extends ComplexAnimationBuilder {
  static presetName = 'LightSpeedOutLeft';
  static createInstance() {
    return new LightSpeedOutLeft();
  }
  build = () => {
    const delayFunction = this.getDelayFunction();
    const animationAndConfig = this.getAnimationAndConfig();
    const [animation, config] = animationAndConfig;
    const delay = this.getDelay();
    const callback = this.callbackV;
    const initialValues = this.initialValues;
    const targetValues = this.targetValues;
    return values => {
      'worklet';

      return {
        animations: {
          opacity: delayFunction(delay, animation(targetValues?.opacity ?? 0, config)),
          transform: animateTransformToValues([{
            translateX: -values.windowWidth
          }, {
            skewX: '45deg'
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        initialValues: {
          opacity: initialValues?.opacity ?? 1,
          transform: pickTransformValues([{
            translateX: 0
          }, {
            skewX: '0deg'
          }], initialValues)
        },
        callback
      };
    };
  };
}
//# sourceMappingURL=Lightspeed.js.map