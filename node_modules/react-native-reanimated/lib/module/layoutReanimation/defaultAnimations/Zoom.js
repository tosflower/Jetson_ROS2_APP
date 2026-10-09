'use strict';

import { ComplexAnimationBuilder } from "../animationBuilder/index.js";
import { animateTransformToValues, pickTransformValues } from "./utils.js";

/**
 * Scale from center animation. You can modify the behavior by chaining methods
 * like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `entering` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations/#zoom
 */
export class ZoomIn extends ComplexAnimationBuilder {
  static presetName = 'ZoomIn';
  static createInstance() {
    return new ZoomIn();
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
            scale: 1
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        initialValues: {
          transform: pickTransformValues([{
            scale: 0
          }], initialValues)
        },
        callback
      };
    };
  };
}

/**
 * Scale from center with rotation. You can modify the behavior by chaining
 * methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `entering` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations/#zoom
 */
export class ZoomInRotate extends ComplexAnimationBuilder {
  static presetName = 'ZoomInRotate';
  static createInstance() {
    return new ZoomInRotate();
  }
  build = () => {
    const delayFunction = this.getDelayFunction();
    const animationAndConfig = this.getAnimationAndConfig();
    const delay = this.getDelay();
    const rotate = this.rotateV ? this.rotateV : '0.3';
    const callback = this.callbackV;
    const initialValues = this.initialValues;
    const targetValues = this.targetValues;
    return () => {
      'worklet';

      return {
        animations: {
          transform: animateTransformToValues([{
            scale: 1
          }, {
            rotate: '0rad'
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        initialValues: {
          transform: pickTransformValues([{
            scale: 0
          }, {
            rotate: `${rotate}rad`
          }], initialValues)
        },
        callback
      };
    };
  };
}

/**
 * Scale from left animation. You can modify the behavior by chaining methods
 * like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `entering` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations/#zoom
 */
export class ZoomInLeft extends ComplexAnimationBuilder {
  static presetName = 'ZoomInLeft';
  static createInstance() {
    return new ZoomInLeft();
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
            scale: 1
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        initialValues: {
          transform: pickTransformValues([{
            translateX: -values.windowWidth
          }, {
            scale: 0
          }], initialValues)
        },
        callback
      };
    };
  };
}

/**
 * Scale from right animation. You can modify the behavior by chaining methods
 * like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `entering` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations/#zoom
 */
export class ZoomInRight extends ComplexAnimationBuilder {
  static presetName = 'ZoomInRight';
  static createInstance() {
    return new ZoomInRight();
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
            scale: 1
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        initialValues: {
          transform: pickTransformValues([{
            translateX: values.windowWidth
          }, {
            scale: 0
          }], initialValues)
        },
        callback
      };
    };
  };
}

/**
 * Scale from top animation. You can modify the behavior by chaining methods
 * like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `entering` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations/#zoom
 */
export class ZoomInUp extends ComplexAnimationBuilder {
  static presetName = 'ZoomInUp';
  static createInstance() {
    return new ZoomInUp();
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
            translateY: 0
          }, {
            scale: 1
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        initialValues: {
          transform: pickTransformValues([{
            translateY: -values.windowHeight
          }, {
            scale: 0
          }], initialValues)
        },
        callback
      };
    };
  };
}

/**
 * Scale from bottom animation. You can modify the behavior by chaining methods
 * like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `entering` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations/#zoom
 */
export class ZoomInDown extends ComplexAnimationBuilder {
  static presetName = 'ZoomInDown';
  static createInstance() {
    return new ZoomInDown();
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
            translateY: 0
          }, {
            scale: 1
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        initialValues: {
          transform: pickTransformValues([{
            translateY: values.windowHeight
          }, {
            scale: 0
          }], initialValues)
        },
        callback
      };
    };
  };
}

/**
 * Eased scale from top animation. You can modify the behavior by chaining
 * methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `entering` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations/#zoom
 */
export class ZoomInEasyUp extends ComplexAnimationBuilder {
  static presetName = 'ZoomInEasyUp';
  static createInstance() {
    return new ZoomInEasyUp();
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
            translateY: 0
          }, {
            scale: 1
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        initialValues: {
          transform: pickTransformValues([{
            translateY: -values.targetHeight
          }, {
            scale: 0
          }], initialValues)
        },
        callback
      };
    };
  };
}

/**
 * Eased scale from bottom animation. You can modify the behavior by chaining
 * methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `entering` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations/#zoom
 */
export class ZoomInEasyDown extends ComplexAnimationBuilder {
  static presetName = 'ZoomInEasyDown';
  static createInstance() {
    return new ZoomInEasyDown();
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
            translateY: 0
          }, {
            scale: 1
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        initialValues: {
          transform: pickTransformValues([{
            translateY: values.targetHeight
          }, {
            scale: 0
          }], initialValues)
        },
        callback
      };
    };
  };
}

