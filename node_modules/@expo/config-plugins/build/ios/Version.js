"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getBuildNumber: null,
    getVersion: null,
    setBuildNumber: null,
    setVersion: null,
    withBuildNumber: null,
    withVersion: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getBuildNumber () {
        return getBuildNumber;
    },
    get getVersion () {
        return getVersion;
    },
    get setBuildNumber () {
        return setBuildNumber;
    },
    get setVersion () {
        return setVersion;
    },
    get withBuildNumber () {
        return withBuildNumber;
    },
    get withVersion () {
        return withVersion;
    }
});
const _iosplugins = require("../plugins/ios-plugins");
const withVersion = (0, _iosplugins.createInfoPlistPluginWithPropertyGuard)(setVersion, {
    infoPlistProperty: 'CFBundleShortVersionString',
    expoConfigProperty: 'version | ios.version',
    expoPropertyGetter: getVersion
}, 'withVersion');
const withBuildNumber = (0, _iosplugins.createInfoPlistPluginWithPropertyGuard)(setBuildNumber, {
    infoPlistProperty: 'CFBundleVersion',
    expoConfigProperty: 'ios.buildNumber'
}, 'withBuildNumber');
function getVersion(config) {
    return config.ios?.version || config.version || '1.0.0';
}
function setVersion(config, infoPlist) {
    return {
        ...infoPlist,
        CFBundleShortVersionString: getVersion(config)
    };
}
function getBuildNumber(config) {
    return config.ios?.buildNumber ? config.ios.buildNumber : '1';
}
function setBuildNumber(config, infoPlist) {
    return {
        ...infoPlist,
        CFBundleVersion: getBuildNumber(config)
    };
}

//# sourceMappingURL=Version.js.map
