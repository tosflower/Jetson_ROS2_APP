"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    findModulesAsync: null,
    getConfiguration: null,
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
    get findModulesAsync () {
        return apiFindModulesAsync;
    },
    get getConfiguration () {
        return _getConfiguration.getConfiguration;
    },
    get resolveExtraBuildDependenciesAsync () {
        return apiResolveExtraBuildDependenciesAsync;
    },
    get resolveModulesAsync () {
        return apiResolveModulesAsync;
    }
});
const _autolinkingOptions = require("../commands/autolinkingOptions");
const _findModules = require("./findModules");
const _resolveModules = require("./resolveModules");
const _getConfiguration = require("./getConfiguration");
/** @deprecated */ async function apiFindModulesAsync(providedOptions) {
    const autolinkingOptionsLoader = (0, _autolinkingOptions.createAutolinkingOptionsLoader)(providedOptions);
    return (0, _findModules.findModulesAsync)({
        appRoot: await autolinkingOptionsLoader.getAppRoot(),
        autolinkingOptions: await autolinkingOptionsLoader.getPlatformOptions(providedOptions.platform)
    });
}
/** @deprecated */ async function apiResolveExtraBuildDependenciesAsync(providedOptions) {
    return (0, _resolveModules.resolveExtraBuildDependenciesAsync)({
        commandRoot: providedOptions.projectRoot,
        platform: providedOptions.platform
    });
}
/** @deprecated */ async function apiResolveModulesAsync(searchResults, providedOptions) {
    const autolinkingOptionsLoader = (0, _autolinkingOptions.createAutolinkingOptionsLoader)(providedOptions);
    return (0, _resolveModules.resolveModulesAsync)(searchResults, await autolinkingOptionsLoader.getPlatformOptions(providedOptions.platform));
}

//# sourceMappingURL=index.js.map
