'use strict';

import { runOnUISync, toggleSlowAnimationsOnUIRuntime } from 'react-native-worklets';
import { IS_WEB, SHOULD_BE_USE_WEB } from "./common/index.js";
import { initSvgCssSupport } from "./css/svg/index.js";
import { getStaticFeatureFlag } from "./featureFlags/index.js";
export function initializeReanimatedModule(ReanimatedModule) {
  if (!IS_WEB && !ReanimatedModule) {
    throw new Error('[Reanimated] Tried to initialize Reanimated without a valid ReanimatedModule');
  }
  if (getStaticFeatureFlag('EXPERIMENTAL_CSS_ANIMATIONS_FOR_SVG_COMPONENTS')) {
    initSvgCssSupport();
  }
}

// is-tree-shakable-suppress
if (!SHOULD_BE_USE_WEB) {
  globalThis.__toggleSlowAnimationsOnUIRuntime = () => toggleSlowAnimationsOnUIRuntime();
  runOnUISync(() => {
    'worklet';

    global._tagToJSPropNamesMapping = {};
  });
}
//# sourceMappingURL=initializers.js.map