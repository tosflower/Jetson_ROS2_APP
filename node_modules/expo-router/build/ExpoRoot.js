'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ExpoRoot", {
    enumerable: true,
    get: function() {
        return ExpoRoot;
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
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
const _SafeAreaProvider = require("./SafeAreaProvider");
const _constants = require("./constants");
const _useDomComponentNavigation = require("./domComponents/useDomComponentNavigation");
const _NavigationContainer = require("./fork/NavigationContainer");
const _navigationRef = require("./global-state/navigationRef");
const _removalPrevention = require("./global-state/removalPrevention");
const _routerConfigContext = require("./global-state/routerConfigContext");
const _routingQueueContext = require("./global-state/routingQueueContext");
const _useStore = require("./global-state/useStore");
const _utils = require("./global-state/utils");
const _LinkPreviewContext = require("./link/preview/LinkPreviewContext");
const _primitives = require("./primitives");
const _native = require("./react-navigation/native");
const _screensFeatureFlags = require("./screensFeatureFlags");
const _splash = require("./utils/splash");
const _url = require("./utils/url");
const _RootUnmatched = require("./views/RootUnmatched");
const _Sitemap = require("./views/Sitemap");
const _Splash = /*#__PURE__*/ _interop_require_wildcard(require("./views/Splash"));
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
const isTestEnv = process.env.NODE_ENV === 'test';
const INITIAL_METRICS = _reactnative().Platform.OS === 'web' || isTestEnv ? {
    frame: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    },
    insets: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }
} : undefined;
function ExpoRoot({ wrapper: ParentWrapper = _react().Fragment, ...props }) {
    (0, _screensFeatureFlags.initScreensFeatureFlags)();
    // On the server, the parent wrapper renders the HTML document and `<div id="root">`. It stays
    // outside the navigation container, so the container's Suspense boundary is inside `#root`
    // like in the browser.
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(ParentWrapper, {
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_routingQueueContext.RoutingQueueProvider, {
            children: /*#__PURE__*/ (0, _jsxruntime().jsx)(ContextNavigator, {
                ...props,
                wrapper: AppWrapper
            })
        })
    });
}
function AppWrapper({ children }) {
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_LinkPreviewContext.LinkPreviewContextProvider, {
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_SafeAreaProvider.SafeAreaProvider, {
            // SSR support
            initialMetrics: INITIAL_METRICS,
            children: children
        })
    });
}
const initialUrl = _reactnative().Platform.OS === 'web' && typeof window !== 'undefined' ? new URL(window.location.href) : undefined;
function ContextNavigator({ context, location: initialLocation = initialUrl, wrapper: WrapperComponent = _react().Fragment, linking = {} }) {
    // location and linking.getInitialURL are both used to initialize the router state
    //  - location is used on web and during static rendering
    //  - linking.getInitialURL is used on native
    const serverUrl = (0, _react().useMemo)(()=>{
        const url = typeof initialLocation === 'string' ? (0, _url.parseUrlUsingCustomBase)(initialLocation) : initialLocation;
        if (url && url instanceof URL) {
            return `${url.pathname}${url.search}${url.hash}`;
        }
        return undefined;
    }, []);
    const { routerConfig, rootComponent } = (0, _useStore.useRouterConfig)(context, linking, serverUrl);
    const { linking: linkingConfig, routeNode } = routerConfig;
    (0, _useDomComponentNavigation.useDomComponentNavigation)();
    // TODO(@ubax): Revisit onboarding once route creation is React-owned.
    if (process.env.NODE_ENV === 'development' && !routeNode) {
        _Splash.hideAsync();
        if (process.env.NODE_ENV === 'development') {
            const Tutorial = require('./onboard/Tutorial').Tutorial;
            return /*#__PURE__*/ (0, _jsxruntime().jsx)(WrapperComponent, {
                children: /*#__PURE__*/ (0, _jsxruntime().jsx)(Tutorial, {})
            });
        } else {
            // Ensure tutorial styles are stripped in production.
            return null;
        }
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_routerConfigContext.RouterConfigContext.Provider, {
        value: routerConfig,
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_removalPrevention.RemovalPreventionProvider, {
            children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_NavigationContainer.NavigationContainer, {
                ref: _navigationRef.navigationRef,
                linking: linkingConfig,
                children: /*#__PURE__*/ (0, _jsxruntime().jsx)(WrapperComponent, {
                    children: /*#__PURE__*/ (0, _jsxruntime().jsx)(Content, {
                        rootComponent: rootComponent
                    })
                })
            })
        })
    });
}
function Content({ rootComponent }) {
    const children = [
        /*#__PURE__*/ (0, _jsxruntime().jsx)(_primitives.Screen, {
            name: _constants.INTERNAL_SLOT_NAME,
            component: rootComponent
        }, "SLOT")
    ];
    if ((0, _utils.shouldAppendNotFound)()) {
        children.push(/*#__PURE__*/ (0, _jsxruntime().jsx)(_primitives.Screen, {
            name: _constants.NOT_FOUND_ROUTE_NAME,
            component: _RootUnmatched.RootUnmatched
        }, "NOT-FOUND"));
    }
    if ((0, _utils.shouldAppendSitemap)()) {
        children.push(/*#__PURE__*/ (0, _jsxruntime().jsx)(_primitives.Screen, {
            name: _constants.SITEMAP_ROUTE_NAME,
            component: _Sitemap.Sitemap
        }, "SITEMAP"));
    }
    const { state, descriptors, NavigationContent } = (0, _native.useNavigationBuilder)(_native.StackRouter, {
        children,
        id: _constants.INTERNAL_SLOT_NAME
    });
    (0, _react().useEffect)(()=>{
        (0, _splash.maybeHideSplashScreen)();
    }, []);
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(NavigationContent, {
        children: descriptors[state.routes[state.index].key].render()
    });
}

//# sourceMappingURL=ExpoRoot.js.map
