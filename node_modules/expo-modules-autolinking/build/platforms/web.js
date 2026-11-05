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
async function resolveModuleAsync(packageName, revision) {
    return {
        packageName,
        packageRoot: revision.path
    };
}
async function resolveExtraBuildDependenciesAsync(_projectNativeRoot) {
    return null;
}

//# sourceMappingURL=web.js.map
