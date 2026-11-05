"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createAndroidManifestPlugin: null,
    createStringsXmlPlugin: null,
    withAndroidColors: null,
    withAndroidColorsNight: null,
    withAndroidManifest: null,
    withAndroidStyles: null,
    withAppBuildGradle: null,
    withGradleProperties: null,
    withMainActivity: null,
    withMainApplication: null,
    withProjectBuildGradle: null,
    withSettingsGradle: null,
    withStringsXml: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get createAndroidManifestPlugin () {
        return createAndroidManifestPlugin;
    },
    get createStringsXmlPlugin () {
        return createStringsXmlPlugin;
    },
    get withAndroidColors () {
        return withAndroidColors;
    },
    get withAndroidColorsNight () {
        return withAndroidColorsNight;
    },
    get withAndroidManifest () {
        return withAndroidManifest;
    },
    get withAndroidStyles () {
        return withAndroidStyles;
    },
    get withAppBuildGradle () {
        return withAppBuildGradle;
    },
    get withGradleProperties () {
        return withGradleProperties;
    },
    get withMainActivity () {
        return withMainActivity;
    },
    get withMainApplication () {
        return withMainApplication;
    },
    get withProjectBuildGradle () {
        return withProjectBuildGradle;
    },
    get withSettingsGradle () {
        return withSettingsGradle;
    },
    get withStringsXml () {
        return withStringsXml;
    }
});
const _withMod = require("./withMod");
function createAndroidManifestPlugin(action, name) {
    const withUnknown = (config)=>withAndroidManifest(config, async (config)=>{
            config.modResults = await action(config, config.modResults);
            return config;
        });
    if (name) {
        Object.defineProperty(withUnknown, 'name', {
            value: name
        });
    }
    return withUnknown;
}
function createStringsXmlPlugin(action, name) {
    const withUnknown = (config)=>withStringsXml(config, async (config)=>{
            config.modResults = await action(config, config.modResults);
            return config;
        });
    if (name) {
        Object.defineProperty(withUnknown, 'name', {
            value: name
        });
    }
    return withUnknown;
}
const withAndroidManifest = (config, action)=>{
    return (0, _withMod.withMod)(config, {
        platform: 'android',
        mod: 'manifest',
        action
    });
};
const withStringsXml = (config, action)=>{
    return (0, _withMod.withMod)(config, {
        platform: 'android',
        mod: 'strings',
        action
    });
};
const withAndroidColors = (config, action)=>{
    return (0, _withMod.withMod)(config, {
        platform: 'android',
        mod: 'colors',
        action
    });
};
const withAndroidColorsNight = (config, action)=>{
    return (0, _withMod.withMod)(config, {
        platform: 'android',
        mod: 'colorsNight',
        action
    });
};
const withAndroidStyles = (config, action)=>{
    return (0, _withMod.withMod)(config, {
        platform: 'android',
        mod: 'styles',
        action
    });
};
const withMainActivity = (config, action)=>{
    return (0, _withMod.withMod)(config, {
        platform: 'android',
        mod: 'mainActivity',
        action
    });
};
const withMainApplication = (config, action)=>{
    return (0, _withMod.withMod)(config, {
        platform: 'android',
        mod: 'mainApplication',
        action
    });
};
const withProjectBuildGradle = (config, action)=>{
    return (0, _withMod.withMod)(config, {
        platform: 'android',
        mod: 'projectBuildGradle',
        action
    });
};
const withAppBuildGradle = (config, action)=>{
    return (0, _withMod.withMod)(config, {
        platform: 'android',
        mod: 'appBuildGradle',
        action
    });
};
const withSettingsGradle = (config, action)=>{
    return (0, _withMod.withMod)(config, {
        platform: 'android',
        mod: 'settingsGradle',
        action
    });
};
const withGradleProperties = (config, action)=>{
    return (0, _withMod.withMod)(config, {
        platform: 'android',
        mod: 'gradleProperties',
        action
    });
};

//# sourceMappingURL=android-plugins.js.map
