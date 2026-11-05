'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createStandardBottomTabNavigator", {
    enumerable: true,
    get: function() {
        return createStandardBottomTabNavigator;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
function _standardnavigation() {
    const data = require("standard-navigation");
    _standardnavigation = function() {
        return data;
    };
    return data;
}
const _useNonStackAnchorWarning = require("../../../standard-navigation/useNonStackAnchorWarning");
const _usePreloadPlaceholderRoutes = require("../../../standard-navigation/usePreloadPlaceholderRoutes");
const _useReconcileTabHistory = require("../../../standard-navigation/useReconcileTabHistory");
const _useVisibleTabsWithRedirect = require("../../../standard-navigation/useVisibleTabsWithRedirect");
const _BottomTabView = require("../views/BottomTabView");
function BottomTabNavigatorContent({ state, descriptors, actions, emitter, isPreloaded: _isPreloaded, isRemovalPrevented: _isRemovalPrevented, routeNames, popNestedStackToTop, preload, backBehavior, ...rest }) {
    (0, _useNonStackAnchorWarning.useNonStackAnchorWarning)(backBehavior);
    (0, _useReconcileTabHistory.useReconcileTabHistory)();
    const { visibleRoutes, focusedIndex, focusedFallbackRoute } = (0, _useVisibleTabsWithRedirect.useVisibleTabsWithRedirect)({
        routes: state.routes,
        routeNames,
        focusedRouteKey: state.routes[state.index]?.key,
        descriptors
    });
    // TODO(@ubax): SDK-58: Try to remove the casting from here to ensure type safety
    // Integration supplies full descriptors, including preload placeholders; standard types omit route/navigation.
    const bottomTabDescriptors = descriptors;
    const navigateToTab = (routeKey)=>{
        const route = state.routes.find((route)=>route.key === routeKey);
        if (route) {
            actions.navigate(route.name, route.params);
        } else if (__DEV__) {
            console.warn(`Bottom tabs could not switch to the tab "${routeKey}" because no tab with that key exists. ` + `'navigateToTab' takes a route key, not a route name — pass 'route.key' from the tab bar props.`);
        }
    };
    (0, _usePreloadPlaceholderRoutes.usePreloadPlaceholderRoutes)({
        routes: visibleRoutes,
        descriptors: bottomTabDescriptors,
        preload,
        lazyByDefault: true
    });
    if (focusedFallbackRoute) {
        return descriptors[focusedFallbackRoute.key]?.render() ?? null;
    }
    if (visibleRoutes.length === 0 || focusedIndex < 0) {
        return null;
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_BottomTabView.BottomTabView, {
        ...rest,
        state: {
            // Only routes are substituted; navigator metadata remains from the real state.
            ...state,
            routes: visibleRoutes,
            index: focusedIndex
        },
        descriptors: bottomTabDescriptors,
        emitter: emitter,
        navigateToTab: navigateToTab,
        popNestedStackToTop: popNestedStackToTop
    });
}
const createStandardBottomTabNavigator = (0, _standardnavigation().createStandardNavigator)(BottomTabNavigatorContent);

//# sourceMappingURL=createBottomTabNavigator.js.map
