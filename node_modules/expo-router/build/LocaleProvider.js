'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LocaleProvider", {
    enumerable: true,
    get: function() {
        return LocaleProvider;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
const _LocaleDirContext = require("./react-navigation/native/LocaleDirContext");
function LocaleProvider({ direction, children }) {
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_LocaleDirContext.LocaleDirContext.Provider, {
        value: direction,
        children: children
    });
}

//# sourceMappingURL=LocaleProvider.js.map