/**
 * Scale to center animation. You can modify the behavior by chaining methods
 * like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `exiting` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations/#zoom
 */
export class ZoomOut extends ComplexAnimationBuilder {
  static presetName = 'ZoomOut';
  static createInstance() {
    return new ZoomOut();
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
            scale: 0
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        initialValues: {
          transform: pickTransformValues([{
            scale: 1
          }], initialValues)
        },
        callback
      };
    };
  };
}

/**
 * Scale to center with rotation. You can modify the behavior by chaining
 * methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `exiting` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations/#zoom
 */
export class ZoomOutRotate extends ComplexAnimationBuilder {
  static presetName = 'ZoomOutRotate';
  static createInstance() {
    return new ZoomOutRotate();
  }
  build = () => {
    const delayFunction = this.getDelayFunction();
    const animationAndConfig = this.getAnimationAndConfig();
    const delay = this.getDelay();
    const rotate = this.rotateV ? this.rotateV : '0.3';
    const callback = this.callbackV;
    const initialValues = this.initialValues;
    const targetValues = this.targetValues;
    return () => {
      'worklet';

      return {
        animations: {
          transform: animateTransformToValues([{
            scale: 0
          }, {
            rotate
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        initialValues: {
          transform: pickTransformValues([{
            scale: 1
          }, {
            rotate: '0rad'
          }], initialValues)
        },
        callback
      };
    };
  };
}

/**
 * Scale to left animation. You can modify the behavior by chaining methods like
 * `.springify()` or `.duration(500)`.
 *
 * You pass it to the `exiting` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations/#zoom
 */
export class ZoomOutLeft extends ComplexAnimationBuilder {
  static presetName = 'ZoomOutLeft';
  static createInstance() {
    return new ZoomOutLeft();
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
            scale: 0
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        initialValues: {
          transform: pickTransformValues([{
            translateX: 0
          }, {
            scale: 1
          }], initialValues)
        },
        callback
      };
    };
  };
}

/**
 * Scale to right animation. You can modify the behavior by chaining methods
 * like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `exiting` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations/#zoom
 */
export class ZoomOutRight extends ComplexAnimationBuilder {
  static presetName = 'ZoomOutRight';
  static createInstance() {
    return new ZoomOutRight();
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
            scale: 0
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        initialValues: {
          transform: pickTransformValues([{
            translateX: 0
          }, {
            scale: 1
          }], initialValues)
        },
        callback
      };
    };
  };
}

/**
 * Scale to top animation. You can modify the behavior by chaining methods like
 * `.springify()` or `.duration(500)`.
 *
 * You pass it to the `exiting` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations/#zoom
 */
export class ZoomOutUp extends ComplexAnimationBuilder {
  static presetName = 'ZoomOutUp';
  static createInstance() {
    return new ZoomOutUp();
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
            translateY: -values.windowHeight
          }, {
            scale: 0
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        initialValues: {
          transform: pickTransformValues([{
            translateY: 0
          }, {
            scale: 1
          }], initialValues)
        },
        callback
      };
    };
  };
}

/**
 * Scale to bottom animation. You can modify the behavior by chaining methods
 * like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `exiting` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations/#zoom
 */
export class ZoomOutDown extends ComplexAnimationBuilder {
  static presetName = 'ZoomOutDown';
  static createInstance() {
    return new ZoomOutDown();
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
            translateY: values.windowHeight
          }, {
            scale: 0
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        initialValues: {
          transform: pickTransformValues([{
            translateY: 0
          }, {
            scale: 1
          }], initialValues)
        },
        callback
      };
    };
  };
}

/**
 * Eased scale to top animation. You can modify the behavior by chaining methods
 * like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `exiting` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations/#zoom
 */
export class ZoomOutEasyUp extends ComplexAnimationBuilder {
  static presetName = 'ZoomOutEasyUp';
  static createInstance() {
    return new ZoomOutEasyUp();
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
            translateY: -values.currentHeight
          }, {
            scale: 0
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        initialValues: {
          transform: pickTransformValues([{
            translateY: 0
          }, {
            scale: 1
          }], initialValues)
        },
        callback
      };
    };
  };
}

/**
 * Eased scale to bottom animation. You can modify the behavior by chaining
 * methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `exiting` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations/#zoom
 */
export class ZoomOutEasyDown extends ComplexAnimationBuilder {
  static presetName = 'ZoomOutEasyDown';
  static createInstance() {
    return new ZoomOutEasyDown();
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
            translateY: values.currentHeight
          }, {
            scale: 0
          }], targetValues, animationAndConfig, delayFunction, delay)
        },
        initialValues: {
          transform: pickTransformValues([{
            translateY: 0
          }, {
            scale: 1
          }], initialValues)
        },
        callback
      };
    };
  };
}
//# sourceMappingURL=Zoom.js.map