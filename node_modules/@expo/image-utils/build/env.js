"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "env", {
    enumerable: true,
    get: function() {
        return env;
    }
});
function _getenv() {
    const data = require("getenv");
    _getenv = function() {
        return data;
    };
    return data;
}
class Env {
    /** Enable image utils related debugging messages */ get EXPO_IMAGE_UTILS_DEBUG() {
        return (0, _getenv().boolish)('EXPO_IMAGE_UTILS_DEBUG', false);
    }
    /** Disable all Sharp related functionality. */ get EXPO_IMAGE_UTILS_NO_SHARP() {
        return (0, _getenv().boolish)('EXPO_IMAGE_UTILS_NO_SHARP', false);
    }
}
const env = new Env();

//# sourceMappingURL=env.js.map
