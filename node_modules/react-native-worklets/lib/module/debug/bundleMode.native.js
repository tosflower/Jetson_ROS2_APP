'use strict';

export function isBundleModeEnabled() {
  return globalThis._WORKLETS_BUNDLE_MODE_ENABLED === true && (() => {
    'worklet';
  }).__initData === undefined;
}
//# sourceMappingURL=bundleMode.native.js.map