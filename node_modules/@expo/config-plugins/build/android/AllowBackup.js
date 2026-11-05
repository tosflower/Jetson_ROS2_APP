"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getAllowBackup: null,
    getAllowBackupFromManifest: null,
    setAllowBackup: null,
    withAllowBackup: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getAllowBackup () {
        return getAllowBackup;
    },
    get getAllowBackupFromManifest () {
        return getAllowBackupFromManifest;
    },
    get setAllowBackup () {
        return setAllowBackup;
    },
    get withAllowBackup () {
        return withAllowBackup;
    }
});
const _androidplugins = require("../plugins/android-plugins");
const _Manifest = require("./Manifest");
const withAllowBackup = (0, _androidplugins.createAndroidManifestPlugin)(setAllowBackup, 'withAllowBackup');
function getAllowBackup(config) {
    // Defaults to true.
    // https://docs.expo.dev/versions/latest/config/app/#allowbackup
    return config.android?.allowBackup ?? true;
}
function setAllowBackup(config, androidManifest) {
    const allowBackup = getAllowBackup(config);
    const mainApplication = (0, _Manifest.getMainApplication)(androidManifest);
    if (mainApplication?.$) {
        mainApplication.$['android:allowBackup'] = String(allowBackup);
    }
    return androidManifest;
}
function getAllowBackupFromManifest(androidManifest) {
    const mainApplication = (0, _Manifest.getMainApplication)(androidManifest);
    if (mainApplication?.$) {
        return String(mainApplication.$['android:allowBackup']) === 'true';
    }
    return null;
}

//# sourceMappingURL=AllowBackup.js.map
