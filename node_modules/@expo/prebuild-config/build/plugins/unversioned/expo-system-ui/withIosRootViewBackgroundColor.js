"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getRootViewBackgroundColor: null,
    setRootViewBackgroundColor: null,
    shouldUseLegacyBehavior: null,
    warnSystemUIMissing: null,
    withIosRootViewBackgroundColor: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getRootViewBackgroundColor () {
        return getRootViewBackgroundColor;
    },
    get setRootViewBackgroundColor () {
        return setRootViewBackgroundColor;
    },
    get shouldUseLegacyBehavior () {
        return shouldUseLegacyBehavior;
    },
    get warnSystemUIMissing () {
        return warnSystemUIMissing;
    },
    get withIosRootViewBackgroundColor () {
        return withIosRootViewBackgroundColor;
    }
});
function _configplugins() {
    const data = require("@expo/config-plugins");
    _configplugins = function() {
        return data;
    };
    return data;
}
function _normalizecolors() {
    const data = /*#__PURE__*/ _interop_require_default(require("@react-native/normalize-colors"));
    _normalizecolors = function() {
        return data;
    };
    return data;
}
function _semver() {
    const data = /*#__PURE__*/ _interop_require_default(require("semver"));
    _semver = function() {
        return data;
    };
    return data;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// Maps to the template AppDelegate.m
const BACKGROUND_COLOR_KEY = 'RCTRootViewBackgroundColor';
const debug = require('debug')('expo:system-ui:plugin:ios');
const withIosRootViewBackgroundColor = (config)=>{
    config = (0, _configplugins().withInfoPlist)(config, (config)=>{
        if (shouldUseLegacyBehavior(config)) {
            config.modResults = setRootViewBackgroundColor(config, config.modResults);
        } else {
            warnSystemUIMissing(config);
        }
        return config;
    });
    return config;
};
function shouldUseLegacyBehavior(config) {
    try {
        return !!(config.sdkVersion && _semver().default.lt(config.sdkVersion, '44.0.0'));
    } catch  {}
    return false;
}
function warnSystemUIMissing(config) {
    const backgroundColor = getRootViewBackgroundColor(config);
    if (backgroundColor) {
        // Background color needs to be set programmatically
        _configplugins().WarningAggregator.addWarningIOS('ios.backgroundColor', 'Install expo-system-ui to enable this feature', 'https://docs.expo.dev/versions/latest/sdk/system-ui/');
    }
}
function setRootViewBackgroundColor(config, infoPlist) {
    const backgroundColor = getRootViewBackgroundColor(config);
    if (!backgroundColor) {
        delete infoPlist[BACKGROUND_COLOR_KEY];
    } else {
        let color = (0, _normalizecolors().default)(backgroundColor);
        if (!color) {
            throw new Error('Invalid background color on iOS');
        }
        color = (color << 24 | color >>> 8) >>> 0;
        infoPlist[BACKGROUND_COLOR_KEY] = color;
        debug(`Convert color: ${backgroundColor} -> ${color}`);
    }
    return infoPlist;
}
function getRootViewBackgroundColor(config) {
    return config.ios?.backgroundColor || config.backgroundColor || null;
}

//# sourceMappingURL=withIosRootViewBackgroundColor.js.map
