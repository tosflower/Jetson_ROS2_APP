'use strict';

import { withImplicitStrokeDashArrayBounds, withMatchingPathStructure } from "../../svg/web/processors/index.js";
// Whole-set keyframe fixups (need every keyframe at once, not one value). Each
// is a no-op unless its prop is animated, so order is irrelevant.
const NORMALIZERS = [withImplicitStrokeDashArrayBounds, withMatchingPathStructure];
export const normalizeWebKeyframes = keyframes => NORMALIZERS.reduce((acc, normalize) => normalize(acc), keyframes);
//# sourceMappingURL=keyframes.js.map