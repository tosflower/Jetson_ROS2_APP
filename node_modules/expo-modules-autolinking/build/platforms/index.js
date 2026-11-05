"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getLinkingImplementationForPlatform: null,
    getSupportPackageForPlatform: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getLinkingImplementationForPlatform () {
        return getLinkingImplementationForPlatform;
    },
    get getSupportPackageForPlatform () {
        return getSupportPackageForPlatform;
    }
});
function _platforms() {
    const data = require("@expo/platforms");
    _platforms = function() {
        return data;
    };
    return data;
}
function getLinkingImplementationForPlatform(platform) {
    if (!platform) {
        throw new Error(`No platform was specified, but linking commands require a specific platform.`);
    }
    switch(platform){
        case 'ios':
        case 'macos':
        case 'tvos':
        case 'apple':
            return require('../platforms/apple');
        case 'android':
            return require('../platforms/android');
        case 'devtools':
            return require('../platforms/devtools');
        case 'web':
            return require('../platforms/web');
        default:
            throw new Error(`No linking implementation is available for platform "${platform}"`);
    }
}
function getSupportPackageForPlatform(platform) {
    switch(platform){
        case 'ios':
        case 'android':
        case 'tvos':
        case 'macos':
        case 'windows':
            // The host package names are shared tooling-wide data in @expo/platforms.
            return (0, _platforms().getReactNativeHostPackage)(platform);
        case 'apple':
        case 'web':
        case 'devtools':
            return null;
        default:
            throw new Error(`No support package is known for platform "${platform}"`);
    }
}

//# sourceMappingURL=index.js.map
