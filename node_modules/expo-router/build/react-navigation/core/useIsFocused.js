'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    FocusedRouteKeyContext: null,
    IsFocusedContext: null,
    useIsFocused: null,
    useIsRouteFocused: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get FocusedRouteKeyContext () {
        return FocusedRouteKeyContext;
    },
    get IsFocusedContext () {
        return IsFocusedContext;
    },
    get useIsFocused () {
        return useIsFocused;
    },
    get useIsRouteFocused () {
        return useIsRouteFocused;
    }
});
function _react() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const FocusedRouteKeyContext = /*#__PURE__*/ _react().createContext(undefined);
const IsFocusedContext = /*#__PURE__*/ _react().createContext(undefined);
function useIsRouteFocused(routeKey) {
    const parentIsFocused = (0, _react().use)(IsFocusedContext);
    const focusedRouteKey = (0, _react().use)(FocusedRouteKeyContext);
    if (routeKey === undefined) {
        return parentIsFocused ?? true;
    }
    return parentIsFocused == null || parentIsFocused ? focusedRouteKey === routeKey : false;
}
function useIsFocused() {
    const isFocused = (0, _react().use)(IsFocusedContext);
    if (isFocused === undefined) {
        throw new Error("Couldn't find a focus context. Make sure the component is rendered inside your app's route tree. This is most likely a bug in expo-router. Please report it at https://github.com/expo/expo/issues.");
    }
    return isFocused;
}

//# sourceMappingURL=useIsFocused.js.map
