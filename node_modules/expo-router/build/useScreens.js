'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getQualifiedRouteComponent: null,
    getSingularId: null,
    routeToScreen: null,
    screenOptionsFactory: null,
    useSortedScreens: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getQualifiedRouteComponent () {
        return getQualifiedRouteComponent;
    },
    get getSingularId () {
        return _getSingularId.getSingularId;
    },
    get routeToScreen () {
        return routeToScreen;
    },
    get screenOptionsFactory () {
        return screenOptionsFactory;
    },
    get useSortedScreens () {
        return useSortedScreens;
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
const _Route = require("./Route");
const _utils = require("./global-state/utils");
const _useCurrentRouteInfo = require("./hooks/useCurrentRouteInfo");
const _GuardContext = require("./layouts/GuardContext");
const _Redirect = require("./link/Redirect");
const _ZoomTransitionEnabler = require("./link/zoom/ZoomTransitionEnabler");
const _zoomtransitioncontextproviders = require("./link/zoom/zoom-transition-context-providers");
const _LoaderRouteLifecycle = require("./loaders/LoaderRouteLifecycle");
const _resolveLoaderPath = require("./loaders/resolveLoaderPath");
const _matchers = require("./matchers");
const _navigationParams = require("./navigationParams");
const _performance = require("./performance");
const _primitives = require("./primitives");
const _native = require("./react-navigation/native");
const _routeNode = require("./routeNode");
const _useIsFocused = require("./useIsFocused");
const _getSingularId = require("./utils/getSingularId");
const _EmptyRoute = require("./views/EmptyRoute");
const _NavigationActivityContext = require("./views/NavigationActivityContext");
const _NavigationAwareActivity = require("./views/NavigationAwareActivity");
const _SuspenseFallback = require("./views/SuspenseFallback");
const _Try = require("./views/Try");
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
function getSortedChildren(children, order = [], initialRouteName) {
    if (!order?.length) {
        return children.sort((0, _Route.sortRoutesWithInitial)(initialRouteName)).map((route)=>({
                route,
                props: {},
                routeSource: 'filesystem'
            }));
    }
    const entries = [
        ...children
    ];
    const ordered = order.map(({ name, listeners, options, getId, dangerouslySingular: singular, activityEnabled })=>{
        if (!entries.length) {
            console.warn(`[Layout children]: Too many screens defined. Route "${name}" is extraneous.`);
            return null;
        }
        const match = entries.find((route)=>route.route === name || route.route === `${name}/index`);
        if (!match) {
            console.warn(`[Layout children]: No route named "${name}" exists in nested children:`, children.map(({ route })=>route));
            return null;
        } else {
            // Get match and remove from entries
            entries.splice(entries.indexOf(match), 1);
            if (getId) {
                console.warn(`Deprecated: prop 'getId' on screen ${name} is deprecated. Please rename the prop to 'dangerouslySingular'`);
                if (singular) {
                    console.warn(`Screen ${name} cannot use both getId and dangerouslySingular together.`);
                }
            } else if (singular) {
                // If singular is set, use it as the getId function.
                if (typeof singular === 'string') {
                    getId = ()=>singular;
                } else if (typeof singular === 'function' && name) {
                    getId = (options)=>singular(name, options.params || {});
                } else if (singular === true && name) {
                    getId = (options)=>(0, _getSingularId.getSingularId)(name, options);
                }
            }
            return {
                route: match,
                props: {
                    listeners,
                    options,
                    getId,
                    activityEnabled
                },
                routeSource: 'layout'
            };
        }
    }).filter(Boolean);
    // Add any remaining children
    ordered.push(...entries.sort((0, _Route.sortRoutesWithInitial)(initialRouteName)).map((route)=>({
            route,
            props: {},
            routeSource: 'filesystem'
        })));
    return ordered;
}
function useSortedScreens(order, guardedRedirects = new Map()) {
    const node = (0, _Route.useRouteNode)();
    const children = node?.children ?? [];
    const sorted = children.length ? getSortedChildren(children, order, (0, _routeNode.getValidInitialRouteName)(node)) : [];
    return _react().default.useMemo(()=>{
        const screensWithGuarded = sorted.map((value)=>{
            const route = value.route.route;
            return {
                ...value,
                isGuarded: (0, _GuardContext.isRouteGuarded)(route, guardedRedirects)
            };
        });
        return screensWithGuarded.map((value)=>{
            return routeToScreen(value.route, value.props, value.isGuarded, value.routeSource);
        });
    }, [
        sorted,
        guardedRedirects
    ]);
}
function fromImport(value, { ErrorBoundary, SuspenseFallback, unstable_settings, ...component }) {
    // If possible, add a more helpful display name for the component stack to improve debugging of React errors such as `Text strings must be rendered within a <Text> component.`.
    if (component?.default && __DEV__) {
        component.default.displayName ??= `${component.default.name ?? 'Route'}(${value.contextKey})`;
    }
    const screenErrorBoundary = unstable_settings?.screenErrorBoundary;
    if (process.env.NODE_ENV !== 'production' && screenErrorBoundary && value.type !== 'layout') {
        console.warn(`Route "${value.contextKey}" exports unstable_settings.screenErrorBoundary. This setting is only supported in layout routes; use export const ErrorBoundary instead.`);
    }
    if (process.env.NODE_ENV !== 'production' && typeof component.default === 'object' && component.default && Object.keys(component.default).length === 0) {
        return {
            default: _EmptyRoute.EmptyRoute,
            SuspenseFallback
        };
    }
    if (ErrorBoundary || value.type === 'layout' && screenErrorBoundary !== undefined) {
        const Wrapped = /*#__PURE__*/ _react().default.forwardRef((props, ref)=>{
            const inheritedScreenErrorBoundary = (0, _react().use)(_Route.ScreenErrorBoundaryContext);
            let children = /*#__PURE__*/ _react().default.createElement(component.default || _EmptyRoute.EmptyRoute, {
                ...props,
                ref
            });
            if (ErrorBoundary) {
                children = /*#__PURE__*/ (0, _jsxruntime().jsx)(_Try.Try, {
                    catch: ErrorBoundary,
                    children: children
                });
            }
            if (value.type === 'layout' && screenErrorBoundary !== undefined) {
                children = /*#__PURE__*/ (0, _jsxruntime().jsx)(_Route.ScreenErrorBoundaryContext, {
                    value: screenErrorBoundary ?? undefined,
                    children: children
                });
                if (screenErrorBoundary === null && inheritedScreenErrorBoundary) {
                    children = /*#__PURE__*/ (0, _jsxruntime().jsx)(_Try.Try, {
                        catch: inheritedScreenErrorBoundary,
                        children: children
                    });
                }
            }
            return children;
        });
        if (__DEV__) {
            Wrapped.displayName = `ErrorBoundary(${value.contextKey})`;
        }
        return {
            default: Wrapped,
            SuspenseFallback
        };
    }
    return {
        default: component.default,
        SuspenseFallback
    };
}
// TODO: Maybe there's a more React-y way to do this?
// Without this store, the process enters a recursive loop.
const qualifiedStore = new WeakMap();
function getQualifiedRouteComponent(value) {
    if (qualifiedStore.has(value)) {
        return qualifiedStore.get(value);
    }
    let ScreenComponent;
    let LayoutSuspenseFallback;
    // TODO: This ensures sync doesn't use React.lazy, but it's not ideal.
    if (process.env.EXPO_ROUTER_IMPORT_MODE === 'lazy') {
        ScreenComponent = /*#__PURE__*/ _react().default.lazy(()=>{
            const res = value.loadRoute();
            // NOTE(@kitten): React.lazy supports promise likes, which we can use to ensure that
            // the route is synchronously available, if the `loadRoute` method returns a loaded route
            // synchronously
            if (!('then' in res)) {
                return {
                    then (resolve) {
                        const ret = fromImport(value, res);
                        return Promise.resolve(resolve ? resolve(ret) : ret);
                    }
                };
            } else {
                return res.then(fromImport.bind(null, value));
            }
        });
        if (__DEV__) {
            ScreenComponent.displayName = `AsyncRoute(${value.route})`;
        }
    } else {
        const res = value.loadRoute();
        const result = fromImport(value, res);
        ScreenComponent = result.default;
        LayoutSuspenseFallback = value.type === 'layout' ? result.SuspenseFallback : undefined;
    }
    const WrappedScreenComponent = (props)=>{
        (0, _utils.useColorSchemeChangesIfNeeded)();
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(ScreenComponent, {
            ...props
        });
    };
    function BaseRoute({ // Remove these React Navigation props to
    // enforce usage of expo-router hooks (where the query params are correct).
    route, navigation, // Pass all other props to the component
    ...props }) {
        const routeInfo = (0, _useCurrentRouteInfo.useCurrentRouteInfo)();
        const InheritedSuspenseFallback = (0, _react().use)(_Route.SuspenseFallbackContext);
        const ScreenErrorBoundary = (0, _react().use)(_Route.ScreenErrorBoundaryContext);
        const activityThreshold = (0, _NavigationActivityContext.useActivityThreshold)();
        const redirectHref = (0, _GuardContext.useGuardRedirect)(value.route);
        const isGuarded = redirectHref !== undefined;
        const isRouteType = value.type === 'route';
        const resolvedLoaderPath = (0, _react().useMemo)(()=>{
            if (!isRouteType || isGuarded) {
                return null;
            }
            // NOTE(@hassankhan): `RouteNode` does not expose whether its module has a loader without
            // eagerly loading it. Static loader metadata would let loader-free routes skip this work.
            return (0, _resolveLoaderPath.resolveLoaderPath)((0, _matchers.getContextKey)(value.contextKey), routeInfo);
        }, [
            isGuarded,
            isRouteType,
            routeInfo
        ]);
        const ResolvedSuspenseFallback = process.env.EXPO_ROUTER_IMPORT_MODE === 'lazy' ? _SuspenseFallback.SuspenseFallback : LayoutSuspenseFallback ?? InheritedSuspenseFallback ?? _SuspenseFallback.SuspenseFallback;
        const providedSuspenseFallback = value.type === 'layout' ? LayoutSuspenseFallback ?? InheritedSuspenseFallback : InheritedSuspenseFallback;
        (0, _react().useEffect)(()=>{
            return navigation.addListener('transitionEnd', (e)=>{
                if (!e?.data?.closing) {
                    // When navigating to a screen, remove the no animation param to re-enable animations
                    // Otherwise the navigation back would also have no animation
                    if ((0, _navigationParams.hasParam)(route?.params, _navigationParams.INTERNAL_EXPO_ROUTER_NO_ANIMATION_PARAM_NAME)) {
                        navigation.dispatchSync(_native.CommonActions.replaceParams((0, _navigationParams.removeParams)(route?.params, [
                            _navigationParams.INTERNAL_EXPO_ROUTER_NO_ANIMATION_PARAM_NAME
                        ])));
                    }
                }
            });
        }, [
            navigation
        ]);
        const hasRouteKey = !!route?.key;
        if (isGuarded) {
            // A `null` href means guarded with no destination to redirect to (every
            // candidate is also guarded): render nothing but keep the screen registered
            // so the navigator and its state stay mounted.
            return /*#__PURE__*/ (0, _jsxruntime().jsx)(_Route.Route, {
                node: value,
                params: route?.params,
                children: redirectHref != null ? /*#__PURE__*/ (0, _jsxruntime().jsx)(_Redirect.Redirect, {
                    href: redirectHref
                }) : /*#__PURE__*/ (0, _jsxruntime().jsx)(AllRoutesProtectedWarning, {})
            });
        }
        const screenComponent = /*#__PURE__*/ (0, _jsxruntime().jsx)(WrappedScreenComponent, {
            ...props,
            // Expose the template segment path, e.g. `(home)`, `[foo]`, `index`
            // the intention is to make it possible to deduce shared routes.
            segment: value.route
        });
        const screenContent = ScreenErrorBoundary && isRouteType ? /*#__PURE__*/ (0, _jsxruntime().jsx)(_Try.Try, {
            catch: ScreenErrorBoundary,
            children: screenComponent
        }) : screenComponent;
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(_Route.Route, {
            node: value,
            params: route?.params,
            children: /*#__PURE__*/ (0, _jsxruntime().jsxs)(_Route.SuspenseFallbackContext, {
                value: providedSuspenseFallback,
                children: [
                    resolvedLoaderPath && /*#__PURE__*/ (0, _jsxruntime().jsx)(_LoaderRouteLifecycle.LoaderRouteLifecycle, {
                        path: resolvedLoaderPath
                    }),
                    (0, _performance.isEnabled)() && isRouteType && hasRouteKey && /*#__PURE__*/ (0, _jsxruntime().jsx)(AnalyticsListeners, {
                        navigation: navigation,
                        screenId: route.key
                    }),
                    /*#__PURE__*/ (0, _jsxruntime().jsxs)(_zoomtransitioncontextproviders.ZoomTransitionTargetContextProvider, {
                        route: route,
                        children: [
                            /*#__PURE__*/ (0, _jsxruntime().jsx)(_ZoomTransitionEnabler.ZoomTransitionEnabler, {
                                route: route
                            }),
                            /*#__PURE__*/ (0, _jsxruntime().jsx)(_react().default.Suspense, {
                                name: route ? `Route(${route.name})` : undefined,
                                fallback: // `ResolvedSuspenseFallback` only selects between statically defined
                                // components; nothing is created during render.
                                // oxlint-disable-next-line react/static-components
                                /*#__PURE__*/ (0, _jsxruntime().jsx)(ResolvedSuspenseFallback, {
                                    route: value.contextKey,
                                    params: route?.params ?? {}
                                }),
                                children: isRouteType && typeof activityThreshold === 'number' ? /*#__PURE__*/ (0, _jsxruntime().jsx)(_NavigationAwareActivity.NavigationAwareActivity, {
                                    hideWhenNestedAtLevel: activityThreshold,
                                    children: screenContent
                                }) : screenContent
                            })
                        ]
                    })
                ]
            })
        });
    }
    if (__DEV__) {
        BaseRoute.displayName = `Route(${value.route})`;
    }
    qualifiedStore.set(value, BaseRoute);
    return BaseRoute;
}
// A separate component, so reading focus does not rerender the screen on focus changes.
function AllRoutesProtectedWarning() {
    const isFocused = (0, _useIsFocused.useIsFocused)();
    (0, _react().useEffect)(()=>{
        if (__DEV__ && isFocused) {
            console.warn('All routes in this navigator are protected. Ensure at least one route is accessible.');
        }
    }, [
        isFocused
    ]);
    return null;
}
function AnalyticsListeners({ navigation, screenId }) {
    const hasEmittedPagePreloadedRef = _react().default.useRef(false);
    const hasBlurredRef = _react().default.useRef(true);
    const routeInfo = (0, _useCurrentRouteInfo.useCurrentRouteInfo)();
    // Read focus from render context. `navigation.isFocused()` can return the navigator's
    // previous state during render, so a first push would look like a preload.
    const isFocused = (0, _useIsFocused.useIsFocused)();
    const emitPagePreloaded = _react().default.useEffectEvent(()=>{
        if (routeInfo && !isFocused) {
            (0, _performance.mark)('expo-router:page-preloaded', {
                pathname: routeInfo.pathname,
                params: routeInfo.params,
                segments: routeInfo.segments,
                screenId
            });
        }
    });
    (0, _react().useEffect)(()=>{
        // We only one to emit once
        if (!hasEmittedPagePreloadedRef.current) {
            hasEmittedPagePreloadedRef.current = true;
            emitPagePreloaded();
        }
    }, []);
    (0, _react().useEffect)(()=>{
        if (routeInfo) {
            return ()=>{
                (0, _performance.mark)('expo-router:page-removed', {
                    pathname: routeInfo.pathname,
                    params: routeInfo.params,
                    segments: routeInfo.segments,
                    screenId
                });
            };
        }
        return ()=>{};
    }, [
        routeInfo?.params,
        routeInfo?.pathname,
        routeInfo?.segments,
        screenId
    ]);
    // Emit `pageFocused` from an effect — not during render — so it fires after the
    // focused screen's content has committed. `hasBlurredRef` deduplicates across both paths.
    (0, _react().useEffect)(()=>{
        if (isFocused && routeInfo && hasBlurredRef.current) {
            (0, _performance.mark)('expo-router:page-focused', {
                pathname: routeInfo.pathname,
                params: routeInfo.params,
                segments: routeInfo.segments,
                screenId
            });
            hasBlurredRef.current = false;
        }
    }, [
        isFocused,
        routeInfo?.pathname,
        routeInfo?.params,
        routeInfo?.segments,
        screenId
    ]);
    (0, _react().useEffect)(()=>{
        if (routeInfo) {
            const cleanFocus = navigation.addListener('focus', ()=>{
                // If the screen was not blurred, don't emit focused again
                // hasBlurredRef will be false when the screen was initially focused
                if (hasBlurredRef.current) {
                    (0, _performance.mark)('expo-router:page-focused', {
                        pathname: routeInfo.pathname,
                        params: routeInfo.params,
                        segments: routeInfo.segments,
                        screenId
                    });
                    hasBlurredRef.current = false;
                }
            });
            const cleanBlur = navigation.addListener('blur', ()=>{
                (0, _performance.mark)('expo-router:page-blurred', {
                    pathname: routeInfo.pathname,
                    params: routeInfo.params,
                    segments: routeInfo.segments,
                    screenId
                });
                hasBlurredRef.current = true;
            });
            return ()=>{
                cleanFocus();
                cleanBlur();
            };
        }
        return ()=>{};
    }, [
        navigation,
        routeInfo?.pathname,
        routeInfo?.params,
        routeInfo?.segments,
        screenId
    ]);
    return null;
}
function screenOptionsFactory(route, options, isGuarded) {
    return (args)=>{
        // Only eager load generated components
        const staticOptions = route.generated ? route.loadRoute()?.getNavOptions : null;
        // Route modules are untyped, while callers define the option shape for their navigator.
        const staticResult = typeof staticOptions === 'function' ? staticOptions(args) : staticOptions;
        const dynamicResult = typeof options === 'function' ? options?.(args) : options;
        const output = {
            ...staticResult,
            ...dynamicResult
        };
        // Prevent generated screens from showing up in the tab bar.
        if (route.internal || isGuarded) {
            // TODO(@ubax): Document migrating withLayoutContext navigators to standard navigation,
            // where processScreens can map hidden to navigator-specific options.
            output.hidden = true;
        }
        // The merged object may contain only part of `TOptions`.
        return output;
    };
}
function routeToScreen(route, { options, getId, ...props } = {}, isGuarded, routeSource) {
    return /*#__PURE__*/ (0, _react().createElement)(_primitives.Screen, {
        ...props,
        name: route.route,
        key: route.route,
        getId: getId,
        routeSource: routeSource,
        options: screenOptionsFactory(route, options, isGuarded),
        getComponent: ()=>getQualifiedRouteComponent(route)
    });
}

//# sourceMappingURL=useScreens.js.map
