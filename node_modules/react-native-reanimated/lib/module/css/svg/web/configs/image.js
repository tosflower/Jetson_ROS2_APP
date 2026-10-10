'use strict';

// TODO: Fix me
// @ts-ignore RNSVG doesn't export types for web, see https://github.com/software-mansion/react-native-svg/pull/2801
import { SVG_COMMON_WEB_PROPERTIES_CONFIG } from "./common.js";
export const SVG_IMAGE_WEB_PROPERTIES_CONFIG = {
  ...SVG_COMMON_WEB_PROPERTIES_CONFIG,
  x: 'px',
  y: 'px',
  width: 'px',
  height: 'px'
};
//# sourceMappingURL=image.js.map