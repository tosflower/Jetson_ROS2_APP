'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    StackToolbarView: null,
    convertStackToolbarViewPropsToRNHeaderItem: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get StackToolbarView () {
        return StackToolbarView;
    },
    get convertStackToolbarViewPropsToRNHeaderItem () {
        return convertStackToolbarViewPropsToRNHeaderItem;
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
const StackToolbarView = (props)=>{
    const placement = (0, _context.useToolbarPlacement)();
    if (process.env.EXPO_OS === 'ios' && placement !== 'bottom' || placement == null) {
        throw new Error('Stack.Toolbar.View must be used inside a Stack.Toolbar');
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_native.NativeToolbarView, {
        ...props,
        children: props.children
    });
};
function convertStackToolbarViewPropsToRNHeaderItem(props) {
    if (props.hidden) {
        return undefined;
    }
    const { children, hidesSharedBackground } = props;
    if (!children) {
        console.warn('Stack.Toolbar.View requires a child element to render custom content in the toolbar.');
    }
    const element = children ? children : /*#__PURE__*/ (0, _jsxruntime().jsx)(_jsxruntime().Fragment, {});
    return {
        type: 'custom',
        element,
        hidesSharedBackground
    };
}

//# sourceMappingURL=index.js.map
