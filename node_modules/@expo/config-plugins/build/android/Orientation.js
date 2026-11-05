"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    SCREEN_ORIENTATION_ATTRIBUTE: null,
    getOrientation: null,
    setAndroidOrientation: null,
    withOrientation: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get SCREEN_ORIENTATION_ATTRIBUTE () {
        return SCREEN_ORIENTATION_ATTRIBUTE;
    },
    get getOrientation () {
        return getOrientation;
    },
    get setAndroidOrientation () {
        return setAndroidOrientation;
    },
    get withOrientation () {
        return withOrientation;
    }
});
const _androidplugins = require("../plugins/android-plugins");
const _Manifest = require("./Manifest");
const SCREEN_ORIENTATION_ATTRIBUTE = 'android:screenOrientation';
const withOrientation = (0, _androidplugins.createAndroidManifestPlugin)(setAndroidOrientation, 'withOrientation');
function getOrientation(config) {
    return typeof config.orientation === 'string' ? config.orientation : null;
}
function setAndroidOrientation(config, androidManifest) {
    const orientation = getOrientation(config);
    // TODO: Remove this if we decide to remove any orientation configuration when not specified
    if (!orientation) {
        return androidManifest;
    }
    const mainActivity = (0, _Manifest.getMainActivityOrThrow)(androidManifest);
    mainActivity.$[SCREEN_ORIENTATION_ATTRIBUTE] = orientation !== 'default' ? orientation : 'unspecified';
    return androidManifest;
}

//# sourceMappingURL=Orientation.js.map
