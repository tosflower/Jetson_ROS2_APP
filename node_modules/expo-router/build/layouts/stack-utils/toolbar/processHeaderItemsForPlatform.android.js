'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "processHeaderItemsForPlatform", {
    enumerable: true,
    get: function() {
        return processHeaderItemsForPlatform;
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
const _NativeMenuContext = require("../../../link/NativeMenuContext");
const _expoui = require("../../../optional-libraries/expo-ui");
const _context = require("./context");
function processHeaderItemsForPlatform(children, placement, colors) {
    if (placement !== 'left' && placement !== 'right') {
        return null;
    }
    (0, _expoui.requireExpoUI)("Stack.Toolbar on Android requires '@expo/ui'. Install it with `npx expo install @expo/ui` and rebuild your app.");
    const headerContent = (props)=>/*#__PURE__*/ (0, _jsxruntime().jsx)(HeaderToolbarHostBase, {
            placement: placement,
            colors: colors,
            headerProps: props,
            children: children
        });
    if (placement === 'left') {
        return {
            headerShown: true,
            headerLeft: headerContent
        };
    }
    return {
        headerShown: true,
        headerRight: headerContent
    };
}
function HeaderToolbarHostBase({ children, placement, colors, headerProps }) {
    const { expoUI: { Host, Row } } = (0, _expoui.requireExpoUI)("Stack.Toolbar on Android requires '@expo/ui'. Install it with `npx expo install @expo/ui` and rebuild your app.");
    const stableColors = (0, _react().useMemo)(()=>({
            tintColor: colors?.tintColor ?? headerProps?.tintColor,
            backgroundColor: colors?.backgroundColor ?? headerProps?.backgroundColor,
            buttonContainerColor: colors?.buttonContainerColor
        }), [
        colors?.backgroundColor,
        colors?.buttonContainerColor,
        colors?.tintColor,
        headerProps?.tintColor,
        headerProps?.backgroundColor
    ]);
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_context.ToolbarPlacementContext.Provider, {
        value: placement,
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_context.ToolbarColorContext.Provider, {
            value: stableColors,
            children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_NativeMenuContext.NativeMenuContext, {
                value: true,
                children: /*#__PURE__*/ (0, _jsxruntime().jsx)(Host, {
                    matchContents: true,
                    children: /*#__PURE__*/ (0, _jsxruntime().jsx)(Row, {
                        verticalAlignment: "center",
                        children: children
                    })
                })
            })
        })
    });
}

//# sourceMappingURL=processHeaderItemsForPlatform.android.js.map
