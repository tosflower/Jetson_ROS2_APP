'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "StackView", {
    enumerable: true,
    get: function() {
        return StackView;
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
const _elements = require("../../../elements");
const _ModalPresentationContext = require("../../utils/ModalPresentationContext");
const _GestureHandler = require("../GestureHandler");
const _HeaderContainer = require("../Header/HeaderContainer");
const _CardStack = require("./CardStack");
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
const GestureHandlerWrapper = _GestureHandler.GestureHandlerRootView ?? _reactnative().View;
/**
 * Compare two arrays with primitive values as the content.
 * We need to make sure that both values and order match.
 */ const isArrayEqual = (a, b)=>a.length === b.length && a.every((it, index)=>Object.is(it, b[index]));
class StackView extends _react().Component {
    static getDerivedStateFromProps(props, state) {
        const allRoutes = props.state.routes;
        const previousRoutes = state.previousState?.routes ?? [];
        const previousFocusedRoute = state.previousState ? state.previousState.routes[state.previousState.index] : undefined;
        const nextFocusedRouteFromState = props.state.routes[props.state.index];
        const activeRoutes = props.state.routes.filter((route)=>!props.isPreloaded(route.key));
        // If there was no change in routes, we don't need to compute anything
        if (isArrayEqual(allRoutes.map((r)=>r.key), previousRoutes.map((r)=>r.key)) && previousFocusedRoute?.key === nextFocusedRouteFromState?.key && state.routes.length) {
            // If there were any routes being closed or replaced,
            // We need to make sure they are preserved in the new state from props.state
            // So first we get all such routes from the previous state (that included the animating routes)
            // Then we add them back to the new state if they don't already exist
            const closingRoutes = state.routes.filter((r)=>state.closingRouteKeys.includes(r.key) && !activeRoutes.some((pr)=>pr.key === r.key));
            const replacingRoutes = state.routes.filter((r)=>state.replacingRouteKeys.includes(r.key) && !activeRoutes.some((pr)=>pr.key === r.key));
            let routes = activeRoutes.slice();
            // Replacing routes go before the focused route (they're being covered)
            if (replacingRoutes.length) {
                routes.splice(routes.length - 1, 0, ...replacingRoutes);
            }
            // Closing routes go at the end (they're animating out on top)
            if (closingRoutes.length) {
                routes.push(...closingRoutes);
            }
            let descriptors = props.descriptors;
            let previousDescriptors = state.previousDescriptors;
            if (props.descriptors !== state.previousDescriptors) {
                descriptors = routes.reduce((acc, route)=>{
                    acc[route.key] = props.descriptors[route.key] || state.descriptors[route.key];
                    return acc;
                }, {});
                previousDescriptors = props.descriptors;
            }
            if (!isArrayEqual(allRoutes, previousRoutes)) {
                // if any route objects have changed, we should update them
                const map = allRoutes.reduce((acc, route)=>{
                    acc[route.key] = route;
                    return acc;
                }, {});
                routes = routes.map((route)=>map[route.key] || route);
            }
            return {
                routes,
                previousState: props.state,
                descriptors,
                previousDescriptors
            };
        }
        // Here we determine which routes were added or removed to animate them
        // We keep a copy of the route being removed in local state to be able to animate it
        let routes = activeRoutes;
        let { openingRouteKeys, closingRouteKeys, replacingRouteKeys } = state;
        // If a route that was closing or being replaced is now back in the routes,
        // it was added back before the animation finished, so stop tracking it
        closingRouteKeys = closingRouteKeys.filter((key)=>!routes.some((r)=>r.key === key));
        replacingRouteKeys = replacingRouteKeys.filter((key)=>!routes.some((r)=>r.key === key));
        // Get previous focused route from previousState (actual focused route, not last in previousRoutes
        // which can be a preloaded route that was never focused)
        const nextFocusedRoute = activeRoutes[activeRoutes.length - 1];
        const isAnimationEnabled = (key)=>{
            const descriptor = props.descriptors[key] || state.descriptors[key];
            return (0, _CardStack.getAnimationEnabled)(descriptor?.options.animation);
        };
        const getAnimationTypeForReplace = (key)=>{
            const descriptor = props.descriptors[key] || state.descriptors[key];
            return descriptor.options.animationTypeForReplace ?? 'push';
        };
        if (previousFocusedRoute && previousFocusedRoute.key !== nextFocusedRoute.key) {
            // We only need to animate routes if the focused route changed
            // Animating previous routes won't be visible coz the focused route is on top of everything
            if (previousRoutes.some((r)=>r.key === nextFocusedRoute.key) && !routes.some((r)=>r.key === previousFocusedRoute.key)) {
                // The previously focused route was removed, and the new focused route was already present
                // We treat this as a pop
                if (isAnimationEnabled(previousFocusedRoute.key) && !closingRouteKeys.includes(previousFocusedRoute.key)) {
                    closingRouteKeys = [
                        ...closingRouteKeys,
                        previousFocusedRoute.key
                    ];
                    // Sometimes a route can be closed before the opening animation finishes
                    // So we also need to remove it from the opening list
                    openingRouteKeys = openingRouteKeys.filter((key)=>key !== previousFocusedRoute.key);
                    replacingRouteKeys = replacingRouteKeys.filter((key)=>key !== previousFocusedRoute.key);
                    // Keep a copy of route being removed in the state to be able to animate it
                    routes = [
                        ...routes,
                        previousFocusedRoute
                    ];
                }
            } else {
                // A route has come to the focus, we treat this as a push
                // A replace or rearranging can also trigger this
                // The animation should look like push
                if (isAnimationEnabled(nextFocusedRoute.key) && !openingRouteKeys.includes(nextFocusedRoute.key)) {
                    // In this case, we need to animate pushing the focused route
                    // We don't care about animating any other added routes because they won't be visible
                    openingRouteKeys = [
                        ...openingRouteKeys,
                        nextFocusedRoute.key
                    ];
                    closingRouteKeys = closingRouteKeys.filter((key)=>key !== nextFocusedRoute.key);
                    replacingRouteKeys = replacingRouteKeys.filter((key)=>key !== nextFocusedRoute.key);
                    if (!routes.some((r)=>r.key === previousFocusedRoute.key)) {
                        // The previous focused route isn't present in state, we treat this as a replace
                        openingRouteKeys = openingRouteKeys.filter((key)=>key !== previousFocusedRoute.key);
                        if (getAnimationTypeForReplace(nextFocusedRoute.key) === 'pop') {
                            closingRouteKeys = [
                                ...closingRouteKeys,
                                previousFocusedRoute.key
                            ];
                            // By default, new routes have a push animation, so we add it to `openingRouteKeys` before
                            // But since user configured it to animate the old screen like a pop, we need to add this without animation
                            // So remove it from `openingRouteKeys` which will remove the animation
                            openingRouteKeys = openingRouteKeys.filter((key)=>key !== nextFocusedRoute.key);
                            // Keep the route being removed at the end to animate it out
                            routes = [
                                ...routes,
                                previousFocusedRoute
                            ];
                        } else {
                            replacingRouteKeys = [
                                ...replacingRouteKeys,
                                previousFocusedRoute.key
                            ];
                            closingRouteKeys = closingRouteKeys.filter((key)=>key !== previousFocusedRoute.key);
                            // Keep the old route in the state because it's visible under the new route, and removing it will feel abrupt
                            // We need to insert it just before the focused one (the route being pushed)
                            // After the push animation is completed, routes being replaced will be removed completely
                            routes = routes.slice();
                            routes.splice(routes.length - 1, 0, previousFocusedRoute);
                            // Preserve any other routes still being replaced from previous transitions
                            const previousReplacingRoutes = state.routes.filter((r)=>replacingRouteKeys.includes(r.key) && !routes.some((existing)=>existing.key === r.key));
                            if (previousReplacingRoutes.length) {
                                // Insert before the route we just added (previousFocusedRoute)
                                routes.splice(routes.length - 2, 0, ...previousReplacingRoutes);
                            }
                        }
                    }
                }
            }
        } else if (replacingRouteKeys.length || closingRouteKeys.length) {
            // Keep the routes we are closing or replacing if animation is enabled for them
            routes = routes.slice();
            routes.splice(routes.length - 1, 0, ...state.routes.filter(({ key })=>isAnimationEnabled(key) ? replacingRouteKeys.includes(key) || closingRouteKeys.includes(key) : false));
        }
        if (!routes.length) {
            throw new Error('There should always be at least one route in the navigation state.');
        }
        const routeKeys = new Set(routes.map((route)=>route.key));
        const descriptors = [
            ...routes,
            ...allRoutes.filter((route)=>!routeKeys.has(route.key))
        ].reduce((acc, route)=>{
            acc[route.key] = props.descriptors[route.key] || state.descriptors[route.key];
            return acc;
        }, {});
        return {
            routes,
            previousState: props.state,
            previousDescriptors: props.descriptors,
            openingRouteKeys,
            closingRouteKeys,
            replacingRouteKeys,
            descriptors
        };
    }
    state = {
        routes: [],
        previousState: undefined,
        previousDescriptors: {},
        openingRouteKeys: [],
        closingRouteKeys: [],
        replacingRouteKeys: [],
        descriptors: {}
    };
    getPreviousRoute = ({ route })=>{
        const { closingRouteKeys, replacingRouteKeys } = this.state;
        const routes = this.state.routes.filter((r)=>r.key === route.key || !closingRouteKeys.includes(r.key) && !replacingRouteKeys.includes(r.key));
        const index = routes.findIndex((r)=>r.key === route.key);
        return routes[index - 1];
    };
    renderHeader = (props)=>{
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(_HeaderContainer.HeaderContainer, {
            ...props
        });
    };
    handleOpenRoute = ({ route })=>{
        const { state, restoreRoute } = this.props;
        const { closingRouteKeys, replacingRouteKeys } = this.state;
        const activeRoutes = state.routes.filter((route)=>!this.props.isPreloaded(route.key));
        if (closingRouteKeys.some((key)=>key === route.key) && replacingRouteKeys.every((key)=>key !== route.key) && !activeRoutes.some((r)=>r.key === route.key)) {
            // If route isn't present in current state, but was closing, assume that a close animation was cancelled
            // So we need to add this route back to the state
            if (restoreRoute(route)) {
                return;
            }
        }
        this.setState((state)=>{
            const routeIndex = state.routes.findIndex((r)=>r.key === route.key);
            // Remove replacing routes that were before the route that just opened
            // Those were replaced by this or earlier routes and should be cleaned up
            const replacingRoutesToRemove = new Set(state.routes.slice(0, routeIndex).filter((r)=>state.replacingRouteKeys.includes(r.key)).map((r)=>r.key));
            const newRoutes = state.routes.filter((r)=>!replacingRoutesToRemove.has(r.key));
            return {
                routes: newRoutes,
                openingRouteKeys: state.openingRouteKeys.filter((key)=>key !== route.key),
                closingRouteKeys: state.closingRouteKeys.filter((key)=>key !== route.key),
                replacingRouteKeys: state.replacingRouteKeys.filter((key)=>!replacingRoutesToRemove.has(key))
            };
        });
    };
    handleCloseRoute = ({ route })=>{
        const { state, pop } = this.props;
        const activeRoutes = state.routes.filter((route)=>!this.props.isPreloaded(route.key));
        if (activeRoutes.some((r)=>r.key === route.key)) {
            // If a route exists in state, trigger a pop
            // This will happen in when the route was closed from the card component
            // e.g. When the close animation triggered from a gesture ends
            pop(1, route.key);
        } else {
            // We need to clean up any state tracking the route and pop it immediately
            this.setState((state)=>({
                    routes: state.routes.filter((r)=>r.key !== route.key),
                    openingRouteKeys: state.openingRouteKeys.filter((key)=>key !== route.key),
                    closingRouteKeys: state.closingRouteKeys.filter((key)=>key !== route.key)
                }));
        }
    };
    handleTransitionStart = ({ route }, closing)=>this.props.emit({
            type: 'transitionStart',
            data: {
                closing
            },
            target: route.key
        });
    handleTransitionEnd = ({ route }, closing)=>this.props.emit({
            type: 'transitionEnd',
            data: {
                closing
            },
            target: route.key
        });
    handleGestureStart = ({ route })=>{
        this.props.emit({
            type: 'gestureStart',
            target: route.key
        });
    };
    handleGestureEnd = ({ route })=>{
        this.props.emit({
            type: 'gestureEnd',
            target: route.key
        });
    };
    handleGestureCancel = ({ route })=>{
        this.props.emit({
            type: 'gestureCancel',
            target: route.key
        });
    };
    render() {
        const { state, // eslint-disable-next-line @typescript-eslint/no-unused-vars
        descriptors: _, ...rest } = this.props;
        const { routes, descriptors, openingRouteKeys, closingRouteKeys } = this.state;
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(GestureHandlerWrapper, {
            style: styles.container,
            children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_elements.SafeAreaProviderCompat, {
                children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnativesafeareacontext().SafeAreaInsetsContext.Consumer, {
                    children: (insets)=>/*#__PURE__*/ (0, _jsxruntime().jsx)(_ModalPresentationContext.ModalPresentationContext.Consumer, {
                            children: (isParentModal)=>/*#__PURE__*/ (0, _jsxruntime().jsx)(_elements.HeaderShownContext.Consumer, {
                                    children: (isParentHeaderShown)=>/*#__PURE__*/ (0, _jsxruntime().jsx)(CardStackWithVerticalBarEdge, {
                                            insets: insets,
                                            isParentHeaderShown: isParentHeaderShown,
                                            isParentModal: isParentModal,
                                            getPreviousRoute: this.getPreviousRoute,
                                            routes: routes,
                                            openingRouteKeys: openingRouteKeys,
                                            closingRouteKeys: closingRouteKeys,
                                            onOpenRoute: this.handleOpenRoute,
                                            onCloseRoute: this.handleCloseRoute,
                                            onTransitionStart: this.handleTransitionStart,
                                            onTransitionEnd: this.handleTransitionEnd,
                                            renderHeader: this.renderHeader,
                                            state: state,
                                            descriptors: descriptors,
                                            onGestureStart: this.handleGestureStart,
                                            onGestureEnd: this.handleGestureEnd,
                                            onGestureCancel: this.handleGestureCancel,
                                            ...rest
                                        })
                                })
                        })
                })
            })
        });
    }
}
const styles = _reactnative().StyleSheet.create({
    container: {
        flex: 1
    }
});
function CardStackWithVerticalBarEdge(props) {
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_CardStack.CardStack, {
        ...props,
        verticalBarEdge: (0, _expostatusbar().useVerticalBarEdgeIOS)()
    });
}

//# sourceMappingURL=StackView.js.map
