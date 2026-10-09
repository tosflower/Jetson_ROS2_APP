'use strict';

// TODO: Fix me
// @ts-ignore RNSVG doesn't export types for web, see https://github.com/software-mansion/react-native-svg/pull/2801
import { processSVGGradientStops } from "../processors/index.js";
// TODO: Fix me
// @ts-ignore RNSVG doesn't export types for web, see https://github.com/software-mansion/react-native-svg/pull/2801
export const SVG_LINEAR_GRADIENT_PROPERTIES_CONFIG = {
  x1: true,
  x2: true,
  y1: true,
  y2: true,
  gradient: {
    process: processSVGGradientStops
  },
  gradientUnits: {
    process: gradinetUnits => gradinetUnits === 'userSpaceOnUse' ? 1 : 0
  }
  // TODO: implement 'gradientTransform'
  // gradientTransform: true,
};
//# sourceMappingURL=linearGradient.js.map