"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    appendBaseUrl: null,
    getPathDataFromState: null,
    getPathFromState: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get appendBaseUrl () {
        return appendBaseUrl;
    },
    get getPathDataFromState () {
        return getPathDataFromState;
    },
    get getPathFromState () {
        return getPathFromState;
    }
});
const _navigationParams = require("../navigationParams");
const _queryParams = require("../utils/queryParams");
const _getPathFromStateforks = /*#__PURE__*/ _interop_require_wildcard(require("./getPathFromState-forks"));
const _validatePathConfig = require("./validatePathConfig");
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
const getActiveRoute = (state)=>{
    const route = state.index != null ? state.routes[state.index] : state.routes[state.routes.length - 1];
    if (route.state) {
        return getActiveRoute(route.state);
    }
    return route;
};
let cachedNormalizedConfigs = [
    undefined,
    {}
];
function getPathFromState(state, options) {
    return getPathDataFromState(state, options).path;
}
function getPathDataFromState(state, options) {
    if (state == null) {
        throw Error("Got 'undefined' for the navigation state. You must pass a valid state object.");
    }
    if (options) {
        (0, _validatePathConfig.validatePathConfig)(options);
    }
    // Create a normalized configs object which will be easier to use
    if (cachedNormalizedConfigs[0] !== options?.screens) {
        cachedNormalizedConfigs = [
            options?.screens,
            options?.screens ? createNormalizedConfigs(options.screens) : {}
        ];
    }
    const configs = cachedNormalizedConfigs[1];
    let path = '/';
    let current = state;
    const allParams = {};
    while(current){
        let index = typeof current.index === 'number' ? current.index : 0;
        let route = current.routes[index];
        let pattern;
        let focusedParams;
        const focusedRoute = getActiveRoute(state);
        let currentOptions = configs;
        // Keep all the route names that appeared during going deeper in config in case the pattern is resolved to undefined
        const nestedRouteNames = [];
        let hasNext = true;
        while(route.name in currentOptions && hasNext){
            pattern = currentOptions[route.name].pattern;
            nestedRouteNames.push(route.name);
            if (route.params) {
                const stringify = currentOptions[route.name]?.stringify;
                // This mutates allParams
                const currentParams = _getPathFromStateforks.fixCurrentParams(allParams, route, stringify);
                if (focusedRoute === route) {
                    // If this is the focused route, keep the params for later use
                    // We save it here since it's been stringified already
                    focusedParams = {
                        ...currentParams
                    };
                    pattern?.split('/').filter((p)=>_getPathFromStateforks.isDynamicPart(p)).forEach((p)=>{
                        const name = _getPathFromStateforks.getParamName(p);
                        // Remove the params present in the pattern since we'll only use the rest for query string
                        if (focusedParams) {
                            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                            delete focusedParams[name];
                        }
                    });
                }
            }
            // If there is no `screens` property or no nested state, we return pattern
            if (!currentOptions[route.name].screens || route.state === undefined) {
                hasNext = false;
            } else {
                index = route.state.index != null ? route.state.index : route.state.routes.length - 1;
                const nextRoute = route.state.routes[index];
                const nestedConfig = currentOptions[route.name].screens;
                // if there is config for next route name, we go deeper
                if (nestedConfig && nextRoute.name in nestedConfig) {
                    route = nextRoute;
                    currentOptions = nestedConfig;
                } else {
                    // If not, there is no sense in going deeper in config
                    hasNext = false;
                }
            }
        }
        if (pattern === undefined) {
            pattern = nestedRouteNames.join('/');
        }
        if (currentOptions[route.name] !== undefined) {
            path += _getPathFromStateforks.getPathWithConventionsCollapsed({
                ...options,
                pattern,
                route,
                params: allParams,
                initialRouteName: configs[route.name]?.initialRouteName
            });
        } else if (!route.name.startsWith('+')) {
            path += encodeURIComponent(route.name);
        }
        if (!focusedParams) {
            focusedParams = focusedRoute.params ? {
                ...focusedRoute.params
            } : undefined;
        }
        if (route.state) {
            path += '/';
        } else if (focusedParams) {
            for(const param in focusedParams){
                if (focusedParams[param] === 'undefined') {
                    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                    delete focusedParams[param];
                }
            }
            delete focusedParams['#'];
            focusedParams = (0, _navigationParams.removeInternalExpoRouterParams)(focusedParams);
            const query = (0, _queryParams.stringifySearchParams)(focusedParams);
            if (query) {
                path += `?${query}`;
            }
        }
        current = route.state;
    }
    // Remove multiple as well as trailing slashes
    path = path.replace(/\/+/g, '/');
    path = path.length > 1 ? path.replace(/\/$/, '') : path;
    // Include the root path if specified
    if (options?.path) {
        path = joinPaths(options.path, path);
    }
    path = _getPathFromStateforks.appendBaseUrl(path);
    if (allParams['#']) {
        path += `#${allParams['#']}`;
    }
    return {
        path,
        params: allParams
    };
}
const joinPaths = (...paths)=>[].concat(...paths.map((p)=>p.split('/'))).filter(Boolean).join('/');
const createConfigItem = (config, parentPattern)=>{
    if (typeof config === 'string') {
        // If a string is specified as the value of the key(e.g. Foo: '/path'), use it as the pattern
        const pattern = parentPattern ? joinPaths(parentPattern, config) : config;
        return {
            pattern
        };
    }
    if (config.exact && config.path === undefined) {
        throw new Error("A 'path' needs to be specified when specifying 'exact: true'. If you don't want this screen in the URL, specify it as empty string, e.g. `path: ''`.");
    }
    // If an object is specified as the value (e.g. Foo: { ... }),
    // It can have `path` property and `screens` prop which has nested configs
    const pattern = config.exact !== true ? joinPaths(parentPattern || '', config.path || '') : config.path || '';
    const screens = config.screens ? createNormalizedConfigs(config.screens, pattern) : undefined;
    return {
        // Normalize pattern to remove any leading, trailing slashes, duplicate slashes etc.
        pattern: pattern?.split('/').filter(Boolean).join('/'),
        stringify: config.stringify,
        screens
    };
};
const createNormalizedConfigs = (options, pattern)=>Object.fromEntries(Object.entries(options).map(([name, c])=>{
        const result = createConfigItem(c, pattern);
        return [
            name,
            result
        ];
    }));
function appendBaseUrl(path, baseUrl = process.env.EXPO_BASE_URL) {
    if (process.env.NODE_ENV !== 'development') {
        if (baseUrl) {
            return `/${baseUrl.replace(/^\/+/, '').replace(/\/$/, '')}${path}`;
        }
    }
    return path;
}

//# sourceMappingURL=getPathFromState.js.map
