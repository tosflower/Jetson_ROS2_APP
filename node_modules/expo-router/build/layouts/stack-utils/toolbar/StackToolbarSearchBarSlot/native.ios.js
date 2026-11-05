'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NativeToolbarSearchBarSlot", {
    enumerable: true,
    get: function() {
        return NativeToolbarSearchBarSlot;
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
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
const _native = require("../../../../toolbar/native");
const NativeToolbarSearchBarSlot = ({ hidesSharedBackground, hidden, separateBackground })=>{
    const id = (0, _react().useId)();
    if (process.env.EXPO_OS !== 'ios' || parseInt(String(_reactnative().Platform.Version).split('.')[0], 10) < 26) {
        return null;
    }
    if (hidden) {
        return null;
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_native.RouterToolbarItem, {
        hidesSharedBackground: hidesSharedBackground,
        identifier: id,
        sharesBackground: !separateBackground,
        type: "searchBar"
    });
};

//# sourceMappingURL=native.ios.js.map
