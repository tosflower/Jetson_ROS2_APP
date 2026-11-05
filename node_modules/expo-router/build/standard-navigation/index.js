'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    IsWithinNativeNavigator: null,
    createStandardRouterNavigator: null,
    integrateWithRouter: null,
    unstable_createStandardRouterNavigator: null,
    unstable_integrateWithRouter: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get IsWithinNativeNavigator () {
        return _IsWithinNativeNavigator.IsWithinNativeNavigator;
    },
    get createStandardRouterNavigator () {
        return createStandardRouterNavigator;
    },
    get integrateWithRouter () {
        return integrateWithRouter;
    },
    get unstable_createStandardRouterNavigator () {
        return unstable_createStandardRouterNavigator;
    },
    get unstable_integrateWithRouter () {
        return unstable_integrateWithRouter;
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
    const data = require("react");
    _react = function() {
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
const _Route = require("../Route");
const _removalPrevention = require("../global-state/removalPrevention");
const _withLayoutContext = require("../layouts/withLayoutContext");
const _native = require("../react-navigation/native");
const _routeNode = require("../routeNode");
const _useStandardActions = require("./useStandardActions");
const _useStandardEmitter = require("./useStandardEmitter");
const _useStandardState = require("./useStandardState");
const _IsWithinNativeNavigator = require("./IsWithinNativeNavigator");
const SUPPORTED_VERSION = 1;
const STANDARD_NAVIGATOR_TYPE = 'standard';
function createStandardRouterNavigator(NavigatorContent, router, ...options) {
    const navigator = (0, _standardnavigation().createStandardNavigator)(NavigatorContent);
    return integrateWithRouter(navigator, router, ...options);
}
function integrateWithRouter(navigator, router, ...[options]) {
    assertStandardNavigator(navigator);
    const { NavigatorContent } = navigator;
    function StandardRouterNavigator(allProps) {
        const { unstable_screenErrorBoundary, ...rest } = allProps;
        const props = rest;
        const routeNode = (0, _Route.useRouteNode)();
        const { extraProps, useNavigationBuilderProps } = partitionNavigatorProps(props, (0, _routeNode.getValidInitialRouteName)(routeNode));
        const { state, navigation, describe, descriptors, NavigationContent } = (0, _native.useNavigationBuilder)(router, useNavigationBuilderProps, {
            activityDefaultThreshold: options?.activityDefaultThreshold
        });
        const { dispatch, dispatchSync } = navigation;
        const routesWithRemovalPrevented = (0, _removalPrevention.useRoutesWithRemovalPrevented)();
        const processedDescriptors = (0, _react().useMemo)(()=>options?.processDescriptors?.(descriptors, state, describe) ?? descriptors, [
            state,
            descriptors,
            describe,
            options
        ]);
        const processedState = (0, _react().useMemo)(()=>options?.processState?.(state, processedDescriptors, describe) ?? state, [
            state,
            processedDescriptors,
            describe,
            options
        ]);
        const derivedProps = (0, _react().useMemo)(()=>options?.createProps?.({
                state: processedState,
                dispatch,
                dispatchSync,
                navigation,
                isPreloaded: (key)=>processedState.routes.find((route)=>route.key === key)?.isPreloaded === true,
                isRemovalPrevented: (key)=>routesWithRemovalPrevented.has(key)
            }) ?? {}, [
            processedState,
            dispatch,
            dispatchSync,
            navigation,
            options,
            routesWithRemovalPrevented
        ]);
        const standardArgs = {
            state: (0, _useStandardState.useStandardState)(processedState),
            descriptors: processedDescriptors,
            actions: (0, _useStandardActions.useStandardActions)(navigation, state.key),
            emitter: (0, _useStandardEmitter.useStandardEmitter)(navigation)
        };
        const content = /*#__PURE__*/ (0, _jsxruntime().jsx)(NavigationContent, {
            children: /*#__PURE__*/ (0, _jsxruntime().jsx)(NavigatorContent, {
                ...extraProps,
                ...derivedProps,
                ...standardArgs
            })
        });
        return unstable_screenErrorBoundary ? /*#__PURE__*/ (0, _jsxruntime().jsx)(_Route.ScreenErrorBoundaryContext, {
            value: unstable_screenErrorBoundary,
            children: content
        }) : content;
    }
    return (0, _withLayoutContext.withLayoutContext)(StandardRouterNavigator, options?.processScreens);
}
const unstable_createStandardRouterNavigator = createStandardRouterNavigator;
const unstable_integrateWithRouter = integrateWithRouter;
/**
 * Partitions a navigator's props into the subset consumed by `useNavigationBuilder`
 * (`useNavigationBuilderProps`) and everything else (`extraProps`, forwarded to `NavigatorContent`).
 */ function partitionNavigatorProps(props, routeNodeInitialRouteName) {
    const { id, children, activityEnabled, initialRouteName: _initialRouteName, layout, // `ref` is supplied by `withLayoutContext` and consumed by React; it must not be forwarded
    // to `NavigatorContent`, so it is pulled out of the props here and intentionally dropped.
    ref, screenLayout, screenListeners, screenOptions, UNSTABLE_router, ...extraProps } = props;
    // The builder-specific keys are explicitly destructured so they cannot leak into `extraProps`.
    // Re-listing them as a pure object literal typed as `StandardUseNavigationBuilderOptions` also makes
    // the partition type-checked: a key that is not a valid builder option is rejected by excess-property
    // checking, and a missing required builder option is rejected too — both surface as a compile error
    // here instead of silently passing through to the wrong consumer.
    const useNavigationBuilderProps = {
        id,
        children,
        activityEnabled,
        initialRouteName: routeNodeInitialRouteName,
        layout,
        screenLayout,
        screenListeners,
        screenOptions,
        UNSTABLE_router
    };
    return {
        extraProps,
        // Spread `extraProps` first so router-specific options (e.g. `backBehavior`) reach the
        // router, then the framework keys above. `NavigatorContent` still receives `extraProps`.
        useNavigationBuilderProps: {
            ...extraProps,
            ...useNavigationBuilderProps
        }
    };
}
function assertStandardNavigator(navigator) {
    if (navigator == null) {
        throw new Error('Could not integrate a standard navigator because no navigator was provided. ' + 'Pass the object returned by `createStandardNavigator(...)` from the `standard-navigation` package, ' + 'or use `createStandardRouterNavigator(NavigatorContent, router)` which creates it for you.');
    }
    const { type, version } = navigator;
    if (type !== STANDARD_NAVIGATOR_TYPE) {
        throw new Error(`Could not integrate a standard navigator because its \`type\` is ${JSON.stringify(type)}, not "standard". ` + 'This value is likely not a standard-navigation navigator. ' + 'Create it with `createStandardNavigator(...)` from the `standard-navigation` package, ' + 'or use `createStandardRouterNavigator(NavigatorContent, router)`.');
    }
    if (version !== SUPPORTED_VERSION) {
        // This is a warning rather than a hard error on purpose: the standard-navigation contract is
        // versioned by the `standard-navigation` package, not by expo-router, and integration is likely
        // to keep working across adjacent versions. Blocking here would needlessly break those cases.
        // If a mismatch does cause problems, this points at the version skew as the likely cause.
        console.warn(`This standard navigator targets the standard-navigation v${version} contract, ` + `but this version of expo-router was built against v${SUPPORTED_VERSION}. ` + 'Integration may still work, but if you hit unexpected navigation behavior, ' + 'align the installed `standard-navigation` version with your expo-router version, ' + 'or check the standard-navigation release notes for migration steps.');
    }
}

//# sourceMappingURL=index.js.map
