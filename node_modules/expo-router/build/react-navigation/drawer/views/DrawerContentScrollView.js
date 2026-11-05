'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DrawerContentScrollView", {
    enumerable: true,
    get: function() {
        return DrawerContentScrollView;
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
const _native = require("../../native");
const _DrawerPositionContext = require("../utils/DrawerPositionContext");
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
const SPACING = 12;
function DrawerContentScrollViewInner({ ref, contentContainerStyle, style, children, ...rest }) {
    const drawerPosition = (0, _react().use)(_DrawerPositionContext.DrawerPositionContext);
    const insets = (0, _reactnativesafeareacontext().useSafeAreaInsets)();
    const { direction } = (0, _native.useLocale)();
    const isRight = direction === 'rtl' ? drawerPosition === 'left' : drawerPosition === 'right';
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().ScrollView, {
        ...rest,
        ref: ref,
        contentContainerStyle: [
            {
                paddingTop: SPACING + insets.top,
                paddingBottom: SPACING + insets.bottom,
                paddingStart: SPACING + (!isRight ? insets.left : 0),
                paddingEnd: SPACING + (isRight ? insets.right : 0)
            },
            contentContainerStyle
        ],
        style: [
            styles.container,
            style
        ],
        children: children
    });
}
const DrawerContentScrollView = DrawerContentScrollViewInner;
const styles = _reactnative().StyleSheet.create({
    container: {
        flex: 1
    }
});

//# sourceMappingURL=DrawerContentScrollView.js.map
