'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createStandardMaterialTopTabNavigator", {
    enumerable: true,
    get: function() {
        return createStandardMaterialTopTabNavigator;
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
const _MaterialTopTabView = require("../views/MaterialTopTabView");
function MaterialTopTabNavigatorContent({ state, descriptors, actions, emitter, isPreloaded: _isPreloaded, isRemovalPrevented: _isRemovalPrevented, routeNames, preload, navigateToTabSync, backBehavior, ...rest }) {
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
    const topTabDescriptors = descriptors;
    const navigateToTab = (routeKey)=>{
        const route = state.routes.find((route)=>route.key === routeKey);
        if (route) {
            actions.navigate(route.name, route.params);
        } else if (__DEV__) {
            console.warn(`Top tabs could not switch to the tab "${routeKey}" because no tab with that key exists. ` + `'navigateToTab' takes a route key, not a route name — pass 'route.key' from the tab bar props.`);
        }
    };
    (0, _usePreloadPlaceholderRoutes.usePreloadPlaceholderRoutes)({
        routes: visibleRoutes,
        descriptors: topTabDescriptors,
        preload,
        lazyByDefault: false
    });
    if (focusedFallbackRoute) {
        return descriptors[focusedFallbackRoute.key]?.render() ?? null;
    }
    if (visibleRoutes.length === 0 || focusedIndex < 0) {
        return null;
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_MaterialTopTabView.MaterialTopTabView, {
        ...rest,
        state: {
            ...state,
            routes: visibleRoutes,
            index: focusedIndex
        },
        descriptors: topTabDescriptors,
        emitter: emitter,
        navigateToTab: navigateToTab,
        navigateToTabSync: (routeKey)=>{
            const route = state.routes.find((route)=>route.key === routeKey);
            if (route) {
                navigateToTabSync(route.name, route.params);
            }
        }
    });
}
const createStandardMaterialTopTabNavigator = (0, _standardnavigation().createStandardNavigator)(MaterialTopTabNavigatorContent);

//# sourceMappingURL=createMaterialTopTabNavigator.js.map
