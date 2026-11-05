'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    StackToolbarButton: null,
    convertStackToolbarButtonPropsToRNHeaderItem: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get StackToolbarButton () {
        return StackToolbarButton;
    },
    get convertStackToolbarButtonPropsToRNHeaderItem () {
        return convertStackToolbarButtonPropsToRNHeaderItem;
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
const _children = require("../../../../utils/children");
const _context = require("../context");
const _shared = require("../shared");
const _toolbarprimitives = require("../toolbar-primitives");
const _native = require("./native");
const StackToolbarButton = (props)=>{
    const placement = (0, _context.useToolbarPlacement)();
    const validChildren = (0, _react().useMemo)(()=>(0, _children.filterAllowedChildrenElements)(props.children, ALLOWED_CHILDREN), [
        props.children
    ]);
    if (process.env.NODE_ENV !== 'production') {
        // Skip validation for string children
        if (typeof props.children !== 'string') {
            const allChildren = _react().Children.toArray(props.children);
            if (allChildren.length !== validChildren.length) {
                throw new Error(`Stack.Toolbar.Button only accepts a single string or Stack.Toolbar.Label, Stack.Toolbar.Icon, and Stack.Toolbar.Badge as its children.`);
            }
        }
    }
    if (process.env.NODE_ENV !== 'production' && placement === 'bottom') {
        const hasBadge = (0, _children.getFirstChildOfType)(props.children, _toolbarprimitives.StackToolbarBadge);
        if (hasBadge) {
            console.warn('Stack.Toolbar.Badge is not supported in bottom toolbar (iOS limitation). The badge will be ignored.');
        }
    }
    if (process.env.EXPO_OS === 'ios' && placement !== 'bottom' || placement == null) {
        throw new Error('Stack.Toolbar.Button must be used inside a Stack.Toolbar');
    }
    const sharedProps = (0, _shared.convertStackHeaderSharedPropsToRNSharedHeaderItem)(props, true);
    // TODO(@ubax): Handle image loading using useImage in a follow-up PR.
    const icon = sharedProps?.icon?.type === 'sfSymbol' ? sharedProps.icon.name : undefined;
    const source = sharedProps?.icon?.type === 'image' ? sharedProps.icon.source : undefined;
    const xcassetName = (0, _shared.extractXcassetName)(props);
    const imageRenderingMode = (0, _shared.extractIconRenderingMode)(props) ?? props.iconRenderingMode;
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_native.NativeToolbarButton, {
        ...sharedProps,
        icon: icon,
        source: source,
        xcassetName: xcassetName,
        image: props.image,
        imageRenderingMode: imageRenderingMode
    });
};
function convertStackToolbarButtonPropsToRNHeaderItem(props) {
    if (props.hidden) {
        return undefined;
    }
    return {
        ...(0, _shared.convertStackHeaderSharedPropsToRNSharedHeaderItem)(props),
        type: 'button',
        onPress: props.onPress ?? (()=>{}),
        selected: !!props.selected
    };
}
const ALLOWED_CHILDREN = [
    _toolbarprimitives.StackToolbarLabel,
    _toolbarprimitives.StackToolbarIcon,
    _toolbarprimitives.StackToolbarBadge
];

//# sourceMappingURL=index.js.map
