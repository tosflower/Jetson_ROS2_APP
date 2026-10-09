'use strict';

import { logger } from "../common/index.js";
import { ComplexAnimationBuilder } from "./animationBuilder/index.js";
export class SharedTransition extends ComplexAnimationBuilder {
  static presetName = 'SharedTransition';
  static createInstance() {
    return new SharedTransition();
  }
  build = () => {
    const delayFunction = this.getDelayFunction();
    if (!this.durationV) {
      this.durationV = 500;
    }
    const [animation, config] = this.getAnimationAndConfig();
    const callback = this.callbackV;
    const delay = this.getDelay();
    return valuesUntyped => {
      'worklet';

      const values = valuesUntyped;
      const animationFactory = value => {
        return delayFunction(delay, animation(value, config));
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const initialValues = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const animations = {};
      for (let key in values.source) {
        initialValues[key] = values.source[key];
        const target = values.target[key];
        if (Array.isArray(target)) {
          if (key === 'transform') {
            // TODO (future): do proper transform interpolation
            animations[key] = target.map(item => {
              key = Object.keys(item)[0];
              return {
                [key]: animationFactory(item[key])
              };
            });
          } else if (key === 'boxShadow') {
            animations[key] = target.map(item => {
              const boxShadow = {};
              for (const shadowKey of Object.keys(item)) {
                boxShadow[shadowKey] = animationFactory(item[shadowKey]);
              }
              return boxShadow;
            });
          } else if (key === 'transformOrigin') {
            animations[key] = target.map(animationFactory);
          } else {
            logger.error(`Unexpected array in SharedTransition: ${key}`);
          }
        } else {
          animations[key] = animationFactory(values.target[key]);
        }
      }
      return {
        initialValues,
        animations,
        callback
      };
    };
  };
}
//# sourceMappingURL=SharedTransition.js.map