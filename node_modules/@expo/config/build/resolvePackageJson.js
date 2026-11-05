"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getRootPackageJsonPath", {
    enumerable: true,
    get: function() {
        return getRootPackageJsonPath;
    }
});
function _fs() {
    const data = require("fs");
    _fs = function() {
        return data;
    };
    return data;
}
function _path() {
    const data = require("path");
    _path = function() {
        return data;
    };
    return data;
}
const _Errors = require("./Errors");
function getRootPackageJsonPath(projectRoot) {
    const packageJsonPath = (0, _path().join)(projectRoot, 'package.json');
    if (!(0, _fs().existsSync)(packageJsonPath)) {
        throw new _Errors.ConfigError(`The expected package.json path: ${packageJsonPath} does not exist`, 'MODULE_NOT_FOUND');
    }
    return packageJsonPath;
}

//# sourceMappingURL=resolvePackageJson.js.map
