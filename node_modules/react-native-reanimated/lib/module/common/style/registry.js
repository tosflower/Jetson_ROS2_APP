'use strict';

import { STYLE_PROPERTIES_CONFIG } from "./config.js";
import { createNativePropsBuilder, stylePropsBuilder } from "./propsBuilder.js";
const DEFAULT_SEPARATELY_INTERPOLATED_NESTED_PROPERTIES = new Set(['boxShadow', 'shadowOffset', 'textShadowOffset', 'transformOrigin']);
const PROPS_BUILDERS = new Map();
const PATTERN_PROPS_BUILDERS = [];
const SUPPORTED_BUILDER_PROPS = new Set(Object.keys(STYLE_PROPERTIES_CONFIG));
export function isSupportedStyleProp(prop) {
  return SUPPORTED_BUILDER_PROPS.has(prop);
}
function findEntry(compoundComponentName) {
  const [reactViewName] = compoundComponentName.split('$');
  const exact = PROPS_BUILDERS.get(compoundComponentName) ?? PROPS_BUILDERS.get(reactViewName);
  if (exact) {
    return exact;
  }

  // Pattern matches in registration order
  for (const {
    matcher,
    entry
  } of PATTERN_PROPS_BUILDERS) {
    const matches = matcher instanceof RegExp ? matcher.test(compoundComponentName) || matcher.test(reactViewName) : matcher(compoundComponentName) || matcher(reactViewName);
    if (matches) {
      return entry;
    }
  }
  return null;
}
export function getCompoundComponentName(reactViewName, componentDisplayName) {
  return `${reactViewName}$${componentDisplayName}`;
}
export function getPropsBuilder(compoundComponentName) {
  return findEntry(compoundComponentName)?.builder ?? stylePropsBuilder;
}
export function registerComponentPropsBuilder(componentName, config, options = {}) {
  for (const prop in config) {
    SUPPORTED_BUILDER_PROPS.add(prop);
  }
  const entry = {
    builder: createNativePropsBuilder(config),
    separatelyInterpolatedNestedProperties: options.separatelyInterpolatedNestedProperties?.length ? new Set(options.separatelyInterpolatedNestedProperties) : undefined
  };
  if (typeof componentName === 'string') {
    PROPS_BUILDERS.set(componentName, entry);
  } else {
    PATTERN_PROPS_BUILDERS.push({
      matcher: componentName,
      entry
    });
  }
}
export function getSeparatelyInterpolatedNestedProperties(compoundComponentName) {
  return findEntry(compoundComponentName)?.separatelyInterpolatedNestedProperties ?? DEFAULT_SEPARATELY_INTERPOLATED_NESTED_PROPERTIES;
}
//# sourceMappingURL=registry.js.map