'use strict';

import { processSVGPath } from "./path.js";
function extractPolyPoints(points) {
  const polyPoints = Array.isArray(points) ? points.join(',') : points;
  return polyPoints.replace(/([^eE])-/g, '$1 -').split(/(?:\s+|\s*,\s*)/g).join(' ');
}
export const processPolylinePoints = points => ({
  d: processSVGPath(`M${extractPolyPoints(points)}`)
});
export const processPolygonPoints = points => ({
  d: processSVGPath(`M${extractPolyPoints(points)}z`)
});
//# sourceMappingURL=polypoints.js.map