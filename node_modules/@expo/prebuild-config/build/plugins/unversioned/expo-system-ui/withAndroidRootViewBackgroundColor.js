"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getRootViewBackgroundColor: null,
    withAndroidRootViewBackgroundColor: null,
    withRootViewBackgroundColorColors: null,
    withRootViewBackgroundColorStyles: null
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
    get withAndroidRootViewBackgroundColor () {
        return withAndroidRootViewBackgroundColor;
    },
    get withRootViewBackgroundColorColors () {
        return withRootViewBackgroundColorColors;
    },
    get withRootViewBackgroundColorStyles () {
        return withRootViewBackgroundColorStyles;
    }
});
function _configplugins() {
    const data = require("@expo/config-plugins");
    _configplugins = function() {
        return data;
    };
    return data;
}
const { assignColorValue } = _configplugins().AndroidConfig.Colors;
const { assignStylesValue, getAppThemeGroup } = _configplugins().AndroidConfig.Styles;
const ANDROID_WINDOW_BACKGROUND = 'android:windowBackground';
const WINDOW_BACKGROUND_COLOR = 'activityBackground';
const withAndroidRootViewBackgroundColor = (config)=>{
    config = withRootViewBackgroundColorColors(config);
    config = withRootViewBackgroundColorStyles(config);
    return config;
};
const withRootViewBackgroundColorColors = (config)=>{
    return (0, _configplugins().withAndroidColors)(config, async (config)=>{
        config.modResults = assignColorValue(config.modResults, {
            value: getRootViewBackgroundColor(config),
            name: WINDOW_BACKGROUND_COLOR
        });
        return config;
    });
};
const withRootViewBackgroundColorStyles = (config)=>{
    return (0, _configplugins().withAndroidStyles)(config, async (config)=>{
        config.modResults = assignStylesValue(config.modResults, {
            add: !!getRootViewBackgroundColor(config),
            parent: getAppThemeGroup(),
            name: ANDROID_WINDOW_BACKGROUND,
            value: `@color/${WINDOW_BACKGROUND_COLOR}`
        });
        return config;
    });
};
function getRootViewBackgroundColor(config) {
    return config.android?.backgroundColor || config.backgroundColor || null;
}

//# sourceMappingURL=withAndroidRootViewBackgroundColor.js.map
