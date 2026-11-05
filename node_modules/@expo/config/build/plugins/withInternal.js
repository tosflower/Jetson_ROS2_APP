"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    EXPO_DEBUG: null,
    withInternal: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get EXPO_DEBUG () {
        return EXPO_DEBUG;
    },
    get withInternal () {
        return withInternal;
    }
});
function _getenv() {
    const data = require("getenv");
    _getenv = function() {
        return data;
    };
    return data;
}
const EXPO_DEBUG = (0, _getenv().boolish)('EXPO_DEBUG', false);
const withInternal = (config, internals)=>{
    if (!config._internal) {
        config._internal = {};
    }
    config._internal = {
        isDebug: EXPO_DEBUG,
        ...config._internal,
        ...internals
    };
    return config;
};

//# sourceMappingURL=withInternal.js.map
