'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DrawerView", {
    enumerable: true,
    get: function() {
        return DrawerView;
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
function _reactnativedrawerlayout() {
    const data = require("react-native-drawer-layout");
    _reactnativedrawerlayout = function() {
        return data;
    };
    return data;
}
const _useLatestCallback = /*#__PURE__*/ _interop_require_default(require("../../../utils/useLatestCallback"));
const _elements = require("../../elements");
const _native = require("../../native");
const _DrawerPositionContext = require("../utils/DrawerPositionContext");
const _DrawerStatusContext = require("../utils/DrawerStatusContext");
const _addCancelListener = require("../utils/addCancelListener");
const _getDrawerStatusFromState = require("../utils/getDrawerStatusFromState");
const _DrawerContent = require("./DrawerContent");
const _DrawerToggleButton = require("./DrawerToggleButton");
const _ScreenFallback = require("./ScreenFallback");
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
const DRAWER_BORDER_RADIUS = 16;
const renderDrawerContentDefault = (props)=>/*#__PURE__*/ (0, _jsxruntime().jsx)(_DrawerContent.DrawerContent, {
        ...props
    });
function DrawerViewBase({ state, navigation, descriptors, defaultStatus, drawerContent = renderDrawerContentDefault, detachInactiveScreens = _reactnative().Platform.OS === 'web' || _reactnative().Platform.OS === 'android' || _reactnative().Platform.OS === 'ios' }) {
    const { direction } = (0, _native.useLocale)();
    const focusedRouteKey = state.routes[state.index].key;
    const { drawerHideStatusBarOnOpen, drawerPosition = direction === 'rtl' ? 'right' : 'left', drawerStatusBarAnimation, drawerStyle, drawerType = _reactnative().Platform.select({
        ios: 'slide',
        default: 'front'
    }), configureGestureHandler, keyboardDismissMode, overlayColor = 'rgba(0, 0, 0, 0.5)', swipeEdgeWidth, swipeEnabled = _reactnative().Platform.OS !== 'web' && _reactnative().Platform.OS !== 'windows' && _reactnative().Platform.OS !== 'macos', swipeMinDistance, overlayAccessibilityLabel } = descriptors[focusedRouteKey].options;
    const previousRouteKeyRef = _react().useRef(focusedRouteKey);
    _react().useEffect(()=>{
        const previousRouteKey = previousRouteKeyRef.current;
        if (previousRouteKey !== focusedRouteKey && descriptors[previousRouteKey]?.options.popToTopOnBlur) {
            const prevRoute = state.routes.find((route)=>route.key === previousRouteKey);
            if (prevRoute?.state?.key) {
                // A targeted POP_TO_TOP is a no-op for nested navigators that are not stacks.
                navigation.dispatch({
                    ..._native.StackActions.popToTop(),
                    target: prevRoute.state.key
                });
            }
        }
        previousRouteKeyRef.current = focusedRouteKey;
    }, [
        descriptors,
        focusedRouteKey,
        navigation,
        state.routes
    ]);
    const dimensions = (0, _elements.useFrameSize)((size)=>size, true);
    const { colors } = (0, _native.useTheme)();
    const drawerStatus = (0, _getDrawerStatusFromState.getDrawerStatusFromState)(state, defaultStatus);
    const handleDrawerOpen = (0, _useLatestCallback.default)(()=>{
        navigation.dispatchSync({
            ..._native.DrawerActions.openDrawer(),
            target: state.key
        });
    });
    const handleDrawerClose = (0, _useLatestCallback.default)(()=>{
        navigation.dispatchSync({
            ..._native.DrawerActions.closeDrawer(),
            target: state.key
        });
    });
    const handleGestureStart = (0, _useLatestCallback.default)(()=>{
        navigation.emit({
            type: 'gestureStart',
            target: state.key
        });
    });
    const handleGestureEnd = (0, _useLatestCallback.default)(()=>{
        navigation.emit({
            type: 'gestureEnd',
            target: state.key
        });
    });
    const handleGestureCancel = (0, _useLatestCallback.default)(()=>{
        navigation.emit({
            type: 'gestureCancel',
            target: state.key
        });
    });
    const handleTransitionStart = (0, _useLatestCallback.default)((closing)=>{
        navigation.emit({
            type: 'transitionStart',
            data: {
                closing
            },
            target: state.key
        });
    });
    const handleTransitionEnd = (0, _useLatestCallback.default)((closing)=>{
        navigation.emit({
            type: 'transitionEnd',
            data: {
                closing
            },
            target: state.key
        });
    });
    _react().useEffect(()=>{
        if (drawerStatus === defaultStatus || drawerType === 'permanent') {
            return;
        }
        const handleHardwareBack = ()=>{
            // We shouldn't handle the back button if the parent screen isn't focused
            // This will avoid the drawer overriding event listeners from a focused screen
            if (!navigation.isFocused()) {
                return false;
            }
            if (defaultStatus === 'open') {
                handleDrawerOpen();
            } else {
                handleDrawerClose();
            }
            return true;
        };
        // We only add the listeners when drawer opens
        // This way we can make sure that the listener is added as late as possible
        // This will make sure that our handler will run first when back button is pressed
        return (0, _addCancelListener.addCancelListener)(handleHardwareBack);
    }, [
        defaultStatus,
        drawerStatus,
        drawerType,
        handleDrawerClose,
        handleDrawerOpen,
        navigation
    ]);
    const renderDrawerContent = ()=>{
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(_DrawerPositionContext.DrawerPositionContext.Provider, {
            value: drawerPosition,
            children: drawerContent({
                state,
                navigation,
                descriptors
            })
        });
    };
    const renderSceneContent = ()=>{
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(_ScreenFallback.MaybeScreenContainer, {
            enabled: detachInactiveScreens,
            hasTwoStates: true,
            style: styles.content,
            children: state.routes.map((route, index)=>{
                const descriptor = descriptors[route.key];
                const isFocused = state.index === index;
                if (descriptor.route.key === undefined) {
                    // Don't render placeholder screens.
                    return null;
                }
                const { header = ({ layout, options })=>/*#__PURE__*/ (0, _jsxruntime().jsx)(_elements.Header, {
                        ...options,
                        layout: layout,
                        title: (0, _elements.getHeaderTitle)(options, route.name),
                        headerLeft: drawerPosition === 'left' && options.headerLeft == null ? (props)=>/*#__PURE__*/ (0, _jsxruntime().jsx)(_DrawerToggleButton.DrawerToggleButton, {
                                ...props
                            }) : options.headerLeft,
                        headerRight: drawerPosition === 'right' && options.headerRight == null ? (props)=>/*#__PURE__*/ (0, _jsxruntime().jsx)(_DrawerToggleButton.DrawerToggleButton, {
                                ...props
                            }) : options.headerRight
                    }), headerShown, headerStatusBarHeight, headerTransparent, sceneStyle } = descriptor.options;
                return /*#__PURE__*/ (0, _jsxruntime().jsx)(_ScreenFallback.MaybeScreen, {
                    style: [
                        _reactnative().StyleSheet.absoluteFill,
                        {
                            zIndex: isFocused ? 0 : -1
                        }
                    ],
                    visible: isFocused,
                    enabled: detachInactiveScreens,
                    children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_elements.Screen, {
                        focused: isFocused,
                        route: route,
                        navigation: descriptor.navigation,
                        headerShown: headerShown,
                        headerStatusBarHeight: headerStatusBarHeight,
                        headerTransparent: headerTransparent,
                        header: header({
                            layout: dimensions,
                            route,
                            navigation: descriptor.navigation,
                            options: descriptor.options
                        }),
                        style: sceneStyle,
                        children: descriptor.render()
                    })
                }, route.key);
            })
        });
    };
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_DrawerStatusContext.DrawerStatusContext.Provider, {
        value: drawerStatus,
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnativedrawerlayout().Drawer, {
            open: drawerStatus !== 'closed',
            onOpen: handleDrawerOpen,
            onClose: handleDrawerClose,
            onGestureStart: handleGestureStart,
            onGestureEnd: handleGestureEnd,
            onGestureCancel: handleGestureCancel,
            onTransitionStart: handleTransitionStart,
            onTransitionEnd: handleTransitionEnd,
            layout: dimensions,
            direction: direction,
            configureGestureHandler: configureGestureHandler,
            swipeEnabled: swipeEnabled,
            swipeEdgeWidth: swipeEdgeWidth,
            swipeMinDistance: swipeMinDistance,
            hideStatusBarOnOpen: drawerHideStatusBarOnOpen,
            statusBarAnimation: drawerStatusBarAnimation,
            keyboardDismissMode: keyboardDismissMode,
            drawerType: drawerType,
            overlayAccessibilityLabel: overlayAccessibilityLabel,
            drawerPosition: drawerPosition,
            drawerStyle: [
                {
                    backgroundColor: colors.card
                },
                drawerType === 'permanent' && ((_reactnative().Platform.OS === 'web' ? drawerPosition === 'right' : direction === 'rtl' && drawerPosition !== 'right' || direction !== 'rtl' && drawerPosition === 'right') ? {
                    borderLeftColor: colors.border,
                    borderLeftWidth: _reactnative().StyleSheet.hairlineWidth
                } : {
                    borderRightColor: colors.border,
                    borderRightWidth: _reactnative().StyleSheet.hairlineWidth
                }),
                drawerType === 'front' && (drawerPosition === 'left' ? {
                    borderTopRightRadius: DRAWER_BORDER_RADIUS,
                    borderBottomRightRadius: DRAWER_BORDER_RADIUS
                } : {
                    borderTopLeftRadius: DRAWER_BORDER_RADIUS,
                    borderBottomLeftRadius: DRAWER_BORDER_RADIUS
                }),
                drawerStyle
            ],
            overlayStyle: {
                backgroundColor: overlayColor
            },
            renderDrawerContent: renderDrawerContent,
            children: renderSceneContent()
        })
    });
}
function DrawerView({ navigation, ...rest }) {
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_elements.SafeAreaProviderCompat, {
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(DrawerViewBase, {
            navigation: navigation,
            ...rest
        })
    });
}
const styles = _reactnative().StyleSheet.create({
    content: {
        flex: 1
    }
});

//# sourceMappingURL=DrawerView.js.map
