'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NativeToolbarButton", {
    enumerable: true,
    get: function() {
        return NativeToolbarButton;
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
const NativeToolbarButton = (props)=>{
    const id = (0, _react().useId)();
    const renderingMode = props.imageRenderingMode ?? (props.tintColor !== undefined ? 'template' : 'original');
    if (process.env.NODE_ENV !== 'production' && props.source) {
        console.warn('Stack.Toolbar.Button in placement="bottom" on iOS does not support image icons via the `icon` prop or <Stack.Toolbar.Icon src={...} />; the image will not render. Use the `icon` prop with a string SF Symbol name (e.g. "star.fill"), the `image` prop for a custom image, or <Stack.Toolbar.Icon xcasset="..." /> for an Xcode asset catalog image.');
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_native.RouterToolbarItem, {
        accessibilityHint: props.accessibilityHint,
        accessibilityLabel: props.accessibilityLabel,
        barButtonItemStyle: props.variant === 'done' ? 'prominent' : props.variant,
        disabled: props.disabled,
        hidden: props.hidden,
        hidesSharedBackground: props.hidesSharedBackground,
        identifier: id,
        image: props.image,
        imageRenderingMode: renderingMode,
        onSelected: props.onPress,
        possibleTitles: props.possibleTitles,
        selected: props.selected,
        sharesBackground: !props.separateBackground,
        systemImageName: props.icon,
        xcassetName: props.xcassetName,
        title: props.label,
        tintColor: props.tintColor,
        titleStyle: _reactnative().StyleSheet.flatten(props.style)
    });
};

//# sourceMappingURL=native.ios.js.map
