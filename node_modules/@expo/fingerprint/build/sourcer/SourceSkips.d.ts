/**
 * Bitmask of values that can be used to skip certain parts of the sources when generating a fingerprint.
 */
export declare enum SourceSkips {
    /** Skip nothing. */
    None = 0,
    /**
     * Versions in app.json, including `version`, `android.versionCode`, `ios.buildNumber`, and the
     * platform-specific overrides `ios.version` and `android.version` (which take precedence over
     * the top-level `version`).
     */
    ExpoConfigVersions = 1,
    /** `runtimeVersion` in app.json if it is a string. */
    ExpoConfigRuntimeVersionIfString = 2,
    /** App names in app.json, including `name`, `description`, `web.name`, `web.shortName`, and `web.description`. */
    ExpoConfigNames = 4,
    /** Android package name in app.json. */
    ExpoConfigAndroidPackage = 8,
    /** iOS bundle identifier in app.json. */
    ExpoConfigIosBundleIdentifier = 16,
    /** Schemes in app.json. */
    ExpoConfigSchemes = 32,
    /** EAS project information in app.json. */
    ExpoConfigEASProject = 64,
    /** Assets in app.json, including icons and splash assets. */
    ExpoConfigAssets = 128,
    /**
     * Skip the whole ExpoConfig.
     * Prefer the other ExpoConfig source skips when possible and use this flag with caution.
     * This will potentially ignore some native changes that should be part of most fingerprints.
     * E.g., adding a new config plugin, changing the app icon, or changing the app name.
     */
    ExpoConfigAll = 256,
    /**
     * package.json scripts if android and ios items do not contain "run".
     * Because prebuild will change the scripts in package.json,
     * this is useful to generate a consistent fingerprint before and after prebuild.
     */
    PackageJsonAndroidAndIosScriptsIfNotContainRun = 512,
    /**
     * Skip the whole `scripts` section in the project's package.json.
     */
    PackageJsonScriptsAll = 1024,
    /**
     * Skip .gitignore files.
     */
    GitIgnore = 2048,
    /** The [extra](https://docs.expo.dev/versions/latest/config/app/#extra) section in app.json */
    ExpoConfigExtraSection = 4096,
    /**
     * Skip eas.json.
     * Most of its content, such as build profiles and submit settings, does not affect the native
     * project. Note that some fields do, e.g. `ios.buildConfiguration` or `android.gradleCommand`.
     */
    EasJson = 8192,
    /**
     * Skip .easignore.
     * The file only controls which files are uploaded to EAS Build.
     * Note that excluding a file that does affect the native build will not change the fingerprint.
     */
    Easignore = 16384,
    /**
     * Path fields in the resolved autolinking config from `expo-modules-autolinking` and
     * `react-native-config`.
     * The config itself is still hashed. Filesystem paths, and values that sit under the project
     * root, are omitted, including `scriptPhases[].path` and `sourceDir` / `podspecPath` overrides
     * from the project's **react-native.config.js**. Those overrides will not change the fingerprint.
     * Linked module names and `scriptPhases` names remain.
     */
    AutolinkingConfigPaths = 32768
}
