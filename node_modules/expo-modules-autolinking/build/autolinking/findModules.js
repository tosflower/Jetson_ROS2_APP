"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    findModulesAsync: null,
    resolveExpoModule: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get findModulesAsync () {
        return findModulesAsync;
    },
    get resolveExpoModule () {
        return resolveExpoModule;
    }
});
const _ExpoModuleConfig = require("../ExpoModuleConfig");
const _dependencies = require("../dependencies");
const _memoize = require("../memoize");
async function resolveExpoModule(resolution, platform, excludeNames) {
    if (excludeNames.has(resolution.name)) {
        return null;
    }
    // Workaround for Android Gradle/Prefab issue with special characters in paths.
    // pnpm creates virtual store paths with '=' characters (e.g., _patch_hash=abc123),
    // which cause build failures on Android due to Prefab not properly escaping them.
    // See: https://github.com/google/prefab/issues/187
    const shouldUseOriginPath = platform === 'android' && resolution.path.includes('=') && resolution.path.includes('.pnpm');
    const modulePath = shouldUseOriginPath ? resolution.originPath : resolution.path;
    const expoModuleConfig = await (0, _ExpoModuleConfig.discoverExpoModuleConfigAsync)(modulePath);
    if (expoModuleConfig && expoModuleConfig.supportsPlatform(platform)) {
        return {
            name: resolution.name,
            path: modulePath,
            version: resolution.version,
            config: expoModuleConfig,
            duplicates: resolution.duplicates?.map((duplicate)=>({
                    name: duplicate.name,
                    path: duplicate.path,
                    version: duplicate.version
                })) ?? []
        };
    } else {
        return null;
    }
}
async function findModulesAsync({ appRoot, autolinkingOptions }) {
    const memoizer = (0, _memoize.createMemoizer)();
    const excludeNames = new Set(autolinkingOptions.exclude);
    // custom native modules should be resolved first so that they can override other modules
    const searchPaths = autolinkingOptions.nativeModulesDir ? [
        autolinkingOptions.nativeModulesDir,
        ...autolinkingOptions.searchPaths
    ] : autolinkingOptions.searchPaths;
    return memoizer.withMemoizer(async ()=>{
        return (0, _dependencies.filterMapResolutionResult)((0, _dependencies.mergeResolutionResults)(await Promise.all([
            ...searchPaths.map((searchPath)=>(0, _dependencies.scanDependenciesInSearchPath)(searchPath)),
            (0, _dependencies.scanDependenciesRecursively)(appRoot)
        ])), (resolution)=>resolveExpoModule(resolution, autolinkingOptions.platform, excludeNames));
    });
}

//# sourceMappingURL=findModules.js.map
