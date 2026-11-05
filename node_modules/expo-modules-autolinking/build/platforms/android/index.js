"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getConfiguration: null,
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
    get getConfiguration () {
        return _android.getConfiguration;
    },
    get resolveExtraBuildDependenciesAsync () {
        return _android.resolveExtraBuildDependenciesAsync;
    },
    get resolveModuleAsync () {
        return _android.resolveModuleAsync;
    }
});
const _android = require("./android");

//# sourceMappingURL=index.js.map
