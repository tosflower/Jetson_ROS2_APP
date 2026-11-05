"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    METRO_PORT_INFO_PLIST_KEY: null,
    setMetroPort: null,
    withMetroPort: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get METRO_PORT_INFO_PLIST_KEY () {
        return METRO_PORT_INFO_PLIST_KEY;
    },
    get setMetroPort () {
        return setMetroPort;
    },
    get withMetroPort () {
        return withMetroPort;
    }
});
const _iosplugins = require("../plugins/ios-plugins");
const METRO_PORT_INFO_PLIST_KEY = 'RCTMetroPort';
const withMetroPort = (0, _iosplugins.createInfoPlistPlugin)(setMetroPort, 'withMetroPort');
function setMetroPort(_config, infoPlist) {
    return {
        ...infoPlist,
        [METRO_PORT_INFO_PLIST_KEY]: '$(RCT_METRO_PORT)'
    };
}

//# sourceMappingURL=DevServer.js.map
