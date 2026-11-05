'use strict';

import { initSvgCssSupport } from "./css/svg/index.js";
import { getStaticFeatureFlag } from "./featureFlags/index.js";
export function initializeReanimatedModule(_ReanimatedModule) {
  if (getStaticFeatureFlag('EXPERIMENTAL_CSS_ANIMATIONS_FOR_SVG_COMPONENTS')) {
    initSvgCssSupport();
  }
}
//# sourceMappingURL=initializers.js.map