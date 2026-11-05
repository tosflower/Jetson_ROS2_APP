"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    resolveExtraBuildDependenciesAsync: null,
    resolveModulesAsync: null
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
    get resolveModulesAsync () {
        return resolveModulesAsync;
    }
});
const _concurrency = require("../concurrency");
const _platforms = require("../platforms");
async function resolveModulesAsync(searchResults, autolinkingOptions, { scanNativeModules = false, onScanResult, scanPlatform } = {}) {
    const platformLinking = (0, _platforms.getLinkingImplementationForPlatform)(autolinkingOptions.platform);
    // One scan for all packages, passed down through `extraOutput`. A failed scan never fails
    // resolution.
    let scannedModules = null;
    if (scanNativeModules && 'scanNativeModulesAsync' in platformLinking) {
        try {
            scannedModules = await platformLinking.scanNativeModulesAsync(searchResults, scanPlatform ?? autolinkingOptions.platform);
        } catch (error) {
            console.warn(`warning: Scanning for native modules failed, only modules declared in the module config will be linked: ${error.message ?? error}`);
        }
        onScanResult?.(scannedModules != null);
    }
    // Additional output property for Cocoapods flags
    const extraOutput = {
        flags: autolinkingOptions.flags,
        scannedModules
    };
    const moduleDescriptorList = await (0, _concurrency.taskAll)(Object.entries(searchResults), async ([packageName, revision])=>{
        const resolvedModule = await platformLinking.resolveModuleAsync(packageName, revision, extraOutput);
        return resolvedModule ? {
            ...resolvedModule,
            packageVersion: revision.version,
            packageName: resolvedModule.packageName ?? packageName
        } : null;
    });
    return moduleDescriptorList.filter((moduleDescriptor)=>moduleDescriptor != null).sort((a, b)=>a.packageName.localeCompare(b.packageName));
}
async function resolveExtraBuildDependenciesAsync({ commandRoot, platform }) {
    const platformLinking = (0, _platforms.getLinkingImplementationForPlatform)(platform);
    const extraDependencies = await platformLinking.resolveExtraBuildDependenciesAsync(// NOTE: We assume we must be inside the native folder here
    // The `resolve` command either is invoked in the CWD of `./{android,ios}` or has a `--project-root`
    // that's in the native directory
    commandRoot);
    return extraDependencies ?? [];
}

//# sourceMappingURL=resolveModules.js.map
