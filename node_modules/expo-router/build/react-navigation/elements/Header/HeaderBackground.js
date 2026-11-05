'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HeaderBackground", {
    enumerable: true,
    get: function() {
        return HeaderBackground;
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
const _native = require("../../native");
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
function HeaderBackground({ style, ...rest }) {
    const { colors, dark } = (0, _native.useTheme)();
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Animated.View, {
        style: [
            styles.container,
            {
                backgroundColor: colors.card,
                borderBottomColor: colors.border,
                ..._reactnative().Platform.OS === 'ios' && {
                    shadowColor: dark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 1)'
                }
            },
            style
        ],
        ...rest
    });
}
const styles = _reactnative().StyleSheet.create({
    container: {
        flex: 1,
        ..._reactnative().Platform.select({
            android: {
                elevation: 4
            },
            ios: {
                shadowOpacity: 0.3,
                shadowRadius: 0,
                shadowOffset: {
                    width: 0,
                    height: _reactnative().StyleSheet.hairlineWidth
                }
            },
            default: {
                borderBottomWidth: _reactnative().StyleSheet.hairlineWidth
            }
        })
    }
});

//# sourceMappingURL=HeaderBackground.js.map
