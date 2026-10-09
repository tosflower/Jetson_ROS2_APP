'use strict';

export const processInset = value => {
  'worklet';

  return {
    top: value,
    bottom: value,
    left: value,
    right: value
  };
};
export const processInsetBlock = value => {
  'worklet';

  return {
    top: value,
    bottom: value
  };
};
export const processInsetInline = value => {
  'worklet';

  return {
    left: value,
    right: value
  };
};
//# sourceMappingURL=insets.js.map