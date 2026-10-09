'use strict';

// TODO: Fix me
// @ts-ignore RNSVG doesn't export types for web, see https://github.com/software-mansion/react-native-svg/pull/2801
import { SVG_COMMON_WEB_PROPERTIES_CONFIG } from "./common.js";
const processPathD = value => `path("${value}")`;
export const SVG_PATH_WEB_PROPERTIES_CONFIG = {
  ...SVG_COMMON_WEB_PROPERTIES_CONFIG,
  d: {
    process: processPathD
  }
};
//# sourceMappingURL=path.js.map