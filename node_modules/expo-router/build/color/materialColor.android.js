"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    Material3Color: null,
    Material3DynamicColor: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get Material3Color () {
        return Material3Color;
    },
    get Material3DynamicColor () {
        return Material3DynamicColor;
    }
});
function _expo() {
    const data = require("expo");
    _expo = function() {
        return data;
    };
    return data;
}
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
let AndroidExpoRouterModule = null;
function NativeDynamicColor(name, scheme) {
    if (!AndroidExpoRouterModule) {
        AndroidExpoRouterModule = (0, _expo().requireNativeModule)('ExpoRouter');
    }
    return AndroidExpoRouterModule.Material3DynamicColor(name, scheme);
}
function NativeMaterialColor(name, scheme) {
    if (!AndroidExpoRouterModule) {
        AndroidExpoRouterModule = (0, _expo().requireNativeModule)('ExpoRouter');
    }
    return AndroidExpoRouterModule.Material3Color(name, scheme);
}
function Material3DynamicColor(name) {
    const scheme = _reactnative().Appearance.getColorScheme();
    return NativeDynamicColor(name, scheme ?? 'unspecified');
}
function Material3Color(name) {
    const scheme = _reactnative().Appearance.getColorScheme();
    return NativeMaterialColor(name, scheme ?? 'unspecified');
}

//# sourceMappingURL=materialColor.android.js.map
