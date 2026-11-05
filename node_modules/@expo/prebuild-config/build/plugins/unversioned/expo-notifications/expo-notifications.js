"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    withNotificationError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get default () {
        return _default;
    },
    get withNotificationError () {
        return withNotificationError;
    }
});
function _configplugins() {
    const data = require("@expo/config-plugins");
    _configplugins = function() {
        return data;
    };
    return data;
}
const _createLegacyPlugin = require("../createLegacyPlugin");
const withNotificationError = (config)=>{
    return (0, _configplugins().withDangerousMod)(config, [
        'android',
        async (config)=>{
            if ('notification' in config) {
                throw new Error('The `notification` property in app config is no longer supported. Use the `expo-notifications` config plugin instead.');
            }
            return config;
        }
    ]);
};
const _default = (0, _createLegacyPlugin.createLegacyPlugin)({
    packageName: 'expo-notifications',
    fallback: [
        // Android
        withNotificationError
    ]
});

//# sourceMappingURL=expo-notifications.js.map
