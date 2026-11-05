'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CardContainer", {
    enumerable: true,
    get: function() {
        return CardContainer;
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
const _elements = require("../../../elements");
const _native = require("../../../native");
const _ModalPresentationContext = require("../../utils/ModalPresentationContext");
const _useKeyboardManager = require("../../utils/useKeyboardManager");
const _Card = require("./Card");
const _CardA11yWrapper = require("./CardA11yWrapper");
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
const EPSILON = 0.1;
function CardContainerInner({ interpolationIndex, index, active, opening, closing, gesture, focused, modal, getPreviousScene, getFocusedRoute, hasAbsoluteFloatHeader, headerHeight, onHeaderHeightChange, isParentHeaderShown, isNextScreenTransparent, detachCurrentScreen, layout, onCloseRoute, onOpenRoute, onGestureCancel, onGestureEnd, onGestureStart, onTransitionEnd, onTransitionStart, preloaded, renderHeader, safeAreaInsetBottom, safeAreaInsetLeft, safeAreaInsetRight, safeAreaInsetTop, scene }) {
    const wrapperRef = _react().useRef(null);
    const { direction } = (0, _native.useLocale)();
    const parentHeaderHeight = (0, _react().use)(_elements.HeaderHeightContext);
    const { options } = scene.descriptor;
    const enabled = focused && options.keyboardHandlingEnabled !== false;
    const { onPageChangeStart, onPageChangeCancel, onPageChangeConfirm } = (0, _useKeyboardManager.useKeyboardManager)({
        enabled,
        focused
    });
    const handleOpen = ()=>{
        const { route } = scene;
        onTransitionEnd({
            route
        }, false);
        onOpenRoute({
            route
        });
    };
    const handleClose = ()=>{
        const { route } = scene;
        onTransitionEnd({
            route
        }, true);
        onCloseRoute({
            route
        });
    };
    const handleGestureBegin = ()=>{
        const { route } = scene;
        onPageChangeStart();
        onGestureStart({
            route
        });
    };
    const handleGestureCanceled = ()=>{
        const { route } = scene;
        onPageChangeCancel();
        onGestureCancel({
            route
        });
    };
    const handleGestureEnd = ()=>{
        const { route } = scene;
        onGestureEnd({
            route
        });
    };
    const handleTransition = ({ closing, gesture })=>{
        wrapperRef.current?.setInert(closing);
        const { route } = scene;
        onPageChangeConfirm?.({
            gesture,
            active,
            closing
        });
        onTransitionStart?.({
            route
        }, closing);
    };
    const insets = {
        top: safeAreaInsetTop,
        right: safeAreaInsetRight,
        bottom: safeAreaInsetBottom,
        left: safeAreaInsetLeft
    };
    const { colors } = (0, _native.useTheme)();
    _react().useEffect(()=>{
        const listener = scene.progress.next?.addListener?.(({ value })=>{
            wrapperRef.current?.setInert(value > EPSILON);
        });
        return ()=>{
            if (listener) {
                scene.progress.next?.removeListener?.(listener);
            }
        };
    }, [
        scene.progress.next
    ]);
    const { presentation, animation, cardOverlay, cardOverlayEnabled, cardShadowEnabled, cardStyle, cardStyleInterpolator, gestureDirection, gestureEnabled, gestureResponseDistance, gestureVelocityImpact, headerMode, headerShown, transitionSpec } = scene.descriptor.options;
    const { buildHref } = (0, _native.useLinkBuilder)();
    const previousScene = getPreviousScene({
        route: scene.route
    });
    let backTitle;
    let href;
    if (previousScene) {
        const { options } = previousScene.descriptor;
        const { route } = previousScene;
        backTitle = (0, _elements.getHeaderTitle)(options, route.name);
        href = buildHref(route.name, route.params);
    }
    const canGoBack = previousScene != null;
    const headerBack = _react().useMemo(()=>{
        if (canGoBack) {
            return {
                href,
                title: backTitle
            };
        }
        return undefined;
    }, [
        canGoBack,
        backTitle,
        href
    ]);
    const animated = animation !== 'none';
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_CardA11yWrapper.CardA11yWrapper, {
        ref: wrapperRef,
        focused: focused,
        active: active,
        animated: animated,
        isNextScreenTransparent: isNextScreenTransparent,
        detachCurrentScreen: detachCurrentScreen,
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_Card.Card, {
            animated: animated,
            interpolationIndex: interpolationIndex,
            gestureDirection: gestureDirection,
            layout: layout,
            insets: insets,
            direction: direction,
            gesture: gesture,
            current: scene.progress.current,
            next: scene.progress.next,
            opening: opening,
            closing: closing,
            onOpen: handleOpen,
            onClose: handleClose,
            overlay: cardOverlay,
            overlayEnabled: cardOverlayEnabled,
            shadowEnabled: cardShadowEnabled,
            onTransition: handleTransition,
            onGestureBegin: handleGestureBegin,
            onGestureCanceled: handleGestureCanceled,
            onGestureEnd: handleGestureEnd,
            gestureEnabled: index === 0 ? false : gestureEnabled,
            gestureResponseDistance: gestureResponseDistance,
            gestureVelocityImpact: gestureVelocityImpact,
            transitionSpec: transitionSpec,
            styleInterpolator: cardStyleInterpolator,
            pageOverflowEnabled: headerMode !== 'float' && presentation !== 'modal',
            preloaded: preloaded,
            containerStyle: hasAbsoluteFloatHeader && headerMode !== 'screen' ? {
                marginTop: headerHeight
            } : null,
            contentStyle: [
                {
                    backgroundColor: presentation === 'transparentModal' ? 'transparent' : colors.background
                },
                cardStyle
            ],
            children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
                style: styles.container,
                children: /*#__PURE__*/ (0, _jsxruntime().jsxs)(_ModalPresentationContext.ModalPresentationContext.Provider, {
                    value: modal,
                    children: [
                        headerMode !== 'float' ? renderHeader({
                            mode: 'screen',
                            layout,
                            scenes: [
                                previousScene,
                                scene
                            ],
                            getPreviousScene,
                            getFocusedRoute,
                            onContentHeightChange: onHeaderHeightChange,
                            style: styles.header
                        }) : null,
                        /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
                            style: styles.scene,
                            children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_elements.HeaderBackContext.Provider, {
                                value: headerBack,
                                children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_elements.HeaderShownContext.Provider, {
                                    value: isParentHeaderShown || headerShown !== false,
                                    children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_elements.HeaderHeightContext.Provider, {
                                        value: headerShown !== false ? headerHeight : parentHeaderHeight ?? 0,
                                        children: scene.descriptor.render()
                                    })
                                })
                            })
                        })
                    ]
                })
            })
        })
    });
}
const CardContainer = /*#__PURE__*/ _react().memo(CardContainerInner);
const styles = _reactnative().StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        zIndex: 1
    },
    scene: {
        flex: 1
    }
});

//# sourceMappingURL=CardContainer.js.map
