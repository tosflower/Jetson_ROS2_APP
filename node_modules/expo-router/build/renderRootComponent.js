"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "renderRootComponent", {
    enumerable: true,
    get: function() {
        return renderRootComponent;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
function _expo() {
    const data = require("expo");
    _expo = function() {
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
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
const _splash = /*#__PURE__*/ _interop_require_wildcard(require("./utils/splash"));
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
function isBaseObject(obj) {
    if (Object.prototype.toString.call(obj) !== '[object Object]') {
        return false;
    }
    const proto = Object.getPrototypeOf(obj);
    if (proto === null) {
        return true;
    }
    return proto === Object.prototype;
}
function isErrorShaped(error) {
    return error && typeof error === 'object' && typeof error.name === 'string' && typeof error.message === 'string';
}
/**
 * After we throw this error, any number of tools could handle it.
 * This check ensures the error is always in a reason state before surfacing it to the runtime.
 */ function convertError(error) {
    if (isErrorShaped(error)) {
        return error;
    }
    if (process.env.NODE_ENV === 'development') {
        if (error == null) {
            return new Error('A null/undefined error was thrown.');
        }
    }
    if (isBaseObject(error)) {
        return new Error(JSON.stringify(error));
    }
    return new Error(String(error));
}
function renderRootComponent(Component) {
    try {
        if (process.env.NODE_ENV !== 'production') {
            require('@expo/log-box/lib').setupLogBox();
        }
        // This must be delayed so the user has a chance to call it first.
        setTimeout(()=>{
            _splash._internal_preventAutoHideAsync?.();
        });
        _react().startTransition(()=>{
            (0, _expo().registerRootComponent)(Component);
        });
    } catch (e) {
        // Hide the splash screen if there was an error so the user can see it.
        _splash.hideAsync();
        const error = convertError(e);
        // Prevent the app from throwing confusing:
        //  ERROR  Invariant Violation: "main" has not been registered. This can happen if:
        // * Metro (the local dev server) is run from the wrong folder. Check if Metro is running, stop it and restart it in the current project.
        // * A module failed to load due to an error and `AppRegistry.registerComponent` wasn't called.
        (0, _expo().registerRootComponent)(()=>/*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {}));
        // Console is pretty useless on native, on web you get interactive stack traces.
        if (process.env.EXPO_OS === 'web') {
            console.error(error);
            console.error(`A runtime error has occurred while rendering the root component.`);
        }
        // Give React a tick to render before throwing.
        setTimeout(()=>{
            throw error;
        });
    // TODO: Render a production-only error screen.
    }
}

//# sourceMappingURL=renderRootComponent.js.map
