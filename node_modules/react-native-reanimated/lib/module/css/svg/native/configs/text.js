'use strict';

// TODO: Fix me
// @ts-ignore RNSVG doesn't export types for web, see https://github.com/software-mansion/react-native-svg/pull/2801
import { processNumberArray } from "../processors/index.js";
import { SVG_COMMON_PROPERTIES_CONFIG } from "./common.js";
export const SVG_TEXT_PROPERTIES_CONFIG = {
  ...SVG_COMMON_PROPERTIES_CONFIG,
  // A single number/string is wrapped into an array to match NumberArray.
  x: {
    process: processNumberArray
  },
  y: {
    process: processNumberArray
  },
  dx: {
    process: processNumberArray
  },
  dy: {
    process: processNumberArray
  },
  rotate: {
    process: processNumberArray
  },
  // TODO:
  // implement them
  lengthAdjust: false,
  textLength: false,
  children: false,
  inlineSize: false,
  alignmentBaseline: false,
  baselineShift: false,
  verticalAlign: false,
  fontData: false,
  fontFeatureSettings: false,
  font: false,
  fontStyle: false,
  fontVariant: false,
  fontWeight: false,
  fontStretch: false,
  fontSize: false,
  fontFamily: false,
  textAnchor: false,
  textDecoration: false,
  letterSpacing: false,
  wordSpacing: false,
  kerning: false,
  fontVariantLigatures: false,
  fontVariationSettings: false
};
//# sourceMappingURL=text.js.map