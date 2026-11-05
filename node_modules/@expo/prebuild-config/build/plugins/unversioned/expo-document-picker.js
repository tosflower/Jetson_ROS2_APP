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
const _default = (0, _createLegacyPlugin.createLegacyPlugin)({
    packageName: 'expo-document-picker',
    fallback (config) {
        if (config.ios?.usesIcloudStorage) {
            _configplugins().WarningAggregator.addWarningIOS('ios.usesIcloudStorage', 'Install expo-document-picker to enable the ios.usesIcloudStorage feature');
        }
        return config;
    }
});

//# sourceMappingURL=expo-document-picker.js.map
