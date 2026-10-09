'use strict';

import { isLength } from "../../../utils/index.js";
export const ERROR_MESSAGES = {
  invalidDashArray: value => `Invalid stroke dash array value: ${JSON.stringify(value)}`
};
export const processStrokeDashArray = value => {
  let result = [];
  if (isLength(value)) {
    result = [value];
  } else if (Array.isArray(value)) {
    result = [...value];
  } else if (value === 'none') {
    return 'none';
  } else {
    throw new Error(`[Reanimated] ${ERROR_MESSAGES.invalidDashArray(value)}`);
  }

  // Per the SVG spec an odd-length dash array is repeated to an even length.
  // react-native-svg's extractStroke does this, but animated values bypass it
  // and an odd-length array crashes Android's DashPathEffect, so we repeat here.
  // https://www.w3.org/TR/fill-stroke-3/#valdef-stroke-dasharray-length-percentage
  if (result.length % 2 === 1) {
    result = result.concat(result);
  }
  if (__DEV__) {
    isValidDashArray(result);
  }
  return result;
};
const isValidDashArray = value => {
  if (!value.every(isLength)) {
    throw new Error(`[Reanimated] ${ERROR_MESSAGES.invalidDashArray(value)}`);
  }
};
//# sourceMappingURL=stroke.js.map