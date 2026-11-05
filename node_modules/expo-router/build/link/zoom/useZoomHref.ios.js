'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useZoomHref", {
    enumerable: true,
    get: function() {
        return useZoomHref;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _navigationParams = require("../../navigationParams");
const _url = require("../../utils/url");
const _zoomtransitioncontext = require("./zoom-transition-context");
function useZoomHref({ href }) {
    const value = (0, _react().use)(_zoomtransitioncontext.ZoomTransitionSourceContext);
    if (!value) {
        throw new Error('[expo-router] useZoomHref must be used within a ZoomTransitionSourceContextProvider. This is most likely a bug in expo-router.');
    }
    const { hasZoomSource, identifier } = value;
    return (0, _react().useMemo)(()=>{
        if (!hasZoomSource) {
            return href;
        }
        if (typeof href === 'string') {
            const { pathname, searchParams } = (0, _url.parseUrlUsingCustomBase)(href);
            return {
                pathname,
                params: {
                    ...Object.fromEntries(searchParams.entries()),
                    [_navigationParams.INTERNAL_EXPO_ROUTER_ZOOM_TRANSITION_SOURCE_ID_PARAM_NAME]: identifier
                }
            };
        }
        return {
            pathname: href.pathname,
            params: {
                ...href.params ?? {},
                [_navigationParams.INTERNAL_EXPO_ROUTER_ZOOM_TRANSITION_SOURCE_ID_PARAM_NAME]: identifier
            }
        };
    }, [
        href,
        identifier,
        hasZoomSource
    ]);
}

//# sourceMappingURL=useZoomHref.ios.js.map
