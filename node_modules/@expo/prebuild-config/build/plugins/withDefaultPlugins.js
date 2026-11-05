/**
 * These are the versioned first-party plugins with some of the future third-party plugins mixed in for legacy support.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getAutoPlugins: null,
    getLegacyExpoPlugins: null,
    withAndroidExpoPlugins: null,
    withIosExpoPlugins: null,
    withLegacyExpoPlugins: null,
    withVersionedExpoSDKPlugins: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getAutoPlugins () {
        return getAutoPlugins;
    },
    get getLegacyExpoPlugins () {
        return getLegacyExpoPlugins;
    },
    get withAndroidExpoPlugins () {
        return withAndroidExpoPlugins;
    },
    get withIosExpoPlugins () {
        return withIosExpoPlugins;
    },
    get withLegacyExpoPlugins () {
        return withLegacyExpoPlugins;
    },
    get withVersionedExpoSDKPlugins () {
        return withVersionedExpoSDKPlugins;
    }
});
function _configplugins() {
    const data = require("@expo/config-plugins");
    _configplugins = function() {
        return data;
    };
    return data;
}
function _debug() {
    const data = /*#__PURE__*/ _interop_require_default(require("debug"));
    _debug = function() {
        return data;
    };
    return data;
}
const _getAutolinkedPackages = require("../getAutolinkedPackages");
const _withAndroidIcons = require("./icons/withAndroidIcons");
const _withIosIcons = require("./icons/withIosIcons");
const _withEdgeToEdge = /*#__PURE__*/ _interop_require_default(require("./unversioned/edge-to-edge/withEdgeToEdge"));
const _expoappleauthentication = /*#__PURE__*/ _interop_require_default(require("./unversioned/expo-apple-authentication"));
const _expocontacts = /*#__PURE__*/ _interop_require_default(require("./unversioned/expo-contacts"));
const _expodocumentpicker = /*#__PURE__*/ _interop_require_default(require("./unversioned/expo-document-picker"));
const _withInlineModules = /*#__PURE__*/ _interop_require_default(require("./unversioned/expo-inline-modules/withInlineModules"));
const _exponotifications = /*#__PURE__*/ _interop_require_default(require("./unversioned/expo-notifications/expo-notifications"));
const _exposystemui = /*#__PURE__*/ _interop_require_default(require("./unversioned/expo-system-ui/expo-system-ui"));
const _expoupdates = /*#__PURE__*/ _interop_require_default(require("./unversioned/expo-updates"));
const _reactnativemaps = /*#__PURE__*/ _interop_require_default(require("./unversioned/react-native-maps"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const debug = (0, _debug().default)('expo:prebuild-config');
const withIosExpoPlugins = (config, { bundleIdentifier })=>{
    // Set the bundle ID ahead of time.
    if (!config.ios) config.ios = {};
    config.ios.bundleIdentifier = bundleIdentifier;
    return (0, _configplugins().withPlugins)(config, [
        [
            _configplugins().IOSConfig.BundleIdentifier.withBundleIdentifier,
            {
                bundleIdentifier
            }
        ],
        _configplugins().IOSConfig.Google.withGoogle,
        _configplugins().IOSConfig.Name.withDisplayName,
        _configplugins().IOSConfig.Name.withProductName,
        _configplugins().IOSConfig.Orientation.withOrientation,
        _configplugins().IOSConfig.RequiresFullScreen.withRequiresFullScreen,
        _configplugins().IOSConfig.Scheme.withScheme,
        _configplugins().IOSConfig.DevServer.withMetroPort,
        _configplugins().IOSConfig.UsesNonExemptEncryption.withUsesNonExemptEncryption,
        _configplugins().IOSConfig.Version.withBuildNumber,
        _configplugins().IOSConfig.Version.withVersion,
        _configplugins().IOSConfig.Google.withGoogleServicesFile,
        // Deployment Target
        _configplugins().IOSConfig.DeploymentTarget.withDeploymentTarget,
        _configplugins().IOSConfig.DeploymentTarget.withDeploymentTargetPodfileProps,
        // Entitlements
        _configplugins().IOSConfig.Entitlements.withAssociatedDomains,
        // XcodeProject
        _configplugins().IOSConfig.DeviceFamily.withDeviceFamily,
        _configplugins().IOSConfig.Bitcode.withBitcode,
        _configplugins().IOSConfig.Locales.withLocales,
        _configplugins().IOSConfig.DevelopmentTeam.withDevelopmentTeam,
        // Dangerous
        _withIosIcons.withIosIcons,
        _configplugins().IOSConfig.PrivacyInfo.withPrivacyInfo
    ]);
};
const withAndroidExpoPlugins = (config, props)=>{
    // Set the package name ahead of time.
    if (!config.android) config.android = {};
    config.android.package = props.package;
    return (0, _configplugins().withPlugins)(config, [
        // settings.gradle
        _configplugins().AndroidConfig.Name.withNameSettingsGradle,
        // project build.gradle
        _configplugins().AndroidConfig.GoogleServices.withClassPath,
        // app/build.gradle
        _configplugins().AndroidConfig.GoogleServices.withApplyPlugin,
        _configplugins().AndroidConfig.Package.withPackageGradle,
        _configplugins().AndroidConfig.Version.withVersion,
        // AndroidManifest.xml
        _configplugins().AndroidConfig.AllowBackup.withAllowBackup,
        _configplugins().AndroidConfig.WindowSoftInputMode.withWindowSoftInputMode,
        _configplugins().AndroidConfig.PredictiveBackGesture.withPredictiveBackGesture,
        // Note: The withAndroidIntentFilters plugin must appear before the withScheme
        // plugin or withScheme will override the output of withAndroidIntentFilters.
        _configplugins().AndroidConfig.IntentFilters.withAndroidIntentFilters,
        _configplugins().AndroidConfig.Scheme.withScheme,
        _configplugins().AndroidConfig.Orientation.withOrientation,
        _configplugins().AndroidConfig.Permissions.withInternalBlockedPermissions,
        _configplugins().AndroidConfig.Permissions.withPermissions,
        // strings.xml
        _configplugins().AndroidConfig.Name.withName,
        _configplugins().AndroidConfig.Locales.withLocales,
        // Dangerous -- these plugins run in reverse order.
        _configplugins().AndroidConfig.GoogleServices.withGoogleServicesFile,
        // Modify colors.xml and styles.xml
        _configplugins().AndroidConfig.SystemBars.withSystemBars,
        _configplugins().AndroidConfig.PrimaryColor.withPrimaryColor,
        _withEdgeToEdge.default,
        _withAndroidIcons.withAndroidIcons,
        // If we renamed the package, we should also move it around and rename it in source files
        // Added last to ensure this plugin runs first. Out of tree solutions will mistakenly resolve the package incorrectly otherwise.
        _configplugins().AndroidConfig.Package.withPackageRefactor
    ]);
};
// Must keep in sync with `withVersionedExpoSDKPlugins`
const versionedExpoSDKPackages = [
    'react-native-maps',
    'expo-ads-admob',
    'expo-apple-authentication',
    'expo-contacts',
    'expo-notifications',
    'expo-updates',
    'expo-navigation-bar',
    'expo-document-picker',
    'expo-system-ui',
    'expo-inline-modules'
];
const withVersionedExpoSDKPlugins = (config)=>{
    return (0, _configplugins().withPlugins)(config, [
        _reactnativemaps.default,
        _expoappleauthentication.default,
        _expocontacts.default,
        _exponotifications.default,
        _expoupdates.default,
        _expodocumentpicker.default,
        _exposystemui.default,
        _withInlineModules.default
    ]);
};
function getAutoPlugins() {
    return versionedExpoSDKPackages.concat(legacyExpoPlugins).concat(expoManagedVersionedPlugins);
}
function getLegacyExpoPlugins() {
    return legacyExpoPlugins;
}
// Expo managed packages that require extra update.
// These get applied automatically to create parity with expo build in eas build.
const legacyExpoPlugins = [
    'expo-app-auth',
    'expo-av',
    'expo-background-fetch',
    'expo-brightness',
    'expo-calendar',
    'expo-camera',
    'expo-cellular',
    'expo-dev-menu',
    'expo-dev-launcher',
    'expo-dev-client',
    'expo-image-picker',
    'expo-file-system',
    'expo-location',
    'expo-media-library',
    'expo-screen-orientation',
    'expo-sensors',
    'expo-task-manager',
    'expo-local-authentication'
];
// Plugins that need to be automatically applied, but also get applied by expo-cli if the versioned plugin isn't available.
// These are split up because the user doesn't need to be prompted to setup these packages.
const expoManagedVersionedPlugins = [
    'expo-firebase-analytics',
    'expo-firebase-core',
    'expo-google-sign-in'
];
const withOptionalLegacyPlugins = (config, plugins)=>{
    return plugins.reduce((prev, plugin)=>{
        if ((0, _getAutolinkedPackages.shouldSkipAutoPlugin)(config, plugin)) {
            debug('Skipping unlinked auto plugin:', plugin);
            return prev;
        }
        return (0, _configplugins().withStaticPlugin)(prev, {
            // hide errors
            _isLegacyPlugin: true,
            plugin,
            // If a plugin doesn't exist, do nothing.
            fallback: (config)=>config
        });
    }, config);
};
function withLegacyExpoPlugins(config) {
    return withOptionalLegacyPlugins(config, [
        ...new Set(expoManagedVersionedPlugins.concat(legacyExpoPlugins))
    ]);
}

//# sourceMappingURL=withDefaultPlugins.js.map
