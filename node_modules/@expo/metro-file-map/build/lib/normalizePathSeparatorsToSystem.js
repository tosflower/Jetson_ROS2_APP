/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
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
let normalizePathSeparatorsToSystem;
if (_path().default.sep === '/') {
    normalizePathSeparatorsToSystem = (filePath)=>filePath;
} else {
    normalizePathSeparatorsToSystem = (filePath)=>filePath.replace(/\//g, _path().default.sep);
}
const _default = normalizePathSeparatorsToSystem;

//# sourceMappingURL=normalizePathSeparatorsToSystem.js.map
