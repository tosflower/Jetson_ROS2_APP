"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    applyEdgeToEdge: null,
    default: null,
    withEdgeToEdge: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get applyEdgeToEdge () {
        return applyEdgeToEdge;
    },
    get default () {
        return _default;
    },
    get withEdgeToEdge () {
        return withEdgeToEdge;
    }
});
function _configplugins() {
    const data = require("@expo/config-plugins");
    _configplugins = function() {
        return data;
    };
    return data;
}
const _withRestoreDefaultTheme = require("./withRestoreDefaultTheme");
const TAG = 'EDGE_TO_EDGE_PLUGIN';
const withEdgeToEdge = (config)=>{
    return applyEdgeToEdge(config);
};
function applyEdgeToEdge(config) {
    if ('edgeToEdgeEnabled' in (config.android ?? {})) {
        _configplugins().WarningAggregator.addWarningAndroid(TAG, '`edgeToEdgeEnabled` customization is no longer available - Android 16 makes edge-to-edge mandatory. Remove the `edgeToEdgeEnabled` entry from your app.json/app.config.js.');
    }
    // We always restore the default theme in case the project has a leftover react-native-edge-to-edge theme from SDK 53.
    // If they are using react-native-edge-to-edge config plugin it'll be reapplied later.
    return (0, _withRestoreDefaultTheme.withRestoreDefaultTheme)(config);
}
const _default = withEdgeToEdge;

//# sourceMappingURL=withEdgeToEdge.js.map
