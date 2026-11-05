"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    resolveExtraBuildDependenciesAsync: null,
    resolveModuleAsync: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get resolveExtraBuildDependenciesAsync () {
        return resolveExtraBuildDependenciesAsync;
    },
    get resolveModuleAsync () {
        return resolveModuleAsync;
    }
});
function _requireutils() {
    const data = require("@expo/require-utils");
    _requireutils = function() {
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
const _utils = require("../utils");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function resolveModuleAsync(packageName, revision) {
    const devtoolsConfig = revision.config?.toJSON().devtools;
    if (devtoolsConfig == null) {
        return null;
    }
    return {
        packageName,
        packageRoot: revision.path,
        webpageRoot: await resolvePackageLocalWebpageRoot(revision.path, devtoolsConfig.webpageRoot),
        bannerTitle: devtoolsConfig.bannerTitle,
        serverEntryPoint: await resolvePackageLocalPath(revision.path, devtoolsConfig.serverEntryPoint),
        cliExtensions: devtoolsConfig.cliExtensions
    };
}
async function resolvePackageLocalPath(packageRoot, configuredPath) {
    if (!configuredPath) {
        return undefined;
    }
    const resolvedPath = (0, _requireutils().resolveFrom)(packageRoot, configuredPath);
    if (!resolvedPath) {
        return undefined;
    }
    return (0, _utils.isPathInside)(resolvedPath, packageRoot) ? resolvedPath : undefined;
}
async function resolvePackageLocalWebpageRoot(packageRoot, configuredPath) {
    if (!configuredPath) {
        return undefined;
    }
    const resolvedPath = _path().default.resolve(packageRoot, configuredPath);
    // NOTE(@kitten): Failing realpath-ing, typically due to ENOENT, results in the original value
    const realPath = await (0, _utils.maybeRealpath)(resolvedPath) ?? resolvedPath;
    return (0, _utils.isPathInside)(realPath, packageRoot) ? realPath : undefined;
}
async function resolveExtraBuildDependenciesAsync(_projectNativeRoot) {
    return null;
}

//# sourceMappingURL=devtools.js.map
