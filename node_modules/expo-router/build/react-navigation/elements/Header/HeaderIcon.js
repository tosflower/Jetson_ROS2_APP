'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    HeaderIcon: null,
    ICON_MARGIN: null,
    ICON_SIZE: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get HeaderIcon () {
        return HeaderIcon;
    },
    get ICON_MARGIN () {
        return ICON_MARGIN;
    },
    get ICON_SIZE () {
        return ICON_SIZE;
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
const _native = require("../../native");
function HeaderIcon({ source, style, ...rest }) {
    const { colors } = (0, _native.useTheme)();
    const { direction } = (0, _native.useLocale)();
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Image, {
        source: source,
        resizeMode: "contain",
        fadeDuration: 0,
        tintColor: colors.text,
        style: [
            styles.icon,
            direction === 'rtl' && styles.flip,
            style
        ],
        ...rest
    });
}
const ICON_SIZE = _reactnative().Platform.OS === 'ios' ? 21 : 24;
const ICON_MARGIN = _reactnative().Platform.OS === 'ios' ? 8 : 3;
const styles = _reactnative().StyleSheet.create({
    icon: {
        width: ICON_SIZE,
        height: ICON_SIZE,
        margin: ICON_MARGIN
    },
    flip: {
        transform: 'scaleX(-1)'
    }
});

//# sourceMappingURL=HeaderIcon.js.map
