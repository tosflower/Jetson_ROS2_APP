'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Text", {
    enumerable: true,
    get: function() {
        return Text;
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
const _native = require("../native");
function Text({ style, ...rest }) {
    const { colors, fonts } = (0, _native.useTheme)();
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Text, {
        ...rest,
        style: [
            {
                color: colors.text
            },
            fonts.regular,
            style
        ]
    });
}

//# sourceMappingURL=Text.js.map
