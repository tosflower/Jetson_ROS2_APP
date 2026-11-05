"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getStateFromPath", {
    enumerable: true,
    get: function() {
        return getStateFromPath;
    }
});
const _constants = require("../constants");
const _escapeStringRegexp = require("../utils/escapeStringRegexp");
const _findFocusedRoute = require("./findFocusedRoute");
const _getStateFromPathforks = /*#__PURE__*/ _interop_require_wildcard(require("./getStateFromPath-forks"));
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
function getStateFromPath(path, options, segments = []) {
    const { initialRoutes, configs, configWithRegexes } = getConfigResources(options, segments);
    const screens = options?.screens;
    const expoPath = _getStateFromPathforks.getUrlWithReactNavigationConcessions(path);
    let remaining = _getStateFromPathforks.cleanPath(expoPath.nonstandardPathname);
    const prefix = options?.path?.replace(/^\//, ''); // Remove extra leading slash
    if (prefix) {
        // Make sure there is a trailing slash
        const normalizedPrefix = prefix.endsWith('/') ? prefix : `${prefix}/`;
        // If the path doesn't start with the prefix, it's not a match
        if (!remaining.startsWith(normalizedPrefix)) {
            return undefined;
        }
        // Remove the prefix from the path
        remaining = remaining.replace(normalizedPrefix, '');
    }
    if (screens === undefined) {
        // When no config is specified, use the path segments as route names
        const routes = remaining.split('/').filter(Boolean).map((segment)=>{
            const name = decodeURIComponent(segment);
            return {
                name
            };
        });
        if (routes.length) {
            return createNestedStateObject(expoPath, routes, initialRoutes, [], expoPath.hash);
        }
        return undefined;
    }
    if (remaining === '/') {
        // We need to add special handling of empty path so navigation to empty path also works
        // When handling empty path, we should only look at the root level config
        const match = _getStateFromPathforks.matchForEmptyPath(configWithRegexes);
        if (match) {
            return createNestedStateObject(expoPath, match.routeNames.map((name)=>({
                    name
                })), initialRoutes, configs, expoPath.hash);
        }
        return undefined;
    }
    let result;
    let current;
    // We match the whole path against the regex instead of segments
    // This makes sure matches such as wildcard will catch any unmatched routes, even if nested
    const { routes, remainingPath } = matchAgainstConfigs(remaining, configWithRegexes);
    if (routes !== undefined) {
        // This will always be empty if full path matched
        current = createNestedStateObject(expoPath, routes, initialRoutes, configs, expoPath.hash);
        remaining = remainingPath;
        result = current;
    }
    if (current == null || result == null) {
        return undefined;
    }
    return result;
}
/**
 * Reference to the most recently computed config resources.
 */ let cachedConfigResources = [
    undefined,
    prepareConfigResources()
];
function getConfigResources(options, previousSegments) {
    // Recompute every time because config resources depend on the current state.
    cachedConfigResources = [
        options,
        prepareConfigResources(options, previousSegments)
    ];
    return cachedConfigResources[1];
}
function prepareConfigResources(options, previousSegments) {
    if (options) {
        (0, _validatePathConfig.validatePathConfig)(options);
    }
    const initialRoutes = getInitialRoutes(options);
    const configs = getNormalizedConfigs(initialRoutes, options?.screens, previousSegments);
    checkForDuplicatedConfigs(configs);
    const configWithRegexes = getConfigsWithRegexes(configs);
    return {
        initialRoutes,
        configs,
        configWithRegexes
    };
}
function getInitialRoutes(options) {
    const initialRoutes = [];
    if (options?.initialRouteName) {
        initialRoutes.push({
            initialRouteName: options.initialRouteName,
            parentScreens: []
        });
    }
    return initialRoutes;
}
function getNormalizedConfigs(initialRoutes, screens = {}, previousSegments) {
    // Create a normalized configs array which will be easier to use
    return [].concat(...Object.keys(screens).map((key)=>createNormalizedConfigs(key, screens, [], initialRoutes, []))).map(_getStateFromPathforks.appendIsInitial(initialRoutes)).sort(_getStateFromPathforks.getRouteConfigSorter(previousSegments));
}
function checkForDuplicatedConfigs(configs) {
    // Check for duplicate patterns in the config
    configs.reduce((acc, config)=>{
        if (acc[config.pattern]) {
            const a = acc[config.pattern].routeNames;
            const b = config.routeNames;
            // It's not a problem if the path string omitted from a inner most screen
            // For example, it's ok if a path resolves to `A > B > C` or `A > B`
            const intersects = a.length > b.length ? b.every((it, i)=>a[i] === it) : a.every((it, i)=>b[i] === it);
            if (!intersects) {
                throw new Error(`Found conflicting screens with the same pattern. The pattern '${config.pattern}' resolves to both '${a.join(' > ')}' and '${b.join(' > ')}'. Patterns must be unique and cannot resolve to more than one screen.`);
            }
        }
        return Object.assign(acc, {
            [config.pattern]: config
        });
    }, {});
}
function getConfigsWithRegexes(configs) {
    return configs.map((c)=>({
            ...c,
            // Add `$` to the regex to make sure it matches till end of the path and not just beginning
            regex: _getStateFromPathforks.configRegExp(c)
        }));
}
const joinPaths = (...paths)=>[].concat(...paths.map((p)=>p.split('/'))).filter(Boolean).join('/');
const matchAgainstConfigs = (remaining, configs)=>{
    let routes;
    let remainingPath = remaining;
    const allParams = Object.create(null);
    // Go through all configs, and see if the next path segment matches our regex
    for (const config of configs){
        if (!config.regex) {
            continue;
        }
        const match = remainingPath.match(config.regex);
        // If our regex matches, we need to extract params from the path
        if (match) {
            const matchResult = config.pattern?.split('/').reduce((acc, p, index)=>{
                if (!_getStateFromPathforks.isDynamicPart(p)) {
                    return acc;
                }
                acc.pos += 1;
                const decodedParamSegment = _getStateFromPathforks.safelyDecodeURIComponent(// The param segments appear every second item starting from 2 in the regex match result
                match[(acc.pos + 1) * 2].replace(/\/$/, ''));
                Object.assign(acc.matchedParams, {
                    [p]: Object.assign(acc.matchedParams[p] || {}, {
                        [index]: decodedParamSegment
                    })
                });
                return acc;
            }, {
                pos: -1,
                matchedParams: {}
            });
            const matchedParams = matchResult.matchedParams || {};
            routes = config.routeNames.map((name)=>{
                const routeConfig = configs.find((c)=>{
                    // Check matching name AND pattern in case same screen is used at different levels in config
                    return c.screen === name && config.pattern.startsWith(c.pattern);
                });
                // Normalize pattern to remove any leading, trailing slashes, duplicate slashes etc.
                const normalizedPath = routeConfig?.path.split('/').filter(Boolean).join('/');
                // Get the number of segments in the initial pattern
                const numInitialSegments = routeConfig?.pattern.replace(new RegExp(`${(0, _escapeStringRegexp.escapeStringRegexp)(normalizedPath)}$`), '')?.split('/').length;
                const params = normalizedPath?.split('/').reduce((acc, p, index)=>{
                    if (!_getStateFromPathforks.isDynamicPart(p)) {
                        return acc;
                    }
                    // Get the real index of the path parameter in the matched path
                    // by offsetting by the number of segments in the initial pattern
                    const offset = numInitialSegments ? numInitialSegments - 1 : 0;
                    // TODO(@kitten): Assess which is intended, non-optional or getParamValue accepting undefined
                    const value = _getStateFromPathforks.getParamValue(p, matchedParams[p]?.[index + offset]);
                    if (value) {
                        const key = _getStateFromPathforks.replacePart(p);
                        acc[key] = routeConfig?.parse?.[key] ? routeConfig.parse[key](value) : value;
                    }
                    return acc;
                }, {});
                if (params && Object.keys(params).length) {
                    Object.assign(allParams, params);
                    return {
                        name,
                        params
                    };
                }
                return {
                    name
                };
            });
            remainingPath = remainingPath.replace(match[1], '');
            break;
        }
    }
    _getStateFromPathforks.populateParams(routes, allParams);
    return {
        routes,
        remainingPath
    };
};
const createNormalizedConfigs = (screen, routeConfig, routeNames = [], initials, parentScreens, parentPattern)=>{
    const configs = [];
    routeNames.push(screen);
    parentScreens.push(screen);
    // @ts-expect-error: TODO(@kitten): This is entirely untyped. The index access just flags this, but we're not typing the config properly here
    const config = routeConfig[screen];
    if (typeof config === 'string') {
        // If a string is specified as the value of the key(e.g. Foo: '/path'), use it as the pattern
        const pattern = parentPattern ? joinPaths(parentPattern, config) : config;
        configs.push(createConfigItem(screen, routeNames, pattern, config));
    } else if (typeof config === 'object') {
        let pattern;
        // if an object is specified as the value (e.g. Foo: { ... }),
        // it can have `path` property and
        // it could have `screens` prop which has nested configs
        if (typeof config.path === 'string') {
            if (config.exact && config.path === undefined) {
                throw new Error("A 'path' needs to be specified when specifying 'exact: true'. If you don't want this screen in the URL, specify it as empty string, e.g. `path: ''`.");
            }
            pattern = config.exact !== true ? joinPaths(parentPattern || '', config.path || '') : config.path || '';
            if (screen !== _constants.INTERNAL_SLOT_NAME) {
                configs.push(createConfigItem(screen, routeNames, pattern, config.path, config.parse, config));
            }
        }
        if (config.screens) {
            // property `initialRouteName` without `screens` has no purpose
            if (config.initialRouteName) {
                initials.push({
                    initialRouteName: config.initialRouteName,
                    parentScreens
                });
            }
            Object.keys(config.screens).forEach((nestedConfig)=>{
                const result = createNormalizedConfigs(nestedConfig, config.screens, routeNames, initials, [
                    ...parentScreens
                ], pattern ?? parentPattern);
                configs.push(...result);
            });
        }
    }
    routeNames.pop();
    return configs;
};
const createConfigItem = (screen, routeNames, pattern, path, parse = undefined, config = {})=>{
    // Normalize pattern to remove any leading, trailing slashes, duplicate slashes etc.
    pattern = pattern.split('/').filter(Boolean).join('/');
    const regex = pattern ? _getStateFromPathforks.routePatternToRegex(pattern) : undefined;
    return {
        screen,
        regex,
        pattern,
        path,
        // The routeNames array is mutated, so copy it to keep the current state
        routeNames: [
            ...routeNames
        ],
        parse,
        ..._getStateFromPathforks.createConfig(screen, pattern, routeNames, config)
    };
};
const findParseConfigForRoute = (routeName, flatConfig)=>{
    for (const config of flatConfig){
        if (routeName === config.routeNames[config.routeNames.length - 1]) {
            return config.parse;
        }
    }
    return undefined;
};
// Try to find an initial route connected with the one passed
const findInitialRoute = (routeName, parentScreens, initialRoutes)=>{
    for (const config of initialRoutes){
        if (parentScreens.length === config.parentScreens.length) {
            let sameParents = true;
            for(let i = 0; i < parentScreens.length; i++){
                if (parentScreens[i].localeCompare(config.parentScreens[i]) !== 0) {
                    sameParents = false;
                    break;
                }
            }
            if (sameParents) {
                return routeName !== config.initialRouteName ? config.initialRouteName : undefined;
            }
        }
    }
    return undefined;
};
// returns state object with values depending on whether
// it is the end of state and if there is initialRoute for this level
const createStateObject = (initialRoute, route, isEmpty)=>{
    if (isEmpty) {
        if (initialRoute) {
            return {
                index: 1,
                routes: [
                    {
                        name: initialRoute,
                        params: route.params
                    },
                    route
                ]
            };
        } else {
            return {
                routes: [
                    route
                ]
            };
        }
    } else {
        if (initialRoute) {
            return {
                index: 1,
                routes: [
                    {
                        name: initialRoute,
                        params: route.params
                    },
                    {
                        ...route,
                        state: {
                            routes: []
                        }
                    }
                ]
            };
        } else {
            return {
                routes: [
                    {
                        ...route,
                        state: {
                            routes: []
                        }
                    }
                ]
            };
        }
    }
};
const createNestedStateObject = ({ path, ...expoURL }, routes, initialRoutes, flatConfig, hash)=>{
    let route = routes.shift();
    const parentScreens = [];
    let initialRoute = findInitialRoute(route.name, parentScreens, initialRoutes);
    parentScreens.push(route.name);
    const state = createStateObject(initialRoute, route, routes.length === 0);
    if (routes.length > 0) {
        let nestedState = state;
        while(route = routes.shift()){
            initialRoute = findInitialRoute(route.name, parentScreens, initialRoutes);
            const nestedStateIndex = nestedState.index ?? nestedState.routes.length - 1;
            nestedState.routes[nestedStateIndex].state = createStateObject(initialRoute, route, routes.length === 0);
            if (routes.length > 0) {
                nestedState = nestedState.routes[nestedStateIndex].state;
            }
            parentScreens.push(route.name);
        }
    }
    route = (0, _findFocusedRoute.findFocusedRoute)(state);
    route.path = expoURL.pathWithoutGroups;
    const params = _getStateFromPathforks.parseQueryParams(path, route, flatConfig ? findParseConfigForRoute(route.name, flatConfig) : undefined, hash);
    if (params) {
        route.params = {
            ...route.params,
            ...params
        };
    }
    return state;
};

//# sourceMappingURL=getStateFromPath.js.map
