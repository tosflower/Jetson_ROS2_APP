'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    EnsureSingleNavigator: null,
    SingleNavigatorContext: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get EnsureSingleNavigator () {
        return EnsureSingleNavigator;
    },
    get SingleNavigatorContext () {
        return SingleNavigatorContext;
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
const MULTIPLE_NAVIGATOR_ERROR = `Another navigator is already registered for this container. You likely have multiple navigators under a single "NavigationContainer" or "Screen". Make sure each navigator is under a separate "Screen" container. See https://docs.expo.dev/router/advanced/nesting-navigators/ for a guide on nesting.`;
const SingleNavigatorContext = /*#__PURE__*/ _react().createContext(undefined);
function EnsureSingleNavigator({ children }) {
    const navigatorKeyRef = _react().useRef(undefined);
    const value = _react().useMemo(()=>({
            register (key) {
                const currentKey = navigatorKeyRef.current;
                if (currentKey !== undefined && key !== currentKey) {
                    throw new Error(MULTIPLE_NAVIGATOR_ERROR);
                }
                navigatorKeyRef.current = key;
            },
            unregister (key) {
                const currentKey = navigatorKeyRef.current;
                if (key !== currentKey) {
                    return;
                }
                navigatorKeyRef.current = undefined;
            }
        }), []);
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(SingleNavigatorContext.Provider, {
        value: value,
        children: children
    });
}

//# sourceMappingURL=EnsureSingleNavigator.js.map
