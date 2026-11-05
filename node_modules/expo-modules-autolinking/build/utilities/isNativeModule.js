"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isNativeModuleAsync", {
    enumerable: true,
    get: function() {
        return isNativeModuleAsync;
    }
});
const _concurrency = require("../concurrency");
const _dependencies = require("../dependencies");
async function isNativeModuleAsync(maybeModulePath) {
    const resolution = await (0, _dependencies.mockDependencyAtPath)(maybeModulePath);
    const excludeNames = new Set();
    const isNativeModules = await (0, _concurrency.taskAll)([
        'android',
        'apple'
    ], (platform)=>(0, _dependencies.isNativeModuleAsync)(resolution, null, platform, excludeNames));
    return isNativeModules.some((x)=>!!x);
}

//# sourceMappingURL=isNativeModule.js.map
