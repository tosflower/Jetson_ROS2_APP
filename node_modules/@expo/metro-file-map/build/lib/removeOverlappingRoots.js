/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 * @format
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return removeOverlappingRoots;
    }
});
function _path() {
    const data = /*#__PURE__*/ _interop_require_default(require("path"));
    _path = function() {
        return data;
    };
    return data;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function removeOverlappingRoots(roots) {
    const sorted = roots.map((r)=>_path().default.resolve(r)).sort((a, b)=>{
        const aRoot = a + _path().default.sep;
        const bRoot = b + _path().default.sep;
        return aRoot < bRoot ? -1 : aRoot > bRoot ? 1 : 0;
    });
    if (sorted.length === 0) {
        return sorted;
    }
    const result = [
        sorted[0]
    ];
    for(let i = 1; i < sorted.length; i++){
        const rootPath = sorted[i] + _path().default.sep;
        const prevPath = result[result.length - 1] + _path().default.sep;
        if (!rootPath.startsWith(prevPath)) {
            result.push(sorted[i]);
        }
    }
    return result;
}

//# sourceMappingURL=removeOverlappingRoots.js.map
