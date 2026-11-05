"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Button", {
    enumerable: true,
    get: function() {
        return Button;
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
const _imperativeapi = require("../../imperative-api");
const _href = require("../../link/href");
const _useLinkToPathProps = /*#__PURE__*/ _interop_require_default(require("../../link/useLinkToPathProps"));
const _color = require("../../utils/color");
const _native = require("../native");
const _PlatformPressable = require("./PlatformPressable");
const _Text = require("./Text");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const BUTTON_RADIUS = 40;
function Button({ href, ...rest }) {
    if (href != null) {
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(ButtonLink, {
            ...rest,
            href: href
        });
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(ButtonBase, {
        ...rest
    });
}
function ButtonLink({ href, onPress, ...rest }) {
    const { href: resolvedHref } = (0, _useLinkToPathProps.default)({
        href: (0, _href.resolveHref)(href)
    });
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(ButtonBase, {
        ...rest,
        href: resolvedHref,
        onPress: (event)=>{
            onPress?.(event);
            // `PlatformPressable` prevents unmodified web clicks before calling `onPress`, so a
            // consumer cannot cancel navigation there with `preventDefault`; on native, they can.
            if (_reactnative().Platform.OS === 'web' || !event?.defaultPrevented) {
                _imperativeapi.router.navigate(href);
            }
        }
    });
}
function ButtonBase({ variant = 'tinted', color: customColor, android_ripple, style, children, ...rest }) {
    const { colors, fonts } = (0, _native.useTheme)();
    const color = customColor ?? colors.primary;
    const fadedColor = (0, _color.alpha)(color);
    let backgroundColor;
    let textColor;
    switch(variant){
        case 'plain':
            backgroundColor = 'transparent';
            textColor = color;
            break;
        case 'tinted':
            backgroundColor = (fadedColor === undefined ? undefined : (0, _color.alpha)(color, fadedColor * 0.15)) ?? color;
            textColor = color;
            break;
        case 'filled':
            backgroundColor = color;
            textColor = (0, _color.isDark)(color) ? 'white' : (0, _color.darken)(color, 0.71) ?? color;
            break;
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_PlatformPressable.PlatformPressable, {
        ...rest,
        android_ripple: {
            radius: BUTTON_RADIUS,
            color: (0, _color.alpha)(textColor, ((0, _color.alpha)(textColor) ?? 1) * 0.15) ?? textColor,
            ...android_ripple
        },
        pressOpacity: _reactnative().Platform.OS === 'ios' ? undefined : 1,
        hoverEffect: {
            color: textColor
        },
        style: [
            {
                backgroundColor
            },
            styles.button,
            style
        ],
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_Text.Text, {
            style: [
                {
                    color: textColor
                },
                fonts.regular,
                styles.text
            ],
            children: children
        })
    });
}
const styles = _reactnative().StyleSheet.create({
    button: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: BUTTON_RADIUS,
        borderCurve: 'continuous'
    },
    text: {
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.1,
        textAlign: 'center'
    }
});

//# sourceMappingURL=Button.js.map
