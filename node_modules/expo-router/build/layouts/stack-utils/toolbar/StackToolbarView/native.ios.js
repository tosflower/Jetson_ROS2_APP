'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NativeToolbarView", {
    enumerable: true,
    get: function() {
        return NativeToolbarView;
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
const _native = require("../../../../toolbar/native");
const NativeToolbarView = ({ children, hidden, hidesSharedBackground, separateBackground })=>{
    const id = (0, _react().useId)();
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_native.RouterToolbarItem, {
        hidesSharedBackground: hidesSharedBackground,
        hidden: hidden,
        identifier: id,
        sharesBackground: !separateBackground,
        children: children
    });
};

//# sourceMappingURL=native.ios.js.map
