'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useDescriptors", {
    enumerable: true,
    get: function() {
        return useDescriptors;
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
const _NavigationActivityContext = require("../../views/NavigationActivityContext");
const _NavigationBuilderContext = require("./NavigationBuilderContext");
const _NavigationProvider = require("./NavigationProvider");
const _SceneView = require("./SceneView");
const _ThemeContext = require("./theming/ThemeContext");
const _useNavigationCache = require("./useNavigationCache");
const _useRouteCache = require("./useRouteCache");
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
function useDescriptors({ routes, routeNames, screens, activityEnabled, activityDefaultThreshold, navigation, screenOptions, screenLayout, state, addListener, router, emitter }) {
    const theme = (0, _react().use)(_ThemeContext.ThemeContext);
    const [options, setOptions] = _react().useState({});
    const { handleAction, resetNavigator } = (0, _react().use)(_NavigationBuilderContext.NavigationBuilderContext);
    const context = _react().useMemo(()=>({
            navigation,
            handleAction,
            resetNavigator,
            addListener
        }), [
        navigation,
        handleAction,
        resetNavigator,
        addListener
    ]);
    const getNavigation = (0, _useNavigationCache.useNavigationCache)({
        routes,
        routeNames,
        navigation,
        setOptions,
        router,
        // The same runtime emitter handles custom events; this generic only exposes core events here.
        emitter: emitter
    });
    const cachedRoutes = (0, _useRouteCache.useRouteCache)(routes);
    const emitRemovalEvent = _react().useCallback((routeKey, type, action)=>emitter.emit({
            type,
            target: routeKey,
            data: {
                action
            }
        }), [
        emitter
    ]);
    const getOptions = (route, navigation, overrides)=>{
        const config = screens[route.name];
        const screen = config.props;
        const optionsList = [
            // The default `screenOptions` passed to the navigator
            screenOptions,
            // The `screenOptions` props passed to `Group` elements
            ...config.options ? config.options.filter(Boolean) : [],
            // The `options` prop passed to `Screen` elements,
            screen.options,
            // The options set via `navigation.setOptions`
            overrides
        ];
        return optionsList.reduce((acc, curr)=>Object.assign(acc, // @ts-expect-error: we check for function but TS still complains
            typeof curr !== 'function' ? curr : curr({
                route,
                navigation,
                theme
            })), {});
    };
    const render = (route, navigation, customOptions, routeState)=>{
        const config = screens[route.name];
        const screen = config.props;
        const clearOptions = ()=>setOptions((o)=>{
                if (route.key in o) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { [route.key]: _, ...rest } = o;
                    return rest;
                }
                return o;
            });
        const layout = // The `layout` prop passed to `Screen` elements,
        screen.layout ?? // The `screenLayout` props passed to `Group` elements
        config.layout ?? // The default `screenLayout` passed to the navigator
        screenLayout;
        let element = /*#__PURE__*/ (0, _jsxruntime().jsx)(_SceneView.SceneView, {
            navigation: navigation,
            route: route,
            screen: screen,
            routeState: routeState,
            options: customOptions,
            clearOptions: clearOptions,
            emitRemovalEvent: emitRemovalEvent
        });
        if (layout != null) {
            element = layout({
                route,
                navigation,
                options: customOptions,
                // @ts-expect-error: in practice `theme` will be defined
                theme,
                children: element
            });
        }
        const activityThreshold = getActivityThreshold(screen.activityEnabled ?? activityEnabled, activityDefaultThreshold);
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(_NavigationActivityContext.NavigationActivityProvider, {
            activityThreshold: activityThreshold,
            children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_NavigationBuilderContext.NavigationBuilderContext.Provider, {
                value: context,
                children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_NavigationProvider.NavigationProvider, {
                    route: route,
                    navigation: navigation,
                    children: element
                })
            })
        }, route.key);
    };
    const descriptors = cachedRoutes.reduce((acc, route, i)=>{
        const navigation = getNavigation(route, route.isPreloaded === true);
        if (screens[route.name] === undefined) {
            acc[route.key] = {
                route,
                // @ts-expect-error: it's missing action helpers, fix later
                navigation,
                options: {},
                render: ()=>null
            };
            return acc;
        }
        const customOptions = getOptions(route, navigation, options[route.key]);
        const element = render(route, navigation, customOptions, routes[i].state);
        acc[route.key] = {
            route,
            // @ts-expect-error: it's missing action helpers, fix later
            navigation,
            render () {
                return element;
            },
            options: customOptions,
            routeSource: screens[route.name]?.props.routeSource
        };
        return acc;
    }, {});
    // Placeholder descriptors need a cast because `useNavigationCache` adds action helpers at
    // runtime, but its return type omits them.
    // TODO: Fix the `useNavigationCache` return type and remove these casts.
    // TODO: Stabilize screens, options, descriptors, and `describe` without relying on React Compiler.
    const describe = (route)=>{
        if (route.key !== undefined) {
            const descriptor = descriptors[route.key];
            if (!descriptor) {
                throw new Error(`Couldn't find a route with the key ${route.key}.`);
            }
            return descriptor;
        }
        const config = screens[route.name];
        if (!config) {
            return {
                route,
                navigation: getNavigation({
                    key: route.name,
                    name: route.name
                }, false),
                options: {},
                render: ()=>null
            };
        }
        const navigation = getNavigation({
            key: route.name,
            name: route.name
        }, false);
        return {
            route,
            navigation,
            options: getOptions(route, navigation, {}),
            render: ()=>null,
            routeSource: config.props.routeSource
        };
    };
    return {
        describe,
        descriptors
    };
}
function getActivityThreshold(activityEnabled, defaultThreshold) {
    if (typeof activityEnabled === 'number') {
        if (Number.isNaN(activityEnabled) || activityEnabled <= 0) {
            if (__DEV__) {
                console.warn(`activityEnabled must be a positive number. Received ${activityEnabled}; disabling React Activity.`);
            }
            return undefined;
        }
        return activityEnabled;
    }
    if (activityEnabled) {
        return Math.max(1, defaultThreshold);
    }
    return undefined;
}

//# sourceMappingURL=useDescriptors.js.map
