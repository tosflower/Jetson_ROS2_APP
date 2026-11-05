'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    PreviewRouteContext: null,
    useIsPreview: null,
    usePreviewInfo: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get PreviewRouteContext () {
        return PreviewRouteContext;
    },
    get useIsPreview () {
        return useIsPreview;
    },
    get usePreviewInfo () {
        return usePreviewInfo;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const PreviewRouteContext = (0, _react().createContext)(undefined);
function usePreviewInfo() {
    const paramsContext = (0, _react().use)(PreviewRouteContext);
    return {
        isPreview: !!paramsContext,
        ...paramsContext
    };
}
function useIsPreview() {
    const { isPreview } = usePreviewInfo();
    return isPreview;
}

//# sourceMappingURL=PreviewRouteContext.js.map
