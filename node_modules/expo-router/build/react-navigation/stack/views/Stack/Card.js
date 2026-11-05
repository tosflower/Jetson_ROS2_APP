'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Card", {
    enumerable: true,
    get: function() {
        return Card;
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
const _color = require("../../../../utils/color");
const _useLatestCallback = /*#__PURE__*/ _interop_require_default(require("../../../../utils/useLatestCallback"));
const _CardAnimationContext = require("../../utils/CardAnimationContext");
const _gestureActivationCriteria = require("../../utils/gestureActivationCriteria");
const _getDistanceForDirection = require("../../utils/getDistanceForDirection");
const _getInvertedMultiplier = require("../../utils/getInvertedMultiplier");
const _getShadowStyle = require("../../utils/getShadowStyle");
const _GestureHandler = require("../GestureHandler");
const _CardContent = require("./CardContent");
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
const GESTURE_VELOCITY_IMPACT = 0.3;
const TRUE = 1;
const FALSE = 0;
const useNativeDriver = _reactnative().Platform.OS !== 'web';
const hasOpacityStyle = (style)=>{
    if (style) {
        const flattenedStyle = _reactnative().StyleSheet.flatten(style);
        return 'opacity' in flattenedStyle && flattenedStyle.opacity != null;
    }
    return false;
};
const getAnimateToValue = ({ closing: isClosing, layout: currentLayout, gestureDirection: currentGestureDirection, direction: currentDirection, preloaded: isPreloaded })=>{
    if (!isClosing && !isPreloaded) {
        return 0;
    }
    return (0, _getDistanceForDirection.getDistanceForDirection)(currentLayout, currentGestureDirection, currentDirection === 'rtl');
};
const defaultOverlay = ({ style })=>style ? /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Animated.View, {
        style: [
            styles.overlay,
            style
        ]
    }) : null;
