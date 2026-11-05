'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useSegments", {
    enumerable: true,
    get: function() {
        return useSegments;
    }
});
const _useRouteInfo = require("../global-state/useRouteInfo");
function useSegments() {
    return (0, _useRouteInfo.useRouteInfo)().segments;
}

//# sourceMappingURL=useSegments.js.map
