"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    isNativeModuleAsync: null,
    makeCachedDependenciesLinker: null,
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
    get isNativeModuleAsync () {
        return isNativeModuleAsync;
    },
    get makeCachedDependenciesLinker () {
        return makeCachedDependenciesLinker;
    },
    get scanDependencyResolutionsForPlatform () {
        return scanDependencyResolutionsForPlatform;
    },
    get scanExpoModuleResolutionsForPlatform () {
        return scanExpoModuleResolutionsForPlatform;
    }
});
function _fs() {
    const data = /*#__PURE__*/ _interop_require_default(require("fs"));
    _fs = function() {
        return data;
    };
    return data;
}
const _findModules = require("../autolinking/findModules");
const _autolinkingOptions = require("../commands/autolinkingOptions");
const _memoize = require("../memoize");
const _platforms = require("../platforms");
const _reactNativeConfig = require("../reactNativeConfig");
const _config = require("../reactNativeConfig/config");
const _resolution = require("./resolution");
const _rncliLocal = require("./rncliLocal");
const _scanning = require("./scanning");
const _types = require("./types");
const _utils = require("./utils");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function makeCachedDependenciesLinker(params) {
    const memoizer = (0, _memoize.createMemoizer)();
    const autolinkingOptionsLoader = (0, _autolinkingOptions.createAutolinkingOptionsLoader)({
        projectRoot: params.projectRoot
    });
    let appRoot;
    const getAppRoot = ()=>appRoot || (appRoot = autolinkingOptionsLoader.getAppRoot());
    const dependenciesResultBySearchPath = new Map();
    let reactNativeProjectConfig;
    let reactNativeProjectConfigDependencies;
    let recursiveDependencies;
    return {
        memoizer,
        async getOptionsForPlatform (platform, extraInclude) {
            const options = await autolinkingOptionsLoader.getPlatformOptions(platform);
            return makeCachedDependenciesSearchOptions(options, extraInclude);
        },
        async loadReactNativeProjectConfig () {
            if (reactNativeProjectConfig === undefined) {
                reactNativeProjectConfig = memoizer.call(_config.loadConfigAsync, await getAppRoot());
            }
            return reactNativeProjectConfig;
        },
        async scanDependenciesFromRNProjectConfig () {
            if (reactNativeProjectConfigDependencies === undefined) {
                reactNativeProjectConfigDependencies = memoizer.withMemoizer(async ()=>{
                    return await (0, _rncliLocal.scanDependenciesFromRNProjectConfig)(await getAppRoot(), await this.loadReactNativeProjectConfig());
                });
            }
            return reactNativeProjectConfigDependencies;
        },
        async scanDependenciesRecursively () {
            if (recursiveDependencies === undefined) {
                recursiveDependencies = memoizer.withMemoizer(async ()=>{
                    return (0, _resolution.scanDependenciesRecursively)(await getAppRoot());
                });
            }
            return recursiveDependencies;
        },
        async scanDependenciesInSearchPath (searchPath) {
            let result = dependenciesResultBySearchPath.get(searchPath);
            if (!result) {
                dependenciesResultBySearchPath.set(searchPath, result = memoizer.withMemoizer(_scanning.scanDependenciesInSearchPath, searchPath));
            }
            return result;
        }
    };
}
async function isNativeModuleAsync(resolution, reactNativeProjectConfig, platform, excludeNames) {
    const [reactNativeModule, expoModule] = await Promise.all([
        (0, _reactNativeConfig.resolveReactNativeModule)(resolution, reactNativeProjectConfig, platform, excludeNames),
        (0, _findModules.resolveExpoModule)(resolution, platform, excludeNames)
    ]);
    return !!reactNativeModule || !!expoModule;
}
async function scanDependencyResolutionsForPlatform(linker, platform, extraInclude) {
    const opts = await linker.getOptionsForPlatform(platform, extraInclude);
    const reactNativeProjectConfig = await linker.loadReactNativeProjectConfig();
    const resolutions = (0, _utils.mergeResolutionResults)(await Promise.all([
        linker.scanDependenciesFromRNProjectConfig(),
        ...opts.searchPaths.map((searchPath)=>{
            return linker.scanDependenciesInSearchPath(searchPath);
        }),
        linker.scanDependenciesRecursively()
    ]));
    return await linker.memoizer.withMemoizer(async ()=>{
        const dependencies = await (0, _utils.filterMapResolutionResult)(resolutions, async (resolution)=>{
            if (opts.excludeNames.has(resolution.name)) {
                return null;
            } else if (opts.includeNames.has(resolution.name)) {
                return resolution;
            } else if (resolution.source === _types.DependencyResolutionSource.RN_CLI_LOCAL) {
                // If the dependency was resolved from the React Native project config, we'll only
                // attempt to resolve it as a React Native module
                const reactNativeModuleDesc = await (0, _reactNativeConfig.resolveReactNativeModule)(resolution, reactNativeProjectConfig, platform, opts.excludeNames);
                if (!reactNativeModuleDesc) {
                    return null;
                }
            } else {
                const isNativeModule = await isNativeModuleAsync(resolution, reactNativeProjectConfig, platform, opts.excludeNames);
                if (!isNativeModule) {
                    return null;
                }
            }
            return resolution;
        });
        // OOT platforms (tvos/macos) ship their react-native fork as a separately-named package
        // Include it in the sticky output so the module resolver can deduplicate and redirect to it
        const supportPackage = (0, _platforms.getSupportPackageForPlatform)(platform);
        if (supportPackage && supportPackage !== 'react-native') {
            const supportResolution = resolutions[supportPackage];
            if (supportResolution) {
                dependencies[supportPackage] = {
                    ...supportResolution,
                    name: supportPackage
                };
            }
        }
        return dependencies;
    });
}
async function scanExpoModuleResolutionsForPlatform(linker, platform, extraInclude) {
    const { excludeNames, searchPaths } = await linker.getOptionsForPlatform(platform, extraInclude);
    const resolutions = (0, _utils.mergeResolutionResults)(await Promise.all([
        ...searchPaths.map((searchPath)=>{
            return linker.scanDependenciesInSearchPath(searchPath);
        }),
        linker.scanDependenciesRecursively()
    ].filter((x)=>x != null)));
    return await linker.memoizer.withMemoizer(async ()=>{
        return await (0, _utils.filterMapResolutionResult)(resolutions, async (resolution)=>{
            return !excludeNames.has(resolution.name) ? await (0, _findModules.resolveExpoModule)(resolution, platform, excludeNames) : null;
        });
    });
}
const makeCachedDependenciesSearchOptions = (options, extraInclude)=>({
        excludeNames: new Set(options.exclude),
        includeNames: new Set(extraInclude ? [
            ...options.include,
            ...extraInclude
        ] : options.include),
        searchPaths: options.nativeModulesDir && _fs().default.existsSync(options.nativeModulesDir) ? [
            options.nativeModulesDir,
            ...options.searchPaths ?? []
        ] : options.searchPaths ?? []
    });

//# sourceMappingURL=CachedDependenciesLinker.js.map
