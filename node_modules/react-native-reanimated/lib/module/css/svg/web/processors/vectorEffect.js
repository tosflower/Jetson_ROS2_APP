'use strict';

const VECTOR_EFFECT_CSS_VALUES = {
  none: 'none',
  default: 'none',
  nonScalingStroke: 'non-scaling-stroke',
  'non-scaling-stroke': 'non-scaling-stroke',
  inherit: 'inherit'
};
export const processVectorEffect = value => VECTOR_EFFECT_CSS_VALUES[value] ?? value;
//# sourceMappingURL=vectorEffect.js.map