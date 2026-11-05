'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    NativeTabsContext: null,
    NativeTabsNavigatorWrapper: null,
    createNativeTabsProps: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get NativeTabsContext () {
        return NativeTabsContext;
    },
    get NativeTabsNavigatorWrapper () {
        return NativeTabsNavigatorWrapper;
    },
    get createNativeTabsProps () {
        return createNativeTabsProps;
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
const _createBaseTabProps = require("../layouts/createBaseTabProps");
const _native = require("../react-navigation/native");
const _standardnavigation = require("../standard-navigation");
const _appendMissingPlaceholderTabRoutes = require("../standard-navigation/appendMissingPlaceholderTabRoutes");
const _useNonStackAnchorWarning = require("../standard-navigation/useNonStackAnchorWarning");
const _usePreloadPlaceholderRoutes = require("../standard-navigation/usePreloadPlaceholderRoutes");
const _useReconcileTabHistory = require("../standard-navigation/useReconcileTabHistory");
const _useVisibleTabsWithRedirect = require("../standard-navigation/useVisibleTabsWithRedirect");
const _children = require("../utils/children");
const _NativeBottomTabsRouter = require("./NativeBottomTabsRouter");
const _NativeTabTrigger = require("./NativeTabTrigger");
const _NativeTabsView = require("./NativeTabsView");
const _utils = require("./utils");
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
// In Jetpack Compose, the default back behavior is to go back to the initial route.
const defaultBackBehavior = 'initialRoute';
const NativeTabsContext = /*#__PURE__*/ _react().default.createContext(false);
function createNativeTabsProps(args) {
    const { dispatchSync } = args;
    return {
        ...(0, _createBaseTabProps.createBaseTabProps)(args),
        navigateSync: (name)=>dispatchSync(_native.CommonActions.navigate(name))
    };
}
function NativeTabsContent({ state, routeNames, descriptors, actions: _actions, emitter, preload, navigateSync, isPreloaded: _isPreloaded, isRemovalPrevented: _isRemovalPrevented, tabConfigurationKey, // These per-tab style props are folded into `screenOptions` by `NativeTabsNavigatorWrapper` and
// read back per-tab from `descriptors`. Pull them out of `rest` so they aren't forwarded to
// `NativeTabsView` as top-level props.
labelStyle, iconColor, backgroundColor, badgeBackgroundColor, blurEffect, indicatorColor, badgeTextColor, rippleColor, disableIndicator, labelVisibilityMode, ...rest }) {
    (0, _useReconcileTabHistory.useReconcileTabHistory)();
    if ((0, _react().use)(NativeTabsContext)) {
        throw new Error('Nesting Native Tabs inside each other is not supported natively. Use JS tabs for nesting instead.');
    }
    (0, _useNonStackAnchorWarning.useNonStackAnchorWarning)(rest.backBehavior);
    const { routes } = state;
    const { visibleRoutes, focusedIndex, focusedFallbackRoute } = (0, _useVisibleTabsWithRedirect.useVisibleTabsWithRedirect)({
        routes,
        routeNames,
        focusedRouteKey: routes[state.index]?.key,
        descriptors
    });
    const visibleTabs = (0, _react().useMemo)(()=>visibleRoutes.map((route)=>({
                options: descriptors[route.key].options,
                name: route.name,
                routeKey: route.key,
                contentRenderer: ()=>descriptors[route.key].render()
            })), [
        descriptors,
        visibleRoutes
    ]);
    (0, _usePreloadPlaceholderRoutes.usePreloadPlaceholderRoutes)({
        routes: visibleRoutes,
        descriptors,
        preload,
        lazyByDefault: false
    });
    const provenanceRef = (0, _react().useRef)(0);
    const onTabChange = (0, _react().useCallback)(({ selectedKey, provenance, isNativeAction, isPrevented = false })=>{
        if (isPrevented) {
            // The native side blocked selecting a disabled tab. Notify listeners, but
            // don't advance navigation or acknowledge a (non-existent) state transition,
            // so the provenance counter is left untouched.
            emitter.emit({
                type: 'tabPress',
                target: routes.find((route)=>route.name === selectedKey)?.key ?? selectedKey,
                data: {
                    __internalTabsType: 'native',
                    isPrevented: true
                }
            });
            return;
        }
        // We should always send the last provenance we got from native side
        provenanceRef.current = provenance;
        if (isNativeAction) {
            const selectedRoute = routes.find((route)=>route.name === selectedKey);
            if (!selectedRoute) {
                if (process.env.NODE_ENV !== 'production') {
                    console.warn(`NativeTabs received a native tab change for an unknown tab (key: "${selectedKey}"), so the change was ignored. ` + `This is most likely a bug in expo-router. Please report it at https://github.com/expo/expo/issues.`);
                }
                return;
            }
            emitter.emit({
                type: 'tabPress',
                target: selectedRoute.key,
                data: {
                    __internalTabsType: 'native',
                    isPrevented: false
                }
            });
            navigateSync(selectedRoute.name);
        }
    }, [
        routes,
        navigateSync,
        emitter
    ]);
    // Compile-time guard: everything spread onto `<NativeTabsView>` must be a prop it declares. The
    // `Record<…, never>` turns any prop the view doesn't accept into a type error here instead of
    // letting it leak silently through the spread.
    const nativeTabsViewProps = rest;
    if (focusedFallbackRoute) {
        return descriptors[focusedFallbackRoute.key]?.render() ?? null;
    }
    if (visibleTabs.length === 0 || focusedIndex < 0) {
        return null;
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(NativeTabsContext, {
        value: true,
        children: /*#__PURE__*/ (0, _react().createElement)(_NativeTabsView.NativeTabsView, {
            ...nativeTabsViewProps,
            key: tabConfigurationKey,
            focusedIndex: focusedIndex,
            // Provenance should only be sent with updates, and updates
            // on JS side are only triggered by rerender, so passing ref
            // here is ok.
            provenance: provenanceRef.current,
            tabs: visibleTabs,
            onTabChange: onTabChange
        })
    });
}
const NativeTabsNavigatorWithContext = (0, _standardnavigation.createStandardRouterNavigator)(NativeTabsContent, _NativeBottomTabsRouter.NativeBottomTabsRouter, {
    activityDefaultThreshold: 1,
    processDescriptors: _appendMissingPlaceholderTabRoutes.appendMissingPlaceholderTabDescriptors,
    processState: _appendMissingPlaceholderTabRoutes.appendMissingPlaceholderTabRoutes,
    createProps: createNativeTabsProps
});
function NativeTabsNavigatorWrapper(props) {
    const triggerChildren = (0, _react().useMemo)(()=>(0, _children.getAllChildrenOfType)(props.children, _NativeTabTrigger.NativeTabTrigger).filter((child)=>!child.props.hidden), [
        props.children
    ]);
    const nonTriggerChildren = (0, _react().useMemo)(()=>(0, _children.getAllChildrenNotOfType)(props.children, _NativeTabTrigger.NativeTabTrigger), [
        props.children
    ]);
    const tabConfigurationKey = triggerChildren.map((child)=>child.props.name).join(';');
    const { backBehavior = defaultBackBehavior, labelStyle, iconColor, blurEffect, backgroundColor, badgeBackgroundColor, indicatorColor, badgeTextColor, shadowColor, rippleColor, disableIndicator, labelVisibilityMode, tintColor, disableTransparentOnScrollEdge } = props;
    const screenOptions = (0, _react().useMemo)(()=>{
        const processedLabelStyle = (0, _utils.convertLabelStylePropToObject)(labelStyle);
        const processedIconColor = (0, _utils.convertIconColorPropToObject)(iconColor);
        const selectedLabelStyle = processedLabelStyle.selected ? {
            ...processedLabelStyle.selected,
            color: processedLabelStyle.selected.color ?? tintColor
        } : tintColor ? {
            color: tintColor
        } : undefined;
        return {
            disableTransparentOnScrollEdge,
            labelStyle: processedLabelStyle.default,
            selectedLabelStyle,
            iconColor: processedIconColor.default,
            selectedIconColor: processedIconColor.selected ?? tintColor,
            blurEffect,
            backgroundColor,
            badgeBackgroundColor,
            indicatorColor,
            badgeTextColor,
            shadowColor,
            rippleColor,
            disableIndicator,
            labelVisibilityMode,
            tintColor
        };
    }, [
        labelStyle,
        iconColor,
        blurEffect,
        backgroundColor,
        badgeBackgroundColor,
        indicatorColor,
        badgeTextColor,
        shadowColor,
        rippleColor,
        disableIndicator,
        labelVisibilityMode,
        tintColor,
        disableTransparentOnScrollEdge
    ]);
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_standardnavigation.IsWithinNativeNavigator, {
        value: true,
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(NativeTabsNavigatorWithContext, {
            ...props,
            children: triggerChildren,
            nonTriggerChildren: nonTriggerChildren,
            tabConfigurationKey: tabConfigurationKey,
            screenOptions: screenOptions,
            // Passed to TabRouter
            backBehavior: backBehavior
        })
    });
}

//# sourceMappingURL=NativeBottomTabsNavigator.js.map
