'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DrawerToggleButton", {
    enumerable: true,
    get: function() {
        return DrawerToggleButton;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
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
const _toggledrawericonpng = /*#__PURE__*/ _interop_require_default(require("../../../../assets/react-navigation/drawer/toggle-drawer-icon.png"));
const _elements = require("../../elements");
const _native = require("../../native");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function DrawerToggleButton({ tintColor, accessibilityLabel = 'Show navigation menu', imageSource = _toggledrawericonpng.default, ...rest }) {
    const navigation = (0, _native.useNavigation)();
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_elements.HeaderButton, {
        ...rest,
        accessibilityLabel: accessibilityLabel,
        onPress: ()=>navigation.dispatch(_native.DrawerActions.toggleDrawer()),
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Image, {
            resizeMode: "contain",
            source: imageSource,
            fadeDuration: 0,
            tintColor: tintColor,
            style: styles.icon
        })
    });
}
const styles = _reactnative().StyleSheet.create({
    icon: {
        height: 24,
        width: 24,
        marginVertical: 8,
        marginHorizontal: 5
    }
});

//# sourceMappingURL=DrawerToggleButton.js.map
