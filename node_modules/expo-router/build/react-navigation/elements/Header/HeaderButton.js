'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HeaderButton", {
    enumerable: true,
    get: function() {
        return HeaderButton;
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
const _PlatformPressable = require("../PlatformPressable");
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
function HeaderButtonInternal({ ref, disabled, onPress, pressColor, pressOpacity, accessibilityLabel, testID, style, href, children }) {
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_PlatformPressable.PlatformPressable, {
        ref: ref,
        disabled: disabled,
        href: href,
        "aria-label": accessibilityLabel,
        testID: testID,
        onPress: onPress,
        pressColor: pressColor,
        pressOpacity: pressOpacity,
        android_ripple: androidRipple,
        style: [
            styles.container,
            disabled && styles.disabled,
            style
        ],
        hitSlop: _reactnative().Platform.select({
            ios: undefined,
            default: {
                top: 16,
                right: 16,
                bottom: 16,
                left: 16
            }
        }),
        children: children
    });
}
const HeaderButton = HeaderButtonInternal;
const androidRipple = {
    borderless: true,
    foreground: _reactnative().Platform.OS === 'android' && _reactnative().Platform.Version >= 23,
    radius: 20
};
const styles = _reactnative().StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        // Roundness for iPad hover effect
        borderRadius: 10,
        borderCurve: 'continuous'
    },
    disabled: {
        opacity: 0.5
    }
});

//# sourceMappingURL=HeaderButton.js.map
