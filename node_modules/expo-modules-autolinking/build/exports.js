"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    findProjectRootSync: null,
    makeCachedDependenciesLinker: null,
    mergeLinkingOptionsAsync: null,
    queryAutolinkingModulesFromProjectAsync: null,
    resolveSearchPathsAsync: null,
    scanDependencyResolutionsForPlatform: null,
    scanExpoModuleResolutionsForPlatform: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get findProjectRootSync () {
        return findProjectRootSync;
    },
    get makeCachedDependenciesLinker () {
        return _dependencies.makeCachedDependenciesLinker;
    },
    get mergeLinkingOptionsAsync () {
        return mergeLinkingOptionsAsync;
    },
    get queryAutolinkingModulesFromProjectAsync () {
        return queryAutolinkingModulesFromProjectAsync;
    },
    get resolveSearchPathsAsync () {
        return resolveSearchPathsAsync;
    },
    get scanDependencyResolutionsForPlatform () {
        return _dependencies.scanDependencyResolutionsForPlatform;
    },
    get scanExpoModuleResolutionsForPlatform () {
        return _dependencies.scanExpoModuleResolutionsForPlatform;
    }
});
0 && __export(require("./types")) && __export(require("./autolinking")) && __export(require("./platforms")) && __export(require("./utilities"));
function _fs() {
    const data = /*#__PURE__*/ _interop_require_default(require("fs"));
    _fs = function() {
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
const _findModules = require("./autolinking/findModules");
const _resolveModules = require("./autolinking/resolveModules");
const _autolinkingOptions = require("./commands/autolinkingOptions");
_export_star(require("./types"), exports);
_export_star(require("./autolinking"), exports);
_export_star(require("./platforms"), exports);
const _dependencies = require("./dependencies");
_export_star(require("./utilities"), exports);
function _export_star(from, to) {
    Object.keys(from).forEach(function(k) {
        if (k !== "default" && !Object.prototype.hasOwnProperty.call(to, k)) {
            Object.defineProperty(to, k, {
                enumerable: true,
                get: function() {
                    return from[k];
                }
            });
        }
    });
    return from;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function mergeLinkingOptionsAsync(argumentsOptions) {
    const autolinkingOptionsLoader = (0, _autolinkingOptions.createAutolinkingOptionsLoader)(argumentsOptions);
    return {
        ...argumentsOptions,
        ...await autolinkingOptionsLoader.getPlatformOptions(),
        projectRoot: autolinkingOptionsLoader.getAppRoot()
    };
}
async function queryAutolinkingModulesFromProjectAsync(projectRoot, options) {
    const autolinkingOptionsLoader = (0, _autolinkingOptions.createAutolinkingOptionsLoader)({
        ...options,
        // NOTE(@kitten): This has always been duplicated
        projectRoot: options.projectRoot ?? projectRoot
    });
    const appRoot = await autolinkingOptionsLoader.getAppRoot();
    const autolinkingOptions = await autolinkingOptionsLoader.getPlatformOptions(options.platform);
    const searchResults = await (0, _findModules.findModulesAsync)({
        appRoot,
        autolinkingOptions
    });
    return await (0, _resolveModules.resolveModulesAsync)(searchResults, autolinkingOptions);
}
function findProjectRootSync(cwd = process.cwd()) {
    for(let dir = cwd; _path().default.dirname(dir) !== dir; dir = _path().default.dirname(dir)){
        const file = _path().default.resolve(dir, 'package.json');
        if (_fs().default.existsSync(file)) {
            return file;
        }
    }
    throw new Error(`Couldn't find "package.json" up from path "${cwd}"`);
}
async function resolveSearchPathsAsync(searchPaths, cwd) {
    return (0, _autolinkingOptions.filterMapSearchPaths)(searchPaths, cwd) ?? [];
}

//# sourceMappingURL=exports.js.map
