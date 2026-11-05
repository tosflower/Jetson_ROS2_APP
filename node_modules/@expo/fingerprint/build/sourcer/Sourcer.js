"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getHashSourcesAsync", {
    enumerable: true,
    get: function() {
        return getHashSourcesAsync;
    }
});
function _chalk() {
    const data = /*#__PURE__*/ _interop_require_default(require("chalk"));
    _chalk = function() {
        return data;
    };
    return data;
}
function _semver() {
    const data = /*#__PURE__*/ _interop_require_default(require("semver"));
    _semver = function() {
        return data;
    };
    return data;
}
const _ExpoConfig = require("../ExpoConfig");
const _ExpoResolver = require("../ExpoResolver");
const _Profile = require("../utils/Profile");
const _Bare = require("./Bare");
const _Expo = require("./Expo");
const _Packages = require("./Packages");
const _PatchPackage = require("./PatchPackage");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const debug = require('debug')('expo:fingerprint:sourcer:Sourcer');
async function getHashSourcesAsync(projectRoot, options) {
    const { config: expoConfig, loadedModules } = await (0, _ExpoConfig.getExpoConfigAsync)(projectRoot, options);
    const expoAutolinkingVersion = (0, _ExpoResolver.resolveExpoAutolinkingVersion)(projectRoot) ?? '0.0.0';
    const useRNCoreAutolinkingFromExpo = // expo-modules-autolinking supports the `react-native-config` core autolinking from 1.11.2.
    // To makes the `useRNCoreAutolinkingFromExpo` default to `true` for Expo SDK 52 and higher.
    // We check the expo-modules-autolinking version from 1.12.0.
    typeof options.useRNCoreAutolinkingFromExpo === 'boolean' ? options.useRNCoreAutolinkingFromExpo : _semver().default.gte(expoAutolinkingVersion, '1.12.0');
    const results = await Promise.all([
        // expo
        (0, _Profile.profile)(options, _Expo.getExpoAutolinkingAndroidSourcesAsync)(projectRoot, options, expoAutolinkingVersion),
        (0, _Profile.profile)(options, _Expo.getExpoAutolinkingIosSourcesAsync)(projectRoot, options, expoAutolinkingVersion),
        (0, _Profile.profile)(options, _Expo.getExpoConfigSourcesAsync)(projectRoot, expoConfig, loadedModules, options),
        (0, _Profile.profile)(options, _Expo.getEasBuildSourcesAsync)(projectRoot, options),
        (0, _Profile.profile)(options, _Expo.getExpoCNGPatchSourcesAsync)(projectRoot, options),
        // bare managed files
        (0, _Profile.profile)(options, _Bare.getGitIgnoreSourcesAsync)(projectRoot, options),
        (0, _Profile.profile)(options, _Bare.getPackageJsonScriptSourcesAsync)(projectRoot, options),
        // bare native files
        (0, _Profile.profile)(options, _Bare.getBareAndroidSourcesAsync)(projectRoot, options),
        (0, _Profile.profile)(options, _Bare.getBareIosSourcesAsync)(projectRoot, options),
        // react-native core autolinking
        (0, _Profile.profile)(options, _Bare.getCoreAutolinkingSourcesFromExpoAndroid)(projectRoot, options, useRNCoreAutolinkingFromExpo),
        (0, _Profile.profile)(options, _Bare.getCoreAutolinkingSourcesFromExpoIos)(projectRoot, options, useRNCoreAutolinkingFromExpo),
        (0, _Profile.profile)(options, _Bare.getCoreAutolinkingSourcesFromRncCliAsync)(projectRoot, options, useRNCoreAutolinkingFromExpo),
        // patch-package
        (0, _Profile.profile)(options, _PatchPackage.getPatchPackageSourcesAsync)(projectRoot, options),
        // some known dependencies, e.g. react-native
        (0, _Profile.profile)(options, _Packages.getDefaultPackageSourcesAsync)(projectRoot, options)
    ]);
    // extra sources
    if (options.extraSources) {
        for (const source of options.extraSources){
            debug(`Adding extra source - ${_chalk().default.dim(JSON.stringify(source))}`);
        }
        results.push(options.extraSources);
    }
    // flatten results
    return [].concat(...results);
}

//# sourceMappingURL=Sourcer.js.map
