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
const _createLegacyPlugin = require("./createLegacyPlugin");
const withAppleSignInWarning = (config)=>{
    return (0, _configplugins().withEntitlementsPlist)(config, (config)=>{
        if (config.ios?.usesAppleSignIn) {
            _configplugins().WarningAggregator.addWarningIOS('ios.usesAppleSignIn', 'Install expo-apple-authentication to enable this feature', 'https://docs.expo.dev/versions/latest/sdk/apple-authentication/#eas-build');
        }
        return config;
    });
};
const _default = (0, _createLegacyPlugin.createLegacyPlugin)({
    packageName: 'expo-apple-authentication',
    fallback: withAppleSignInWarning
});

//# sourceMappingURL=expo-apple-authentication.js.map
