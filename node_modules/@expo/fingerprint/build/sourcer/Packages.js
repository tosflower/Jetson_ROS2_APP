"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getDefaultPackageSourcesAsync: null,
    getPackageSourceAsync: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getDefaultPackageSourcesAsync () {
        return getDefaultPackageSourcesAsync;
    },
    get getPackageSourceAsync () {
        return getPackageSourceAsync;
    }
});
function _chalk() {
    const data = /*#__PURE__*/ _interop_require_default(require("chalk"));
    _chalk = function() {
        return data;
    };
    return data;
}
function _promises() {
    const data = /*#__PURE__*/ _interop_require_default(require("fs/promises"));
    _promises = function() {
        return data;
    };
    return data;
}
function _path() {
    const data = /*#__PURE__*/ _interop_require_default(require("path"));
    _path = function() {
        return data;
    };
    return data;
}
function _resolvefrom() {
    const data = /*#__PURE__*/ _interop_require_default(require("resolve-from"));
    _resolvefrom = function() {
        return data;
    };
    return data;
}
const _Path = require("../utils/Path");
const _Utils = require("./Utils");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const debug = require('debug')('expo:fingerprint:sourcer:Packages');
const DEFAULT_PACKAGES = [
    {
        packageName: 'react-native',
        sourceType: 'package'
    }
];
async function getDefaultPackageSourcesAsync(projectRoot, options) {
    const results = await Promise.all(DEFAULT_PACKAGES.map((params)=>getPackageSourceAsync(projectRoot, params)));
    return results.filter(Boolean);
}
async function getPackageSourceAsync(projectRoot, params) {
    const reason = `package:${params.packageName}`;
    const packageJsonPath = _resolvefrom().default.silent(projectRoot, `${params.packageName}/package.json`);
    if (packageJsonPath == null) {
        return null;
    }
    debug(`Adding package - ${_chalk().default.dim(params.packageName)}`);
    if (params.sourceType === 'package') {
        let packageJson;
        try {
            packageJson = JSON.parse(await _promises().default.readFile(packageJsonPath, 'utf8'));
        } catch (error) {
            // A resolved package.json that can't be read shouldn't crash fingerprinting; skip the source.
            if (error.code === 'ENOENT') {
                return null;
            }
            throw error;
        }
        return {
            type: 'package',
            name: packageJson.name ?? '',
            version: packageJson.version ?? '',
            filePath: (0, _Path.toPosixPath)(_path().default.relative(projectRoot, packageJsonPath)),
            reasons: [
                reason
            ]
        };
    }
    const packageRoot = _path().default.relative(projectRoot, _path().default.dirname(packageJsonPath));
    return await (0, _Utils.getFileBasedHashSourceAsync)(projectRoot, packageRoot, reason);
}

//# sourceMappingURL=Packages.js.map
