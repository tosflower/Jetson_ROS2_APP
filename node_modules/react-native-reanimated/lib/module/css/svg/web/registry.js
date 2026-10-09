'use strict';

import { createWebPropsBuilder } from "../../../common/web/index.js";
const PROPS_BUILDERS = new Map();
const PATTERN_PROPS_BUILDERS = [];
function findBuilder(componentName) {
  const exact = PROPS_BUILDERS.get(componentName);
  if (exact) {
    return exact;
  }

  // Pattern matches in registration order
  for (const {
    matcher,
    builder
  } of PATTERN_PROPS_BUILDERS) {
    const matches = matcher instanceof RegExp ? matcher.test(componentName) : matcher(componentName);
    if (matches) {
      return builder;
    }
  }
  return null;
}
export function getWebSvgPropsBuilder(componentName) {
  return findBuilder(componentName);
}
export function registerWebSvgPropsBuilder(componentName, config) {
  const builder = createWebPropsBuilder(config);
  if (typeof componentName === 'string') {
    PROPS_BUILDERS.set(componentName, builder);
  } else {
    PATTERN_PROPS_BUILDERS.push({
      matcher: componentName,
      builder
    });
  }
}
//# sourceMappingURL=registry.js.map