"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    setSystemBarsStyles: null,
    withSystemBars: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get setSystemBarsStyles () {
        return setSystemBarsStyles;
    },
    get withSystemBars () {
        return withSystemBars;
    }
});
const _androidplugins = require("../plugins/android-plugins");
const _warnings = /*#__PURE__*/ _interop_require_wildcard(require("../utils/warnings"));
const _Styles = require("./Styles");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const TAG = 'SYSTEM_BARS_PLUGIN';
const setSystemBarsStyles = (styles)=>{
    styles = (0, _Styles.assignStylesValue)(styles, {
        add: true,
        parent: (0, _Styles.getAppThemeGroup)(),
        name: 'android:statusBarColor',
        value: '@android:color/transparent'
    });
    styles = (0, _Styles.assignStylesValue)(styles, {
        add: true,
        parent: (0, _Styles.getAppThemeGroup)(),
        name: 'android:navigationBarColor',
        value: '@android:color/transparent'
    });
    return styles;
};
const withSystemBars = (config)=>{
    if ('androidStatusBar' in config) {
        _warnings.addWarningAndroid(TAG, '`androidStatusBar` is deprecated and has no effect. Use the `expo-status-bar` plugin configuration instead.');
    }
    if ('androidNavigationBar' in config) {
        _warnings.addWarningAndroid(TAG, '`androidNavigationBar` is deprecated and has no effect. Use the `expo-navigation-bar` plugin configuration instead.');
    }
    return (0, _androidplugins.withAndroidStyles)(config, (config)=>{
        config.modResults = setSystemBarsStyles(config.modResults);
        return config;
    });
};

//# sourceMappingURL=SystemBars.js.map
