'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NativeToolbarView", {
    enumerable: true,
    get: function() {
        return NativeToolbarView;
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
const _context = require("../context");
const NativeToolbarView = ({ children, hidden })=>{
    const { expoUI: { Box, RNHostView }, modifiers: { fillMaxHeight } } = (0, _expoui.requireExpoUI)("Stack.Toolbar on Android requires '@expo/ui'. Install it with `npx expo install @expo/ui` and rebuild your app.");
    const placement = (0, _context.useToolbarPlacement)();
    const modifiers = placement === 'bottom' ? [
        fillMaxHeight()
    ] : undefined;
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(Box, {
        contentAlignment: "center",
        modifiers: modifiers,
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_AnimatedItemContainer.AnimatedItemContainer, {
            visible: !hidden,
            children: /*#__PURE__*/ (0, _jsxruntime().jsx)(RNHostView, {
                matchContents: true,
                children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_jsxruntime().Fragment, {
                    children: children
                })
            })
        })
    });
};

//# sourceMappingURL=native.android.js.map
