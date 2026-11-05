'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    StackToolbarSpacer: null,
    convertStackToolbarSpacerPropsToRNHeaderItem: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get StackToolbarSpacer () {
        return StackToolbarSpacer;
    },
    get convertStackToolbarSpacerPropsToRNHeaderItem () {
        return convertStackToolbarSpacerPropsToRNHeaderItem;
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
const StackToolbarSpacer = (props)=>{
    const placement = (0, _context.useToolbarPlacement)();
    if (process.env.EXPO_OS === 'ios' && placement !== 'bottom' || placement == null) {
        throw new Error('Stack.Toolbar.Spacer must be used inside a Stack.Toolbar');
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_native.NativeToolbarSpacer, {
        ...props,
        hidesSharedBackground: !props.sharesBackground
    });
};
function convertStackToolbarSpacerPropsToRNHeaderItem(props) {
    const { hidden, width } = props;
    if (hidden) {
        return undefined;
    }
    // Warn if using flexible spacer in Left/Right placement
    if (width === undefined) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn('Stack.Toolbar.Spacer requires `width` when used in left or right placement. Flexible spacers are only supported in Bottom placement.');
        }
        return undefined;
    }
    return {
        type: 'spacing',
        spacing: width ?? 0
    };
}

//# sourceMappingURL=index.js.map
