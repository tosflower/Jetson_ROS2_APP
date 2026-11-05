'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Header", {
    enumerable: true,
    get: function() {
        return Header;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
function _expostatusbar() {
    const data = require("expo-status-bar");
    _expostatusbar = function() {
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
function _reactnativesafeareacontext() {
    const data = require("react-native-safe-area-context");
    _reactnativesafeareacontext = function() {
        return data;
    };
    return data;
}
const _searchiconpng = /*#__PURE__*/ _interop_require_default(require("../../../../assets/react-navigation/elements/search-icon.png"));
const _color = require("../../../utils/color");
const _native = require("../../native");
const _useFrameSize = require("../useFrameSize");
const _HeaderBackButton = require("./HeaderBackButton");
const _HeaderBackground = require("./HeaderBackground");
const _HeaderButton = require("./HeaderButton");
const _HeaderIcon = require("./HeaderIcon");
const _HeaderSearchBar = require("./HeaderSearchBar");
const _HeaderShownContext = require("./HeaderShownContext");
const _HeaderTitle = require("./HeaderTitle");
const _getDefaultHeaderHeight = require("./getDefaultHeaderHeight");
const _getHeaderStatusBarHeight = require("./getHeaderStatusBarHeight");
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
// Width of the screen in split layout on portrait mode on iPad Mini
const IPAD_MINI_MEDIUM_WIDTH = 414;
const warnIfHeaderStylesDefined = (styles)=>{
    Object.keys(styles).forEach((styleProp)=>{
        const value = styles[styleProp];
        if (styleProp === 'position' && value === 'absolute') {
            console.warn("position: 'absolute' is not supported on headerStyle. If you would like to render content under the header, use the 'headerTransparent' option.");
        } else if (value !== undefined) {
            console.warn(`${styleProp} was given a value of ${value}, this has no effect on headerStyle.`);
        }
    });
};
function Header(props) {
    const insets = (0, _reactnativesafeareacontext().useSafeAreaInsets)();
    const verticalBarEdge = (0, _expostatusbar().useVerticalBarEdgeIOS)();
    const frame = (0, _useFrameSize.useFrameSize)((size)=>size, true);
    const { colors } = (0, _native.useTheme)();
    const navigation = (0, _native.useNavigation)();
    const isParentHeaderShown = (0, _react().use)(_HeaderShownContext.HeaderShownContext);
    const [searchBarVisible, setSearchBarVisible] = _react().useState(false);
    const [titleLayout, setTitleLayout] = _react().useState(undefined);
    const onTitleLayout = (e)=>{
        const { height, width } = e.nativeEvent.layout;
        setTitleLayout((titleLayout)=>{
            if (titleLayout && height === titleLayout.height && width === titleLayout.width) {
                return titleLayout;
            }
            return {
                height,
                width
            };
        });
    };
    const { layout = frame, modal = false, back, title, headerTitle: customTitle, headerTitleAlign = process.env.EXPO_OS === 'ios' ? 'center' : 'left', headerLeft = back ? (props)=>/*#__PURE__*/ (0, _jsxruntime().jsx)(_HeaderBackButton.HeaderBackButton, {
            ...props
        }) : undefined, headerSearchBarOptions, headerTransparent, headerTintColor, headerBackground, headerRight, headerTitleAllowFontScaling: titleAllowFontScaling, headerTitleStyle: titleStyle, headerLeftContainerStyle: leftContainerStyle, headerRightContainerStyle: rightContainerStyle, headerTitleContainerStyle: titleContainerStyle, headerBackButtonDisplayMode = process.env.EXPO_OS === 'ios' ? 'default' : 'minimal', headerBackTitleStyle, headerBackgroundContainerStyle: backgroundContainerStyle, headerStyle: customHeaderStyle, headerShadowVisible, headerPressColor, headerPressOpacity, headerStatusBarHeight = isParentHeaderShown ? 0 : (0, _getHeaderStatusBarHeight.getHeaderStatusBarHeight)(insets, verticalBarEdge) } = props;
    const defaultHeight = (0, _getDefaultHeaderHeight.getDefaultHeaderHeight)(layout, modal, headerStatusBarHeight);
    const { height = defaultHeight, maxHeight, minHeight, backfaceVisibility, backgroundColor, borderBlockColor, borderBlockEndColor, borderBlockStartColor, borderBottomColor, borderBottomEndRadius, borderBottomLeftRadius, borderBottomRightRadius, borderBottomStartRadius, borderBottomWidth, borderColor, borderCurve, borderEndColor, borderEndEndRadius, borderEndStartRadius, borderEndWidth, borderLeftColor, borderLeftWidth, borderRadius, borderRightColor, borderRightWidth, borderStartColor, borderStartEndRadius, borderStartStartRadius, borderStartWidth, borderStyle, borderTopColor, borderTopEndRadius, borderTopLeftRadius, borderTopRightRadius, borderTopStartRadius, borderTopWidth, borderWidth, boxShadow, elevation, filter, mixBlendMode, opacity, shadowColor, shadowOffset, shadowOpacity, shadowRadius, transform, transformOrigin, ...unsafeStyles } = _reactnative().StyleSheet.flatten(customHeaderStyle || {});
    if (process.env.NODE_ENV !== 'production') {
        warnIfHeaderStylesDefined(unsafeStyles);
    }
    const safeStyles = {
        backfaceVisibility,
        backgroundColor,
        borderBlockColor,
        borderBlockEndColor,
        borderBlockStartColor,
        borderBottomColor,
        borderBottomEndRadius,
        borderBottomLeftRadius,
        borderBottomRightRadius,
        borderBottomStartRadius,
        borderBottomWidth,
        borderColor,
        borderCurve,
        borderEndColor,
        borderEndEndRadius,
        borderEndStartRadius,
        borderEndWidth,
        borderLeftColor,
        borderLeftWidth,
        borderRadius,
        borderRightColor,
        borderRightWidth,
        borderStartColor,
        borderStartEndRadius,
        borderStartStartRadius,
        borderStartWidth,
        borderStyle,
        borderTopColor,
        borderTopEndRadius,
        borderTopLeftRadius,
        borderTopRightRadius,
        borderTopStartRadius,
        borderTopWidth,
        borderWidth,
        boxShadow,
        elevation,
        filter,
        mixBlendMode,
        opacity,
        shadowColor,
        shadowOffset,
        shadowOpacity,
        shadowRadius,
        transform,
        transformOrigin
    };
    // Setting a property to undefined triggers default style
    // So we need to filter them out
    // Users can use `null` instead
    for(const styleProp in safeStyles){
        // @ts-expect-error: typescript wrongly complains that styleProp cannot be used to index safeStyles
        if (safeStyles[styleProp] === undefined) {
            // @ts-expect-error don't need to care about index signature for deletion
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete safeStyles[styleProp];
        }
    }
    const backgroundStyle = {
        ...headerTransparent && {
            backgroundColor: 'transparent'
        },
        ...(headerTransparent || headerShadowVisible === false) && {
            borderBottomWidth: 0,
            ..._reactnative().Platform.select({
                android: {
                    elevation: 0
                },
                web: {
                    boxShadow: 'none'
                },
                default: {
                    shadowOpacity: 0
                }
            })
        },
        ...safeStyles
    };
    const iconTintColor = headerTintColor ?? _reactnative().Platform.select({
        ios: colors.primary,
        default: colors.text
    });
    const leftButton = headerLeft ? headerLeft({
        tintColor: iconTintColor,
        pressColor: headerPressColor,
        pressOpacity: headerPressOpacity,
        displayMode: headerBackButtonDisplayMode,
        titleLayout,
        screenLayout: layout,
        canGoBack: Boolean(back),
        onPress: back ? navigation.goBack : undefined,
        label: back?.title,
        labelStyle: headerBackTitleStyle,
        href: back?.href
    }) : null;
    const rightButton = headerRight ? headerRight({
        tintColor: iconTintColor,
        pressColor: headerPressColor,
        pressOpacity: headerPressOpacity,
        canGoBack: Boolean(back)
    }) : null;
    const headerTitle = typeof customTitle !== 'function' ? (props)=>/*#__PURE__*/ (0, _jsxruntime().jsx)(_HeaderTitle.HeaderTitle, {
            ...props
        }) : customTitle;
    return /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().Animated.View, {
        style: [
            styles.boxNone,
            {
                height,
                minHeight,
                maxHeight,
                opacity,
                transform
            }
        ],
        children: [
            /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Animated.View, {
                style: [
                    _reactnative().StyleSheet.absoluteFill,
                    styles.boxNone,
                    backgroundContainerStyle
                ],
                children: headerBackground ? headerBackground({
                    style: backgroundStyle
                }) : /*#__PURE__*/ (0, _jsxruntime().jsx)(_HeaderBackground.HeaderBackground, {
                    style: [
                        {
                            // Allow touch through the header when background color is transparent
                            pointerEvents: headerTransparent && (backgroundStyle.backgroundColor === 'transparent' || backgroundStyle.backgroundColor && (0, _color.alpha)(backgroundStyle.backgroundColor) === 0) ? 'none' : 'auto'
                        },
                        backgroundStyle
                    ]
                })
            }),
            /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
                style: [
                    styles.pointerEventsNone,
                    {
                        height: headerStatusBarHeight
                    }
                ]
            }),
            /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().View, {
                style: [
                    styles.content,
                    process.env.EXPO_OS === 'ios' && frame.width >= IPAD_MINI_MEDIUM_WIDTH ? styles.large : null
                ],
                children: [
                    /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Animated.View, {
                        style: [
                            styles.start,
                            !searchBarVisible && headerTitleAlign === 'center' && styles.expand,
                            {
                                marginStart: insets.left
                            },
                            leftContainerStyle
                        ],
                        children: leftButton
                    }),
                    process.env.EXPO_OS === 'ios' || !searchBarVisible ? /*#__PURE__*/ (0, _jsxruntime().jsxs)(_jsxruntime().Fragment, {
                        children: [
                            /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Animated.View, {
                                style: [
                                    styles.title,
                                    {
                                        // Avoid the title from going offscreen or overlapping buttons
                                        maxWidth: headerTitleAlign === 'center' ? layout.width - ((leftButton ? headerBackButtonDisplayMode !== 'minimal' ? 80 : 32 : 16) + (rightButton || headerSearchBarOptions ? 16 : 0) + Math.max(insets.left, insets.right)) * 2 : layout.width - ((leftButton ? 52 : 16) + (rightButton || headerSearchBarOptions ? 52 : 16) + insets.left - insets.right)
                                    },
                                    headerTitleAlign === 'left' && leftButton ? {
                                        marginStart: 4
                                    } : {
                                        marginHorizontal: 16
                                    },
                                    titleContainerStyle
                                ],
                                children: headerTitle({
                                    children: title,
                                    allowFontScaling: titleAllowFontScaling,
                                    tintColor: headerTintColor,
                                    onLayout: onTitleLayout,
                                    style: titleStyle
                                })
                            }),
                            /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().Animated.View, {
                                style: [
                                    styles.end,
                                    styles.expand,
                                    {
                                        marginEnd: insets.right
                                    },
                                    rightContainerStyle
                                ],
                                children: [
                                    rightButton,
                                    headerSearchBarOptions ? /*#__PURE__*/ (0, _jsxruntime().jsx)(_HeaderButton.HeaderButton, {
                                        tintColor: iconTintColor,
                                        pressColor: headerPressColor,
                                        pressOpacity: headerPressOpacity,
                                        onPress: ()=>{
                                            setSearchBarVisible(true);
                                            headerSearchBarOptions?.onOpen?.();
                                        },
                                        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_HeaderIcon.HeaderIcon, {
                                            source: _searchiconpng.default,
                                            tintColor: iconTintColor
                                        })
                                    }) : null
                                ]
                            })
                        ]
                    }) : null,
                    process.env.EXPO_OS === 'ios' || searchBarVisible ? /*#__PURE__*/ (0, _jsxruntime().jsx)(_HeaderSearchBar.HeaderSearchBar, {
                        ...headerSearchBarOptions,
                        visible: searchBarVisible,
                        onClose: ()=>{
                            setSearchBarVisible(false);
                            headerSearchBarOptions?.onClose?.();
                        },
                        tintColor: headerTintColor,
                        style: [
                            process.env.EXPO_OS === 'ios' ? [
                                _reactnative().StyleSheet.absoluteFill,
                                {
                                    paddingTop: headerStatusBarHeight ? 0 : 4
                                },
                                {
                                    backgroundColor: backgroundColor ?? colors.card
                                }
                            ] : !leftButton && {
                                marginStart: 8
                            }
                        ]
                    }) : null
                ]
            })
        ]
    });
}
const styles = _reactnative().StyleSheet.create({
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'stretch',
        pointerEvents: 'box-none'
    },
    large: {
        marginHorizontal: 5
    },
    title: {
        pointerEvents: 'box-none',
        justifyContent: 'center'
    },
    start: {
        pointerEvents: 'box-none',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    end: {
        pointerEvents: 'box-none',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    expand: {
        flexGrow: 1,
        flexBasis: 0
    },
    boxNone: {
        pointerEvents: 'box-none'
    },
    pointerEventsNone: {
        pointerEvents: 'none'
    }
});

//# sourceMappingURL=Header.js.map
