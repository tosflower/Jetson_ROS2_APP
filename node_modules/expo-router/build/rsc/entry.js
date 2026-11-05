/**
 * Copyright © 2024 650 Industries.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ 'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "App", {
    enumerable: true,
    get: function() {
        return App;
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
    const data = /*#__PURE__*/ _interop_require_default(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
const _SafeAreaProvider = require("../SafeAreaProvider");
const _ErrorBoundary = require("../views/ErrorBoundary");
const _Try = require("../views/Try");
const _client = require("./router/client");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// Add root error recovery.
function RootErrorBoundary(props) {
    _react().default.useEffect(()=>{
        function refetchRoute() {
            if (props.error) {
                props.retry();
            }
        }
        // TODO: Only strip when not connected to a dev server.
        if (process.env.NODE_ENV === 'development') {
            globalThis.__EXPO_RSC_RELOAD_LISTENERS__ ||= [];
            const index = globalThis.__EXPO_RSC_RELOAD_LISTENERS__.indexOf(globalThis.__EXPO_REFETCH_ROUTE__);
            if (index !== -1) {
                globalThis.__EXPO_RSC_RELOAD_LISTENERS__.splice(index, 1, refetchRoute);
            } else {
                globalThis.__EXPO_RSC_RELOAD_LISTENERS__.unshift(refetchRoute);
            }
            globalThis.__EXPO_REFETCH_ROUTE__ = refetchRoute;
        }
    }, [
        props.error,
        props.retry
    ]);
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_ErrorBoundary.ErrorBoundary, {
        error: props.error,
        retry: ()=>{
            // TODO: Invalidate the cache automatically when the request fails.
            // Invalidate the fetch cache so we can retry the request.
            globalThis.__EXPO_REFETCH_ROUTE_NO_CACHE__?.();
            return props.retry();
        }
    });
}
function App() {
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_SafeAreaProvider.SafeAreaProvider, {
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_Try.Try, {
            catch: RootErrorBoundary,
            children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_client.Router, {})
        })
    });
}

//# sourceMappingURL=entry.js.map
