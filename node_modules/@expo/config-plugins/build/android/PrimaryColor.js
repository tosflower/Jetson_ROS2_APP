"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getPrimaryColor: null,
    withPrimaryColor: null,
    withPrimaryColorColors: null,
    withPrimaryColorStyles: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getPrimaryColor () {
        return getPrimaryColor;
    },
    get withPrimaryColor () {
        return withPrimaryColor;
    },
    get withPrimaryColorColors () {
        return withPrimaryColorColors;
    },
    get withPrimaryColorStyles () {
        return withPrimaryColorStyles;
    }
});
const _androidplugins = require("../plugins/android-plugins");
const _Colors = require("./Colors");
const _Styles = require("./Styles");
const COLOR_PRIMARY_KEY = 'colorPrimary';
const DEFAULT_PRIMARY_COLOR = '#023c69';
const withPrimaryColor = (config)=>{
    config = withPrimaryColorColors(config);
    config = withPrimaryColorStyles(config);
    return config;
};
const withPrimaryColorColors = (config)=>{
    return (0, _androidplugins.withAndroidColors)(config, (config)=>{
        config.modResults = (0, _Colors.assignColorValue)(config.modResults, {
            name: COLOR_PRIMARY_KEY,
            value: getPrimaryColor(config)
        });
        return config;
    });
};
const withPrimaryColorStyles = (config)=>{
    return (0, _androidplugins.withAndroidStyles)(config, (config)=>{
        config.modResults = (0, _Styles.assignStylesValue)(config.modResults, {
            add: !!getPrimaryColor(config),
            parent: (0, _Styles.getAppThemeGroup)(),
            name: COLOR_PRIMARY_KEY,
            value: `@color/${COLOR_PRIMARY_KEY}`
        });
        return config;
    });
};
function getPrimaryColor(config) {
    return config.primaryColor ?? DEFAULT_PRIMARY_COLOR;
}

//# sourceMappingURL=PrimaryColor.js.map
