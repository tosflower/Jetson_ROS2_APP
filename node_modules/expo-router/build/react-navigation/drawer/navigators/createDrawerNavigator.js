'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createStandardDrawerNavigator", {
    enumerable: true,
    get: function() {
        return createStandardDrawerNavigator;
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
const _DrawerView = require("../views/DrawerView");
function DrawerNavigatorContent({ descriptors, drawerState, navigation, isPreloaded: _isPreloaded, isRemovalPrevented: _isRemovalPrevented, preload, defaultStatus = 'closed', drawerContent, detachInactiveScreens, backBehavior }) {
    (0, _useNonStackAnchorWarning.useNonStackAnchorWarning)(backBehavior);
    (0, _useReconcileTabHistory.useReconcileTabHistory)();
    const { visibleRoutes, focusedIndex, focusedFallbackRoute } = (0, _useVisibleTabsWithRedirect.useVisibleTabsWithRedirect)({
        routes: drawerState.routes,
        routeNames: drawerState.routeNames,
        focusedRouteKey: drawerState.routes[drawerState.index]?.key,
        descriptors
    });
    // TODO(@ubax): SDK-58: Try to remove the casting from here to ensure type safety
    // Integration supplies full descriptors, including preload placeholders; standard types omit route/navigation.
    const drawerDescriptors = descriptors;
    (0, _usePreloadPlaceholderRoutes.usePreloadPlaceholderRoutes)({
        routes: visibleRoutes,
        descriptors: drawerDescriptors,
        preload,
        lazyByDefault: true
    });
    if (focusedFallbackRoute) {
        return descriptors[focusedFallbackRoute.key]?.render() ?? null;
    }
    if (visibleRoutes.length === 0 || focusedIndex < 0) {
        return null;
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_DrawerView.DrawerView, {
        state: {
            ...drawerState,
            routes: visibleRoutes,
            index: focusedIndex
        },
        navigation: navigation,
        descriptors: drawerDescriptors,
        defaultStatus: defaultStatus,
        drawerContent: drawerContent,
        detachInactiveScreens: detachInactiveScreens
    });
}
const createStandardDrawerNavigator = (0, _standardnavigation().createStandardNavigator)(DrawerNavigatorContent);

//# sourceMappingURL=createDrawerNavigator.js.map
