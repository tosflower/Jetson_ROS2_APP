"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    restoreDefaultTheme: null,
    withRestoreDefaultTheme: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get restoreDefaultTheme () {
        return restoreDefaultTheme;
    },
    get withRestoreDefaultTheme () {
        return withRestoreDefaultTheme;
    }
});
function _configplugins() {
    const data = require("@expo/config-plugins");
    _configplugins = function() {
        return data;
    };
    return data;
}
const withRestoreDefaultTheme = (config)=>{
    // Default theme for SDK 53 and onwards projects
    return (0, _configplugins().withAndroidStyles)(config, (config)=>{
        return restoreDefaultTheme(config);
    });
};
function restoreDefaultTheme(config) {
    const DEFAULT_THEME = 'Theme.AppCompat.DayNight.NoActionBar';
    const { style = [] } = config.modResults.resources;
    const mainThemeIndex = style.findIndex(({ $ })=>$.name === 'AppTheme');
    if (mainThemeIndex === -1) {
        return config;
    }
    if (style[mainThemeIndex]?.$?.parent.includes('EdgeToEdge')) {
        config.modResults.resources.style = [
            {
                $: {
                    name: 'AppTheme',
                    parent: DEFAULT_THEME
                },
                item: style[mainThemeIndex].item
            },
            ...style.filter(({ $ })=>$.name !== 'AppTheme')
        ];
    }
    return config;
}

//# sourceMappingURL=withRestoreDefaultTheme.js.map
