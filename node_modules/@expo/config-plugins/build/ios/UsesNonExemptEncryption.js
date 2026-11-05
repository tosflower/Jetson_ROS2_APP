"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getUsesNonExemptEncryption: null,
    setUsesNonExemptEncryption: null,
    withUsesNonExemptEncryption: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getUsesNonExemptEncryption () {
        return getUsesNonExemptEncryption;
    },
    get setUsesNonExemptEncryption () {
        return setUsesNonExemptEncryption;
    },
    get withUsesNonExemptEncryption () {
        return withUsesNonExemptEncryption;
    }
});
const _iosplugins = require("../plugins/ios-plugins");
const withUsesNonExemptEncryption = (0, _iosplugins.createInfoPlistPluginWithPropertyGuard)(setUsesNonExemptEncryption, {
    infoPlistProperty: 'ITSAppUsesNonExemptEncryption',
    expoConfigProperty: 'ios.config.usesNonExemptEncryption'
}, 'withUsesNonExemptEncryption');
function getUsesNonExemptEncryption(config) {
    return config?.ios?.config?.usesNonExemptEncryption ?? null;
}
function setUsesNonExemptEncryption(config, { ITSAppUsesNonExemptEncryption, ...infoPlist }) {
    const usesNonExemptEncryption = getUsesNonExemptEncryption(config);
    // Make no changes if the key is left blank
    if (usesNonExemptEncryption === null) {
        return infoPlist;
    }
    return {
        ...infoPlist,
        ITSAppUsesNonExemptEncryption: usesNonExemptEncryption
    };
}

//# sourceMappingURL=UsesNonExemptEncryption.js.map
