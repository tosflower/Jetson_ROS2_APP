'use strict';

export function normalizeIterationCount(iterationCount) {
  if (iterationCount === Infinity || iterationCount === 'infinite') {
    return 'infinite';
  }
  return String(iterationCount);
}
//# sourceMappingURL=settings.js.map