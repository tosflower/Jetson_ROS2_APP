// Copyright © 2024 650 Industries.
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    DefaultNavigator: null,
    Navigator: null,
    NavigatorContext: null,
    Slot: null,
    useNavigatorContext: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get DefaultNavigator () {
        return DefaultNavigator;
    },
    get Navigator () {
        return Navigator;
    },
    get NavigatorContext () {
        return NavigatorContext;
    },
    get Slot () {
        return Slot;
    },
    get useNavigatorContext () {
        return useNavigatorContext;
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
function _reactnativesafeareacontext() {
    const data = require("react-native-safe-area-context");
    _reactnativesafeareacontext = function() {
        return data;
    };
    return data;
}
const _Route = require("../Route");
const _GuardContext = require("../layouts/GuardContext");
const _StackClient = require("../layouts/StackClient");
const _withLayoutContext = require("../layouts/withLayoutContext");
const _native = require("../react-navigation/native");
const _routeNode = require("../routeNode");
const _standardnavigation = require("../standard-navigation");
const _useScreens = require("../useScreens");
const _Screen = require("./Screen");
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
const NavigatorContext = /*#__PURE__*/ _react().createContext(null);
if (process.env.NODE_ENV !== 'production') {
    NavigatorContext.displayName = 'NavigatorContext';
}
function Navigator({ screenOptions, children, activityEnabled, activityDefaultThreshold = 2, router, routerOptions, unstable_screenErrorBoundary }) {
    const contextKey = (0, _Route.useContextKey)();
    const node = (0, _Route.useRouteNode)();
    // A custom navigator can have a mix of Screen and other components (like a Slot inside a View)
    const { screens, children: nonScreenChildren, guardedRedirects } = (0, _withLayoutContext.useFilterScreenChildren)(children, {
        isCustomNavigator: true,
        contextKey
    });
    const sortedScreens = (0, _useScreens.useSortedScreens)(screens ?? [], guardedRedirects);
    router ||= _StackClient.StackRouter;
    const navigation = (0, _native.useNavigationBuilder)(router, {
        // Used for getting the parent with navigation.getParent('/normalized/path')
        ...routerOptions,
        id: contextKey,
        children: sortedScreens || [
            /*#__PURE__*/ (0, _jsxruntime().jsx)(_Screen.Screen, {}, "default")
        ],
        activityEnabled,
        screenOptions,
        initialRouteName: (0, _routeNode.getValidInitialRouteName)(node)
    }, {
        activityDefaultThreshold
    });
    // useNavigationBuilder requires at least one screen to be defined otherwise it will throw.
    if (!sortedScreens.length) {
        console.warn(`Navigator at "${contextKey}" has no children.`);
        return null;
    }
    const content = /*#__PURE__*/ (0, _jsxruntime().jsx)(_GuardContext.GuardContextProvider, {
        node: node,
        guardedRedirects: guardedRedirects,
        children: nonScreenChildren
    });
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(NavigatorContext.Provider, {
        value: {
            ...navigation,
            contextKey,
            router
        },
        children: unstable_screenErrorBoundary ? /*#__PURE__*/ (0, _jsxruntime().jsx)(_Route.ScreenErrorBoundaryContext, {
            value: unstable_screenErrorBoundary,
            children: content
        }) : content
    });
}
function useNavigatorContext() {
    const context = _react().use(NavigatorContext);
    if (!context) {
        throw new Error('useNavigatorContext must be used within a <Navigator />');
    }
    return context;
}
function SlotContent({ state, descriptors }) {
    const focusedRouteKey = state.routes[state.index]?.key;
    return focusedRouteKey ? descriptors[focusedRouteKey]?.render() ?? null : null;
}
const RouterSlot = (0, _standardnavigation.createStandardRouterNavigator)(SlotContent, _StackClient.StackRouter, {
    activityDefaultThreshold: 1
});
function Slot(props) {
    const contextKey = (0, _Route.useContextKey)();
    const context = _react().use(NavigatorContext);
    if (context?.contextKey !== contextKey) {
        // The _layout has changed since the last navigator
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(RouterSlot, {
            ...props
        });
    }
    /*
   * The user has defined a custom navigator
   * <Navigator><Slot /></Navigator>
   */ return /*#__PURE__*/ (0, _jsxruntime().jsx)(NavigatorSlot, {});
}
/**
 * Render the current navigator content.
 */ function NavigatorSlot() {
    const context = useNavigatorContext();
    const { state, descriptors } = context;
    const focusedRouteKey = state.routes[state.index]?.key;
    return focusedRouteKey ? descriptors[focusedRouteKey]?.render() ?? null : null;
}
function DefaultNavigator() {
    if (process.env.EXPO_OS === 'android') {
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(RouterSlot, {});
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnativesafeareacontext().SafeAreaView, {
        style: {
            flex: 1
        },
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(RouterSlot, {})
    });
}
Navigator.Slot = NavigatorSlot;
Navigator.useContext = useNavigatorContext;
/** Used to configure route settings. */ Navigator.Screen = _Screen.Screen;

//# sourceMappingURL=Navigator.js.map
