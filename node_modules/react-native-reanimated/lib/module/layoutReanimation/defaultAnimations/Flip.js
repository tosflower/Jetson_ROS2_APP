'use strict';

import { ComplexAnimationBuilder } from "../animationBuilder/index.js";
import { animateTransformToValues, pickTransformValues } from "./utils.js";

/**
 * Rotate from top on the X axis. You can modify the behavior by chaining
 * methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `entering` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#flip
 */
export class FlipInXUp extends ComplexAnimationBuilder {
  static presetName = 'FlipInXUp';
  static createInstance() {
    return new FlipInXUp();
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
        initialValues: {
          transform: pickTransformValues([{
            perspective: 500
          }, {
            rotateX: '90deg'
          }, {
            translateY: -values.targetHeight
          }], initialValues)
        },
        animations: {
          transform: animateTransformToValues([{
            perspective: 500
          }, {
            rotateX: '0deg'
          }, {
            translateY: 0
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        callback
      };
    };
  };
}

/**
 * Rotate from left on the Y axis. You can modify the behavior by chaining
 * methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `entering` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#flip
 */
export class FlipInYLeft extends ComplexAnimationBuilder {
  static presetName = 'FlipInYLeft';
  static createInstance() {
    return new FlipInYLeft();
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
        initialValues: {
          transform: pickTransformValues([{
            perspective: 500
          }, {
            rotateY: '-90deg'
          }, {
            translateX: -values.targetWidth
          }], initialValues)
        },
        animations: {
          transform: animateTransformToValues([{
            perspective: 500
          }, {
            rotateY: '0deg'
          }, {
            translateX: 0
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        callback
      };
    };
  };
}

/**
 * Rotate from bottom on the X axis. You can modify the behavior by chaining
 * methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `entering` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#flip
 */
export class FlipInXDown extends ComplexAnimationBuilder {
  static presetName = 'FlipInXDown';
  static createInstance() {
    return new FlipInXDown();
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
        initialValues: {
          transform: pickTransformValues([{
            perspective: 500
          }, {
            rotateX: '-90deg'
          }, {
            translateY: values.targetHeight
          }], initialValues)
        },
        animations: {
          transform: animateTransformToValues([{
            perspective: 500
          }, {
            rotateX: '0deg'
          }, {
            translateY: 0
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        callback
      };
    };
  };
}

/**
 * Rotate from right on the Y axis. You can modify the behavior by chaining
 * methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `entering` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#flip
 */
export class FlipInYRight extends ComplexAnimationBuilder {
  static presetName = 'FlipInYRight';
  static createInstance() {
    return new FlipInYRight();
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
        initialValues: {
          transform: pickTransformValues([{
            perspective: 500
          }, {
            rotateY: '90deg'
          }, {
            translateX: values.targetWidth
          }], initialValues)
        },
        animations: {
          transform: animateTransformToValues([{
            perspective: 500
          }, {
            rotateY: '0deg'
          }, {
            translateX: 0
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        callback
      };
    };
  };
}

/**
 * Eased rotate in on the X axis. You can modify the behavior by chaining
 * methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `entering` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#flip
 */
export class FlipInEasyX extends ComplexAnimationBuilder {
  static presetName = 'FlipInEasyX';
  static createInstance() {
    return new FlipInEasyX();
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
        initialValues: {
          transform: pickTransformValues([{
            perspective: 500
          }, {
            rotateX: '90deg'
          }], initialValues)
        },
        animations: {
          transform: animateTransformToValues([{
            perspective: 500
          }, {
            rotateX: '0deg'
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        callback
      };
    };
  };
}

/**
 * Eased rotate in on the Y axis. You can modify the behavior by chaining
 * methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `entering` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#flip
 */
export class FlipInEasyY extends ComplexAnimationBuilder {
  static presetName = 'FlipInEasyY';
  static createInstance() {
    return new FlipInEasyY();
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
        initialValues: {
          transform: pickTransformValues([{
            perspective: 500
          }, {
            rotateY: '90deg'
          }], initialValues)
        },
        animations: {
          transform: animateTransformToValues([{
            perspective: 500
          }, {
            rotateY: '0deg'
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        callback
      };
    };
  };
}

/**
 * Rotate to top animation on the X axis. You can modify the behavior by
 * chaining methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `exiting` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#flip
 */
export class FlipOutXUp extends ComplexAnimationBuilder {
  static presetName = 'FlipOutXUp';
  static createInstance() {
    return new FlipOutXUp();
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
        initialValues: {
          transform: pickTransformValues([{
            perspective: 500
          }, {
            rotateX: '0deg'
          }, {
            translateY: 0
          }], initialValues)
        },
        animations: {
          transform: animateTransformToValues([{
            perspective: 500
          }, {
            rotateX: '90deg'
          }, {
            translateY: -values.currentHeight
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        callback
      };
    };
  };
}

/**
 * Rotate to left on the Y axis. You can modify the behavior by chaining methods
 * like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `exiting` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#flip
 */
export class FlipOutYLeft extends ComplexAnimationBuilder {
  static presetName = 'FlipOutYLeft';
  static createInstance() {
    return new FlipOutYLeft();
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
        initialValues: {
          transform: pickTransformValues([{
            perspective: 500
          }, {
            rotateY: '0deg'
          }, {
            translateX: 0
          }], initialValues)
        },
        animations: {
          transform: animateTransformToValues([{
            perspective: 500
          }, {
            rotateY: '-90deg'
          }, {
            translateX: -values.currentWidth
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        callback
      };
    };
  };
}

/**
 * Rotate to bottom on the X axis. You can modify the behavior by chaining
 * methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `exiting` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#flip
 */
export class FlipOutXDown extends ComplexAnimationBuilder {
  static presetName = 'FlipOutXDown';
  static createInstance() {
    return new FlipOutXDown();
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
        initialValues: {
          transform: pickTransformValues([{
            perspective: 500
          }, {
            rotateX: '0deg'
          }, {
            translateY: 0
          }], initialValues)
        },
        animations: {
          transform: animateTransformToValues([{
            perspective: 500
          }, {
            rotateX: '-90deg'
          }, {
            translateY: values.currentHeight
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        callback
      };
    };
  };
}

/**
 * Rotate to right animation on the Y axis. You can modify the behavior by
 * chaining methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `exiting` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#flip
 */
export class FlipOutYRight extends ComplexAnimationBuilder {
  static presetName = 'FlipOutYRight';
  static createInstance() {
    return new FlipOutYRight();
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
        initialValues: {
          transform: pickTransformValues([{
            perspective: 500
          }, {
            rotateY: '0deg'
          }, {
            translateX: 0
          }], initialValues)
        },
        animations: {
          transform: animateTransformToValues([{
            perspective: 500
          }, {
            rotateY: '90deg'
          }, {
            translateX: values.currentWidth
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        callback
      };
    };
  };
}

/**
 * Eased rotate on the X axis. You can modify the behavior by chaining methods
 * like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `exiting` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#flip
 */
export class FlipOutEasyX extends ComplexAnimationBuilder {
  static presetName = 'FlipOutEasyX';
  static createInstance() {
    return new FlipOutEasyX();
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
        initialValues: {
          transform: pickTransformValues([{
            perspective: 500
          }, {
            rotateX: '0deg'
          }], initialValues)
        },
        animations: {
          transform: animateTransformToValues([{
            perspective: 500
          }, {
            rotateX: '90deg'
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        callback
      };
    };
  };
}

/**
 * Eased rotate on the Y axis. You can modify the behavior by chaining methods
 * like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `exiting` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#flip
 */
export class FlipOutEasyY extends ComplexAnimationBuilder {
  static presetName = 'FlipOutEasyY';
  static createInstance() {
    return new FlipOutEasyY();
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
        initialValues: {
          transform: pickTransformValues([{
            perspective: 500
          }, {
            rotateY: '0deg'
          }], initialValues)
        },
        animations: {
          transform: animateTransformToValues([{
            perspective: 500
          }, {
            rotateY: '90deg'
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        callback
      };
    };
  };
}
//# sourceMappingURL=Flip.js.map