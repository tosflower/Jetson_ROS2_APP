"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    useDeprecated: null,
    useWarnOnce: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get useDeprecated () {
        return useDeprecated;
    },
    get useWarnOnce () {
        return useWarnOnce;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
// Node environment may render in multiple processes causing the warning to log multiple times
// Hence we skip the warning in these environments.
const canWarn = _reactnative().Platform.select({
    native: process.env.NODE_ENV !== 'production',
    default: process.env.NODE_ENV !== 'production' && typeof window !== 'undefined'
});
const warned = new Set();
function useWarnOnce(message, guard = true, key = message) {
    // useLayoutEffect typically doesn't run in node environments.
    // Combined with skipWarn, this should prevent unwanted warnings
    (0, _react().useLayoutEffect)(()=>{
        if (guard && canWarn && !warned.has(key)) {
            warned.add(key);
            console.warn(message);
        }
    }, [
        guard
    ]);
}
function useDeprecated(message, guard = true, key = message) {
    return useWarnOnce(key, guard, `Expo Router: ${message}`);
}

//# sourceMappingURL=useDeprecated.js.map
