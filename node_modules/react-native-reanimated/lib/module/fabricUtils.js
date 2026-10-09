'use strict';

import { findHostInstance } from './platform-specific/findHostInstance';
export function getShadowNodeWrapperFromRef(ref, hostInstance) {
  let resolvedInstance = hostInstance?.__internalInstanceHandle ?? ref?.__internalInstanceHandle;
  if (!resolvedInstance) {
    if (ref.getNativeScrollRef) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolvedInstance = ref.getNativeScrollRef().__internalInstanceHandle;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } else if (ref._reactInternals) {
      resolvedInstance = findHostInstance(ref).__internalInstanceHandle;
    } else {
      throw new Error(`[Reanimated] Failed to find host instance for a ref.`);
    }
  }
  return resolvedInstance.stateNode.node;
}
//# sourceMappingURL=fabricUtils.js.map