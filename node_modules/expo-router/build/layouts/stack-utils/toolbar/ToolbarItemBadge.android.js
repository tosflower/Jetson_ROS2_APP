'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ToolbarItemBadge: null,
    getBadgeContentDescription: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ToolbarItemBadge () {
        return ToolbarItemBadge;
    },
    get getBadgeContentDescription () {
        return getBadgeContentDescription;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
const _expoui = require("../../../optional-libraries/expo-ui");
const _font = require("../../../utils/font");
/** A badge shows text when its value is neither null nor empty; otherwise it's a bare dot. */ function badgeHasValue(badge) {
    return badge?.value != null && badge.value !== '';
}
function getBadgeContentDescription(accessibilityLabel, badge) {
    if (!accessibilityLabel) {
        return undefined;
    }
    return badgeHasValue(badge) ? `${accessibilityLabel}, ${badge.value}` : accessibilityLabel;
}
function ToolbarItemBadge({ badge, disabled, children }) {
    if (!badge) {
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(_jsxruntime().Fragment, {
            children: children
        });
    }
    const { expoUI: { Badge, Box, Text: ComposeText }, modifiers: { alpha: alphaModifier } } = (0, _expoui.requireExpoUI)("Stack.Toolbar on Android requires '@expo/ui'. Install it with `npx expo install @expo/ui` and rebuild your app.");
    return /*#__PURE__*/ (0, _jsxruntime().jsxs)(Box, {
        contentAlignment: "topEnd",
        children: [
            children,
            /*#__PURE__*/ (0, _jsxruntime().jsx)(Badge, {
                containerColor: badge.style?.backgroundColor,
                contentColor: badge.style?.color,
                modifiers: disabled ? [
                    alphaModifier(0.38)
                ] : undefined,
                children: badgeHasValue(badge) ? /*#__PURE__*/ (0, _jsxruntime().jsx)(ComposeText, {
                    style: {
                        typography: 'labelSmall',
                        fontWeight: (0, _font.convertFontWeightToComposeFontWeight)(badge.style?.fontWeight),
                        fontSize: badge.style?.fontSize,
                        fontFamily: badge.style?.fontFamily
                    },
                    children: String(badge.value)
                }) : null
            })
        ]
    });
}

//# sourceMappingURL=ToolbarItemBadge.android.js.map
