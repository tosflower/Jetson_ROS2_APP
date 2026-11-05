'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    NativeToolbarMenu: null,
    NativeToolbarMenuAction: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get NativeToolbarMenu () {
        return NativeToolbarMenu;
    },
    get NativeToolbarMenuAction () {
        return NativeToolbarMenuAction;
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
const _elements = require("../../../../link/elements");
const _native = require("../../../../link/preview/native");
const NativeToolbarMenu = ({ accessibilityHint, accessibilityLabel, separateBackground, hidesSharedBackground, palette, inline, hidden, subtitle, title, label, destructive, children, icon, source, xcassetName, image, imageRenderingMode, tintColor, variant, style, elementSize })=>{
    const identifier = (0, _react().useId)();
    const titleStyle = _reactnative().StyleSheet.flatten(style);
    const renderingMode = imageRenderingMode ?? (tintColor !== undefined ? 'template' : 'original');
    if (process.env.NODE_ENV !== 'production' && source) {
        console.warn('Stack.Toolbar.Menu in placement="bottom" on iOS does not support image icons via the `icon` prop or <Stack.Toolbar.Icon src={...} />; the image will not render. Use the `icon` prop with a string SF Symbol name (e.g. "star.fill"), the `image` prop for a custom image, or <Stack.Toolbar.Icon xcasset="..." /> for an Xcode asset catalog image.');
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_native.NativeLinkPreviewAction, {
        sharesBackground: !separateBackground,
        hidesSharedBackground: hidesSharedBackground,
        hidden: hidden,
        icon: icon,
        xcassetName: xcassetName,
        // TODO(@ubax): Handle image loading using useImage in a follow-up PR.
        image: image,
        imageRenderingMode: renderingMode,
        destructive: destructive,
        subtitle: subtitle,
        accessibilityLabel: accessibilityLabel,
        accessibilityHint: accessibilityHint,
        displayAsPalette: palette,
        displayInline: inline,
        preferredElementSize: elementSize,
        tintColor: tintColor,
        titleStyle: titleStyle,
        barButtonItemStyle: variant === 'done' ? 'prominent' : variant,
        title: title ?? '',
        label: label,
        onSelected: ()=>{},
        children: children,
        identifier: identifier
    });
};
const NativeToolbarMenuAction = _elements.LinkMenuAction;

//# sourceMappingURL=native.ios.js.map
