'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HeaderTitle", {
    enumerable: true,
    get: function() {
        return HeaderTitle;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
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
function HeaderTitle({ tintColor, style, ...rest }) {
    const { colors, fonts } = (0, _native.useTheme)();
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Animated.Text, {
        role: "heading",
        "aria-level": "1",
        numberOfLines: 1,
        ...rest,
        style: [
            {
                color: tintColor === undefined ? colors.text : tintColor
            },
            _reactnative().Platform.select({
                ios: fonts.bold,
                default: fonts.medium
            }),
            styles.title,
            style
        ]
    });
}
const styles = _reactnative().StyleSheet.create({
    title: _reactnative().Platform.select({
        ios: {
            fontSize: 17
        },
        android: {
            fontSize: 20
        },
        default: {
            fontSize: 18
        }
    })
});

//# sourceMappingURL=HeaderTitle.js.map
