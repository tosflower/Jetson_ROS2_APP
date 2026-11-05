'use strict';

// Priority order - later is more important
export const NATIVE_PSEUDO_SELECTORS_PRIORITY = [':focus-within', ':focus', ':hover', ':active', ':active-deepest'];
export const NATIVE_PSEUDO_SELECTORS = new Set(NATIVE_PSEUDO_SELECTORS_PRIORITY);
export const PRESS_PSEUDO_SELECTORS = [':active', ':active-deepest'];
//# sourceMappingURL=pseudoSelectors.js.map