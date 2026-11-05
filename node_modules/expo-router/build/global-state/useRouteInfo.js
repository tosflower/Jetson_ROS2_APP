'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useRouteInfo", {
    enumerable: true,
    get: function() {
        return useRouteInfo;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _PreviewRouteContext = require("../link/preview/PreviewRouteContext");
const _routeInfoContext = require("./routeInfoContext");
function useRouteInfo() {
    const routeInfo = (0, _react().use)(_routeInfoContext.RouteInfoContext);
    const { isPreview, segments, params, pathname } = (0, _PreviewRouteContext.usePreviewInfo)();
    if (isPreview) {
        return {
            pathname: pathname ?? '',
            segments: segments ?? [],
            unstable_globalHref: '',
            params: params ?? {},
            searchParams: new URLSearchParams(),
            pathnameWithParams: pathname ?? '',
            isIndex: false
        };
    }
    return routeInfo;
}

//# sourceMappingURL=useRouteInfo.js.map
