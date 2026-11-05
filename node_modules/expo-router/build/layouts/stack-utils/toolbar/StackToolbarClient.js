'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    StackToolbar: null,
    appendStackToolbarPropsToOptions: null,
    default: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get StackToolbar () {
        return StackToolbar;
    },
    get appendStackToolbarPropsToOptions () {
        return appendStackToolbarPropsToOptions;
    },
    get default () {
        return _default;
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
const _compositionoptions = require("../../../fork/native-stack/composition-options");
const _NativeMenuContext = require("../../../link/NativeMenuContext");
const _native = require("../../../toolbar/native");
const _StackToolbarButton = require("./StackToolbarButton");
const _StackToolbarMenu = require("./StackToolbarMenu");
const _StackToolbarSearchBarSlot = require("./StackToolbarSearchBarSlot");
const _StackToolbarSpacer = require("./StackToolbarSpacer");
const _StackToolbarView = require("./StackToolbarView");
const _context = require("./context");
const _processHeaderItemsForPlatform = require("./processHeaderItemsForPlatform");
const _toolbarprimitives = require("./toolbar-primitives");
const StackToolbar = (props)=>{
    const parentPlacement = (0, _context.useToolbarPlacement)();
    if (parentPlacement) {
        throw new Error(`Stack.Toolbar cannot be nested inside another Stack.Toolbar.`);
    }
    if (props.placement === 'bottom' || !props.placement) {
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(StackToolbarBottom, {
            ...props
        });
    }
    return /*#__PURE__*/ (0, _react().createElement)(StackToolbarHeader, {
        ...props,
        key: props.placement
    });
};
const StackToolbarBottom = ({ children, disableImePadding, tintColor, backgroundColor })=>{
    const colors = (0, _react().useMemo)(()=>({
            tintColor,
            backgroundColor
        }), [
        tintColor,
        backgroundColor
    ]);
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_context.ToolbarPlacementContext.Provider, {
        value: "bottom",
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_context.ToolbarColorContext.Provider, {
            value: colors,
            children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_NativeMenuContext.NativeMenuContext, {
                value: true,
                children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_native.RouterToolbarHost, {
                    withImePadding: !disableImePadding,
                    backgroundColor: backgroundColor,
                    children: children
                })
            })
        })
    });
};
const StackToolbarHeader = ({ children, placement, asChild, disableImePadding, tintColor, backgroundColor, buttonContainerColor })=>{
    if (placement !== 'left' && placement !== 'right') {
        throw new Error(`Invalid placement "${placement}" for Stack.Toolbar. Expected "left" or "right".`);
    }
    const options = (0, _react().useMemo)(()=>appendStackToolbarPropsToOptions({}, // satisfies ensures every prop is listed here
        {
            children,
            placement,
            asChild,
            disableImePadding,
            tintColor,
            backgroundColor,
            buttonContainerColor
        }), [
        children,
        placement,
        asChild,
        disableImePadding,
        tintColor,
        backgroundColor,
        buttonContainerColor
    ]);
    (0, _compositionoptions.useCompositionOption)(options);
    return null;
};
function appendStackToolbarPropsToOptions(options, props) {
    const { children, placement = 'bottom', asChild } = props;
    if (placement === 'bottom') {
        // Bottom toolbar doesn't modify navigation options
        return options;
    }
    const colors = {
        tintColor: props.tintColor,
        backgroundColor: props.backgroundColor,
        buttonContainerColor: props.buttonContainerColor
    };
    if (asChild) {
        const wrappedChildren = /*#__PURE__*/ (0, _jsxruntime().jsx)(_context.ToolbarColorContext.Provider, {
            value: colors,
            children: children
        });
        if (placement === 'left') {
            return {
                ...options,
                headerShown: true,
                headerLeft: ()=>wrappedChildren
            };
        } else {
            return {
                ...options,
                headerShown: true,
                headerRight: ()=>wrappedChildren
            };
        }
    }
    return {
        ...options,
        ...(0, _processHeaderItemsForPlatform.processHeaderItemsForPlatform)(children, placement, colors) ?? {}
    };
}
StackToolbar.Button = _StackToolbarButton.StackToolbarButton;
StackToolbar.Menu = _StackToolbarMenu.StackToolbarMenu;
StackToolbar.MenuAction = _StackToolbarMenu.StackToolbarMenuAction;
StackToolbar.SearchBarSlot = _StackToolbarSearchBarSlot.StackToolbarSearchBarSlot;
StackToolbar.Spacer = _StackToolbarSpacer.StackToolbarSpacer;
StackToolbar.View = _StackToolbarView.StackToolbarView;
StackToolbar.Label = _toolbarprimitives.StackToolbarLabel;
StackToolbar.Icon = _toolbarprimitives.StackToolbarIcon;
StackToolbar.Badge = _toolbarprimitives.StackToolbarBadge;
const _default = StackToolbar;

//# sourceMappingURL=StackToolbarClient.js.map
