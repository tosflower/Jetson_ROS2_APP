'use strict';

// TODO: Fix me
// @ts-ignore RNSVG doesn't export types for web, see https://github.com/software-mansion/react-native-svg/pull/2801
export const convertStringToNumber = conversions => value => conversions[value];
const commaReg = /\s*,\s*/g;
const spaceReg = /\s+/;
export const processNumberArray = value => {
  if (Array.isArray(value)) {
    return value;
  } else if (typeof value === 'number') {
    return [value];
  } else if (typeof value === 'string') {
    return value.trim().replace(commaReg, ' ').split(spaceReg);
  } else {
    return [];
  }
};
//# sourceMappingURL=others.js.map