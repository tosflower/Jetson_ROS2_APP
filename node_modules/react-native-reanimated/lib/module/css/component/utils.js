'use strict';

import { isCSSCallbackProp, isCSSConfigProp, isPseudoSelectorValue } from "../utils/guards.js";
function filterStyleRecursive(style) {
  if (Array.isArray(style)) {
    return style.map(entry => filterStyleRecursive(entry));
  }
  if (!style || typeof style !== 'object') {
    return style;
  }
  const styleObject = style;
  const result = {};
  for (const key in styleObject) {
    if (isCSSConfigProp(key)) {
      continue;
    }
    const value = styleObject[key];
    if (isPseudoSelectorValue(value)) {
      const defaultValue = value.default;
      if (defaultValue !== undefined) {
        result[key] = defaultValue;
      }
      continue;
    }
    result[key] = value;
  }
  return result;
}
function omitCSSCallbackProps(props) {
  const result = {};
  for (const key in props) {
    if (!isCSSCallbackProp(key)) {
      result[key] = props[key];
    }
  }
  return result;
}

/**
 * Everything the wrapped component should receive: the CSS config and the
 * lifecycle callbacks are ours to act on, so neither reaches the host view.
 */
export function filterCSSProps(props) {
  const result = omitCSSCallbackProps(props);
  if ('style' in props) {
    result.style = filterStyleRecursive(props.style);
  }
  return result;
}
//# sourceMappingURL=utils.js.map