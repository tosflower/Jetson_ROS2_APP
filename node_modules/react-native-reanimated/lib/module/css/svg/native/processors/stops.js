'use strict';

import { logger } from "../../../../common/index.js";
import { processColorSVG } from "./colors.js";
import { processPercentage } from "./percentage.js";
const NO_STOPS_WARNING = 'No stops in SVG gradient';
export const processSVGGradientStops = stops => {
  if (!stops || !Array.isArray(stops) || stops.length === 0) {
    logger.warn(NO_STOPS_WARNING);
    return [];
  }
  const intermediate = stops.map(stop => {
    const rawColor = stop.color && processColorSVG(stop.color);
    const stopOpacity = processPercentage(stop.opacity ?? 1);
    const finalColor = typeof rawColor === 'number' && typeof stopOpacity === 'number' ? (Math.round((rawColor >>> 24 & 0xff) * stopOpacity) << 24 | rawColor & 0x00ffffff) >>> 0 : rawColor;
    return {
      offset: processPercentage(stop.offset ?? 0),
      color: finalColor
    };
  });
  intermediate.sort((a, b) => Number(a.offset) - Number(b.offset));

  // This linearised format is used to be consistent with what RNSVG does
  const ret = [];
  for (const item of intermediate) {
    ret.push(item.offset);
    ret.push(item.color);
  }
  return ret;
};
//# sourceMappingURL=stops.js.map