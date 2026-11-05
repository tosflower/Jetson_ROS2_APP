"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getAutolinkedPackagesAsync: null,
    resolvePackagesList: null,
    shouldSkipAutoPlugin: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getAutolinkedPackagesAsync () {
        return getAutolinkedPackagesAsync;
    },
    get resolvePackagesList () {
        return resolvePackagesList;
    },
    get shouldSkipAutoPlugin () {
        return shouldSkipAutoPlugin;
    }
});
function _exports() {
    const data = require("expo-modules-autolinking/exports");
    _exports = function() {
        return data;
    };
    return data;
}
async function getAutolinkedPackagesAsync(projectRoot, platforms = [
    'ios',
    'android'
]) {
    const linker = (0, _exports().makeCachedDependenciesLinker)({
        projectRoot
    });
    const dependenciesPerPlatform = await Promise.all(platforms.map((platform)=>{
        return (0, _exports().scanExpoModuleResolutionsForPlatform)(linker, platform);
    }));
    return resolvePackagesList(dependenciesPerPlatform);
}
function resolvePackagesList(platformPaths) {
    const allPlatformPaths = platformPaths.map((paths)=>Object.keys(paths)).flat();
    const uniquePaths = [
        ...new Set(allPlatformPaths)
    ];
    return uniquePaths.sort();
}
function shouldSkipAutoPlugin(config, plugin) {
    // Hack workaround because expo-dev-client doesn't use expo modules.
    if (plugin === 'expo-dev-client') {
        return false;
    }
    // Only perform the check if `autolinkedModules` is defined, otherwise we assume
    // this is a legacy runner which doesn't support autolinking.
    if (Array.isArray(config._internal?.autolinkedModules)) {
        // Resolve the pluginId as a string.
        const pluginId = Array.isArray(plugin) ? plugin[0] : plugin;
        if (typeof pluginId === 'string') {
            // Determine if the autolinked modules list includes our moduleId
            const isIncluded = config._internal.autolinkedModules.includes(pluginId);
            if (!isIncluded) {
                // If it doesn't then we know that any potential plugin shouldn't be applied automatically.
                return true;
            }
        }
    }
    return false;
}

//# sourceMappingURL=getAutolinkedPackages.js.map
