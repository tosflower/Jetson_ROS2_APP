"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    generateModulesProviderAsync: null,
    getConfiguration: null,
    resolveExtraBuildDependenciesAsync: null,
    resolveModuleAsync: null,
    scanNativeModulesAsync: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get generateModulesProviderAsync () {
        return _apple.generateModulesProviderAsync;
    },
    get getConfiguration () {
        return _apple.getConfiguration;
    },
    get resolveExtraBuildDependenciesAsync () {
        return _apple.resolveExtraBuildDependenciesAsync;
    },
    get resolveModuleAsync () {
        return _apple.resolveModuleAsync;
    },
    get scanNativeModulesAsync () {
        return _apple.scanNativeModulesAsync;
    }
});
const _apple = require("./apple");

//# sourceMappingURL=index.js.map
