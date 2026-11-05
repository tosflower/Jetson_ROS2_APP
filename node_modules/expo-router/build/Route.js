'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    LocalRouteParamsContext: null,
    Route: null,
    ScreenErrorBoundaryContext: null,
    SuspenseFallbackContext: null,
    sortRoutes: null,
    sortRoutesWithInitial: null,
    useContextKey: null,
    useRouteNode: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get LocalRouteParamsContext () {
        return LocalRouteParamsContext;
    },
    get Route () {
        return Route;
    },
    get ScreenErrorBoundaryContext () {
        return ScreenErrorBoundaryContext;
    },
    get SuspenseFallbackContext () {
        return SuspenseFallbackContext;
    },
    get sortRoutes () {
        return _sortRoutes.sortRoutes;
    },
    get sortRoutesWithInitial () {
        return _sortRoutes.sortRoutesWithInitial;
    },
    get useContextKey () {
        return useContextKey;
    },
    get useRouteNode () {
        return useRouteNode;
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
const _matchers = require("./matchers");
const _sortRoutes = require("./sortRoutes");
const CurrentRouteContext = /*#__PURE__*/ (0, _react().createContext)(null);
const SuspenseFallbackContext = /*#__PURE__*/ (0, _react().createContext)(undefined);
const ScreenErrorBoundaryContext = /*#__PURE__*/ (0, _react().createContext)(undefined);
const LocalRouteParamsContext = /*#__PURE__*/ (0, _react().createContext)({});
if (process.env.NODE_ENV !== 'production') {
    CurrentRouteContext.displayName = 'RouteNode';
}
function useRouteNode() {
    return (0, _react().use)(CurrentRouteContext);
}
function useContextKey() {
    const node = useRouteNode();
    if (node == null) {
        throw new Error('No filename found. This is likely a bug in expo-router.');
    }
    return (0, _matchers.getContextKey)(node.contextKey);
}
function Route({ children, node, params }) {
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(LocalRouteParamsContext.Provider, {
        value: params,
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(CurrentRouteContext.Provider, {
            value: node,
            children: children
        })
    });
}

//# sourceMappingURL=Route.js.map
