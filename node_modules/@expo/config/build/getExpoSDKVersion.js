"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getExpoSDKVersion", {
    enumerable: true,
    get: function() {
        return getExpoSDKVersion;
    }
});
function _jsonfile() {
    const data = /*#__PURE__*/ _interop_require_default(require("@expo/json-file"));
    _jsonfile = function() {
        return data;
    };
    return data;
}
function _requireutils() {
    const data = require("@expo/require-utils");
    _requireutils = function() {
        return data;
    };
    return data;
}
const _Errors = require("./Errors");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function getExpoSDKVersion(projectRoot, exp = {}) {
    return exp?.sdkVersion ?? getExpoSDKVersionFromPackage(projectRoot);
}
/**
 * Resolve the Expo SDK Version either from the input Expo config or from the installed
 * version of the `expo` package.
 */ function getExpoSDKVersionFromPackage(projectRoot) {
    const packageJsonPath = (0, _requireutils().resolveFrom)(projectRoot, 'expo/package.json');
    if (!packageJsonPath) {
        throw new _Errors.ConfigError(`Cannot determine the project's Expo SDK version because the module \`expo\` is not installed. Install it with \`npm install expo\` and try again.`, 'MODULE_NOT_FOUND');
    }
    const expoPackageJson = _jsonfile().default.read(packageJsonPath, {
        json5: true
    });
    const { version: packageVersion } = expoPackageJson;
    if (!(typeof packageVersion === 'string')) {
        // This is technically impossible.
        throw new _Errors.ConfigError(`Cannot determine the project's Expo SDK version because the module \`expo\` has an invalid package.json (missing \`version\` field). Try reinstalling node modules and trying again.`, 'MODULE_NOT_FOUND');
    }
    const majorVersion = packageVersion.split('.').shift();
    return `${majorVersion}.0.0`;
}

//# sourceMappingURL=getExpoSDKVersion.js.map
