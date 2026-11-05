'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    NamedRouteContextListContext: null,
    NavigationProvider: null,
    NavigationRouteContext: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get NamedRouteContextListContext () {
        return NamedRouteContextListContext;
    },
    get NavigationProvider () {
        return NavigationProvider;
    },
    get NavigationRouteContext () {
        return NavigationRouteContext;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
function _react() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
const _NavigationContext = require("./NavigationContext");
const _useIsFocused = require("./useIsFocused");
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
const NavigationRouteContext = /*#__PURE__*/ _react().createContext(undefined);
const NamedRouteContextListContext = /*#__PURE__*/ _react().createContext(undefined);
function NavigationProvider({ route, navigation, children }) {
    const isFocused = (0, _useIsFocused.useIsRouteFocused)(route.key);
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(NavigationRouteContext.Provider, {
        value: route,
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_NavigationContext.NavigationContext.Provider, {
            value: navigation,
            children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_useIsFocused.IsFocusedContext.Provider, {
                value: isFocused,
                children: children
            })
        })
    });
}

//# sourceMappingURL=NavigationProvider.js.map
