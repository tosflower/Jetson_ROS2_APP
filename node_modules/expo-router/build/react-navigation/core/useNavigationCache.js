'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useNavigationCache", {
    enumerable: true,
    get: function() {
        return useNavigationCache;
    }
});
function _react() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
const _routers = require("../routers");
const _isRenderingComponent = require("./isRenderingComponent");
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
// Warn once per process, so re-renders and nested parent checks do not repeat it.
let didWarnIsFocusedInRender = false;
function useNavigationCache({ routes, routeNames, navigation, setOptions, router, emitter }) {
    // Cache object which holds navigation objects for each screen
    // We use `React.useMemo` instead of `React.useRef` coz we want to invalidate it when deps change
    // In reality, these deps will rarely change, if ever
    const cache = _react().useMemo(()=>({
            current: {}
        }), // eslint-disable-next-line react-hooks/exhaustive-deps
    [
        navigation,
        setOptions,
        emitter
    ]);
    // Keep name-keyed placeholders stable after their real route keys are created.
    const routeKeys = [
        ...routes.map((route)=>route.key),
        ...routeNames
    ];
    const validKeys = new Set(routeKeys.flatMap((key)=>[
            key,
            `p\0${key}`
        ]));
    cache.current = Object.fromEntries(Object.entries(cache.current).filter(([key])=>validKeys.has(key)));
    const createNavigation = (route, isPreloaded)=>{
        const dispatchSync = (action)=>{
            if (isPreloaded) {
                if (process.env.NODE_ENV !== 'production') {
                    console.warn(`Ignored a navigation action dispatched from the preloaded screen '${route.name}'. The screen is rendered for preloading and is not focused, so its actions would unexpectedly modify the visible stack. Wait until the screen is focused before dispatching.`);
                }
                return;
            }
            // TODO(@ubax): https://github.com/expo/expo/pull/48618#discussion_r3735996416
            navigation.dispatchSync({
                source: route.key,
                ...action
            });
        };
        const dispatch = (action)=>{
            if (isPreloaded) {
                if (process.env.NODE_ENV !== 'production') {
                    console.warn(`Ignored a navigation action dispatched from the preloaded screen '${route.name}'. The screen is rendered for preloading and is not focused, so its actions would unexpectedly modify the visible stack. Wait until the screen is focused before dispatching.`);
                }
                return;
            }
            navigation.dispatch({
                source: route.key,
                ...action
            });
        };
        const actions = {
            ...router.actionCreators,
            ..._routers.CommonActions
        };
        const helpers = Object.keys(actions).reduce((acc, name)=>{
            acc[name] = (...args)=>// @ts-expect-error: name is a valid key, but TypeScript is dumb
                dispatch(actions[name](...args));
            return acc;
        }, {});
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { emit, ...rest } = navigation;
        const navigationItem = {
            ...rest,
            ...helpers,
            // FIXME: too much work to fix the types for now
            ...emitter.create(route.key),
            dispatch,
            dispatchSync,
            getParent: (id)=>{
                if (id !== undefined && id === rest.getId()) {
                    // If the passed id is the same as the current navigation id,
                    // we return the cached navigation object for the relevant route
                    return navigationItem;
                }
                return rest.getParent(id);
            },
            setOptions: (options)=>{
                setOptions((o)=>({
                        ...o,
                        [route.key]: {
                            ...o[route.key],
                            ...options
                        }
                    }));
            },
            isFocused: ()=>{
                if (process.env.NODE_ENV !== 'production' && !didWarnIsFocusedInRender && (0, _isRenderingComponent.isRenderingComponent)()) {
                    didWarnIsFocusedInRender = true;
                    console.warn(`navigation.isFocused() was called while rendering the screen '${route.name}'. During render it can return a stale value, because focus state is updated after render. Use the useIsFocused() hook to read focus during render.`);
                }
                const state = rest.getState();
                if (state.routes[state.index]?.key !== route.key) {
                    return false;
                }
                // If the current screen is focused, we also need to check if parent navigator is focused
                // This makes sure that we return the focus state in the whole tree, not just this navigator
                return navigation ? navigation.isFocused() : true;
            }
        };
        return navigationItem;
    };
    return (route, isPreloaded)=>{
        const key = `${isPreloaded ? 'p\0' : ''}${route.key}`;
        const cachedNavigation = cache.current[key];
        if (cachedNavigation) {
            return cachedNavigation;
        }
        const navigation = createNavigation(route, isPreloaded);
        cache.current[key] = navigation;
        return navigation;
    };
}

//# sourceMappingURL=useNavigationCache.js.map
