"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
function _configplugins() {
    const data = require("@expo/config-plugins");
    _configplugins = function() {
        return data;
    };
    return data;
}
function _resolvefrom() {
    const data = /*#__PURE__*/ _interop_require_default(require("resolve-from"));
    _resolvefrom = function() {
        return data;
    };
    return data;
}
const _createLegacyPlugin = require("./createLegacyPlugin");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const LOCATION_USAGE = 'Allow $(PRODUCT_NAME) to access your location';
// Copied from expo-location package, this gets used when the
// user has react-native-maps installed but not expo-location.
const withDefaultLocationPermissions = (config)=>{
    const isLinked = !config._internal?.autolinkedModules || config._internal.autolinkedModules.includes('react-native-maps');
    // Only add location permissions if react-native-maps is installed.
    if (config._internal?.projectRoot && _resolvefrom().default.silent(config._internal.projectRoot, 'react-native-maps') && isLinked) {
        config = (0, _configplugins().withInfoPlist)(config, (config)=>{
            config.modResults.NSLocationWhenInUseUsageDescription = config.modResults.NSLocationWhenInUseUsageDescription || LOCATION_USAGE;
            return config;
        });
        return _configplugins().AndroidConfig.Permissions.withPermissions(config, [
            'android.permission.ACCESS_COARSE_LOCATION',
            'android.permission.ACCESS_FINE_LOCATION'
        ]);
    }
    return config;
};
const _default = (0, _createLegacyPlugin.createLegacyPlugin)({
    packageName: 'react-native-maps',
    fallback: [
        _configplugins().AndroidConfig.GoogleMapsApiKey.withGoogleMapsApiKey,
        _configplugins().IOSConfig.Maps.withMaps,
        withDefaultLocationPermissions
    ]
});

//# sourceMappingURL=react-native-maps.js.map
