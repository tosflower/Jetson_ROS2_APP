'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SceneView", {
    enumerable: true,
    get: function() {
        return SceneView;
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
const _removalPrevention = require("../../global-state/removalPrevention");
const _EnsureSingleNavigator = require("./EnsureSingleNavigator");
const _IsPreloadedContext = require("./IsPreloadedContext");
const _NavigationFocusedRouteStateContext = require("./NavigationFocusedRouteStateContext");
const _NavigationStateContext = require("./NavigationStateContext");
const _StaticContainer = require("./StaticContainer");
const _useOptionsGetters = require("./useOptionsGetters");
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
function SceneView({ screen, route, navigation, routeState, options, clearOptions, emitRemovalEvent }) {
    const { addOptionsGetter } = (0, _useOptionsGetters.useOptionsGetters)({
        key: route.key,
        options
    });
    // Clear options set by this screen when it is unmounted
    _react().useEffect(()=>{
        return clearOptions;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const parentFocusedRouteState = (0, _react().use)(_NavigationFocusedRouteStateContext.NavigationFocusedRouteStateContext);
    const isPreloaded = (0, _react().use)(_IsPreloadedContext.IsPreloadedContext) || route.isPreloaded === true;
    const focusedRouteState = _react().useMemo(()=>{
        const state = {
            routes: [
                {
                    key: route.key,
                    name: route.name,
                    params: route.params,
                    path: route.path
                }
            ]
        };
        // Add our state to the innermost route of the parent state
        const addState = (parent)=>{
            const parentRoute = parent?.routes[0];
            if (parentRoute) {
                return {
                    routes: [
                        {
                            ...parentRoute,
                            state: addState(parentRoute.state)
                        }
                    ]
                };
            }
            return state;
        };
        return addState(parentFocusedRouteState);
    }, [
        parentFocusedRouteState,
        route.key,
        route.name,
        route.params,
        route.path
    ]);
    const context = _react().useMemo(()=>({
            state: routeState,
            addOptionsGetter
        }), [
        routeState,
        addOptionsGetter
    ]);
    const ScreenComponent = screen.getComponent ? screen.getComponent() : screen.component;
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_IsPreloadedContext.IsPreloadedContext, {
        value: isPreloaded,
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_removalPrevention.PreventRemovalProvider, {
            routeKey: route.key,
            emitRemovalEvent: emitRemovalEvent,
            children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_NavigationStateContext.NavigationStateContext.Provider, {
                value: context,
                children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_NavigationFocusedRouteStateContext.NavigationFocusedRouteStateContext.Provider, {
                    value: focusedRouteState,
                    children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_EnsureSingleNavigator.EnsureSingleNavigator, {
                        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_StaticContainer.StaticContainer, {
                            name: screen.name,
                            render: ScreenComponent || screen.children,
                            navigation: navigation,
                            route: route,
                            children: ScreenComponent !== undefined ? /*#__PURE__*/ (0, _jsxruntime().jsx)(ScreenComponent, {
                                navigation: navigation,
                                route: route
                            }) : screen.children !== undefined ? screen.children({
                                navigation,
                                route
                            }) : null
                        })
                    })
                })
            })
        })
    });
}

//# sourceMappingURL=SceneView.js.map
