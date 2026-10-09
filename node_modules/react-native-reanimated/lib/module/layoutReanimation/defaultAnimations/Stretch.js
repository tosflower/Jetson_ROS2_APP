'use strict';

import { ComplexAnimationBuilder } from "../animationBuilder/index.js";
import { animateTransformToValues, pickTransformValues } from "./utils.js";

/**
 * Stretch animation on the X axis. You can modify the behavior by chaining
 * methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `entering` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations/#stretch
 */
export class StretchInX extends ComplexAnimationBuilder {
  static presetName = 'StretchInX';
  static createInstance() {
    return new StretchInX();
  }
  build = () => {
    const delayFunction = this.getDelayFunction();
    const animationAndConfig = this.getAnimationAndConfig();
    const delay = this.getDelay();
    const callback = this.callbackV;
    const initialValues = this.initialValues;
    const targetValues = this.targetValues;
    return () => {
      'worklet';

      return {
        animations: {
          transform: animateTransformToValues([{
            scaleX: 1
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        initialValues: {
          transform: pickTransformValues([{
            scaleX: 0
          }], initialValues)
        },
        callback
      };
    };
  };
}

/**
 * Stretch animation on the Y axis. You can modify the behavior by chaining
 * methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `entering` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations/#stretch
 */
export class StretchInY extends ComplexAnimationBuilder {
  static presetName = 'StretchInY';
  static createInstance() {
    return new StretchInY();
  }
  build = () => {
    const delayFunction = this.getDelayFunction();
    const animationAndConfig = this.getAnimationAndConfig();
    const delay = this.getDelay();
    const callback = this.callbackV;
    const initialValues = this.initialValues;
    const targetValues = this.targetValues;
    return () => {
      'worklet';

      return {
        animations: {
          transform: animateTransformToValues([{
            scaleY: 1
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        initialValues: {
          transform: pickTransformValues([{
            scaleY: 0
          }], initialValues)
        },
        callback
      };
    };
  };
}

/**
 * Stretch animation on the X axis. You can modify the behavior by chaining
 * methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `exiting` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations/#stretch
 */
export class StretchOutX extends ComplexAnimationBuilder {
  static presetName = 'StretchOutX';
  static createInstance() {
    return new StretchOutX();
  }
  build = () => {
    const delayFunction = this.getDelayFunction();
    const animationAndConfig = this.getAnimationAndConfig();
    const delay = this.getDelay();
    const callback = this.callbackV;
    const initialValues = this.initialValues;
    const targetValues = this.targetValues;
    return () => {
      'worklet';

      return {
        animations: {
          transform: animateTransformToValues([{
            scaleX: 0
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        initialValues: {
          transform: pickTransformValues([{
            scaleX: 1
          }], initialValues)
        },
        callback
      };
    };
  };
}

/**
 * Stretch animation on the Y axis. You can modify the behavior by chaining
 * methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `exiting` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations/#stretch
 */
export class StretchOutY extends ComplexAnimationBuilder {
  static presetName = 'StretchOutY';
  static createInstance() {
    return new StretchOutY();
  }
  build = () => {
    const delayFunction = this.getDelayFunction();
    const animationAndConfig = this.getAnimationAndConfig();
    const delay = this.getDelay();
    const callback = this.callbackV;
    const initialValues = this.initialValues;
    const targetValues = this.targetValues;
    return () => {
      'worklet';

      return {
        animations: {
          transform: animateTransformToValues([{
            scaleY: 0
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        initialValues: {
          transform: pickTransformValues([{
            scaleY: 1
          }], initialValues)
        },
        callback
      };
    };
  };
}
//# sourceMappingURL=Stretch.js.map