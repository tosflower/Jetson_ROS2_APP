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
const _expoui = require("../../../../optional-libraries/expo-ui");
const _AnimatedItemContainer = require("../../../../toolbar/AnimatedItemContainer");
const NativeToolbarSpacer = (props)=>{
    if (!props.width) {
        return null;
    }
    const { expoUI: { Box }, modifiers: { width } } = (0, _expoui.requireExpoUI)("Stack.Toolbar on Android requires '@expo/ui'. Install it with `npx expo install @expo/ui` and rebuild your app.");
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_AnimatedItemContainer.AnimatedItemContainer, {
        visible: !props.hidden,
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(Box, {
            modifiers: [
                width(props.width)
            ]
        })
    });
};

//# sourceMappingURL=native.android.js.map
