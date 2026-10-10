'use strict';

import { createPropsBuilder } from "../../style/index.js";
import { hasValueProcessor, isConfigPropertyAlias, maybeAddSuffix } from "../../utils/index.js";
import { hasNameAlias } from "../utils/index.js";
export function createWebRuleBuilder(config, buildHandler) {
  // Accumulate props across add() calls
  let accumulatedProps = {};
  // Track name aliases for custom property names
  const nameAliases = new Map();
  const propsBuilder = createPropsBuilder({
    config,
    processConfigValue(configValue, propertyKey) {
      // Handle suffix config (e.g., 'px')
      if (typeof configValue === 'string') {
        return value => maybeAddSuffix(value, configValue);
      }

      // Handle property alias
      if (isConfigPropertyAlias(configValue)) {
        return config[configValue.as];
      }

      // Handle name alias and/or value processor
      const isNameAlias = hasNameAlias(configValue);
      if (isNameAlias) {
        nameAliases.set(propertyKey, configValue.name);
      }
      if (hasValueProcessor(configValue)) {
        return configValue.process;
      }

      // Boolean true or name alias without processor - both need string conversion
      if (configValue === true || isNameAlias) {
        return value => String(value);
      }
    }
  });
  return {
    add(property, value) {
      accumulatedProps[property] = value;
    },
    build() {
      // Build all accumulated props
      let processedProps = propsBuilder.build(accumulatedProps);

      // Clear accumulated props for next build
      accumulatedProps = {};

      // Apply name aliases to processed props
      if (nameAliases.size) {
        processedProps = Object.fromEntries(Object.entries(processedProps).map(([key, value]) => [nameAliases.get(key) ?? key, value]));
      }

      // Call the handler with processed props
      return buildHandler(processedProps);
    }
  };
}
//# sourceMappingURL=ruleBuilder.js.map