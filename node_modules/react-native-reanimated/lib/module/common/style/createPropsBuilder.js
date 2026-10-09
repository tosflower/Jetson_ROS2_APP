'use strict';

import { ValueProcessorTarget } from "../types/index.js";
import { isRecord } from "../utils/index.js";
const MAX_PROCESS_DEPTH = 10;
export default function createPropsBuilder({
  processConfigValue,
  config
}) {
  const processedConfig = Object.entries(config).reduce((acc, [key, configValue]) => {
    let processedValue = configValue;
    let depth = 0;
    while (processedValue) {
      if (++depth > MAX_PROCESS_DEPTH) {
        throw new Error(`[Reanimated] Max process depth for props builder reached for property ${key}`);
      }

      // If the value returned from the processConfigValue function is a function,
      // that means it's a terminal value that will be used to process the value
      // of the property. We can break the loop at this point.
      if (typeof processedValue === 'function' || processedValue === true) {
        acc[key] = processedValue;
        break;
      }

      // Otherwise, we need to continue processing the value.
      processedValue = processConfigValue(processedValue, key);
    }
    return acc;
  }, {});
  return {
    build(props, options) {
      'worklet';

      const context = {
        target: options?.target ?? ValueProcessorTarget.Default
      };
      const result = {};
      for (const property in props) {
        const configValue = processedConfig[property];
        const value = props[property];

        // Simple case, no need for processing
        if (configValue === true) {
          result[property] = value;
          continue;
        }

        // Prop is not supported or value is undefined
        if (!configValue || value === undefined) {
          if (options?.includeUnprocessed) {
            result[property] = value;
          }
          continue;
        }
        const processedValue = configValue(value, context);
        if (isRecord(processedValue) && !isRecord(value)) {
          // The value processor may return multiple values for a single property
          // as a record of new property names and processed values. In such a case,
          // we want to store properties from this record in the result object only
          // if they are not already present (we don't want to override properties
          // explicitly specified by the user).
          for (const processedKey in processedValue) {
            if (!(processedKey in result)) {
              result[processedKey] = processedValue[processedKey];
            }
          }
        } else {
          result[property] = processedValue;
        }
      }
      return result;
    }
  };
}
//# sourceMappingURL=createPropsBuilder.js.map