/// <reference path="./ts-declarations/xcode.d.ts" />
/**
 * For internal use in Expo CLI
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    AndroidConfig: null,
    BaseMods: null,
    CodeGenerator: null,
    History: null,
    IOSConfig: null,
    PluginError: null,
    Updates: null,
    WarningAggregator: null,
    XML: null,
    assertValidAndroidAssetName: null,
    compileModsAsync: null,
    createRunOncePlugin: null,
    evalModsAsync: null,
    isValidAndroidAssetName: null,
    withAndroidColors: null,
    withAndroidColorsNight: null,
    withAndroidManifest: null,
    withAndroidStyles: null,
    withAppBuildGradle: null,
    withAppDelegate: null,
    withBaseMod: null,
    withDangerousMod: null,
    withDefaultBaseMods: null,
    withEntitlementsPlist: null,
    withExpoPlist: null,
    withFinalizedMod: null,
    withGradleProperties: null,
    withInfoPlist: null,
    withMainActivity: null,
    withMainApplication: null,
    withMod: null,
    withPlugins: null,
    withPodfile: null,
    withPodfileProperties: null,
    withProjectBuildGradle: null,
    withRunOnce: null,
    withSettingsGradle: null,
    withStaticPlugin: null,
    withStringsXml: null,
    withXcodeProject: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get AndroidConfig () {
        return _android;
    },
    get BaseMods () {
        return BaseMods;
    },
    get CodeGenerator () {
        return _generateCode;
    },
    get History () {
        return _history;
    },
    get IOSConfig () {
        return _ios;
    },
    get PluginError () {
        return _errors.PluginError;
    },
    get Updates () {
        return _Updates;
    },
    get WarningAggregator () {
        return _warnings;
    },
    get XML () {
        return _XML;
    },
    get assertValidAndroidAssetName () {
        return _validations.assertValidAndroidAssetName;
    },
    get compileModsAsync () {
        return _modcompiler.compileModsAsync;
    },
    get createRunOncePlugin () {
        return _withRunOnce.createRunOncePlugin;
    },
    get evalModsAsync () {
        return _modcompiler.evalModsAsync;
    },
    get isValidAndroidAssetName () {
        return _validations.isValidAndroidAssetName;
    },
    get withAndroidColors () {
        return _androidplugins.withAndroidColors;
    },
    get withAndroidColorsNight () {
        return _androidplugins.withAndroidColorsNight;
    },
    get withAndroidManifest () {
        return _androidplugins.withAndroidManifest;
    },
    get withAndroidStyles () {
        return _androidplugins.withAndroidStyles;
    },
    get withAppBuildGradle () {
        return _androidplugins.withAppBuildGradle;
    },
    get withAppDelegate () {
        return _iosplugins.withAppDelegate;
    },
    get withBaseMod () {
        return _withMod.withBaseMod;
    },
    get withDangerousMod () {
        return _withDangerousMod.withDangerousMod;
    },
    get withDefaultBaseMods () {
        return _modcompiler.withDefaultBaseMods;
    },
    get withEntitlementsPlist () {
        return _iosplugins.withEntitlementsPlist;
    },
    get withExpoPlist () {
        return _iosplugins.withExpoPlist;
    },
    get withFinalizedMod () {
        return _withFinalizedMod.withFinalizedMod;
    },
    get withGradleProperties () {
        return _androidplugins.withGradleProperties;
    },
    get withInfoPlist () {
        return _iosplugins.withInfoPlist;
    },
    get withMainActivity () {
        return _androidplugins.withMainActivity;
    },
    get withMainApplication () {
        return _androidplugins.withMainApplication;
    },
    get withMod () {
        return _withMod.withMod;
    },
    get withPlugins () {
        return _withPlugins.withPlugins;
    },
    get withPodfile () {
        return _iosplugins.withPodfile;
    },
    get withPodfileProperties () {
        return _iosplugins.withPodfileProperties;
    },
    get withProjectBuildGradle () {
        return _androidplugins.withProjectBuildGradle;
    },
    get withRunOnce () {
        return _withRunOnce.withRunOnce;
    },
    get withSettingsGradle () {
        return _androidplugins.withSettingsGradle;
    },
    get withStaticPlugin () {
        return _withStaticPlugin.withStaticPlugin;
    },
    get withStringsXml () {
        return _androidplugins.withStringsXml;
    },
    get withXcodeProject () {
        return _iosplugins.withXcodeProject;
    }
});
0 && __export(require("./Plugin.types"));
const _android = /*#__PURE__*/ _interop_require_wildcard(require("./android"));
const _ios = /*#__PURE__*/ _interop_require_wildcard(require("./ios"));
const _createBaseMod = require("./plugins/createBaseMod");
const _withAndroidBaseMods = require("./plugins/withAndroidBaseMods");
const _withIosBaseMods = require("./plugins/withIosBaseMods");
const _XML = /*#__PURE__*/ _interop_require_wildcard(require("./utils/XML"));
const _generateCode = /*#__PURE__*/ _interop_require_wildcard(require("./utils/generateCode"));
const _history = /*#__PURE__*/ _interop_require_wildcard(require("./utils/history"));
const _warnings = /*#__PURE__*/ _interop_require_wildcard(require("./utils/warnings"));
const _Updates = /*#__PURE__*/ _interop_require_wildcard(require("./utils/Updates"));
_export_star(require("./Plugin.types"), exports);
const _withPlugins = require("./plugins/withPlugins");
const _withRunOnce = require("./plugins/withRunOnce");
const _withDangerousMod = require("./plugins/withDangerousMod");
const _withFinalizedMod = require("./plugins/withFinalizedMod");
const _withMod = require("./plugins/withMod");
const _iosplugins = require("./plugins/ios-plugins");
const _androidplugins = require("./plugins/android-plugins");
const _validations = require("./utils/validations");
const _withStaticPlugin = require("./plugins/withStaticPlugin");
const _modcompiler = require("./plugins/mod-compiler");
const _errors = require("./utils/errors");
function _export_star(from, to) {
    Object.keys(from).forEach(function(k) {
        if (k !== "default" && !Object.prototype.hasOwnProperty.call(to, k)) {
            Object.defineProperty(to, k, {
                enumerable: true,
                get: function() {
                    return from[k];
                }
            });
        }
    });
    return from;
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const BaseMods = {
    withGeneratedBaseMods: _createBaseMod.withGeneratedBaseMods,
    provider: _createBaseMod.provider,
    withAndroidBaseMods: _withAndroidBaseMods.withAndroidBaseMods,
    getAndroidModFileProviders: _withAndroidBaseMods.getAndroidModFileProviders,
    withIosBaseMods: _withIosBaseMods.withIosBaseMods,
    getIosModFileProviders: _withIosBaseMods.getIosModFileProviders
};

//# sourceMappingURL=index.js.map
