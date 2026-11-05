'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Try", {
    enumerable: true,
    get: function() {
        return Try;
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
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _errors = require("../rsc/router/errors");
const _Splash = /*#__PURE__*/ _interop_require_wildcard(require("./Splash"));
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
class Try extends _react().Component {
    state = {
        error: undefined
    };
    static getDerivedStateFromError(error) {
        // Force hide the splash screen if an error occurs.
        _Splash.hideAsync();
        if (__DEV__ && error instanceof _errors.MetroServerError) {
            // Throw up to the LogBox.
            return null;
        }
        return {
            error
        };
    }
    retry = ()=>{
        return new Promise((resolve)=>{
            this.setState({
                error: undefined
            }, ()=>{
                resolve();
            });
        });
    };
    render() {
        const { error } = this.state;
        const { catch: ErrorBoundary, children } = this.props;
        if (!error) {
            return children;
        }
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(ErrorBoundary, {
            error: error,
            retry: this.retry
        });
    }
}

//# sourceMappingURL=Try.js.map