function Card({ shadowEnabled = false, gestureEnabled = true, gestureVelocityImpact = GESTURE_VELOCITY_IMPACT, overlay = defaultOverlay, animated, interpolationIndex, opening, closing, next, current, gesture, layout, insets, direction, pageOverflowEnabled, gestureDirection, onOpen, onClose, onTransition, onGestureBegin, onGestureCanceled, onGestureEnd, children, overlayEnabled, gestureResponseDistance, transitionSpec, preloaded, styleInterpolator, containerStyle: customContainerStyle, contentStyle }) {
    const didInitiallyAnimate = _react().useRef(false);
    const lastToValueRef = _react().useRef(undefined);
    const animationHandleRef = _react().useRef(undefined);
    const pendingGestureCallbackRef = _react().useRef(undefined);
    const pendingOnCloseCallbackRef = _react().useRef(undefined);
    const [isClosing] = _react().useState(()=>new (_reactnative()).Animated.Value(FALSE));
    const [inverted] = _react().useState(()=>new (_reactnative()).Animated.Value((0, _getInvertedMultiplier.getInvertedMultiplier)(gestureDirection, direction === 'rtl')));
    const [layoutAnim] = _react().useState(()=>({
            width: new (_reactnative()).Animated.Value(layout.width),
            height: new (_reactnative()).Animated.Value(layout.height)
        }));
    const [isSwiping] = _react().useState(()=>new (_reactnative()).Animated.Value(FALSE));
    const animate = (0, _useLatestCallback.default)(({ closing: isClosingParam, velocity })=>{
        const toValue = getAnimateToValue({
            closing: isClosingParam,
            layout,
            gestureDirection,
            direction,
            preloaded
        });
        lastToValueRef.current = toValue;
        isClosing.setValue(isClosingParam ? TRUE : FALSE);
        const spec = isClosingParam ? transitionSpec.close : transitionSpec.open;
        const animation = spec.animation === 'spring' ? _reactnative().Animated.spring : _reactnative().Animated.timing;
        clearTimeout(pendingGestureCallbackRef.current);
        if (animationHandleRef.current !== undefined) {
            cancelAnimationFrame(animationHandleRef.current);
        }
        onTransition?.({
            closing: isClosingParam,
            gesture: velocity !== undefined
        });
        const onFinish = ()=>{
            if (isClosingParam) {
                onClose();
            } else {
                onOpen();
            }
            animationHandleRef.current = requestAnimationFrame(()=>{
                // Make sure to re-open screen if it wasn't removed
                maybeAnimate();
            });
        };
        if (animated) {
            animation(gesture, {
                ...spec.config,
                velocity,
                toValue,
                useNativeDriver,
                isInteraction: false
            }).start(({ finished })=>{
                clearTimeout(pendingGestureCallbackRef.current);
                if (finished) {
                    onFinish();
                }
            });
        } else {
            onFinish();
        }
    });
    const onGestureStateChange = (0, _useLatestCallback.default)(({ nativeEvent })=>{
        switch(nativeEvent.state){
            case _GestureHandler.GestureState.ACTIVE:
                clearTimeout(pendingGestureCallbackRef.current);
                clearTimeout(pendingOnCloseCallbackRef.current);
                isSwiping.setValue(TRUE);
                onGestureBegin?.();
                break;
            case _GestureHandler.GestureState.CANCELLED:
            case _GestureHandler.GestureState.FAILED:
                {
                    isSwiping.setValue(FALSE);
                    const velocity = gestureDirection === 'vertical' || gestureDirection === 'vertical-inverted' ? nativeEvent.velocityY : nativeEvent.velocityX;
                    animate({
                        closing,
                        velocity
                    });
                    onGestureCanceled?.();
                    break;
                }
            case _GestureHandler.GestureState.END:
                {
                    isSwiping.setValue(FALSE);
                    let distance;
                    let translation;
                    let velocity;
                    if (gestureDirection === 'vertical' || gestureDirection === 'vertical-inverted') {
                        distance = layout.height;
                        translation = nativeEvent.translationY;
                        velocity = nativeEvent.velocityY;
                    } else {
                        distance = layout.width;
                        translation = nativeEvent.translationX;
                        velocity = nativeEvent.velocityX;
                    }
                    const shouldClose = (translation + velocity * gestureVelocityImpact) * (0, _getInvertedMultiplier.getInvertedMultiplier)(gestureDirection, direction === 'rtl') > distance / 2 ? velocity !== 0 || translation !== 0 : closing;
                    animate({
                        closing: shouldClose,
                        velocity
                    });
                    if (shouldClose) {
                        // We call onClose with a delay to make sure that the animation has already started
                        // This will make sure that the state update caused by this doesn't affect start of animation
                        pendingGestureCallbackRef.current = setTimeout(()=>{
                            onClose();
                            // Check if the screen is still closing with a delay
                            // So state update from onClose has a chance to go through
                            // If route wasn't removed after onClose, re-open it
                            pendingOnCloseCallbackRef.current = setTimeout(()=>{
                                maybeAnimate();
                            }, 32);
                        }, 16);
                    }
                    onGestureEnd?.();
                    break;
                }
        }
    });
    _react().useLayoutEffect(()=>{
        layoutAnim.width.setValue(layout.width);
        layoutAnim.height.setValue(layout.height);
        inverted.setValue((0, _getInvertedMultiplier.getInvertedMultiplier)(gestureDirection, direction === 'rtl'));
    }, [
        gestureDirection,
        direction,
        inverted,
        layoutAnim.width,
        layoutAnim.height,
        layout.width,
        layout.height
    ]);
    const previousPropsRef = _react().useRef(null);
    _react().useEffect(()=>{
        return ()=>{
            if (animationHandleRef.current) {
                cancelAnimationFrame(animationHandleRef.current);
            }
            clearTimeout(pendingGestureCallbackRef.current);
            clearTimeout(pendingOnCloseCallbackRef.current);
        };
    // We only want to clean up the animation on unmount
    }, []);
    const timeoutRef = _react().useRef(undefined);
    const maybeAnimate = (0, _useLatestCallback.default)(()=>{
        clearTimeout(pendingGestureCallbackRef.current);
        clearTimeout(pendingOnCloseCallbackRef.current);
        if (!didInitiallyAnimate.current) {
            // Animate the card in on initial mount
            // Wrap in setTimeout to ensure animation starts after
            // rendering of the screen is done. This is especially important
            // in the new architecture
            // cf., https://github.com/react-navigation/react-navigation/issues/12401
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(()=>{
                didInitiallyAnimate.current = true;
                animate({
                    closing
                });
            }, 0);
        } else {
            const previousOpening = previousPropsRef.current?.opening;
            const previousToValue = previousPropsRef.current ? getAnimateToValue(previousPropsRef.current) : null;
            const toValue = getAnimateToValue({
                closing,
                layout,
                gestureDirection,
                direction,
                preloaded
            });
            if (previousToValue !== toValue || lastToValueRef.current !== toValue) {
                // We need to trigger the animation when route was closed
                // The route might have been closed by a `POP` action or by a gesture
                // When route was closed due to a gesture, the animation would've happened already
                // It's still important to trigger the animation so that `onClose` is called
                // If `onClose` is not called, cleanup step won't be performed for gestures
                animate({
                    closing
                });
            } else if (typeof previousOpening === 'boolean' && opening && !previousOpening) {
                // This can happen when screen somewhere below in the stack comes into focus via rearranging
                // Also reset the animated value to make sure that the animation starts from the beginning
                gesture.setValue((0, _getDistanceForDirection.getDistanceForDirection)(layout, gestureDirection, direction === 'rtl'));
                animate({
                    closing
                });
            }
        }
    });
    _react().useEffect(()=>{
        if (preloaded) {
            return;
        }
        maybeAnimate();
        previousPropsRef.current = {
            opening,
            closing,
            layout,
            gestureDirection,
            direction,
            preloaded
        };
    }, [
        animate,
        closing,
        direction,
        gesture,
        gestureDirection,
        layout,
        opening,
        preloaded,
        maybeAnimate
    ]);
    const interpolationProps = _react().useMemo(()=>({
            index: interpolationIndex,
            current: {
                progress: current
            },
            next: next && {
                progress: next
            },
            closing: isClosing,
            swiping: isSwiping,
            inverted,
            layouts: {
                screen: layout
            },
            insets: {
                top: insets.top,
                right: insets.right,
                bottom: insets.bottom,
                left: insets.left
            }
        }), [
        interpolationIndex,
        current,
        next,
        isClosing,
        isSwiping,
        inverted,
        layout,
        insets.top,
        insets.right,
        insets.bottom,
        insets.left
    ]);
    const { containerStyle, cardStyle, overlayStyle, shadowStyle } = _react().useMemo(()=>styleInterpolator(interpolationProps), [
        styleInterpolator,
        interpolationProps
    ]);
    const onGestureEvent = _react().useMemo(()=>gestureEnabled ? _reactnative().Animated.event([
            {
                nativeEvent: gestureDirection === 'vertical' || gestureDirection === 'vertical-inverted' ? {
                    translationY: gesture
                } : {
                    translationX: gesture
                }
            }
        ], {
            useNativeDriver
        }) : undefined, [
        gesture,
        gestureDirection,
        gestureEnabled
    ]);
    const { backgroundColor } = _reactnative().StyleSheet.flatten(contentStyle || {});
    const isTransparent = typeof backgroundColor === 'string' ? (0, _color.alpha)(backgroundColor) === 0 : false;
    return /*#__PURE__*/ (0, _jsxruntime().jsxs)(_CardAnimationContext.CardAnimationContext.Provider, {
        value: interpolationProps,
        children: [
            _reactnative().Platform.OS !== 'web' ? /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Animated.View, {
                style: {
                    // This is a dummy style that doesn't actually change anything visually.
                    // Animated needs the animated value to be used somewhere, otherwise things don't update properly.
                    // If we disable animations and hide header, it could end up making the value unused.
                    // So we have this dummy style that will always be used regardless of what else changed.
                    opacity: current
                },
                // Make sure that this view isn't removed. If this view is removed, our style with animated value won't apply
                collapsable: false
            }) : null,
            overlayEnabled ? /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
                style: [
                    styles.overlayContainer,
                    _reactnative().StyleSheet.absoluteFill
                ],
                children: overlay({
                    style: overlayStyle
                })
            }) : null,
            /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Animated.View, {
                style: [
                    styles.container,
                    containerStyle,
                    customContainerStyle
                ],
                children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_GestureHandler.PanGestureHandler, {
                    enabled: layout.width !== 0 && gestureEnabled,
                    onGestureEvent: onGestureEvent,
                    onHandlerStateChange: onGestureStateChange,
                    ...(0, _gestureActivationCriteria.gestureActivationCriteria)({
                        layout,
                        direction,
                        gestureDirection,
                        gestureResponseDistance
                    }),
                    children: /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().Animated.View, {
                        needsOffscreenAlphaCompositing: hasOpacityStyle(cardStyle),
                        style: [
                            styles.container,
                            cardStyle
                        ],
                        children: [
                            shadowEnabled && shadowStyle && !isTransparent ? /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Animated.View, {
                                style: [
                                    styles.shadow,
                                    gestureDirection === 'horizontal' ? [
                                        styles.shadowHorizontal,
                                        styles.shadowStart
                                    ] : gestureDirection === 'horizontal-inverted' ? [
                                        styles.shadowHorizontal,
                                        styles.shadowEnd
                                    ] : gestureDirection === 'vertical' ? [
                                        styles.shadowVertical,
                                        styles.shadowTop
                                    ] : [
                                        styles.shadowVertical,
                                        styles.shadowBottom
                                    ],
                                    {
                                        backgroundColor
                                    },
                                    shadowStyle
                                ]
                            }) : null,
                            /*#__PURE__*/ (0, _jsxruntime().jsx)(_CardContent.CardContent, {
                                enabled: pageOverflowEnabled,
                                layout: layout,
                                style: contentStyle,
                                children: children
                            })
                        ]
                    })
                })
            })
        ]
    });
}
const styles = _reactnative().StyleSheet.create({
    container: {
        flex: 1,
        pointerEvents: 'box-none'
    },
    overlay: {
        flex: 1,
        backgroundColor: '#000',
        pointerEvents: 'none'
    },
    overlayContainer: {
        pointerEvents: 'box-none'
    },
    shadow: {
        position: 'absolute',
        pointerEvents: 'none'
    },
    shadowHorizontal: {
        top: 0,
        bottom: 0,
        width: 3,
        ...(0, _getShadowStyle.getShadowStyle)({
            offset: {
                width: -1,
                height: 1
            },
            radius: 5,
            opacity: 0.3
        })
    },
    shadowStart: {
        start: 0
    },
    shadowEnd: {
        end: 0
    },
    shadowVertical: {
        start: 0,
        end: 0,
        height: 3,
        ...(0, _getShadowStyle.getShadowStyle)({
            offset: {
                width: 1,
                height: -1
            },
            radius: 5,
            opacity: 0.3
        })
    },
    shadowTop: {
        top: 0
    },
    shadowBottom: {
        bottom: 0
    }
});

//# sourceMappingURL=Card.js.map
