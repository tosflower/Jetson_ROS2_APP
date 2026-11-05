"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    CardStack: null,
    getAnimationEnabled: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get CardStack () {
        return CardStack;
    },
    get getAnimationEnabled () {
        return getAnimationEnabled;
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
const _getHeaderStatusBarHeight = require("../../../elements/Header/getHeaderStatusBarHeight");
const _CardStyleInterpolators = require("../../TransitionConfigs/CardStyleInterpolators");
const _TransitionPresets = require("../../TransitionConfigs/TransitionPresets");
const _findLastIndex = require("../../utils/findLastIndex");
const _getDistanceForDirection = require("../../utils/getDistanceForDirection");
const _getModalRoutesKeys = require("../../utils/getModalRoutesKeys");
const _Screens = require("../Screens");
const _CardContainer = require("./CardContainer");
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
const NAMED_TRANSITIONS_PRESETS = {
    default: _TransitionPresets.DefaultTransition,
    fade: _TransitionPresets.ModalFadeTransition,
    fade_from_bottom: _TransitionPresets.FadeFromBottomAndroid,
    fade_from_right: _TransitionPresets.FadeFromRightAndroid,
    none: _TransitionPresets.DefaultTransition,
    reveal_from_bottom: _TransitionPresets.RevealFromBottomAndroid,
    scale_from_center: _TransitionPresets.ScaleFromCenterAndroid,
    slide_from_left: _TransitionPresets.SlideFromLeftIOS,
    slide_from_right: _TransitionPresets.SlideFromRightIOS,
    slide_from_bottom: _reactnative().Platform.select({
        ios: _TransitionPresets.ModalSlideFromBottomIOS,
        default: _TransitionPresets.BottomSheetAndroid
    })
};
const EPSILON = 1e-5;
const STATE_INACTIVE = 0;
const STATE_TRANSITIONING_OR_BELOW_TOP = 1;
const STATE_ON_TOP = 2;
const FALLBACK_DESCRIPTOR = Object.freeze({
    options: {}
});
const getInterpolationIndex = (scenes, index)=>{
    const { cardStyleInterpolator } = scenes[index].descriptor.options;
    // Start from current card and count backwards the number of cards with same interpolation
    let interpolationIndex = 0;
    for(let i = index - 1; i >= 0; i--){
        const cardStyleInterpolatorCurrent = scenes[i]?.descriptor.options.cardStyleInterpolator;
        if (cardStyleInterpolatorCurrent !== cardStyleInterpolator) {
            break;
        }
        interpolationIndex++;
    }
    return interpolationIndex;
};
const getIsModalPresentation = (cardStyleInterpolator)=>{
    return cardStyleInterpolator === _CardStyleInterpolators.forModalPresentationIOS || // Handle custom modal presentation interpolators as well
    cardStyleInterpolator.name === 'forModalPresentationIOS';
};
const getIsModal = (scene, interpolationIndex, isParentModal)=>{
    if (isParentModal) {
        return true;
    }
    const { cardStyleInterpolator } = scene.descriptor.options;
    const isModalPresentation = getIsModalPresentation(cardStyleInterpolator);
    const isModal = isModalPresentation && interpolationIndex !== 0;
    return isModal;
};
const getHeaderHeights = (scenes, insets, verticalBarEdge, isParentHeaderShown, isParentModal, layout, previous)=>{
    return scenes.reduce((acc, curr, index)=>{
        const { headerStatusBarHeight = isParentHeaderShown ? 0 : (0, _getHeaderStatusBarHeight.getHeaderStatusBarHeight)(insets, verticalBarEdge), headerStyle } = curr.descriptor.options;
        const style = _reactnative().StyleSheet.flatten(headerStyle || {});
        const height = 'height' in style && typeof style.height === 'number' ? style.height : previous[curr.route.key];
        const interpolationIndex = getInterpolationIndex(scenes, index);
        const isModal = getIsModal(curr, interpolationIndex, isParentModal);
        acc[curr.route.key] = typeof height === 'number' ? height : (0, _elements.getDefaultHeaderHeight)(layout, isModal, headerStatusBarHeight);
        return acc;
    }, {});
};
const getDistanceFromOptions = (layout, options, isRTL)=>{
    if (options?.gestureDirection) {
        return (0, _getDistanceForDirection.getDistanceForDirection)(layout, options.gestureDirection, isRTL);
    }
    const defaultGestureDirection = options?.presentation === 'modal' ? _TransitionPresets.ModalTransition.gestureDirection : _TransitionPresets.DefaultTransition.gestureDirection;
    const gestureDirection = options?.animation ? NAMED_TRANSITIONS_PRESETS[options?.animation]?.gestureDirection : defaultGestureDirection;
    return (0, _getDistanceForDirection.getDistanceForDirection)(layout, gestureDirection, isRTL);
};
const getProgressFromGesture = (gesture, layout, options, isRTL)=>{
    const distance = getDistanceFromOptions({
        // Make sure that we have a non-zero distance, otherwise there will be incorrect progress
        // This causes blank screen on web if it was previously inside container with display: none
        width: Math.max(1, layout.width),
        height: Math.max(1, layout.height)
    }, options, isRTL);
    if (distance > 0) {
        return gesture.interpolate({
            inputRange: [
                0,
                distance
            ],
            outputRange: [
                1,
                0
            ]
        });
    }
    return gesture.interpolate({
        inputRange: [
            distance,
            0
        ],
        outputRange: [
            0,
            1
        ]
    });
};
function getDefaultAnimation(animation) {
    // Disable screen transition animation by default on web, windows and macos to match the native behavior
    const excludedPlatforms = _reactnative().Platform.OS !== 'web' && _reactnative().Platform.OS !== 'windows' && _reactnative().Platform.OS !== 'macos';
    return animation ?? (excludedPlatforms ? 'default' : 'none');
}
function getAnimationEnabled(animation) {
    return getDefaultAnimation(animation) !== 'none';
}
const getAllRoutes = (routes, state, isPreloaded)=>{
    const routeKeys = new Set(routes.map((route)=>route.key));
    return routes.concat(state.routes.filter((route)=>isPreloaded(route.key) && !routeKeys.has(route.key)));
};
class CardStack extends _react().Component {
    static getDerivedStateFromProps(props, state) {
        if (props.routes === state.routes && props.descriptors === state.descriptors) {
            return null;
        }
        const allRoutes = getAllRoutes(props.routes, props.state, props.isPreloaded);
        const gestures = allRoutes.reduce((acc, curr)=>{
            const descriptor = props.descriptors[curr.key];
            const { animation } = descriptor?.options || {};
            acc[curr.key] = state.gestures[curr.key] || new (_reactnative()).Animated.Value(props.openingRouteKeys.includes(curr.key) && getAnimationEnabled(animation) || props.isPreloaded(curr.key) ? getDistanceFromOptions(state.layout, descriptor?.options, props.direction === 'rtl') : 0);
            return acc;
        }, {});
        const modalRouteKeys = (0, _getModalRoutesKeys.getModalRouteKeys)(props.routes, props.descriptors);
        const scenes = allRoutes.map((route, index, self)=>{
            const isPreloaded = props.isPreloaded(route.key);
            const previousRoute = isPreloaded ? undefined : self[index - 1];
            const nextRouteCandidate = self[index + 1];
            const nextRoute = isPreloaded || nextRouteCandidate && props.isPreloaded(nextRouteCandidate.key) ? undefined : nextRouteCandidate;
            const oldScene = state.scenes.find((scene)=>scene.route.key === route.key);
            const currentGesture = gestures[route.key];
            const previousGesture = previousRoute ? gestures[previousRoute.key] : undefined;
            const nextGesture = nextRoute ? gestures[nextRoute.key] : undefined;
            const descriptor = props.descriptors[route.key] || state.descriptors[route.key] || (oldScene ? oldScene.descriptor : FALLBACK_DESCRIPTOR);
            const nextOptions = nextRoute && (props.descriptors[nextRoute?.key] || state.descriptors[nextRoute?.key])?.options;
            const previousOptions = previousRoute && (props.descriptors[previousRoute?.key] || state.descriptors[previousRoute?.key])?.options;
            // When a screen is not the last, it should use next screen's transition config
            // Many transitions also animate the previous screen, so using 2 different transitions doesn't look right
            // For example combining a slide and a modal transition would look wrong otherwise
            // With this approach, combining different transition styles in the same navigator mostly looks right
            // This will still be broken when 2 transitions have different idle state (e.g. modal presentation),
            // but the majority of the transitions look alright
            const optionsForTransitionConfig = index !== self.length - 1 && nextOptions && nextOptions?.presentation !== 'transparentModal' ? nextOptions : descriptor.options;
            // Assume modal if there are already modal screens in the stack
            // or current screen is a modal when no presentation is specified
            const isModal = modalRouteKeys.includes(route.key);
            const animation = getDefaultAnimation(optionsForTransitionConfig.animation);
            const isAnimationEnabled = getAnimationEnabled(animation);
            const transitionPreset = animation !== 'default' ? NAMED_TRANSITIONS_PRESETS[animation] : optionsForTransitionConfig.presentation === 'transparentModal' ? _TransitionPresets.ModalFadeTransition : optionsForTransitionConfig.presentation === 'modal' || isModal ? _TransitionPresets.ModalTransition : _TransitionPresets.DefaultTransition;
            const { gestureEnabled = _reactnative().Platform.OS === 'ios' && isAnimationEnabled, gestureDirection = transitionPreset.gestureDirection, transitionSpec = transitionPreset.transitionSpec, cardStyleInterpolator = isAnimationEnabled ? transitionPreset.cardStyleInterpolator : _CardStyleInterpolators.forNoAnimation, headerStyleInterpolator = transitionPreset.headerStyleInterpolator, cardOverlayEnabled = _reactnative().Platform.OS !== 'ios' && optionsForTransitionConfig.presentation !== 'transparentModal' || getIsModalPresentation(cardStyleInterpolator) } = optionsForTransitionConfig;
            const headerMode = descriptor.options.headerMode ?? (!(optionsForTransitionConfig.presentation === 'modal' || optionsForTransitionConfig.presentation === 'transparentModal' || nextOptions?.presentation === 'modal' || nextOptions?.presentation === 'transparentModal' || getIsModalPresentation(cardStyleInterpolator)) && _reactnative().Platform.OS === 'ios' && descriptor.options.header === undefined ? 'float' : 'screen');
            const isRTL = props.direction === 'rtl';
            const scene = {
                route,
                descriptor: {
                    ...descriptor,
                    options: {
                        ...descriptor.options,
                        animation,
                        cardOverlayEnabled,
                        cardStyleInterpolator,
                        gestureDirection,
                        gestureEnabled,
                        headerStyleInterpolator,
                        transitionSpec,
                        headerMode
                    }
                },
                progress: {
                    current: getProgressFromGesture(currentGesture, state.layout, descriptor.options, isRTL),
                    next: nextGesture && nextOptions?.presentation !== 'transparentModal' ? getProgressFromGesture(nextGesture, state.layout, nextOptions, isRTL) : undefined,
                    previous: previousGesture ? getProgressFromGesture(previousGesture, state.layout, previousOptions, isRTL) : undefined
                },
                __memo: [
                    state.layout,
                    descriptor,
                    nextOptions,
                    previousOptions,
                    currentGesture,
                    nextGesture,
                    previousGesture
                ]
            };
            if (oldScene && scene.__memo.every((it, i)=>{
                // @ts-expect-error: we haven't added __memo to the annotation to prevent usage elsewhere
                return oldScene.__memo[i] === it;
            })) {
                return oldScene;
            }
            return scene;
        });
        let activeStates = state.activeStates;
        if (props.routes.length !== state.routes.length) {
            let activeScreensLimit = 1;
            for(let i = props.routes.length - 1; i >= 0; i--){
                const { options } = scenes[i].descriptor;
                const { // By default, we don't want to detach the previous screen of the active one for modals
                detachPreviousScreen = options.presentation === 'transparentModal' ? false : getIsModalPresentation(options.cardStyleInterpolator) ? i !== (0, _findLastIndex.findLastIndex)(scenes, (scene)=>{
                    const { cardStyleInterpolator } = scene.descriptor.options;
                    return cardStyleInterpolator === _CardStyleInterpolators.forModalPresentationIOS || cardStyleInterpolator?.name === 'forModalPresentationIOS';
                }) : true } = options;
                if (detachPreviousScreen === false) {
                    activeScreensLimit++;
                } else {
                    // Check at least last 2 screens before stopping
                    // This will make sure that screen isn't detached when another screen is animating on top of the transparent one
                    // e.g. opaque -> transparent -> opaque
                    if (i <= props.routes.length - 2) {
                        break;
                    }
                }
            }
            activeStates = props.routes.map((_, index, self)=>{
                // The activity state represents state of the screen:
                // 0 - inactive, the screen is detached
                // 1 - transitioning or below the top screen, the screen is mounted but interaction is disabled
                // 2 - on top of the stack, the screen is mounted and interaction is enabled
                let activityState;
                const lastActiveState = state.activeStates[index];
                const activeAfterTransition = index >= self.length - activeScreensLimit;
                if (lastActiveState === STATE_INACTIVE && !activeAfterTransition) {
                    // screen was inactive before and it will still be inactive after the transition
                    activityState = STATE_INACTIVE;
                } else {
                    const sceneForActivity = scenes[self.length - 1];
                    const outputValue = index === self.length - 1 ? STATE_ON_TOP // the screen is on top after the transition
                     : activeAfterTransition ? STATE_TRANSITIONING_OR_BELOW_TOP // the screen should stay active after the transition, it is not on top but is in activeLimit
                     : STATE_INACTIVE; // the screen should be active only during the transition, it is at the edge of activeLimit
                    activityState = sceneForActivity ? sceneForActivity.progress.current.interpolate({
                        inputRange: [
                            0,
                            1 - EPSILON,
                            1
                        ],
                        outputRange: [
                            1,
                            1,
                            outputValue
                        ],
                        extrapolate: 'clamp'
                    }) : STATE_TRANSITIONING_OR_BELOW_TOP;
                }
                return activityState;
            });
        }
        return {
            routes: props.routes,
            scenes,
            gestures,
            descriptors: props.descriptors,
            activeStates,
            headerHeights: getHeaderHeights(scenes, props.insets, props.verticalBarEdge, props.isParentHeaderShown, props.isParentModal, state.layout, state.headerHeights)
        };
    }
    constructor(props){
        super(props);
        this.state = {
            routes: [],
            scenes: [],
            gestures: {},
            layout: _elements.SafeAreaProviderCompat.initialMetrics.frame,
            descriptors: this.props.descriptors,
            activeStates: [],
            // Used when card's header is null and mode is float to make transition
            // between screens with headers and those without headers smooth.
            // This is not a great heuristic here. We don't know synchronously
            // on mount what the header height is so we have just used the most
            // common cases here.
            headerHeights: {}
        };
    }
    handleLayout = (e)=>{
        const { height, width } = e.nativeEvent.layout;
        const layout = {
            width,
            height
        };
        this.setState((state, props)=>{
            if (height === state.layout.height && width === state.layout.width) {
                return null;
            }
            return {
                layout,
                headerHeights: getHeaderHeights(state.scenes, props.insets, props.verticalBarEdge, props.isParentHeaderShown, props.isParentModal, layout, state.headerHeights)
            };
        });
    };
    handleHeaderLayout = ({ route, height })=>{
        this.setState(({ headerHeights })=>{
            const previousHeight = headerHeights[route.key];
            if (previousHeight === height) {
                return null;
            }
            return {
                headerHeights: {
                    ...headerHeights,
                    [route.key]: height
                }
            };
        });
    };
    getFocusedRoute = ()=>{
        const { state } = this.props;
        return state.routes[state.index];
    };
    getPreviousScene = ({ route })=>{
        const { getPreviousRoute } = this.props;
        const { scenes } = this.state;
        const previousRoute = getPreviousRoute({
            route
        });
        if (previousRoute) {
            const previousScene = scenes.find((scene)=>scene.route.key === previousRoute.key);
            return previousScene;
        }
        return undefined;
    };
    render() {
        const { insets, state, routes, openingRouteKeys, closingRouteKeys, onOpenRoute, onCloseRoute, renderHeader, isParentHeaderShown, isParentModal, onTransitionStart, onTransitionEnd, onGestureStart, onGestureEnd, onGestureCancel, detachInactiveScreens = _reactnative().Platform.OS === 'web' || _reactnative().Platform.OS === 'android' || _reactnative().Platform.OS === 'ios' } = this.props;
        const { scenes, layout, gestures, activeStates, headerHeights } = this.state;
        const activeScenes = scenes.filter((scene)=>routes.some((route)=>route.key === scene.route.key));
        if (state.routes.length === 0) {
            return null;
        }
        const focusedRoute = state.routes[state.index];
        const focusedHeaderHeight = headerHeights[focusedRoute.key];
        const isFloatHeaderAbsolute = activeScenes.slice(-2).some((scene)=>{
            const options = scene.descriptor.options ?? {};
            const { headerMode, headerTransparent, headerShown = true } = options;
            if (headerTransparent || headerShown === false || headerMode === 'screen') {
                return true;
            }
            return false;
        });
        return /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().View, {
            style: styles.container,
            children: [
                renderHeader({
                    mode: 'float',
                    layout,
                    scenes: activeScenes,
                    getPreviousScene: this.getPreviousScene,
                    getFocusedRoute: this.getFocusedRoute,
                    onContentHeightChange: this.handleHeaderLayout,
                    style: [
                        styles.floating,
                        isFloatHeaderAbsolute && [
                            // Without this, the header buttons won't be touchable on Android when headerTransparent: true
                            {
                                height: focusedHeaderHeight
                            },
                            styles.absolute
                        ]
                    ]
                }),
                /*#__PURE__*/ (0, _jsxruntime().jsx)(_Screens.MaybeScreenContainer, {
                    enabled: detachInactiveScreens,
                    style: styles.container,
                    onLayout: this.handleLayout,
                    children: getAllRoutes(routes, state, this.props.isPreloaded).map((route, index)=>{
                        const focused = focusedRoute.key === route.key;
                        const gesture = gestures[route.key];
                        const scene = scenes[index];
                        const isPreloaded = this.props.isPreloaded(route.key);
                        const { headerShown = true, headerTransparent, autoHideHomeIndicator } = scene.descriptor.options;
                        const safeAreaInsetTop = insets.top;
                        const safeAreaInsetRight = insets.right;
                        const safeAreaInsetBottom = insets.bottom;
                        const safeAreaInsetLeft = insets.left;
                        const headerHeight = headerShown !== false ? headerHeights[route.key] ?? 0 : 0;
                        // Start from current card and count backwards the number of cards with same interpolation
                        const interpolationIndex = getInterpolationIndex(scenes, index);
                        const isModal = getIsModal(scene, interpolationIndex, isParentModal);
                        const nextScene = isPreloaded ? undefined : activeScenes[index + 1];
                        const isNextScreenTransparent = nextScene?.descriptor.options.presentation === 'transparentModal';
                        const detachCurrentScreen = nextScene?.descriptor.options.detachPreviousScreen !== false;
                        const activityState = isPreloaded ? STATE_INACTIVE : activeStates[index];
                        return /*#__PURE__*/ (0, _jsxruntime().jsx)(_Screens.MaybeScreen, {
                            style: [
                                styles.boxNone,
                                _reactnative().StyleSheet.absoluteFill
                            ],
                            enabled: detachInactiveScreens,
                            active: activityState,
                            homeIndicatorHidden: autoHideHomeIndicator,
                            children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_CardContainer.CardContainer, {
                                index: index,
                                interpolationIndex: interpolationIndex,
                                modal: isModal,
                                active: index === routes.length - 1,
                                focused: focused,
                                opening: openingRouteKeys.includes(route.key),
                                closing: closingRouteKeys.includes(route.key),
                                layout: layout,
                                gesture: gesture,
                                scene: scene,
                                safeAreaInsetTop: safeAreaInsetTop,
                                safeAreaInsetRight: safeAreaInsetRight,
                                safeAreaInsetBottom: safeAreaInsetBottom,
                                safeAreaInsetLeft: safeAreaInsetLeft,
                                onGestureStart: onGestureStart,
                                onGestureCancel: onGestureCancel,
                                onGestureEnd: onGestureEnd,
                                headerHeight: headerHeight,
                                isParentHeaderShown: isParentHeaderShown,
                                onHeaderHeightChange: this.handleHeaderLayout,
                                getPreviousScene: this.getPreviousScene,
                                getFocusedRoute: this.getFocusedRoute,
                                hasAbsoluteFloatHeader: isFloatHeaderAbsolute && !headerTransparent,
                                renderHeader: renderHeader,
                                onOpenRoute: onOpenRoute,
                                onCloseRoute: onCloseRoute,
                                onTransitionStart: onTransitionStart,
                                onTransitionEnd: onTransitionEnd,
                                isNextScreenTransparent: isNextScreenTransparent,
                                detachCurrentScreen: detachCurrentScreen,
                                preloaded: isPreloaded
                            })
                        }, route.key);
                    })
                })
            ]
        });
    }
}
const styles = _reactnative().StyleSheet.create({
    container: {
        flex: 1
    },
    absolute: {
        position: 'absolute',
        top: 0,
        start: 0,
        end: 0
    },
    floating: {
        zIndex: 1
    },
    boxNone: {
        pointerEvents: 'box-none'
    }
});

//# sourceMappingURL=CardStack.js.map
