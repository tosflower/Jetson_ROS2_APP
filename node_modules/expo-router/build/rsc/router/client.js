/**
 * Copyright © 2024 650 Industries.
 * Copyright © 2024 2023 Daishi Kato
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * https://github.com/dai-shi/waku/blob/3d1cc7d714b67b142c847e879c30f0724fc457a7/packages/waku/src/router/client.ts#L1
 */ 'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    Link: null,
    Router: null,
    ServerRouter: null,
    useRouter_UNSTABLE: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get Link () {
        return Link;
    },
    get Router () {
        return Router;
    },
    get ServerRouter () {
        return ServerRouter;
    },
    get useRouter_UNSTABLE () {
        return useRouter_UNSTABLE;
    }
});
function _reactslot() {
    const data = require("@radix-ui/react-slot");
    _reactslot = function() {
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
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
const _href = require("../../link/href");
const _useLinkHooks = require("../../link/useLinkHooks");
const _useLatestCallback = /*#__PURE__*/ _interop_require_default(require("../../utils/useLatestCallback"));
const _common = require("./common.js");
const _host = require("./host.js");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const normalizeRoutePath = (path)=>{
    for (const suffix of [
        '/',
        '/index.html'
    ]){
        if (path.endsWith(suffix)) {
            return path.slice(0, -suffix.length) || '/';
        }
    }
    return path;
};
const parseRoute = (url)=>{
    if (globalThis.__EXPO_ROUTER_404__) {
        return {
            path: '/404',
            query: '',
            hash: ''
        };
    }
    const { pathname, searchParams, hash } = url;
    if (searchParams.has(_common.PARAM_KEY_SKIP)) {
        console.warn(`The search param "${_common.PARAM_KEY_SKIP}" is reserved`);
    }
    return {
        path: normalizeRoutePath(pathname),
        query: searchParams.toString(),
        hash
    };
};
const getHref = ()=>process.env.EXPO_OS === 'web' ? window.location.href : 'http://localhost:8081/';
const equalRouteProps = (a, b)=>{
    if (a.path !== b.path) {
        return false;
    }
    if (a.query !== b.query) {
        return false;
    }
    return true;
};
const RouterContext = (0, _react().createContext)(null);
const InnerRouter = ({ routerData })=>{
    const refetch = (0, _host.useRefetch)();
    const initialRouteRef = (0, _react().useRef)(null);
    if (!initialRouteRef.current) {
        initialRouteRef.current = parseRoute(new URL(getHref()));
    }
    const [route, setRoute] = (0, _react().useState)(()=>({
            // This is the first initialization of the route, and it has
            // to ignore the hash, because on server side there is none.
            // Otherwise there will be a hydration error.
            // The client side route, including the hash, will be updated in the effect below.
            ...initialRouteRef.current,
            hash: ''
        }));
    // Update the route post-load to include the current hash.
    (0, _react().useEffect)(()=>{
        const initialRoute = initialRouteRef.current;
        setRoute((prev)=>{
            if (prev.path === initialRoute.path && prev.query === initialRoute.query && prev.hash === initialRoute.hash) {
                return prev;
            }
            return initialRoute;
        });
    }, []);
    // TODO: Mint IDs from the active RouteNode's `contextKey` (via expo-router's
    // RouterStore) so they're group-aware and canonical. Today they're URL-derived
    // and omit `(group)` segments — the server's iterating resolver bridges this via
    // optional-group regex matching, but the asymmetry should go away if/when the
    // canonical-ID convention needs to include groups (e.g. signed skip tokens).
    const { layouts, page } = (0, _common.getComponentIds)(route.path);
    const componentIds = [
        ...layouts,
        page
    ];
    //  const refetchRoute = () => {
    //   const loc = parseRoute(new URL(getHref()));
    //   const input = getInputString(loc.path);
    //   refetch(input, loc.query);
    //   refetch(input, JSON.stringify({ query: route.query }));
    // };
    // globalThis.__EXPO_REFETCH_ROUTE_NO_CACHE__ = refetchRoute;
    const [cached, setCached] = (0, _react().useState)(()=>{
        return Object.fromEntries(componentIds.map((id)=>[
                id,
                route
            ]));
    });
    const changeRoute = (0, _useLatestCallback.default)((route, options)=>{
        const { checkCache, skipRefetch } = options || {};
        (0, _react().startTransition)(()=>{
            setRoute(route);
        });
        const { layouts, page } = (0, _common.getComponentIds)(route.path);
        const componentIds = [
            ...layouts,
            page
        ];
        if (checkCache && componentIds.every((id)=>{
            const cachedLoc = cached[id];
            return cachedLoc && equalRouteProps(cachedLoc, route);
        })) {
            return; // everything is cached
        }
        const shouldSkip = routerData[0];
        const skip = getSkipList(shouldSkip, componentIds, route, cached);
        if (componentIds.every((id)=>skip.includes(id))) {
            return; // everything is skipped
        }
        const input = (0, _common.getInputString)(route.path);
        if (!skipRefetch) {
            refetch(input, JSON.stringify({
                query: route.query,
                skip
            }));
        }
        (0, _react().startTransition)(()=>{
            setCached((prev)=>({
                    ...prev,
                    ...Object.fromEntries(componentIds.flatMap((id)=>skip.includes(id) ? [] : [
                            [
                                id,
                                route
                            ]
                        ]))
                }));
        });
    });
    const prefetchRoute = (0, _useLatestCallback.default)((route)=>{
        const { layouts, page } = (0, _common.getComponentIds)(route.path);
        const componentIds = [
            ...layouts,
            page
        ];
        const shouldSkip = routerData[0];
        const skip = getSkipList(shouldSkip, componentIds, route, cached);
        if (componentIds.every((id)=>skip.includes(id))) {
            return; // everything is cached
        }
        const input = (0, _common.getInputString)(route.path);
        (0, _host.prefetchRSC)(input, JSON.stringify({
            query: route.query,
            skip
        }));
        globalThis.__EXPO_ROUTER_PREFETCH__?.(route.path);
    });
    (0, _react().useEffect)(()=>{
        const callback = ()=>{
            const route = parseRoute(new URL(getHref()));
            changeRoute(route, {
                checkCache: true
            });
        };
        if (window.addEventListener) {
            window.addEventListener('popstate', callback);
            return ()=>{
                window.removeEventListener('popstate', callback);
            };
        }
        return ()=>{};
    }, [
        changeRoute
    ]);
    (0, _react().useEffect)(()=>{
        const callback = (pathname, searchParamsString)=>{
            const url = new URL(getHref());
            url.pathname = pathname;
            url.search = searchParamsString;
            url.hash = '';
            getHistory().pushState({
                ...getHistory().state,
                expo_new_path: url.pathname !== window.location.pathname
            }, '', url);
            changeRoute(parseRoute(url), {
                skipRefetch: true
            });
        };
        // eslint-disable-next-line no-multi-assign
        const listeners = routerData[1] ||= new Set();
        listeners.add(callback);
        return ()=>{
            listeners.delete(callback);
        };
    }, [
        changeRoute,
        routerData
    ]);
    (0, _react().useEffect)(()=>{
        const { hash } = window.location;
        const { state } = getHistory();
        const element = hash && document.getElementById(hash.slice(1));
        if (window.scrollTo) {
            window.scrollTo({
                left: 0,
                top: element ? element.getBoundingClientRect().top + window.scrollY : 0,
                behavior: state?.expo_new_path ? 'instant' : 'auto'
            });
        } else {
        // TODO: Native
        // console.log('window.scrollTo is not available');
        }
    });
    const children = componentIds.reduceRight((acc, id)=>(0, _react().createElement)(_host.Slot, {
            id,
            fallback: acc
        }, acc), null);
    return (0, _react().createElement)(RouterContext.Provider, {
        value: {
            route,
            changeRoute,
            prefetchRoute
        }
    }, children);
};
function getHistory() {
    if (process.env.EXPO_OS === 'web') {
        return window.history;
    }
    // Native shim
    return {
        pushState: ()=>{},
        replaceState: ()=>{},
        back: ()=>{},
        forward: ()=>{},
        state: {}
    };
}
function useRouter_UNSTABLE() {
    const router = (0, _react().use)(RouterContext);
    if (!router) {
        throw new Error('Missing Router');
    }
    const { route, changeRoute, prefetchRoute } = router;
    const push = (0, _react().useCallback)((href, options)=>{
        if (options) {
            // TODO(Bacon): Implement options
            console.warn('options prop of router.push() is not supported in React Server Components yet');
        }
        const url = new URL((0, _href.resolveHref)(href), getHref());
        getHistory().pushState({
            ...getHistory().state,
            expo_new_path: url.pathname !== window.location.pathname
        }, '', url);
        changeRoute(parseRoute(url));
    }, [
        changeRoute
    ]);
    const replace = (0, _react().useCallback)((href, options)=>{
        if (options) {
            // TODO(Bacon): Implement options
            console.warn('options prop of router.replace() is not supported in React Server Components yet');
        }
        const url = new URL((0, _href.resolveHref)(href), getHref());
        getHistory().replaceState(getHistory().state, '', url);
        changeRoute(parseRoute(url));
    }, [
        changeRoute
    ]);
    const reload = (0, _react().useCallback)(()=>{
        const url = new URL(getHref());
        changeRoute(parseRoute(url));
    }, [
        changeRoute
    ]);
    const back = (0, _react().useCallback)(()=>{
        // FIXME is this correct?
        getHistory().back();
    }, []);
    const forward = (0, _react().useCallback)(()=>{
        // FIXME is this correct?
        getHistory().forward();
    }, []);
    const prefetch = (0, _react().useCallback)((href)=>{
        const url = new URL((0, _href.resolveHref)(href), getHref());
        prefetchRoute(parseRoute(url));
    }, [
        prefetchRoute
    ]);
    return {
        ...route,
        canDismiss () {
            throw new Error('router.canDismiss() is not supported in React Server Components yet');
        },
        canGoBack () {
            throw new Error('router.canGoBack() is not supported in React Server Components yet');
        },
        dismiss () {
            throw new Error('router.dismiss() is not supported in React Server Components yet');
        },
        dismissTo () {
            throw new Error('router.dismissTo() is not supported in React Server Components yet');
        },
        dismissAll () {
            throw new Error('router.dismissAll() is not supported in React Server Components yet');
        },
        setParams () {
            throw new Error('router.setParams() is not supported in React Server Components yet');
        },
        setTransitionMode () {
            throw new Error('router.setTransitionMode() is not supported in React Server Components yet');
        },
        // TODO: The behavior here is not the same as before.
        navigate: push,
        push,
        replace,
        reload,
        back,
        forward,
        prefetch
    };
}
const getSkipList = (shouldSkip, componentIds, route, cached)=>{
    const shouldSkipObj = Object.fromEntries(shouldSkip || []);
    return componentIds.filter((id)=>{
        const prevProps = cached[id];
        if (!prevProps) {
            return false;
        }
        const shouldCheck = shouldSkipObj[id];
        if (!shouldCheck) {
            return false;
        }
        if (shouldCheck[0] && route.path !== prevProps.path) {
            return false;
        }
        if (shouldCheck[0] && route.query !== prevProps.query) {
            return false;
        }
        return true;
    });
};
const DEFAULT_ROUTER_DATA = [];
function Router({ routerData = DEFAULT_ROUTER_DATA }) {
    const route = parseRoute(new URL(getHref()));
    const initialInput = (0, _common.getInputString)(route.path);
    const initialParams = JSON.stringify({
        query: route.query
    });
    const unstable_onFetchData = ()=>{};
    return (0, _react().createElement)(_host.Root, {
        initialInput,
        initialParams,
        unstable_onFetchData
    }, (0, _react().createElement)(InnerRouter, {
        routerData
    }));
}
const notAvailableInServer = (name)=>()=>{
        throw new Error(`${name} is not in the server`);
    };
function ServerRouter({ children, route }) {
    return (0, _react().createElement)(_react().Fragment, null, (0, _react().createElement)(RouterContext.Provider, {
        value: {
            route,
            changeRoute: notAvailableInServer('changeRoute'),
            prefetchRoute: notAvailableInServer('prefetchRoute')
        }
    }, children));
}
const Link = (0, _react().forwardRef)(ExpoRouterLink);
Link.resolveHref = _href.resolveHref;
function ExpoRouterLink({ href, replace, push, // TODO: This does not prevent default on the anchor tag.
relativeToDirectory, asChild, rel, target, download, //   pending,
// notPending,
// unstable_prefetchOnEnter,
// unstable_prefetchOnView,
children, ...props }, ref) {
    // Mutate the style prop to add the className on web.
    const style = (0, _useLinkHooks.useInteropClassName)(props);
    // If not passing asChild, we need to forward the props to the anchor tag using React Native Web's `hrefAttrs`.
    const hrefAttrs = (0, _useLinkHooks.useHrefAttrs)({
        asChild,
        rel,
        target,
        download
    });
    const resolvedHref = (0, _react().useMemo)(()=>{
        if (href == null) {
            throw new Error('Link: href is required');
        }
        return (0, _href.resolveHref)(href);
    }, [
        href
    ]);
    const router = (0, _react().use)(RouterContext);
    const changeRoute = router ? router.changeRoute : ()=>{
        throw new Error('Missing Router');
    };
    const prefetchRoute = router ? router.prefetchRoute : ()=>{
        throw new Error('Missing Router');
    };
    // TODO: Implement support for pending states in the future.
    const [, startTransition] = (0, _react().useTransition)();
    // const elementRef = useRef<HTMLAnchorElement>();
    // useEffect(() => {
    //   if (unstable_prefetchOnView && process.env.EXPO_OS === 'web' && ref.current) {
    //     const observer = new IntersectionObserver(
    //       (entries) => {
    //         entries.forEach((entry) => {
    //           if (entry.isIntersecting) {
    //             const url = new URL(resolvedHref, getHref());
    //             if (router && url.href !== getHref()) {
    //               const route = parseRoute(url);
    //               router.prefetchRoute(route);
    //             }
    //           }
    //         });
    //       },
    //       { threshold: 0.1 }
    //     );
    //     observer.observe(ref.current);
    //     return () => {
    //       observer.disconnect();
    //     };
    //   }
    //   return () => {};
    // }, [unstable_prefetchOnView, router, resolvedHref]);
    const onClick = (event)=>{
        event.preventDefault();
        const url = new URL(resolvedHref, getHref());
        // TODO: Use in-memory route for native platforms.
        // if (url.href !== getHref()) {
        const route = parseRoute(url);
        prefetchRoute(route);
        startTransition(()=>{
            getHistory().pushState({
                ...getHistory().state,
                expo_new_path: url.pathname !== window.location.pathname
            }, '', url);
            changeRoute(route);
        });
        // }
        props.onClick?.(event);
    };
    // const onMouseEnter = unstable_prefetchOnEnter
    //   ? (event: MouseEvent<HTMLAnchorElement>) => {
    //       const url = new URL(to, getHref());
    //       if (url.href !== getHref()) {
    //         const route = parseRoute(url);
    //         prefetchRoute(route);
    //       }
    //       props.onMouseEnter?.(event);
    //     }
    //   : props.onMouseEnter;
    const Element = asChild ? _reactslot().Slot : _reactnative().Text;
    const ele = (0, _react().createElement)(// @ts-expect-error
    Element, {
        ...hrefAttrs,
        ...props,
        style,
        href: resolvedHref,
        onPress: onClick,
        // onMouseEnter,
        ref
    }, children);
    // if (isPending && pending !== undefined) {
    //   return createElement(Fragment, null, ele, pending);
    // }
    // if (!isPending && notPending !== undefined) {
    //   return createElement(Fragment, null, ele, notPending);
    // }
    return ele;
}

//# sourceMappingURL=client.js.map
