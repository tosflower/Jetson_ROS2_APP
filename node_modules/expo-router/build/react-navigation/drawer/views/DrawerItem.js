'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DrawerItem", {
    enumerable: true,
    get: function() {
        return DrawerItem;
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
    const data = /*#__PURE__*/ _interop_require_wildcard(require("react"));
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
const _color = require("../../../utils/color");
const _elements = require("../../elements");
const _native = require("../../native");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function DrawerItem(props) {
    const { colors, fonts } = (0, _native.useTheme)();
    const { href, icon, label, labelStyle, focused = false, allowFontScaling, activeTintColor = colors.primary, inactiveTintColor, activeBackgroundColor, inactiveBackgroundColor = 'transparent', style, onPress, pressColor, pressOpacity = 1, testID, accessibilityLabel, ...rest } = props;
    const { borderRadius = 56 } = _reactnative().StyleSheet.flatten(style || {});
    const color = focused ? activeTintColor : inactiveTintColor ?? (0, _color.alpha)(colors.text, 0.68) ?? colors.text;
    const backgroundColor = focused ? activeBackgroundColor ?? (0, _color.alpha)(activeTintColor, 0.12) ?? 'transparent' : inactiveBackgroundColor;
    const iconNode = icon ? icon({
        size: 24,
        focused,
        color
    }) : null;
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
        collapsable: false,
        ...rest,
        style: [
            styles.container,
            {
                borderRadius,
                backgroundColor
            },
            style
        ],
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_elements.PlatformPressable, {
            testID: testID,
            onPress: onPress,
            role: "button",
            "aria-label": accessibilityLabel,
            "aria-selected": focused,
            pressColor: pressColor,
            pressOpacity: pressOpacity,
            hoverEffect: {
                color
            },
            href: href,
            children: /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().View, {
                style: [
                    styles.wrapper,
                    {
                        borderRadius
                    }
                ],
                children: [
                    iconNode,
                    /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
                        style: [
                            styles.label,
                            {
                                marginStart: iconNode ? 12 : 0
                            }
                        ],
                        children: typeof label === 'string' ? /*#__PURE__*/ (0, _jsxruntime().jsx)(_elements.Text, {
                            numberOfLines: 1,
                            allowFontScaling: allowFontScaling,
                            style: [
                                styles.labelText,
                                {
                                    color
                                },
                                fonts.medium,
                                labelStyle
                            ],
                            children: label
                        }) : label({
                            color,
                            focused
                        })
                    })
                ]
            })
        })
    });
}
const styles = _reactnative().StyleSheet.create({
    container: {
        borderCurve: 'continuous',
        overflow: 'hidden'
    },
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 11,
        paddingStart: 16,
        paddingEnd: 24,
        borderCurve: 'continuous'
    },
    label: {
        marginEnd: 12,
        marginVertical: 4,
        flex: 1
    },
    labelText: {
        lineHeight: 24,
        textAlignVertical: 'center'
    }
});

//# sourceMappingURL=DrawerItem.js.map
