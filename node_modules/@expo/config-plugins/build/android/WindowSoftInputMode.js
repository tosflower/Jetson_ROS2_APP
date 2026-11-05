"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getWindowSoftInputModeMode: null,
    setWindowSoftInputModeMode: null,
    withWindowSoftInputMode: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getWindowSoftInputModeMode () {
        return getWindowSoftInputModeMode;
    },
    get setWindowSoftInputModeMode () {
        return setWindowSoftInputModeMode;
    },
    get withWindowSoftInputMode () {
        return withWindowSoftInputMode;
    }
});
const _androidplugins = require("../plugins/android-plugins");
const _Manifest = require("./Manifest");
const ANDROID_WINDOW_SOFT_INPUT_MODE = 'android:windowSoftInputMode';
const MAPPING = {
    pan: 'adjustPan',
    resize: 'adjustResize'
};
const withWindowSoftInputMode = (config)=>{
    return (0, _androidplugins.withAndroidManifest)(config, async (config)=>{
        config.modResults = setWindowSoftInputModeMode(config, config.modResults);
        return config;
    });
};
function setWindowSoftInputModeMode(config, androidManifest) {
    const app = (0, _Manifest.getMainActivityOrThrow)(androidManifest);
    app.$[ANDROID_WINDOW_SOFT_INPUT_MODE] = getWindowSoftInputModeMode(config);
    return androidManifest;
}
function getWindowSoftInputModeMode(config) {
    const value = config.android?.softwareKeyboardLayoutMode;
    if (!value) {
        // Default to `adjustResize` or `resize`.
        return 'adjustResize';
    }
    return MAPPING[value] ?? value;
}

//# sourceMappingURL=WindowSoftInputMode.js.map
