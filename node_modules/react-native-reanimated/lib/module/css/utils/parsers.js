'use strict';

import { splitByComma, splitByWhitespace } from "../../common/index.js";
import { MILLISECONDS_REGEX, PERCENTAGE_REGEX, SECONDS_REGEX } from "../constants/index.js";
import { isTimeUnit, smellsLikeTimingFunction } from "./guards.js";
export { splitByComma, splitByWhitespace };
export const offsetOf = selector => {
  if (selector === 'from') {
    return 0;
  }
  if (selector === 'to') {
    return 1;
  }
  if (!isNaN(+selector)) {
    return +selector;
  }
  return PERCENTAGE_REGEX.test(`${selector}`) ? parseFloat(`${selector}`) / 100 : null;
};
export function parseSingleTransitionShorthand(value) {
  const result = {};
  const parts = splitByWhitespace(value);
  for (const part of parts) {
    if (part === 'all') {
      result.transitionProperty = 'all';
      continue;
    }
    if (part === 'normal' || part === 'allow-discrete') {
      result.transitionBehavior = part;
      continue;
    }
    if (isTimeUnit(part)) {
      const timeUnit = part;
      if (result.transitionDuration === undefined) {
        result.transitionDuration = timeUnit;
        continue;
      }
      if (result.transitionDelay === undefined) {
        result.transitionDelay = timeUnit;
        continue;
      }
    }
    if (result.transitionTimingFunction === undefined && smellsLikeTimingFunction(part)) {
      result.transitionTimingFunction = part;
      continue;
    }
    if (result.transitionProperty === undefined) {
      result.transitionProperty = part;
      continue;
    }
    throw new Error(`[Reanimated] Invalid transition shorthand: ${value}`);
  }
  return result;
}
export function normalizeTimeUnit(timeUnit) {
  if (typeof timeUnit === 'number') {
    // A non-finite value would reach the C++ timing math and make every
    // progress it computes NaN, which lands on the view as a NaN style value.
    return Number.isFinite(timeUnit) ? timeUnit : null;
  } else if (MILLISECONDS_REGEX.test(timeUnit)) {
    return parseFloat(timeUnit);
  } else if (SECONDS_REGEX.test(timeUnit)) {
    return parseFloat(timeUnit) * 1000;
  }
  return null;
}
//# sourceMappingURL=parsers.js.map