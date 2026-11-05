"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getVersionCode: null,
    getVersionName: null,
    setMinBuildScriptExtVersion: null,
    setVersionCode: null,
    setVersionName: null,
    withBuildScriptExtMinimumVersion: null,
    withVersion: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getVersionCode () {
        return getVersionCode;
    },
    get getVersionName () {
        return getVersionName;
    },
    get setMinBuildScriptExtVersion () {
        return setMinBuildScriptExtVersion;
    },
    get setVersionCode () {
        return setVersionCode;
    },
    get setVersionName () {
        return setVersionName;
    },
    get withBuildScriptExtMinimumVersion () {
        return withBuildScriptExtMinimumVersion;
    },
    get withVersion () {
        return withVersion;
    }
});
const _androidplugins = require("../plugins/android-plugins");
const _warnings = require("../utils/warnings");
const withVersion = (config)=>{
    return (0, _androidplugins.withAppBuildGradle)(config, (config)=>{
        if (config.modResults.language === 'groovy') {
            config.modResults.contents = setVersionCode(config, config.modResults.contents);
            config.modResults.contents = setVersionName(config, config.modResults.contents);
        } else {
            (0, _warnings.addWarningAndroid)('android.versionCode', `Cannot automatically configure app build.gradle if it's not groovy`);
        }
        return config;
    });
};
const withBuildScriptExtMinimumVersion = (config, props)=>{
    return (0, _androidplugins.withProjectBuildGradle)(config, (config)=>{
        if (config.modResults.language === 'groovy') {
            config.modResults.contents = setMinBuildScriptExtVersion(config.modResults.contents, props);
        } else {
            (0, _warnings.addWarningAndroid)('withBuildScriptExtVersion', `Cannot automatically configure project build.gradle if it's not groovy`);
        }
        return config;
    });
};
function setMinBuildScriptExtVersion(buildGradle, { name, minVersion }) {
    const regex = new RegExp(`(${name}\\s?=\\s?)(\\d+(?:\\.\\d+)?)`);
    const currentVersion = buildGradle.match(regex)?.[2];
    if (!currentVersion) {
        (0, _warnings.addWarningAndroid)('withBuildScriptExtVersion', `Cannot set minimum buildscript.ext.${name} version because the property "${name}" cannot be found or does not have a numeric value.`);
        // TODO: Maybe just add the property...
        return buildGradle;
    }
    const currentVersionNum = Number(currentVersion);
    return buildGradle.replace(regex, `$1${Math.max(minVersion, currentVersionNum)}`);
}
function getVersionName(config) {
    return config.android?.version ?? config.version ?? null;
}
function setVersionName(config, buildGradle) {
    const versionName = getVersionName(config);
    if (versionName === null) {
        return buildGradle;
    }
    const pattern = new RegExp(`versionName ".*"`);
    return buildGradle.replace(pattern, `versionName "${versionName}"`);
}
function getVersionCode(config) {
    return config.android?.versionCode ?? 1;
}
function setVersionCode(config, buildGradle) {
    const versionCode = getVersionCode(config);
    if (versionCode === null) {
        return buildGradle;
    }
    const pattern = new RegExp(`versionCode.*`);
    return buildGradle.replace(pattern, `versionCode ${versionCode}`);
}

//# sourceMappingURL=Version.js.map
