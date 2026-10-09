'use strict';

import { ComplexAnimationBuilder } from "../animationBuilder/index.js";
import { animateTransformToValues, pickTransformValues } from "./utils.js";

/**
 * Roll from left animation. You can modify the behavior by chaining methods
 * like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `entering` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#roll
 */
export class RollInLeft extends ComplexAnimationBuilder {
  static presetName = 'RollInLeft';
  static createInstance() {
    return new RollInLeft();
  }
  build = () => {
    const delayFunction = this.getDelayFunction();
    const animationAndConfig = this.getAnimationAndConfig();
    const delay = this.getDelay();
    const callback = this.callbackV;
    const initialValues = this.initialValues;
    const targetValues = this.targetValues;
    return values => {
      'worklet';

      return {
        animations: {
          transform: animateTransformToValues([{
            translateX: 0
          }, {
            rotate: '0deg'
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        initialValues: {
          transform: pickTransformValues([{
            translateX: -values.windowWidth
          }, {
            rotate: '-180deg'
          }], initialValues)
        },
        callback
      };
    };
  };
}

/**
 * Roll from right animation. You can modify the behavior by chaining methods
 * like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `entering` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#roll
 */
export class RollInRight extends ComplexAnimationBuilder {
  static presetName = 'RollInRight';
  static createInstance() {
    return new RollInRight();
  }
  build = () => {
    const delayFunction = this.getDelayFunction();
    const animationAndConfig = this.getAnimationAndConfig();
    const delay = this.getDelay();
    const callback = this.callbackV;
    const initialValues = this.initialValues;
    const targetValues = this.targetValues;
    return values => {
      'worklet';

      return {
        animations: {
          transform: animateTransformToValues([{
            translateX: 0
          }, {
            rotate: '0deg'
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        initialValues: {
          transform: pickTransformValues([{
            translateX: values.windowWidth
          }, {
            rotate: '180deg'
          }], initialValues)
        },
        callback
      };
    };
  };
}

/**
 * Roll to left animation. You can modify the behavior by chaining methods like
 * `.springify()` or `.duration(500)`.
 *
 * You pass it to the `exiting` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#roll
 */
export class RollOutLeft extends ComplexAnimationBuilder {
  static presetName = 'RollOutLeft';
  static createInstance() {
    return new RollOutLeft();
  }
  build = () => {
    const delayFunction = this.getDelayFunction();
    const animationAndConfig = this.getAnimationAndConfig();
    const delay = this.getDelay();
    const callback = this.callbackV;
    const initialValues = this.initialValues;
    const targetValues = this.targetValues;
    return values => {
      'worklet';

      return {
        animations: {
          transform: animateTransformToValues([{
            translateX: -values.windowWidth
          }, {
            rotate: '-180deg'
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        initialValues: {
          transform: pickTransformValues([{
            translateX: 0
          }, {
            rotate: '0deg'
          }], initialValues)
        },
        callback
      };
    };
  };
}

/**
 * Roll to right animation. You can modify the behavior by chaining methods like
 * `.springify()` or `.duration(500)`.
 *
 * You pass it to the `exiting` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#roll
 */
export class RollOutRight extends ComplexAnimationBuilder {
  static presetName = 'RollOutRight';
  static createInstance() {
    return new RollOutRight();
  }
  build = () => {
    const delayFunction = this.getDelayFunction();
    const animationAndConfig = this.getAnimationAndConfig();
    const delay = this.getDelay();
    const callback = this.callbackV;
    const initialValues = this.initialValues;
    const targetValues = this.targetValues;
    return values => {
      'worklet';

      return {
        animations: {
          transform: animateTransformToValues([{
            translateX: values.windowWidth
          }, {
            rotate: '180deg'
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        initialValues: {
          transform: pickTransformValues([{
            translateX: 0
          }, {
            rotate: '0deg'
          }], initialValues)
        },
        callback
      };
    };
  };
}
//# sourceMappingURL=Roll.js.map