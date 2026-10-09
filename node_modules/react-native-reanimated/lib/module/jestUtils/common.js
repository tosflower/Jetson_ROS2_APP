'use strict';

/**
 * Converts any callback function to a mock worklet function for testing
 * purposes. This function simulates a worklet by adding the required internal
 * properties.
 *
 * @param callback - Optional callback function to wrap as a worklet. If not
 *   provided, returns an empty worklet.
 * @returns A mock worklet function with the required worklet properties.
 */
export const worklet = callback => {
  const fn = callback ?? (() => undefined);
  fn.__workletHash = Math.random();
  fn.__closure = {};
  return fn;
};

/** Creates a new worklet with the same hash and closure as the original. */
export const cloneWorklet = original => {
  const w = worklet();
  w.__workletHash = original.__workletHash;
  w.__closure = {
    ...original.__closure
  };
  return w;
};
//# sourceMappingURL=common.js.map