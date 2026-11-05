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
const _expoui = require("../../../../optional-libraries/expo-ui");
const _AnimatedItemContainer = require("../../../../toolbar/AnimatedItemContainer");
const _ToolbarItemBadge = require("../ToolbarItemBadge");
const _context = require("../context");
const _defaults = require("../defaults");
const _getIconButtonContainerColors = require("../getIconButtonContainerColors");
const NativeToolbarButton = (props)=>{
    const toolbarColors = (0, _context.useToolbarColors)();
    if (!props.source) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn('Stack.Toolbar.Button on Android requires an ImageSourcePropType icon. SF Symbols and xcasset icons are not supported. Use the `icon` prop with a require() or { uri } source, or use <Stack.Toolbar.Icon src={...} />.');
        }
        return null;
    }
    const { expoUI: { Icon, IconButton } } = (0, _expoui.requireExpoUI)("Stack.Toolbar on Android requires '@expo/ui'. Install it with `npx expo install @expo/ui` and rebuild your app.");
    // `tint={null}` tells `<Icon>` to draw the source in its original colors.
    // `undefined` would fall back to `LocalContentColor`, i.e. the IconButton's
    // content color, which is still a tint.
    const tintColor = props.imageRenderingMode === 'original' ? null : props.tintColor ?? toolbarColors.tintColor ?? (0, _defaults.DEFAULT_TOOLBAR_TINT_COLOR)();
    const button = /*#__PURE__*/ (0, _jsxruntime().jsx)(IconButton, {
        onClick: props.onPress,
        enabled: !props.disabled,
        colors: (0, _getIconButtonContainerColors.getIconButtonContainerColors)(toolbarColors.buttonContainerColor),
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(Icon, {
            source: props.source,
            tint: tintColor,
            size: 24,
            contentDescription: (0, _ToolbarItemBadge.getBadgeContentDescription)(props.accessibilityLabel, props.badge)
        })
    });
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_AnimatedItemContainer.AnimatedItemContainer, {
        visible: !props.hidden,
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_ToolbarItemBadge.ToolbarItemBadge, {
            badge: props.badge,
            disabled: props.disabled,
            children: button
        })
    });
};

//# sourceMappingURL=native.android.js.map
