'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SafeAreaProviderCompat", {
    enumerable: true,
    get: function() {
        return SafeAreaProviderCompat;
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
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
function _reactnativesafeareacontext() {
    const data = require("react-native-safe-area-context");
    _reactnativesafeareacontext = function() {
        return data;
    };
    return data;
}
const _SafeAreaProvider = require("../../SafeAreaProvider");
const _useFrameSize = require("./useFrameSize");
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
function getInitialFrameSize() {
    if (_reactnative().Platform.OS === 'web') {
        return {
            width: 0,
            height: 0
        };
    }
    const { width = 0, height = 0 } = _reactnative().Dimensions.get('window');
    return {
        width,
        height
    };
}
const { width, height } = getInitialFrameSize();
// To support SSR on web, we need to have empty insets for initial values
// Otherwise there can be mismatch between SSR and client output
// We also need to specify empty values to support tests environments
const initialMetrics = _reactnative().Platform.OS === 'web' || _reactnativesafeareacontext().initialWindowMetrics == null ? {
    frame: {
        x: 0,
        y: 0,
        width,
        height
    },
    insets: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }
} : _reactnativesafeareacontext().initialWindowMetrics;
function SafeAreaProviderCompat({ children, style }) {
    const insets = (0, _react().use)(_reactnativesafeareacontext().SafeAreaInsetsContext);
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_useFrameSize.FrameSizeProvider, {
        initialFrame: initialMetrics.frame,
        render: ({ ref, onLayout })=>{
            if (insets) {
                // If we already have insets, don't wrap the stack in another safe area provider
                // This avoids an issue with updates at the cost of potentially incorrect values
                // https://github.com/react-navigation/react-navigation/issues/174
                return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
                    ref: ref,
                    onLayout: onLayout,
                    style: [
                        styles.container,
                        style
                    ],
                    children: children
                });
            }
            // SafeAreaProvider doesn't forward ref
            // So we only pass onLayout to it
            return /*#__PURE__*/ (0, _jsxruntime().jsx)(_SafeAreaProvider.SafeAreaProvider, {
                initialMetrics: initialMetrics,
                style: style,
                onLayout: onLayout,
                children: children
            });
        }
    });
}
SafeAreaProviderCompat.initialMetrics = initialMetrics;
const styles = _reactnative().StyleSheet.create({
    container: {
        flex: 1
    }
});

//# sourceMappingURL=SafeAreaProviderCompat.js.map
