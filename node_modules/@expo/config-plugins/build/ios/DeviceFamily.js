"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    formatDeviceFamilies: null,
    getDeviceFamilies: null,
    getIsTabletOnly: null,
    getSupportsTablet: null,
    setDeviceFamily: null,
    withDeviceFamily: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get formatDeviceFamilies () {
        return formatDeviceFamilies;
    },
    get getDeviceFamilies () {
        return getDeviceFamilies;
    },
    get getIsTabletOnly () {
        return getIsTabletOnly;
    },
    get getSupportsTablet () {
        return getSupportsTablet;
    },
    get setDeviceFamily () {
        return setDeviceFamily;
    },
    get withDeviceFamily () {
        return withDeviceFamily;
    }
});
const _iosplugins = require("../plugins/ios-plugins");
const _warnings = require("../utils/warnings");
const withDeviceFamily = (config)=>{
    return (0, _iosplugins.withXcodeProject)(config, async (config)=>{
        config.modResults = await setDeviceFamily(config, {
            project: config.modResults
        });
        return config;
    });
};
function getSupportsTablet(config) {
    return !!config.ios?.supportsTablet;
}
function getIsTabletOnly(config) {
    return !!config?.ios?.isTabletOnly;
}
function getDeviceFamilies(config) {
    const supportsTablet = getSupportsTablet(config);
    const isTabletOnly = getIsTabletOnly(config);
    if (isTabletOnly && config.ios?.supportsTablet === false) {
        (0, _warnings.addWarningIOS)('ios.supportsTablet', `Found contradictory values: \`{ ios: { isTabletOnly: true, supportsTablet: false } }\`. Using \`{ isTabletOnly: true }\`.`);
    }
    // 1 is iPhone, 2 is iPad
    if (isTabletOnly) {
        return [
            2
        ];
    } else if (supportsTablet) {
        return [
            1,
            2
        ];
    } else {
        // is iPhone only
        return [
            1
        ];
    }
}
function formatDeviceFamilies(deviceFamilies) {
    return `"${deviceFamilies.join(',')}"`;
}
function setDeviceFamily(config, { project }) {
    const deviceFamilies = formatDeviceFamilies(getDeviceFamilies(config));
    const configurations = project.pbxXCBuildConfigurationSection();
    // @ts-ignore
    for (const { buildSettings } of Object.values(configurations || {})){
        // Guessing that this is the best way to emulate Xcode.
        // Using `project.addToBuildSettings` modifies too many targets.
        if (typeof buildSettings?.PRODUCT_NAME !== 'undefined') {
            if (typeof buildSettings?.TVOS_DEPLOYMENT_TARGET !== 'undefined') {
                buildSettings.TARGETED_DEVICE_FAMILY = '3';
            } else {
                buildSettings.TARGETED_DEVICE_FAMILY = deviceFamilies;
            }
        }
    }
    return project;
}

//# sourceMappingURL=DeviceFamily.js.map
