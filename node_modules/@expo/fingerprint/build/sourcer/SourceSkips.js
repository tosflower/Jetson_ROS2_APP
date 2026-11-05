/**
 * Bitmask of values that can be used to skip certain parts of the sources when generating a fingerprint.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SourceSkips", {
    enumerable: true,
    get: function() {
        return SourceSkips;
    }
});
var SourceSkips = /*#__PURE__*/ function(SourceSkips) {
    /** Skip nothing. */ SourceSkips[SourceSkips["None"] = 0] = "None";
    //#region - ExpoConfig source (e.g., app.json, app.config.js, etc.)
    /**
   * Versions in app.json, including `version`, `android.versionCode`, `ios.buildNumber`, and the
   * platform-specific overrides `ios.version` and `android.version` (which take precedence over
   * the top-level `version`).
   */ SourceSkips[SourceSkips["ExpoConfigVersions"] = 1] = "ExpoConfigVersions";
    /** `runtimeVersion` in app.json if it is a string. */ SourceSkips[SourceSkips["ExpoConfigRuntimeVersionIfString"] = 2] = "ExpoConfigRuntimeVersionIfString";
    /** App names in app.json, including `name`, `description`, `web.name`, `web.shortName`, and `web.description`. */ SourceSkips[SourceSkips["ExpoConfigNames"] = 4] = "ExpoConfigNames";
    /** Android package name in app.json. */ SourceSkips[SourceSkips["ExpoConfigAndroidPackage"] = 8] = "ExpoConfigAndroidPackage";
    /** iOS bundle identifier in app.json. */ SourceSkips[SourceSkips["ExpoConfigIosBundleIdentifier"] = 16] = "ExpoConfigIosBundleIdentifier";
    /** Schemes in app.json. */ SourceSkips[SourceSkips["ExpoConfigSchemes"] = 32] = "ExpoConfigSchemes";
    /** EAS project information in app.json. */ SourceSkips[SourceSkips["ExpoConfigEASProject"] = 64] = "ExpoConfigEASProject";
    /** Assets in app.json, including icons and splash assets. */ SourceSkips[SourceSkips["ExpoConfigAssets"] = 128] = "ExpoConfigAssets";
    /**
   * Skip the whole ExpoConfig.
   * Prefer the other ExpoConfig source skips when possible and use this flag with caution.
   * This will potentially ignore some native changes that should be part of most fingerprints.
   * E.g., adding a new config plugin, changing the app icon, or changing the app name.
   */ SourceSkips[SourceSkips["ExpoConfigAll"] = 256] = "ExpoConfigAll";
    //#endregion - ExpoConfig source (e.g., app.json, app.config.js, etc.)
    /**
   * package.json scripts if android and ios items do not contain "run".
   * Because prebuild will change the scripts in package.json,
   * this is useful to generate a consistent fingerprint before and after prebuild.
   */ SourceSkips[SourceSkips["PackageJsonAndroidAndIosScriptsIfNotContainRun"] = 512] = "PackageJsonAndroidAndIosScriptsIfNotContainRun";
    /**
   * Skip the whole `scripts` section in the project's package.json.
   */ SourceSkips[SourceSkips["PackageJsonScriptsAll"] = 1024] = "PackageJsonScriptsAll";
    /**
   * Skip .gitignore files.
   */ SourceSkips[SourceSkips["GitIgnore"] = 2048] = "GitIgnore";
    /** The [extra](https://docs.expo.dev/versions/latest/config/app/#extra) section in app.json */ SourceSkips[SourceSkips["ExpoConfigExtraSection"] = 4096] = "ExpoConfigExtraSection";
    //#region - EAS Build source
    /**
   * Skip eas.json.
   * Most of its content, such as build profiles and submit settings, does not affect the native
   * project. Note that some fields do, e.g. `ios.buildConfiguration` or `android.gradleCommand`.
   */ SourceSkips[SourceSkips["EasJson"] = 8192] = "EasJson";
    /**
   * Skip .easignore.
   * The file only controls which files are uploaded to EAS Build.
   * Note that excluding a file that does affect the native build will not change the fingerprint.
   */ SourceSkips[SourceSkips["Easignore"] = 16384] = "Easignore";
    //#endregion - EAS Build source
    /**
   * Path fields in the resolved autolinking config from `expo-modules-autolinking` and
   * `react-native-config`.
   * The config itself is still hashed. Filesystem paths, and values that sit under the project
   * root, are omitted, including `scriptPhases[].path` and `sourceDir` / `podspecPath` overrides
   * from the project's **react-native.config.js**. Those overrides will not change the fingerprint.
   * Linked module names and `scriptPhases` names remain.
   */ SourceSkips[SourceSkips["AutolinkingConfigPaths"] = 32768] = "AutolinkingConfigPaths";
    return SourceSkips;
}({});

//# sourceMappingURL=SourceSkips.js.map
