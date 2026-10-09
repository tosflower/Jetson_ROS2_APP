'use strict';

import { FONT_WEIGHT_MAPPINGS } from "../../constants/index.js";
export const ERROR_MESSAGES = {
  invalidFontWeight(weight) {
    'worklet';

    return `Invalid font weight value: ${weight}`;
  }
};
const VALID_FONT_WEIGHTS = new Set(Object.values(FONT_WEIGHT_MAPPINGS));
export const processFontWeight = value => {
  'worklet';

  const stringValue = value.toString();
  if (VALID_FONT_WEIGHTS.has(stringValue)) {
    return stringValue;
  }
  if (stringValue in FONT_WEIGHT_MAPPINGS) {
    return FONT_WEIGHT_MAPPINGS[stringValue];
  }
  throw new Error(`[Reanimated] ${ERROR_MESSAGES.invalidFontWeight(value)}`);
};
//# sourceMappingURL=font.js.map