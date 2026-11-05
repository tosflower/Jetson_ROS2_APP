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
const MOCKS_PATTERN = _path().default.sep + '__mocks__' + _path().default.sep;
const _default = (filePath)=>{
    const mockPath = filePath.split(MOCKS_PATTERN)[1];
    return mockPath.substring(0, mockPath.lastIndexOf(_path().default.extname(mockPath))).replaceAll('\\', '/');
};

//# sourceMappingURL=getMockName.js.map
