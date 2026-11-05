'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    BottomTabBar: null,
    getTabBarHeight: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get BottomTabBar () {
        return BottomTabBar;
    },
    get getTabBarHeight () {
        return getTabBarHeight;
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
const _elements = require("../../elements");
const _native = require("../../native");
const _BottomTabBarHeightCallbackContext = require("../utils/BottomTabBarHeightCallbackContext");
const _useIsKeyboardShown = require("../utils/useIsKeyboardShown");
const _BottomTabItem = require("./BottomTabItem");
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
const TABBAR_HEIGHT_UIKIT = 49;
const TABBAR_HEIGHT_UIKIT_COMPACT = 32;
const SPACING_UIKIT = 15;
const SPACING_MATERIAL = 12;
const DEFAULT_MAX_TAB_ITEM_WIDTH = 125;
const useNativeDriver = process.env.EXPO_OS !== 'web';
const shouldUseHorizontalLabels = ({ state, descriptors, dimensions })=>{
    const { tabBarLabelPosition } = descriptors[state.routes[state.index].key].options;
    if (tabBarLabelPosition) {
        switch(tabBarLabelPosition){
            case 'beside-icon':
                return true;
            case 'below-icon':
                return false;
        }
    }
    if (dimensions.width >= 768) {
        // Screen size matches a tablet
        const maxTabWidth = state.routes.reduce((acc, route)=>{
            const { tabBarItemStyle } = descriptors[route.key].options;
            const flattenedStyle = _reactnative().StyleSheet.flatten(tabBarItemStyle);
            if (flattenedStyle) {
                if (typeof flattenedStyle.width === 'number') {
                    return acc + flattenedStyle.width;
                } else if (typeof flattenedStyle.maxWidth === 'number') {
                    return acc + flattenedStyle.maxWidth;
                }
            }
            return acc + DEFAULT_MAX_TAB_ITEM_WIDTH;
        }, 0);
        return maxTabWidth <= dimensions.width;
    } else {
        return dimensions.width > dimensions.height;
    }
};
const isCompact = ({ state, descriptors, dimensions })=>{
    const { tabBarPosition, tabBarVariant } = descriptors[state.routes[state.index].key].options;
    if (tabBarPosition === 'left' || tabBarPosition === 'right' || tabBarVariant === 'material') {
        return false;
    }
    const isLandscape = dimensions.width > dimensions.height;
    const horizontalLabels = shouldUseHorizontalLabels({
        state,
        descriptors,
        dimensions
    });
    if (_reactnative().Platform.OS === 'ios' && !_reactnative().Platform.isPad && isLandscape && horizontalLabels) {
        return true;
    }
    return false;
};
const getTabBarHeight = ({ state, descriptors, dimensions, insets, style })=>{
    const { tabBarPosition } = descriptors[state.routes[state.index].key].options;
    const flattenedStyle = _reactnative().StyleSheet.flatten(style);
    const customHeight = flattenedStyle && 'height' in flattenedStyle ? flattenedStyle.height : undefined;
    if (typeof customHeight === 'number') {
        return customHeight;
    }
    const inset = insets[tabBarPosition === 'top' ? 'top' : 'bottom'];
    if (isCompact({
        state,
        descriptors,
        dimensions
    })) {
        return TABBAR_HEIGHT_UIKIT_COMPACT + inset;
    }
    return TABBAR_HEIGHT_UIKIT + inset;
};
function BottomTabBar({ state, descriptors, emitter, navigateToTab, insets, style }) {
    const { colors } = (0, _native.useTheme)();
    const { direction } = (0, _native.useLocale)();
    const { buildHref } = (0, _native.useLinkBuilder)();
    const focusedRoute = state.routes[state.index];
    const focusedDescriptor = descriptors[focusedRoute.key];
    const focusedOptions = focusedDescriptor.options;
    const { tabBarPosition = 'bottom', tabBarShowLabel, tabBarLabelPosition, tabBarHideOnKeyboard = false, tabBarVisibilityAnimationConfig, tabBarVariant = 'uikit', tabBarStyle, tabBarBackground, tabBarActiveTintColor, tabBarInactiveTintColor, tabBarActiveBackgroundColor, tabBarInactiveBackgroundColor } = focusedOptions;
    if (tabBarVariant === 'material' && tabBarPosition !== 'left' && tabBarPosition !== 'right') {
        throw new Error("The 'material' variant for tab bar is only supported when 'tabBarPosition' is set to 'left' or 'right'.");
    }
    if (tabBarLabelPosition === 'below-icon' && tabBarVariant === 'uikit' && (tabBarPosition === 'left' || tabBarPosition === 'right')) {
        throw new Error("The 'below-icon' label position for tab bar is only supported when 'tabBarPosition' is set to 'top' or 'bottom' when using the 'uikit' variant.");
    }
    const isKeyboardShown = (0, _useIsKeyboardShown.useIsKeyboardShown)();
    const onHeightChange = (0, _react().use)(_BottomTabBarHeightCallbackContext.BottomTabBarHeightCallbackContext);
    const shouldShowTabBar = !(tabBarHideOnKeyboard && isKeyboardShown);
    const getVisibilityAnimationConfig = _react().default.useEffectEvent(()=>tabBarVisibilityAnimationConfig);
    const [isTabBarHidden, setIsTabBarHidden] = _react().default.useState(!shouldShowTabBar);
    const [visible] = _react().default.useState(()=>new (_reactnative()).Animated.Value(shouldShowTabBar ? 1 : 0));
    _react().default.useEffect(()=>{
        const visibilityAnimationConfig = getVisibilityAnimationConfig();
        if (shouldShowTabBar) {
            const animation = visibilityAnimationConfig?.show?.animation === 'spring' ? _reactnative().Animated.spring : _reactnative().Animated.timing;
            animation(visible, {
                toValue: 1,
                useNativeDriver,
                duration: 250,
                ...visibilityAnimationConfig?.show?.config
            }).start(({ finished })=>{
                if (finished) {
                    setIsTabBarHidden(false);
                }
            });
        } else {
            setIsTabBarHidden(true);
            const animation = visibilityAnimationConfig?.hide?.animation === 'spring' ? _reactnative().Animated.spring : _reactnative().Animated.timing;
            animation(visible, {
                toValue: 0,
                useNativeDriver,
                duration: 200,
                ...visibilityAnimationConfig?.hide?.config
            }).start();
        }
        return ()=>visible.stopAnimation();
    }, [
        visible,
        shouldShowTabBar
    ]);
    const [layout, setLayout] = _react().default.useState({
        height: 0
    });
    const handleLayout = (e)=>{
        const { height } = e.nativeEvent.layout;
        onHeightChange?.(height);
        setLayout((layout)=>{
            if (height === layout.height) {
                return layout;
            } else {
                return {
                    height
                };
            }
        });
    };
    const { routes } = state;
    const tabBarHeight = (0, _elements.useFrameSize)((dimensions)=>getTabBarHeight({
            state,
            descriptors,
            insets,
            dimensions,
            style: [
                tabBarStyle,
                style
            ]
        }));
    const hasHorizontalLabels = (0, _elements.useFrameSize)((dimensions)=>shouldUseHorizontalLabels({
            state,
            descriptors,
            dimensions
        }));
    const compact = (0, _elements.useFrameSize)((dimensions)=>isCompact({
            state,
            descriptors,
            dimensions
        }));
    const sidebar = tabBarPosition === 'left' || tabBarPosition === 'right';
    const spacing = tabBarVariant === 'material' ? SPACING_MATERIAL : SPACING_UIKIT;
    const minSidebarWidth = (0, _elements.useFrameSize)((size)=>sidebar && hasHorizontalLabels ? (0, _elements.getDefaultSidebarWidth)(size) : 0);
    const tabBarBackgroundElement = tabBarBackground?.();
    return /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().Animated.View, {
        style: [
            {
                pointerEvents: isTabBarHidden ? 'none' : 'auto'
            },
            tabBarPosition === 'left' ? styles.start : tabBarPosition === 'right' ? styles.end : styles.bottom,
            (process.env.EXPO_OS === 'web' ? tabBarPosition === 'right' : direction === 'rtl' && tabBarPosition === 'left' || direction !== 'rtl' && tabBarPosition === 'right') ? {
                borderLeftWidth: _reactnative().StyleSheet.hairlineWidth
            } : (process.env.EXPO_OS === 'web' ? tabBarPosition === 'left' : direction === 'rtl' && tabBarPosition === 'right' || direction !== 'rtl' && tabBarPosition === 'left') ? {
                borderRightWidth: _reactnative().StyleSheet.hairlineWidth
            } : tabBarPosition === 'top' ? {
                borderBottomWidth: _reactnative().StyleSheet.hairlineWidth
            } : {
                borderTopWidth: _reactnative().StyleSheet.hairlineWidth
            },
            {
                backgroundColor: tabBarBackgroundElement != null ? 'transparent' : colors.card,
                borderColor: colors.border
            },
            sidebar ? {
                paddingTop: (hasHorizontalLabels ? spacing : spacing / 2) + insets.top,
                paddingBottom: (hasHorizontalLabels ? spacing : spacing / 2) + insets.bottom,
                paddingStart: spacing + (tabBarPosition === 'left' ? insets.left : 0),
                paddingEnd: spacing + (tabBarPosition === 'right' ? insets.right : 0),
                minWidth: minSidebarWidth
            } : [
                {
                    transform: [
                        {
                            translateY: visible.interpolate({
                                inputRange: [
                                    0,
                                    1
                                ],
                                outputRange: [
                                    layout.height + insets[tabBarPosition === 'top' ? 'top' : 'bottom'] + _reactnative().StyleSheet.hairlineWidth,
                                    0
                                ]
                            })
                        }
                    ],
                    // Absolutely position the tab bar so that the content is below it
                    // This is needed to avoid gap at bottom when the tab bar is hidden
                    position: isTabBarHidden ? 'absolute' : undefined
                },
                {
                    height: tabBarHeight,
                    paddingBottom: tabBarPosition === 'bottom' ? insets.bottom : 0,
                    paddingTop: tabBarPosition === 'top' ? insets.top : 0,
                    paddingHorizontal: Math.max(insets.left, insets.right)
                }
            ],
            tabBarStyle
        ],
        onLayout: sidebar ? undefined : handleLayout,
        children: [
            /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
                style: [
                    _reactnative().StyleSheet.absoluteFill,
                    styles.pointerEventsNone
                ],
                children: tabBarBackgroundElement
            }),
            /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
                role: "tablist",
                style: sidebar ? styles.sideContent : styles.bottomContent,
                children: routes.map((route, index)=>{
                    const focused = index === state.index;
                    const descriptor = descriptors[route.key];
                    const { options } = descriptor;
                    const onPress = ()=>{
                        const event = emitter.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true
                        });
                        if (!focused && !event.defaultPrevented) {
                            navigateToTab(route.key);
                        }
                    };
                    const onLongPress = ()=>{
                        emitter.emit({
                            type: 'tabLongPress',
                            target: route.key
                        });
                    };
                    const label = typeof options.tabBarLabel === 'function' ? options.tabBarLabel : (0, _elements.getLabel)({
                        label: options.tabBarLabel,
                        title: options.title
                    }, route.name);
                    const accessibilityLabel = options.tabBarAccessibilityLabel !== undefined ? options.tabBarAccessibilityLabel : typeof label === 'string' && process.env.EXPO_OS === 'ios' ? `${label}, tab, ${index + 1} of ${routes.length}` : undefined;
                    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_native.NavigationProvider, {
                        route: route,
                        navigation: descriptor.navigation,
                        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_BottomTabItem.BottomTabItem, {
                            href: buildHref(route.name, route.params),
                            route: route,
                            descriptor: descriptor,
                            focused: focused,
                            horizontal: hasHorizontalLabels,
                            compact: compact,
                            sidebar: sidebar,
                            variant: tabBarVariant,
                            onPress: onPress,
                            onLongPress: onLongPress,
                            accessibilityLabel: accessibilityLabel,
                            testID: options.tabBarButtonTestID,
                            allowFontScaling: options.tabBarAllowFontScaling,
                            activeTintColor: tabBarActiveTintColor,
                            inactiveTintColor: tabBarInactiveTintColor,
                            activeBackgroundColor: tabBarActiveBackgroundColor,
                            inactiveBackgroundColor: tabBarInactiveBackgroundColor,
                            button: options.tabBarButton,
                            icon: options.tabBarIcon ?? (({ color, size })=>/*#__PURE__*/ (0, _jsxruntime().jsx)(_elements.MissingIcon, {
                                    color: color,
                                    size: size
                                })),
                            badge: options.tabBarBadge,
                            badgeStyle: options.tabBarBadgeStyle,
                            label: label,
                            showLabel: tabBarShowLabel,
                            labelStyle: options.tabBarLabelStyle,
                            iconStyle: options.tabBarIconStyle,
                            style: [
                                sidebar ? {
                                    marginVertical: hasHorizontalLabels ? tabBarVariant === 'material' ? 0 : 1 : spacing / 2
                                } : styles.bottomItem,
                                options.tabBarItemStyle
                            ]
                        })
                    }, route.name);
                })
            })
        ]
    });
}
const styles = _reactnative().StyleSheet.create({
    start: {
        top: 0,
        bottom: 0,
        start: 0
    },
    end: {
        top: 0,
        bottom: 0,
        end: 0
    },
    bottom: {
        start: 0,
        end: 0,
        bottom: 0,
        elevation: 8
    },
    bottomContent: {
        flex: 1,
        flexDirection: 'row'
    },
    sideContent: {
        flex: 1,
        flexDirection: 'column'
    },
    bottomItem: {
        flex: 1
    },
    pointerEventsNone: {
        pointerEvents: 'none'
    }
});

//# sourceMappingURL=BottomTabBar.js.map
