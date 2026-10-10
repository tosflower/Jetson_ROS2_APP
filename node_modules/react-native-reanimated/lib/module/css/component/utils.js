'use strict';

import { isCSSConfigProp, isPseudoSelectorValue } from "../utils/guards.js";
function filterNonCSSStylePropsRecursive(props) {
  if (Array.isArray(props)) {
    return props.map(prop => filterNonCSSStylePropsRecursive(prop));
  }
  if (!props) {
    return props;
  }
  if (typeof props === 'object') {
    return Object.entries(props).reduce((acc, [key, value]) => {
      if (isCSSConfigProp(key)) {
        return acc;
      }
      if (isPseudoSelectorValue(value)) {
        const defaultValue = value.default;
        if (defaultValue !== undefined) {
          acc[key] = defaultValue;
        }
        return acc;
      }
      acc[key] = value;
      return acc;
    }, {});
  }
  return props;
}
export function filterNonCSSStyleProps(props) {
  return filterNonCSSStylePropsRecursive(props);
}
//# sourceMappingURL=utils.js.map