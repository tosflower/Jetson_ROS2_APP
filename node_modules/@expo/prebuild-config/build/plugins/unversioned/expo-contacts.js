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
const withAccessesContactNotes = (config)=>{
    return (0, _configplugins().withEntitlementsPlist)(config, (config)=>{
        config.modResults = setAccessesContactNotes(config, config.modResults);
        return config;
    });
};
function setAccessesContactNotes(config, entitlementsPlist) {
    if (config.ios?.accessesContactNotes) {
        return {
            ...entitlementsPlist,
            'com.apple.developer.contacts.notes': true
        };
    }
    return entitlementsPlist;
}
const _default = (0, _createLegacyPlugin.createLegacyPlugin)({
    packageName: 'expo-contacts',
    fallback: withAccessesContactNotes
});

//# sourceMappingURL=expo-contacts.js.map
