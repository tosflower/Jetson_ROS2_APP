'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NativeStackView", {
    enumerable: true,
    get: function() {
        return NativeStackView;
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
function _reactnativesafeareacontext() {
    const data = require("react-native-safe-area-context");
    _reactnativesafeareacontext = function() {
        return data;
    };
    return data;
}
function _reactnativescreens() {
    const data = require("react-native-screens");
    _reactnativescreens = function() {
        return data;
    };
    return data;
}
const _Route = require("../../../Route");
const _useDeprecated = require("../../../useDeprecated");
const _elements = require("../../elements");
const _native = require("../../native");
const _ScreenPresentationContext = require("../utils/ScreenPresentationContext");
const _debounce = require("../utils/debounce");
const _getModalRoutesKeys = require("../utils/getModalRoutesKeys");
const _useAnimatedHeaderHeight = require("../utils/useAnimatedHeaderHeight");
const _useDismissedRouteError = require("../utils/useDismissedRouteError");
const _useInvalidPreventRemoveError = require("../utils/useInvalidPreventRemoveError");
const _headerAppearance = require("./headerAppearance");
const _useHeaderConfigProps = require("./useHeaderConfigProps");
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
const ANDROID_DEFAULT_HEADER_HEIGHT = 56;
const useNativeDriver = _reactnative().Platform.OS !== 'web';
const SceneView = ({ index, focused, route, descriptor, previousDescriptor, nextDescriptor, isPresentationModal, hasModalBelow, isPreloaded, isRemovalPrevented, onWillDisappear, onWillAppear, onAppear, onDisappear, onDismissed, onHeaderBackButtonClicked, onNativeDismissCancelled, onGestureCancel, onSheetDetentChanged })=>{
    const { navigation, options, render } = descriptor;
    let { animation, animationMatchesGesture, presentation = isPresentationModal ? 'modal' : 'card', fullScreenGestureEnabled } = options;
    const { animationDuration, animationTypeForReplace = 'push', fullScreenGestureShadowEnabled = true, gestureEnabled, gestureDirection = presentation === 'card' ? 'horizontal' : 'vertical', gestureResponseDistance, header, headerBackButtonMenuEnabled, headerShown, headerBackground, headerTransparent, autoHideHomeIndicator, keyboardHandlingEnabled, navigationBarColor, navigationBarTranslucent, navigationBarHidden, orientation, sheetAllowedDetents = [
        1.0
    ], sheetLargestUndimmedDetentIndex = -1, sheetGrabberVisible = false, sheetCornerRadius = -1.0, sheetElevation = 24, sheetExpandsWhenScrolledToEdge = true, sheetInitialDetentIndex = 0, sheetShouldOverflowTopInset = false, sheetResizeAnimationEnabled = true, statusBarAnimation, statusBarHidden, statusBarStyle, statusBarTranslucent, statusBarBackgroundColor, unstable_sheetFooter, scrollEdgeEffects, contentStyle, unstable_nativeProps } = options;
    const screenNativeProps = unstable_nativeProps;
    const routeNode = (0, _Route.useRouteNode)();
    (0, _useDeprecated.useWarnOnce)(`Route "${route.name}" uses presentation "${options.presentation}" but is the first screen in its native stack, so it is rendered as a card. Add unstable_settings.anchor to the stack layout to place a non-modal screen before this route.`, __DEV__ && index === 0 && isPresentationModal && options.presentation != null, routeNode ? `${routeNode.contextKey}:${route.name}` : route.name);
    (0, _useDeprecated.useWarnOnce)(`Route "${route.name}" has no presentation option, so it is shown as a modal because a modal screen is below it. This may change in a future version. Set presentation from route params with options={({ route }) => ...}, or use separate card and formSheet screens that render the same component.`, __DEV__ && isPresentationModal && options.presentation == null, `${route.key}:above-modal`);
    (0, _useDeprecated.useWarnOnce)(`Route "${route.name}" uses presentation "card" above a modal screen, so it is pushed behind the modal and is not visible until the modal closes. Use a modal presentation for this route, or close the modal before you navigate.`, __DEV__ && _reactnative().Platform.OS === 'ios' && options.presentation === 'card' && hasModalBelow, `${route.key}:card-above-modal`);
    if (gestureDirection === 'vertical' && _reactnative().Platform.OS === 'ios') {
        // for `vertical` direction to work, we need to set `fullScreenGestureEnabled` to `true`
        // so the screen can be dismissed from any point on screen.
        // `animationMatchesGesture` needs to be set to `true` so the `animation` set by user can be used,
        // otherwise `simple_push` will be used.
        // Also, the default animation for this direction seems to be `slide_from_bottom`.
        if (fullScreenGestureEnabled === undefined) {
            fullScreenGestureEnabled = true;
        }
        if (animationMatchesGesture === undefined) {
            animationMatchesGesture = true;
        }
        if (animation === undefined) {
            animation = 'slide_from_bottom';
        }
    }
    // workaround for rn-screens where gestureDirection has to be set on both
    // current and previous screen - software-mansion/react-native-screens/pull/1509
    const nextGestureDirection = nextDescriptor?.options.gestureDirection;
    const gestureDirectionOverride = nextGestureDirection != null ? nextGestureDirection : gestureDirection;
    if (index === 0) {
        // first screen should always be treated as `card`, it resolves problems with no header animation
        // for navigator with first screen as `modal` and the next as `card`
        presentation = 'card';
    }
    const { colors } = (0, _native.useTheme)();
    const insets = (0, _reactnativesafeareacontext().useSafeAreaInsets)();
    // `modal`, `formSheet` and `pageSheet` presentations do not take whole screen, so should not take the inset.
    const isModal = presentation === 'modal' || presentation === 'formSheet' || presentation === 'pageSheet';
    // Modals are fullscreen in landscape only on iPhone
    const isIPhone = _reactnative().Platform.OS === 'ios' && !(_reactnative().Platform.isPad || _reactnative().Platform.isTV);
    const isParentHeaderShown = (0, _react().use)(_elements.HeaderShownContext);
    const parentHeaderHeight = (0, _react().use)(_elements.HeaderHeightContext);
    const parentHeaderBack = (0, _react().use)(_elements.HeaderBackContext);
    const isLandscape = (0, _elements.useFrameSize)((frame)=>frame.width > frame.height);
    const topInset = isParentHeaderShown || _reactnative().Platform.OS === 'ios' && isModal || isIPhone && isLandscape ? 0 : insets.top;
    const defaultHeaderHeight = (0, _elements.useFrameSize)((frame)=>_reactnative().Platform.select({
            // FIXME: Currently screens isn't using Material 3
            // So our `getDefaultHeaderHeight` doesn't return the correct value
            // So we hardcode the value here for now until screens is updated
            android: ANDROID_DEFAULT_HEADER_HEIGHT + topInset,
            default: (0, _elements.getDefaultHeaderHeight)(frame, isModal, topInset)
        }));
    const [headerHeight, setHeaderHeight] = _react().useState(defaultHeaderHeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const setHeaderHeightDebounced = _react().useCallback(// Debounce the header height updates to avoid excessive re-renders
    (0, _debounce.debounce)(setHeaderHeight, 100), []);
    const hasCustomHeader = header != null;
    const usesNewAndroidHeaderHeightImplementation = 'usesNewAndroidHeaderHeightImplementation' in _reactnativescreens().compatibilityFlags && _reactnativescreens().compatibilityFlags['usesNewAndroidHeaderHeightImplementation'] === true;
    let headerHeightCorrectionOffset = 0;
    if (_reactnative().Platform.OS === 'android' && !hasCustomHeader && !usesNewAndroidHeaderHeightImplementation) {
        const statusBarHeight = _reactnative().StatusBar.currentHeight ?? 0;
        // On Android, the native header height is not correctly calculated
        // It includes status bar height even if statusbar is not translucent
        // And the statusbar value itself doesn't match the actual status bar height
        // So we subtract the bogus status bar height and add the actual top inset
        headerHeightCorrectionOffset = -statusBarHeight + topInset;
    }
    const rawAnimatedHeaderHeight = (0, _reactnative().useAnimatedValue)(defaultHeaderHeight);
    const animatedHeaderHeight = _react().useMemo(()=>_reactnative().Animated.add(rawAnimatedHeaderHeight, headerHeightCorrectionOffset), [
        headerHeightCorrectionOffset,
        rawAnimatedHeaderHeight
    ]);
    // During the very first render topInset is > 0 when running
    // in non edge-to-edge mode on Android, while on every consecutive render
    // topInset === 0, causing header content to jump, as we add padding on the first frame,
    // just to remove it in next one. To prevent this, when statusBarTranslucent is set,
    // we apply additional padding in header only if it's true.
    // For more details see: https://github.com/react-navigation/react-navigation/pull/12014
    const headerTopInsetEnabled = typeof statusBarTranslucent === 'boolean' ? statusBarTranslucent : topInset !== 0;
    const canGoBack = previousDescriptor != null || parentHeaderBack != null;
    const backTitle = previousDescriptor ? (0, _elements.getHeaderTitle)(previousDescriptor.options, previousDescriptor.route.name) : parentHeaderBack?.title;
    const headerBack = _react().useMemo(()=>{
        if (canGoBack) {
            return {
                href: undefined,
                title: backTitle
            };
        }
        return undefined;
    }, [
        canGoBack,
        backTitle
    ]);
    const headerConfig = (0, _useHeaderConfigProps.useHeaderConfigProps)({
        ...options,
        route,
        headerBackButtonMenuEnabled: isRemovalPrevented ? false : headerBackButtonMenuEnabled,
        headerBackTitle: options.headerBackTitle !== undefined ? options.headerBackTitle : undefined,
        headerHeight,
        headerShown: header !== undefined ? false : headerShown,
        headerTopInsetEnabled,
        headerTransparent,
        headerBack
    });
    const isHeaderTransparent = (0, _headerAppearance.getPlatformHeaderTransparent)(headerTransparent);
    const onHeaderHeightChange = hasCustomHeader ? undefined : // are created after the first notifications about the header height
    // from the native side, `onHeaderHeightChange` event does not notify
    // `animatedHeaderHeight` about initial values on appearing screens at the moment.
    _reactnative().Animated.event([
        {
            nativeEvent: {
                headerHeight: rawAnimatedHeaderHeight
            }
        }
    ], {
        useNativeDriver,
        listener: (e)=>{
            if (e.nativeEvent && typeof e.nativeEvent === 'object' && 'headerHeight' in e.nativeEvent && typeof e.nativeEvent.headerHeight === 'number') {
                const headerHeight = e.nativeEvent.headerHeight;
                // Only debounce if header has large title or search bar
                // As it's the only case where the header height can change frequently
                const doesHeaderAnimate = _reactnative().Platform.OS === 'ios' && (options.headerLargeTitleEnabled || options.headerSearchBarOptions);
                if (doesHeaderAnimate) {
                    setHeaderHeightDebounced(headerHeight);
                } else {
                    if (_reactnative().Platform.OS === 'android' && headerHeight !== 0 && // On some devices, height maybe slightly off (e.g. 56.17 instead of 56)
                    Math.round(headerHeight) <= ANDROID_DEFAULT_HEADER_HEIGHT) {
                        // FIXME: On Android, events may get delivered out-of-order
                        // https://github.com/facebook/react-native/issues/54636
                        // We seem to get header height without status bar height first,
                        // and then the correct height with status bar height included
                        // But due to out-of-order delivery, we may get the correct height first
                        // and then the one without status bar height
                        // This is hack to include status bar height if it's not already included
                        // It only works because header height doesn't change dynamically on Android
                        setHeaderHeight(headerHeight + insets.top);
                    } else {
                        setHeaderHeight(headerHeight);
                    }
                }
            }
        }
    });
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_native.NavigationProvider, {
        route: route,
        navigation: navigation,
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnativescreens().ScreenStackItem, {
            screenId: route.key,
            activityState: isPreloaded ? 0 : 2,
            style: _reactnative().StyleSheet.absoluteFill,
            "aria-hidden": !focused,
            customAnimationOnSwipe: animationMatchesGesture,
            fullScreenSwipeEnabled: fullScreenGestureEnabled,
            fullScreenSwipeShadowEnabled: fullScreenGestureShadowEnabled,
            gestureEnabled: _reactnative().Platform.OS === 'android' ? // Since we handle them in JS side, we disable this
            false : gestureEnabled,
            homeIndicatorHidden: autoHideHomeIndicator,
            hideKeyboardOnSwipe: keyboardHandlingEnabled,
            navigationBarColor: navigationBarColor,
            navigationBarTranslucent: navigationBarTranslucent,
            navigationBarHidden: navigationBarHidden,
            replaceAnimation: animationTypeForReplace,
            stackPresentation: presentation === 'card' ? 'push' : presentation,
            stackAnimation: animation,
            screenOrientation: orientation,
            sheetAllowedDetents: sheetAllowedDetents,
            sheetLargestUndimmedDetentIndex: sheetLargestUndimmedDetentIndex,
            sheetGrabberVisible: sheetGrabberVisible,
            sheetInitialDetentIndex: sheetInitialDetentIndex,
            sheetCornerRadius: sheetCornerRadius,
            sheetElevation: sheetElevation,
            sheetExpandsWhenScrolledToEdge: sheetExpandsWhenScrolledToEdge,
            sheetShouldOverflowTopInset: sheetShouldOverflowTopInset,
            sheetDefaultResizeAnimationEnabled: sheetResizeAnimationEnabled,
            statusBarAnimation: statusBarAnimation,
            statusBarHidden: statusBarHidden,
            statusBarStyle: statusBarStyle,
            statusBarColor: statusBarBackgroundColor,
            statusBarTranslucent: statusBarTranslucent,
            swipeDirection: gestureDirectionOverride,
            transitionDuration: animationDuration,
            onWillAppear: onWillAppear,
            onWillDisappear: onWillDisappear,
            onAppear: onAppear,
            onDisappear: onDisappear,
            onDismissed: onDismissed,
            onGestureCancel: onGestureCancel,
            onSheetDetentChanged: onSheetDetentChanged,
            gestureResponseDistance: gestureResponseDistance,
            nativeBackButtonDismissalEnabled: false,
            onHeaderBackButtonClicked: onHeaderBackButtonClicked,
            preventNativeDismiss: isRemovalPrevented,
            scrollEdgeEffects: {
                bottom: scrollEdgeEffects?.bottom ?? 'automatic',
                top: scrollEdgeEffects?.top ?? 'automatic',
                left: scrollEdgeEffects?.left ?? 'automatic',
                right: scrollEdgeEffects?.right ?? 'automatic'
            },
            onNativeDismissCancelled: onNativeDismissCancelled,
            onHeaderHeightChange: onHeaderHeightChange,
            contentStyle: [
                presentation !== 'transparentModal' && presentation !== 'containedTransparentModal' && {
                    backgroundColor: colors.background
                },
                contentStyle
            ],
            unstable_sheetFooter: unstable_sheetFooter,
            freezeOnBlur: false,
            ...screenNativeProps,
            headerConfig: headerConfig,
            children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_ScreenPresentationContext.ScreenPresentationContext.Provider, {
                value: presentation,
                children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_useAnimatedHeaderHeight.AnimatedHeaderHeightContext.Provider, {
                    value: animatedHeaderHeight,
                    children: /*#__PURE__*/ (0, _jsxruntime().jsxs)(_elements.HeaderHeightContext.Provider, {
                        value: headerShown !== false ? headerHeight : parentHeaderHeight ?? 0,
                        children: [
                            headerBackground != null ? /**
                 * To show a custom header background, we render it at the top of the screen below the header
                 * The header also needs to be positioned absolutely (with `translucent` style)
                 */ /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
                                style: [
                                    styles.background,
                                    isHeaderTransparent ? styles.translucent : null,
                                    {
                                        height: headerHeight
                                    }
                                ],
                                children: headerBackground()
                            }) : null,
                            header != null && headerShown !== false ? /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
                                onLayout: (e)=>{
                                    const headerHeight = e.nativeEvent.layout.height;
                                    setHeaderHeight(headerHeight);
                                    rawAnimatedHeaderHeight.setValue(headerHeight);
                                },
                                style: [
                                    styles.header,
                                    isHeaderTransparent ? styles.absolute : null
                                ],
                                children: header({
                                    back: headerBack,
                                    options,
                                    route,
                                    navigation
                                })
                            }) : null,
                            /*#__PURE__*/ (0, _jsxruntime().jsx)(_elements.HeaderShownContext.Provider, {
                                value: isParentHeaderShown || headerShown !== false,
                                children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_elements.HeaderBackContext.Provider, {
                                    value: headerBack,
                                    children: render()
                                })
                            })
                        ]
                    })
                })
            })
        })
    });
};
function NativeStackView({ state, descriptors, emit, pop, isPreloaded, isRemovalPrevented, unstable_nativeProps }) {
    const { colors } = (0, _native.useTheme)();
    const { setNextDismissedKey } = (0, _useDismissedRouteError.useDismissedRouteError)(state, isPreloaded);
    const parentPresentation = (0, _react().use)(_ScreenPresentationContext.ScreenPresentationContext);
    const isInTransparentPresentation = parentPresentation === 'formSheet' || parentPresentation === 'transparentModal' || parentPresentation === 'containedTransparentModal';
    (0, _useInvalidPreventRemoveError.useInvalidPreventRemoveError)(descriptors, isRemovalPrevented);
    // Preloaded routes are detached and don't participate in back-affordance or modal grouping.
    const activeRoutes = state.routes.filter((route)=>!isPreloaded(route.key));
    const modalRouteKeys = (0, _getModalRoutesKeys.getModalRouteKeys)(activeRoutes, descriptors);
    // The first screen always renders as a card, so a modal there does not count.
    const firstModalIndex = activeRoutes.findIndex((route, index)=>index > 0 && modalRouteKeys.includes(route.key));
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_elements.SafeAreaProviderCompat, {
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnativescreens().ScreenStack, {
            nativeContainerStyle: isInTransparentPresentation ? undefined : {
                backgroundColor: colors.background
            },
            style: styles.container,
            ...unstable_nativeProps,
            children: state.routes.map((route, index)=>{
                const descriptor = descriptors[route.key];
                const isFocused = state.index === index;
                const routeIsPreloaded = isPreloaded(route.key);
                const activeIndex = activeRoutes.findIndex((activeRoute)=>activeRoute.key === route.key);
                const previousKey = activeIndex > 0 ? activeRoutes[activeIndex - 1]?.key : undefined;
                const nextKey = activeIndex >= 0 ? activeRoutes[activeIndex + 1]?.key : undefined;
                const previousDescriptor = previousKey ? descriptors[previousKey] : undefined;
                const nextDescriptor = nextKey ? descriptors[nextKey] : undefined;
                const isModal = modalRouteKeys.includes(route.key);
                return /*#__PURE__*/ (0, _jsxruntime().jsx)(SceneView, {
                    index: index,
                    focused: isFocused,
                    route: route,
                    descriptor: descriptor,
                    previousDescriptor: previousDescriptor,
                    nextDescriptor: nextDescriptor,
                    isPresentationModal: isModal,
                    hasModalBelow: firstModalIndex !== -1 && activeIndex > firstModalIndex,
                    isPreloaded: routeIsPreloaded,
                    isRemovalPrevented: isRemovalPrevented(route.key),
                    onWillDisappear: ()=>{
                        emit({
                            type: 'transitionStart',
                            data: {
                                closing: true
                            },
                            target: route.key
                        });
                    },
                    onWillAppear: ()=>{
                        emit({
                            type: 'transitionStart',
                            data: {
                                closing: false
                            },
                            target: route.key
                        });
                    },
                    onAppear: ()=>{
                        emit({
                            type: 'transitionEnd',
                            data: {
                                closing: false
                            },
                            target: route.key
                        });
                    },
                    onDisappear: ()=>{
                        emit({
                            type: 'transitionEnd',
                            data: {
                                closing: true
                            },
                            target: route.key
                        });
                    },
                    onDismissed: (event)=>{
                        pop(event.nativeEvent.dismissCount, route.key);
                        setNextDismissedKey(route.key);
                    },
                    onHeaderBackButtonClicked: ()=>{
                        pop(1, route.key);
                    },
                    onNativeDismissCancelled: (event)=>{
                        pop(event.nativeEvent.dismissCount, route.key);
                    },
                    onGestureCancel: ()=>{
                        emit({
                            type: 'gestureCancel',
                            target: route.key
                        });
                    },
                    onSheetDetentChanged: (event)=>{
                        emit({
                            type: 'sheetDetentChange',
                            target: route.key,
                            data: {
                                index: event.nativeEvent.index,
                                stable: event.nativeEvent.isStable
                            }
                        });
                    }
                }, route.key);
            })
        })
    });
}
const styles = _reactnative().StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        zIndex: 1
    },
    absolute: {
        position: 'absolute',
        top: 0,
        start: 0,
        end: 0
    },
    translucent: {
        position: 'absolute',
        top: 0,
        start: 0,
        end: 0,
        zIndex: 1,
        elevation: 1
    },
    background: {
        overflow: 'hidden'
    }
});

//# sourceMappingURL=NativeStackView.native.js.map
