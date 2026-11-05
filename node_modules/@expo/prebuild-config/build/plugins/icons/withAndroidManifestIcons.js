"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    setRoundIconManifest: null,
    withAndroidManifestIcons: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get setRoundIconManifest () {
        return setRoundIconManifest;
    },
    get withAndroidManifestIcons () {
        return withAndroidManifestIcons;
    }
});
function _configplugins() {
    const data = require("@expo/config-plugins");
    _configplugins = function() {
        return data;
    };
    return data;
}
const withAndroidManifestIcons = (config)=>(0, _configplugins().withAndroidManifest)(config, (config)=>{
        config.modResults = setRoundIconManifest(config, config.modResults);
        return config;
    });
function setRoundIconManifest(config, manifest) {
    const isAdaptive = !!config.android?.adaptiveIcon;
    const application = _configplugins().AndroidConfig.Manifest.getMainApplicationOrThrow(manifest);
    if (isAdaptive) {
        application.$['android:roundIcon'] = '@mipmap/ic_launcher_round';
    } else {
        delete application.$['android:roundIcon'];
    }
    return manifest;
}

//# sourceMappingURL=withAndroidManifestIcons.js.map
