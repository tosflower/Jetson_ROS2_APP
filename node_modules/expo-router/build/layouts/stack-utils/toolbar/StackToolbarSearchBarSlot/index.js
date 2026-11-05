'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "StackToolbarSearchBarSlot", {
    enumerable: true,
    get: function() {
        return StackToolbarSearchBarSlot;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
const _context = require("../context");
const _native = require("./native");
const StackToolbarSearchBarSlot = (props)=>{
    const placement = (0, _context.useToolbarPlacement)();
    if (placement !== 'bottom') {
        throw new Error('Stack.Toolbar.SearchBarSlot must be used inside a Stack.Toolbar');
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_native.NativeToolbarSearchBarSlot, {
        ...props
    });
};

//# sourceMappingURL=index.js.map
