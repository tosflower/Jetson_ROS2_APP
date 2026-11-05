"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RouterToolbarHost", {
    enumerable: true,
    get: function() {
        return RouterToolbarHost;
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
function _reactnativesafeareacontext() {
    const data = require("react-native-safe-area-context");
    _reactnativesafeareacontext = function() {
        return data;
    };
    return data;
}
const _expoui = require("../optional-libraries/expo-ui");
function RouterToolbarHost(props) {
    const { expoUI: { Host, HorizontalFloatingToolbar, Box }, modifiers: { fillMaxWidth, height, padding, imePadding } } = (0, _expoui.requireExpoUI)("Stack.Toolbar on Android requires '@expo/ui'. Install it with `npx expo install @expo/ui` and rebuild your app.");
    const insets = (0, _reactnativesafeareacontext().useSafeAreaInsets)();
    const modifiers = (0, _react().useMemo)(()=>{
        const baseModifiers = [
            fillMaxWidth(),
            padding(0, 0, 0, insets.bottom)
        ];
        if (props.withImePadding) {
            baseModifiers.push(imePadding());
        }
        return baseModifiers;
    }, [
        insets.bottom,
        props.withImePadding
    ]);
    // The wrapper fills the screen so it can pin the toolbar to the bottom, but `box-none` keeps it
    // from being a touch target. The Compose `Host` then wraps just the toolbar (matchContents), so
    // only that area swallows touches — taps elsewhere reach the screen content below (ENG-22124).
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
        testID: "RouterToolbarWrapper",
        style: styles.container,
        pointerEvents: "box-none",
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(Host, {
            matchContents: {
                vertical: true
            },
            style: styles.host,
            children: /*#__PURE__*/ (0, _jsxruntime().jsx)(Box, {
                modifiers: modifiers,
                contentAlignment: "center",
                children: /*#__PURE__*/ (0, _jsxruntime().jsx)(HorizontalFloatingToolbar, {
                    colors: {
                        ...props.backgroundColor ? {
                            toolbarContainerColor: props.backgroundColor
                        } : {}
                    },
                    modifiers: [
                        height(64)
                    ],
                    children: props.children
                })
            })
        })
    });
}
const styles = _reactnative().StyleSheet.create({
    container: {
        ..._reactnative().StyleSheet.absoluteFill,
        justifyContent: 'flex-end'
    },
    host: {
        width: '100%',
        paddingHorizontal: 24
    }
});

//# sourceMappingURL=native.android.js.map
