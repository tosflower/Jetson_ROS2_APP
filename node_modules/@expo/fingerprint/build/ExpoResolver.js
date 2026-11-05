"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    resolveExpoAutolinkingCliPath: null,
    resolveExpoAutolinkingPackageRoot: null,
    resolveExpoAutolinkingVersion: null,
    resolveExpoConfigPluginsPackagePath: null,
    resolveExpoVersion: null,
    satisfyExpoVersion: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get resolveExpoAutolinkingCliPath () {
        return resolveExpoAutolinkingCliPath;
    },
    get resolveExpoAutolinkingPackageRoot () {
        return resolveExpoAutolinkingPackageRoot;
    },
    get resolveExpoAutolinkingVersion () {
        return resolveExpoAutolinkingVersion;
    },
    get resolveExpoConfigPluginsPackagePath () {
        return resolveExpoConfigPluginsPackagePath;
    },
    get resolveExpoVersion () {
        return resolveExpoVersion;
    },
    get satisfyExpoVersion () {
        return satisfyExpoVersion;
    }
});
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
function _semver() {
    const data = /*#__PURE__*/ _interop_require_default(require("semver"));
    _semver = function() {
        return data;
    };
    return data;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let cachedExpoAutolinkingPackageRoot = null;
function resolveExpoVersion(projectRoot) {
    const expoPackageJsonPath = _resolvefrom().default.silent(projectRoot, 'expo/package.json');
    if (expoPackageJsonPath) {
        const expoPackageJson = require(expoPackageJsonPath);
        return expoPackageJson.version;
    }
    return null;
}
function resolveExpoAutolinkingPackageRoot(projectRoot) {
    if (cachedExpoAutolinkingPackageRoot) {
        const [cachedProjectRoot, cachedPackageRoot] = cachedExpoAutolinkingPackageRoot;
        if (cachedProjectRoot === projectRoot) {
            return cachedPackageRoot;
        }
    }
    const expoPackageRoot = _resolvefrom().default.silent(projectRoot, 'expo/package.json');
    const autolinkingPackageJsonPath = _resolvefrom().default.silent(expoPackageRoot ?? projectRoot, 'expo-modules-autolinking/package.json');
    if (autolinkingPackageJsonPath) {
        const autolinkingPackageRoot = _path().default.dirname(autolinkingPackageJsonPath);
        cachedExpoAutolinkingPackageRoot = [
            projectRoot,
            autolinkingPackageRoot
        ];
        return autolinkingPackageRoot;
    }
    return null;
}
function resolveExpoAutolinkingCliPath(projectRoot) {
    const autolinkingPackageRoot = resolveExpoAutolinkingPackageRoot(projectRoot);
    if (autolinkingPackageRoot == null) {
        throw new Error('Cannot resolve expo-modules-autolinking package in the project.');
    }
    return _path().default.join(autolinkingPackageRoot, 'bin', 'expo-modules-autolinking.js');
}
function resolveExpoAutolinkingVersion(projectRoot) {
    const autolinkingPackageRoot = resolveExpoAutolinkingPackageRoot(projectRoot);
    if (autolinkingPackageRoot) {
        const autolinkingPackageJson = require(_path().default.join(autolinkingPackageRoot, 'package.json'));
        return autolinkingPackageJson.version;
    }
    return null;
}
function resolveExpoConfigPluginsPackagePath(projectRoot) {
    return _resolvefrom().default.silent(projectRoot, 'expo/config-plugins') ?? null;
}
function satisfyExpoVersion(projectRoot, range) {
    const expoVersion = resolveExpoVersion(projectRoot);
    if (expoVersion) {
        return _semver().default.satisfies(expoVersion, range);
    }
    return null;
}

//# sourceMappingURL=ExpoResolver.js.map
