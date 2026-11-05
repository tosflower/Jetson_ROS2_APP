'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    useBuildAction: null,
    useBuildHref: null,
    useLinkBuilder: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get useBuildAction () {
        return useBuildAction;
    },
    get useBuildHref () {
        return useBuildHref;
    },
    get useLinkBuilder () {
        return useLinkBuilder;
    }
});
function _react() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
const _core = require("../core");
const _useNavigationState = require("../core/useNavigationState");
const _LinkingContext = require("./LinkingContext");
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
function useBuildHref() {
    const navigation = (0, _react().use)(_core.NavigationHelpersContext);
    const route = (0, _react().use)(_core.NavigationRouteContext);
    const navigatorState = (0, _react().use)(_useNavigationState.NavigatorStateContext);
    const { options } = (0, _react().use)(_LinkingContext.LinkingContext);
    const focusedRouteState = (0, _core.useStateForPath)();
    const getPathFromStateHelper = options?.getPathFromState ?? _core.getPathFromState;
    const buildHref = _react().useCallback((name, params)=>{
        // Check that we're inside:
        // - navigator's context
        // - route context of the navigator (could be a screen, tab, etc.)
        // - route matches the state for path (from the screen's context)
        // This ensures that we're inside a screen
        const isScreen = navigation && route?.key && focusedRouteState ? route.key === (0, _core.findFocusedRoute)(focusedRouteState)?.key && navigatorState?.routes.some((r)=>r.key === route.key) : false;
        const stateForRoute = {
            routes: [
                {
                    name,
                    params
                }
            ]
        };
        const constructState = (state)=>{
            if (state) {
                const route = state.routes[0];
                // If we're inside a screen and at the innermost route
                // We need to replace the state with the provided one
                // This assumes that we're navigating to a sibling route
                if (isScreen && !route.state) {
                    return stateForRoute;
                }
                // Otherwise, dive into the nested state of the route
                return {
                    routes: [
                        {
                            ...route,
                            state: constructState(route.state)
                        }
                    ]
                };
            }
            // Once there is no more nested state, we're at the innermost route
            // We can add a state based on provided parameters
            // This assumes that we're navigating to a child of this route
            // In this case, the helper is used in a navigator for its routes
            return stateForRoute;
        };
        const state = constructState(focusedRouteState);
        const path = getPathFromStateHelper(state, options?.config);
        return path;
    }, [
        options?.config,
        route?.key,
        navigation,
        navigatorState,
        focusedRouteState,
        getPathFromStateHelper
    ]);
    return buildHref;
}
const useBuildAction = ()=>{
    const { options } = (0, _react().use)(_LinkingContext.LinkingContext);
    const getStateFromPathHelper = options?.getStateFromPath ?? _core.getStateFromPath;
    const buildAction = _react().useCallback((href)=>{
        if (!href.startsWith('/')) {
            throw new Error(`The href must start with '/' (${href}).`);
        }
        const state = getStateFromPathHelper(href, options?.config);
        if (state) {
            const normalizedConfig = options?.config ? createNormalizedConfigItem(options.config) : undefined;
            const routes = state.index != null ? state.routes.slice(0, state.index + 1) : state.routes;
            // TODO(@ubax): add dispatch-level coverage for tabs, drawers, custom parsers, and the
            // partial-state RESET fallback before relying on this conversion for every navigator.
            if (routes.length !== 1 && !(routes.length === 2 && routes[0].name === normalizedConfig?.initialRouteName)) {
                return {
                    type: 'RESET',
                    payload: markState(state)
                };
            }
            const route = routes[routes.length - 1];
            if (!route) {
                throw new Error('Failed to parse the href to a navigation state.');
            }
            return {
                type: 'NAVIGATE',
                payload: {
                    name: route.name,
                    ...route.params !== undefined ? {
                        params: route.params
                    } : undefined,
                    ...route.path !== undefined ? {
                        path: route.path
                    } : undefined,
                    ...route.state !== undefined ? {
                        state: markState(route.state)
                    } : undefined,
                    ...route.state !== undefined || hasNestedScreens(options?.config, route.name) ? {
                        pop: true
                    } : undefined
                }
            };
        } else {
            throw new Error('Failed to parse the href to a navigation state.');
        }
    }, [
        options?.config,
        getStateFromPathHelper
    ]);
    return buildAction;
};
function markState(state) {
    return {
        ...state,
        __internal__routerActionState: true
    };
}
function hasNestedScreens(config, routeName) {
    const routeConfig = config?.screens?.[routeName];
    return typeof routeConfig === 'object' && routeConfig.screens !== undefined && Object.keys(routeConfig.screens).length > 0;
}
function createNormalizedConfigItem(config) {
    return typeof config === 'object' && config !== null ? {
        initialRouteName: config.initialRouteName,
        screens: config.screens ? createNormalizedConfigs(config.screens) : undefined
    } : {};
}
function createNormalizedConfigs(configs) {
    return Object.fromEntries(Object.entries(configs).map(([name, config])=>[
            name,
            createNormalizedConfigItem(typeof config === 'string' || typeof config === 'object' && config !== null ? config : '')
        ]));
}
function useLinkBuilder() {
    const buildHref = useBuildHref();
    const buildAction = useBuildAction();
    return {
        buildHref,
        buildAction
    };
}

//# sourceMappingURL=useLinkBuilder.js.map
