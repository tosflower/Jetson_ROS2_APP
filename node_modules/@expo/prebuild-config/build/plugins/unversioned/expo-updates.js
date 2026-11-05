"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    withExpoUpdates: null
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
    get withExpoUpdates () {
        return withExpoUpdates;
    }
});
function _configplugins() {
    const data = require("@expo/config-plugins");
    _configplugins = function() {
        return data;
    };
    return data;
}
// Local unversioned updates plugin
const packageName = 'expo-updates';
const withExpoUpdates = (config)=>{
    return (0, _configplugins().withStaticPlugin)(config, {
        _isLegacyPlugin: true,
        // Pass props to the static plugin if it exists.
        plugin: packageName,
        // If the static plugin isn't found, use the unversioned one.
        fallback: (0, _configplugins().createRunOncePlugin)((config)=>withUnversionedUpdates(config), packageName)
    });
};
const withUnversionedUpdates = (config)=>{
    config = _configplugins().AndroidConfig.Updates.withUpdates(config);
    config = _configplugins().IOSConfig.Updates.withUpdates(config);
    return config;
};
const _default = withExpoUpdates;

//# sourceMappingURL=expo-updates.js.map
