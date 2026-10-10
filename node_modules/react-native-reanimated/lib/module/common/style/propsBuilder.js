'use strict';

import { hasValueProcessor, isConfigPropertyAlias } from "../utils/index.js";
import { STYLE_PROPERTIES_CONFIG } from "./config.js";
import createPropsBuilder from "./createPropsBuilder.js";
export function createNativePropsBuilder(config) {
  return createPropsBuilder({
    config,
    processConfigValue(configValue) {
      if (configValue === true) {
        // No custom processing needed
        return true;
      }
      if (isConfigPropertyAlias(configValue)) {
        return config[configValue.as];
      }
      if (hasValueProcessor(configValue)) {
        return (value, context) => {
          'worklet';

          return configValue.process(value, context);
        };
      }
    }
  });
}
export const stylePropsBuilder = createNativePropsBuilder(STYLE_PROPERTIES_CONFIG);
//# sourceMappingURL=propsBuilder.js.map