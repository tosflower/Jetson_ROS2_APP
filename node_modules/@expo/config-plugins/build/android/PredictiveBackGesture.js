"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getPredictiveBackGestureValue: null,
    setPredictiveBackGesture: null,
    withPredictiveBackGesture: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getPredictiveBackGestureValue () {
        return getPredictiveBackGestureValue;
    },
    get setPredictiveBackGesture () {
        return setPredictiveBackGesture;
    },
    get withPredictiveBackGesture () {
        return withPredictiveBackGesture;
    }
});
const _androidplugins = require("../plugins/android-plugins");
const _Manifest = require("./Manifest");
const ANDROID_ENABLE_ON_BACK_INVOKED_CALLBACK = 'android:enableOnBackInvokedCallback';
const withPredictiveBackGesture = (config)=>{
    return (0, _androidplugins.withAndroidManifest)(config, async (config)=>{
        config.modResults = setPredictiveBackGesture(config, config.modResults);
        return config;
    });
};
function setPredictiveBackGesture(config, androidManifest) {
    const app = (0, _Manifest.getMainApplicationOrThrow)(androidManifest);
    app.$[ANDROID_ENABLE_ON_BACK_INVOKED_CALLBACK] = getPredictiveBackGestureValue(config);
    return androidManifest;
}
function getPredictiveBackGestureValue(config) {
    const value = config.android?.predictiveBackGestureEnabled;
    return value === true ? 'true' : 'false';
}

//# sourceMappingURL=PredictiveBackGesture.js.map
