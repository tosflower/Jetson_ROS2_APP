"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getGoogleMapsApiKey: null,
    setGoogleMapsApiKey: null,
    withGoogleMapsApiKey: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getGoogleMapsApiKey () {
        return getGoogleMapsApiKey;
    },
    get setGoogleMapsApiKey () {
        return setGoogleMapsApiKey;
    },
    get withGoogleMapsApiKey () {
        return withGoogleMapsApiKey;
    }
});
const _androidplugins = require("../plugins/android-plugins");
const _Manifest = require("./Manifest");
const META_API_KEY = 'com.google.android.geo.API_KEY';
const LIB_HTTP = 'org.apache.http.legacy';
const withGoogleMapsApiKey = (0, _androidplugins.createAndroidManifestPlugin)(setGoogleMapsApiKey, 'withGoogleMapsApiKey');
function getGoogleMapsApiKey(config) {
    return config.android?.config?.googleMaps?.apiKey ?? null;
}
function setGoogleMapsApiKey(config, androidManifest) {
    const apiKey = getGoogleMapsApiKey(config);
    const mainApplication = (0, _Manifest.getMainApplicationOrThrow)(androidManifest);
    if (apiKey) {
        // If the item exists, add it back
        (0, _Manifest.addMetaDataItemToMainApplication)(mainApplication, META_API_KEY, apiKey);
        (0, _Manifest.addUsesLibraryItemToMainApplication)(mainApplication, {
            name: LIB_HTTP,
            required: false
        });
    } else {
        // Remove any existing item
        (0, _Manifest.removeMetaDataItemFromMainApplication)(mainApplication, META_API_KEY);
        (0, _Manifest.removeUsesLibraryItemFromMainApplication)(mainApplication, LIB_HTTP);
    }
    return androidManifest;
}

//# sourceMappingURL=GoogleMapsApiKey.js.map
