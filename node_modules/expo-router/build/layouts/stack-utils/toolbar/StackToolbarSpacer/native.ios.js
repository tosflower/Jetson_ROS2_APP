'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NativeToolbarSpacer", {
    enumerable: true,
    get: function() {
        return NativeToolbarSpacer;
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
const NativeToolbarSpacer = (props)=>{
    const id = (0, _react().useId)();
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_native.RouterToolbarItem, {
        hidesSharedBackground: props.hidesSharedBackground,
        hidden: props.hidden,
        identifier: id,
        sharesBackground: props.sharesBackground,
        type: props.width ? 'fixedSpacer' : 'fluidSpacer',
        width: props.width
    });
};

//# sourceMappingURL=native.ios.js.map
