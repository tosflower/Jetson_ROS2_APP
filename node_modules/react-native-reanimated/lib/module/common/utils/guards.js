'use strict';

export const isDefined = value => value !== undefined && value !== null;
export const isAngle = value => {
  'worklet';

  return typeof value === 'string' && /^-?\d+(\.\d+)?(deg|rad)$/.test(value);
};
export const isNumber = value => {
  'worklet';

  return typeof value === 'number' && !isNaN(value);
};
export const isNumberArray = value => {
  'worklet';

  return Array.isArray(value) && value.every(isNumber);
};
export const isLength = value => {
  'worklet';

  return value.endsWith('px') || !isNaN(Number(value));
};
export const isPercentage = value => {
  'worklet';

  return typeof value === 'string' && /^-?\d+(\.\d+)?%$/.test(value);
};
export const isRecord = value => {
  'worklet';

  return typeof value === 'object' && value !== null && !Array.isArray(value);
};
export const isEmptyObject = value => {
  'worklet';

  return isRecord(value) && Object.keys(value).length === 0;
};
export const isConfigPropertyAlias = value => !!value && typeof value === 'object' && 'as' in value && typeof value.as === 'string';
export const hasValueProcessor = configValue => isRecord(configValue) && 'process' in configValue;
//# sourceMappingURL=guards.js.map