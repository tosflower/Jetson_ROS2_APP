"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    areUrlObjectsEqual: null,
    defaultRouteInfo: null,
    getRouteInfoFromState: null,
    getRouteSegmentsFromState: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get areUrlObjectsEqual () {
        return areUrlObjectsEqual;
    },
    get defaultRouteInfo () {
        return defaultRouteInfo;
    },
    get getRouteInfoFromState () {
        return getRouteInfoFromState;
    },
    get getRouteSegmentsFromState () {
        return getRouteSegmentsFromState;
    }
});
function _reactfastcompare() {
    const data = /*#__PURE__*/ _interop_require_default(require("react-fast-compare"));
    _reactfastcompare = function() {
        return data;
    };
    return data;
}
const _constants = require("../constants");
const _getPathFromStateforks = require("../fork/getPathFromState-forks");
const _navigationParams = require("../navigationParams");
const _isArrayEqual = require("../react-navigation/core/isArrayEqual");
const _url = require("../utils/url");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const defaultRouteInfo = {
    unstable_globalHref: '',
    searchParams: new URLSearchParams(),
    pathname: '/',
    params: {},
    segments: [],
    pathnameWithParams: '/',
    // TODO: Remove this, it is not used anywhere
    isIndex: false
};
function areUrlObjectsEqual(a, b) {
    return a.pathname === b.pathname && a.pathnameWithParams === b.pathnameWithParams && a.unstable_globalHref === b.unstable_globalHref && (0, _isArrayEqual.isArrayEqual)(a.segments, b.segments) && (0, _reactfastcompare().default)(a.params, b.params);
}
function getRouteInfoFromState(state) {
    if (!state) return defaultRouteInfo;
    const index = 'index' in state ? state.index ?? 0 : 0;
    const route = state.routes[index];
    (0, _navigationParams.warnIfNestedParams)(route.params);
    if (route.name === _constants.NOT_FOUND_ROUTE_NAME || route.name === _constants.SITEMAP_ROUTE_NAME) {
        const path = route.path || (route.name === _constants.NOT_FOUND_ROUTE_NAME ? '/' : `/${route.name}`);
        return {
            ...defaultRouteInfo,
            unstable_globalHref: (0, _getPathFromStateforks.appendBaseUrl)(path),
            pathname: path,
            pathnameWithParams: path,
            segments: [
                route.name
            ]
        };
    }
    if (route.name !== _constants.INTERNAL_SLOT_NAME) {
        throw new Error(`Expected the first route to be ${_constants.INTERNAL_SLOT_NAME}, but got ${route.name}`);
    }
    const { segments, params: mergedParams } = collectRouteState(route.state);
    const params = decodeParams(mergedParams);
    const { pathname, pathParams } = resolvePathname(segments, params);
    const { searchParams, pathnameWithParams } = serializeQueryAndHash(pathname, params, pathParams);
    return {
        segments,
        pathname,
        // Navigation params can contain ordinary object values at runtime despite the public search-param type.
        // TODO: address this together with other params serialization issues
        params: params,
        unstable_globalHref: (0, _getPathFromStateforks.appendBaseUrl)(pathnameWithParams),
        searchParams,
        pathnameWithParams,
        // TODO: Remove this, it is not used anywhere
        isIndex: false
    };
}
function getRouteSegmentsFromState(state) {
    if (!state) return [];
    const index = 'index' in state ? state.index ?? 0 : 0;
    let route = state.routes[index];
    (0, _navigationParams.warnIfNestedParams)(route.params);
    if (route.name === _constants.NOT_FOUND_ROUTE_NAME || route.name === _constants.SITEMAP_ROUTE_NAME) {
        return [
            route.name
        ];
    }
    if (route.name !== _constants.INTERNAL_SLOT_NAME) {
        throw new Error(`Expected the first route to be ${_constants.INTERNAL_SLOT_NAME}, but got ${route.name}`);
    }
    const segments = [];
    state = route.state;
    while(state){
        route = state.routes['index' in state && state.index ? state.index : 0];
        (0, _navigationParams.warnIfNestedParams)(route.params);
        const routeName = route.name.startsWith('/') ? route.name.slice(1) : route.name;
        segments.push(...routeName.split('/'));
        state = route.state;
    }
    if (segments[segments.length - 1] === 'index') {
        segments.pop();
    }
    return segments;
}
function collectRouteState(state) {
    const segments = [];
    const params = Object.create(null);
    while(state){
        const route = state.routes['index' in state && state.index ? state.index : 0];
        (0, _navigationParams.warnIfNestedParams)(route.params);
        Object.assign(params, route.params);
        let routeName = route.name;
        if (routeName.startsWith('/')) {
            routeName = routeName.slice(1);
        }
        segments.push(...routeName.split('/'));
        state = route.state;
    }
    if (segments[segments.length - 1] === 'index') {
        segments.pop();
    }
    return {
        segments,
        params
    };
}
function decodeParams(params) {
    return Object.fromEntries(Object.entries(params).map(([key, value])=>{
        if (typeof value === 'string') {
            return [
                key,
                (0, _url.safeDecodeURIComponent)(value)
            ];
        } else if (Array.isArray(value)) {
            return [
                key,
                value.map((v)=>typeof v === 'string' ? (0, _url.safeDecodeURIComponent)(v) : v)
            ];
        } else {
            return [
                key,
                value
            ];
        }
    }));
}
function resolvePathname(segments, params) {
    const resolvedSegments = segments.filter((segment)=>!(segment.startsWith('(') && segment.endsWith(')'))).map((segment)=>{
        if (segment === '+not-found') {
            const notFoundPath = params['not-found'];
            if (typeof notFoundPath === 'undefined') {
                // Not founds are optional, do nothing if its not present
                return {
                    parts: [],
                    paramName: 'not-found'
                };
            } else if (Array.isArray(notFoundPath)) {
                return {
                    parts: notFoundPath.map(String),
                    paramName: 'not-found'
                };
            } else {
                return {
                    parts: [
                        String(notFoundPath)
                    ],
                    paramName: 'not-found'
                };
            }
        } else if (segment.startsWith('[...') && segment.endsWith(']')) {
            let paramName = segment.slice(4, -1);
            // Legacy for React Navigation optional params
            if (paramName.endsWith('?')) {
                paramName = paramName.slice(0, -1);
            }
            const values = params[paramName];
            // Catchall params are optional
            const parts = Array.isArray(values) ? values.filter(isSerializableParam).map(String) : isSerializableParam(values) && values ? [
                String(values)
            ] : [];
            return {
                parts,
                paramName
            };
        } else if (segment.startsWith('[') && segment.endsWith(']')) {
            const paramName = segment.slice(1, -1);
            const value = params[paramName];
            // Optional params are optional
            return {
                parts: isSerializableParam(value) && value ? [
                    String(value)
                ] : [],
                paramName
            };
        } else {
            return {
                parts: [
                    segment
                ]
            };
        }
    });
    const pathname = '/' + resolvedSegments.flatMap(({ parts })=>parts).join('/');
    const pathParams = new Set(resolvedSegments.map(({ paramName })=>paramName).filter((paramName)=>paramName !== undefined));
    return {
        pathname,
        pathParams
    };
}
function serializeQueryAndHash(pathname, params, pathParams) {
    const searchParams = new URLSearchParams(Object.entries(params).flatMap(([key, value])=>{
        // Search params should not include path params
        if (pathParams.has(key)) {
            return [];
        } else if (Array.isArray(value)) {
            return value.filter(isSerializableParam).map((v)=>[
                    key,
                    String(v)
                ]);
        } else if (!isSerializableParam(value)) {
            return [];
        }
        return [
            [
                key,
                String(value)
            ]
        ];
    }));
    let hash;
    if (searchParams.has('#')) {
        hash = searchParams.get('#') || undefined;
        searchParams.delete('#');
    }
    // We cannot use searchParams.size because it is not included in the React Native polyfill
    const searchParamString = searchParams.toString();
    let pathnameWithParams = searchParamString ? pathname + '?' + searchParamString : pathname;
    pathnameWithParams = hash ? pathnameWithParams + '#' + hash : pathnameWithParams;
    return {
        searchParams,
        pathnameWithParams
    };
}
function isSerializableParam(value) {
    return value == null || typeof value !== 'object';
}

//# sourceMappingURL=getRouteInfoFromState.js.map
