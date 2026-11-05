'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HeaderBackButton", {
    enumerable: true,
    get: function() {
        return HeaderBackButton;
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
const _backiconmaskpng = /*#__PURE__*/ _interop_require_default(require("../../../../assets/react-navigation/elements/back-icon-mask.png"));
const _backiconpng = /*#__PURE__*/ _interop_require_default(require("../../../../assets/react-navigation/elements/back-icon.png"));
const _native = require("../../native");
const _MaskedView = require("../MaskedView");
const _HeaderButton = require("./HeaderButton");
const _HeaderIcon = require("./HeaderIcon");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
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
function HeaderBackButton({ disabled, allowFontScaling, backImage, label, labelStyle, displayMode = _reactnative().Platform.OS === 'ios' ? 'default' : 'minimal', onLabelLayout, onPress, pressColor, pressOpacity, screenLayout, tintColor, titleLayout, truncatedLabel = 'Back', accessibilityLabel = label && label !== 'Back' ? `${label}, back` : 'Go back', testID, style, href }) {
    const { colors, fonts } = (0, _native.useTheme)();
    const { direction } = (0, _native.useLocale)();
    const [labelWidth, setLabelWidth] = _react().useState(null);
    const [truncatedLabelWidth, setTruncatedLabelWidth] = _react().useState(null);
    const renderBackImage = ()=>{
        if (backImage) {
            return backImage({
                tintColor: tintColor ?? colors.text
            });
        } else {
            return /*#__PURE__*/ (0, _jsxruntime().jsx)(_HeaderIcon.HeaderIcon, {
                source: _backiconpng.default,
                tintColor: tintColor,
                style: [
                    styles.icon,
                    displayMode !== 'minimal' && styles.iconWithLabel
                ]
            });
        }
    };
    const renderLabel = ()=>{
        if (displayMode === 'minimal') {
            return null;
        }
        const availableSpace = titleLayout && screenLayout ? (screenLayout.width - titleLayout.width) / 2 - (ICON_WIDTH + _HeaderIcon.ICON_MARGIN) : null;
        const potentialLabelText = displayMode === 'default' ? label : truncatedLabel;
        const finalLabelText = availableSpace && labelWidth && truncatedLabelWidth ? availableSpace > labelWidth ? potentialLabelText : availableSpace > truncatedLabelWidth ? truncatedLabel : null : potentialLabelText;
        const commonStyle = [
            fonts.regular,
            styles.label,
            labelStyle
        ];
        const hiddenStyle = [
            commonStyle,
            {
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: 0
            }
        ];
        const labelElement = /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().View, {
            style: styles.labelWrapper,
            children: [
                label && displayMode === 'default' ? /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Animated.Text, {
                    style: hiddenStyle,
                    numberOfLines: 1,
                    onLayout: (e)=>setLabelWidth(e.nativeEvent.layout.width),
                    children: label
                }) : null,
                truncatedLabel ? /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Animated.Text, {
                    style: hiddenStyle,
                    numberOfLines: 1,
                    onLayout: (e)=>setTruncatedLabelWidth(e.nativeEvent.layout.width),
                    children: truncatedLabel
                }) : null,
                finalLabelText ? /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Animated.Text, {
                    accessible: false,
                    onLayout: onLabelLayout,
                    style: [
                        tintColor ? {
                            color: tintColor
                        } : null,
                        commonStyle
                    ],
                    numberOfLines: 1,
                    allowFontScaling: !!allowFontScaling,
                    children: finalLabelText
                }) : null
            ]
        });
        if (backImage || _reactnative().Platform.OS !== 'ios') {
            // When a custom backimage is specified, we can't mask the label
            // Otherwise there might be weird effect due to our mask not being the same as the image
            return labelElement;
        }
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(_MaskedView.MaskedView, {
            maskElement: /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().View, {
                style: [
                    styles.iconMaskContainer,
                    // Extend the mask to the center of the screen so that label isn't clipped during animation
                    screenLayout ? {
                        minWidth: screenLayout.width / 2 - 27
                    } : null
                ],
                children: [
                    /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Image, {
                        source: _backiconmaskpng.default,
                        resizeMode: "contain",
                        style: [
                            styles.iconMask,
                            direction === 'rtl' && styles.flip
                        ]
                    }),
                    /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
                        style: styles.iconMaskFillerRect
                    })
                ]
            }),
            children: labelElement
        });
    };
    const handlePress = ()=>{
        if (onPress) {
            requestAnimationFrame(()=>onPress());
        }
    };
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_HeaderButton.HeaderButton, {
        disabled: disabled,
        href: href,
        accessibilityLabel: accessibilityLabel,
        testID: testID,
        onPress: handlePress,
        pressColor: pressColor,
        pressOpacity: pressOpacity,
        style: [
            styles.container,
            style
        ],
        children: /*#__PURE__*/ (0, _jsxruntime().jsxs)(_jsxruntime().Fragment, {
            children: [
                renderBackImage(),
                renderLabel()
            ]
        })
    });
}
const ICON_WIDTH = _reactnative().Platform.OS === 'ios' ? 13 : 24;
const ICON_MARGIN_END = _reactnative().Platform.OS === 'ios' ? 22 : 3;
const styles = _reactnative().StyleSheet.create({
    container: {
        paddingHorizontal: 0,
        minWidth: _reactnative().StyleSheet.hairlineWidth,
        ..._reactnative().Platform.select({
            ios: null,
            default: {
                marginVertical: 3,
                marginHorizontal: 11
            }
        })
    },
    label: {
        fontSize: 17,
        // Title and back label are a bit different width due to title being bold
        // Adjusting the letterSpacing makes them coincide better
        letterSpacing: 0.35
    },
    labelWrapper: {
        // These styles will make sure that the label doesn't fill the available space
        // Otherwise it messes with the measurement of the label
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginEnd: _HeaderIcon.ICON_MARGIN
    },
    icon: {
        width: ICON_WIDTH,
        marginEnd: ICON_MARGIN_END
    },
    iconWithLabel: _reactnative().Platform.OS === 'ios' ? {
        marginEnd: 6
    } : {},
    iconMaskContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    iconMaskFillerRect: {
        flex: 1,
        backgroundColor: '#000'
    },
    iconMask: {
        height: 21,
        width: 13,
        marginStart: -14.5,
        marginVertical: 12,
        alignSelf: 'center'
    },
    flip: {
        transform: 'scaleX(-1)'
    }
});

//# sourceMappingURL=HeaderBackButton.js.map
