'use strict';

// TODO: Fix me
// @ts-ignore RNSVG doesn't export types for web, see https://github.com/software-mansion/react-native-svg/pull/2801
import { processPolygonPoints } from "../processors/index.js";
import { SVG_COMMON_PROPERTIES_CONFIG } from "./common.js";

// TODO: Fix me
// @ts-ignore RNSVG doesn't export types for web, see https://github.com/software-mansion/react-native-svg/pull/2801
export const SVG_POLYGON_PROPERTIES_CONFIG = {
  ...SVG_COMMON_PROPERTIES_CONFIG,
  points: {
    process: processPolygonPoints
  }
};
//# sourceMappingURL=polygon.js.map