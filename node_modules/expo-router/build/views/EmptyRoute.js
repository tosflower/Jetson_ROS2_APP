'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmptyRoute", {
    enumerable: true,
    get: function() {
        return EmptyRoute;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
const _Route = require("../Route");
const _Toast = require("./Toast");
function EmptyRoute() {
    const route = (0, _Route.useRouteNode)();
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_Toast.ToastWrapper, {
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_Toast.Toast, {
            warning: true,
            filename: route?.contextKey,
            children: "Missing default export"
        })
    });
}

//# sourceMappingURL=EmptyRoute.js.map
