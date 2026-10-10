'use strict';

import { processColor } from "../../../../common/web/index.js";
import { processStrokeDashArray, processVectorEffect } from "../processors/index.js";
const colorAttributes = {
  process: processColor
};
const colorProps = {
  color: colorAttributes
};
const fillProps = {
  fill: colorAttributes,
  fillOpacity: true,
  fillRule: true
};
const strokeProps = {
  stroke: colorAttributes,
  strokeWidth: 'px',
  strokeOpacity: true,
  strokeDasharray: {
    process: processStrokeDashArray
  },
  strokeDashoffset: 'px',
  strokeLinecap: true,
  strokeLinejoin: true,
  strokeMiterlimit: true,
  vectorEffect: {
    process: processVectorEffect
  }
};
const transformProps = {
  transform: true
};
const responderProps = {
  pointerEvents: true
};
export const SVG_COMMON_WEB_PROPERTIES_CONFIG = {
  ...colorProps,
  ...fillProps,
  ...strokeProps,
  ...transformProps,
  ...responderProps,
  opacity: true
};
//# sourceMappingURL=common.js.map