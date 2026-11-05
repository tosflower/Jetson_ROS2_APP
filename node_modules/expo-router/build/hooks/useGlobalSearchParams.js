'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useGlobalSearchParams", {
    enumerable: true,
    get: function() {
        return useGlobalSearchParams;
    }
});
const _useRouteInfo = require("../global-state/useRouteInfo");
function useGlobalSearchParams() {
    return (0, _useRouteInfo.useRouteInfo)().params;
}

//# sourceMappingURL=useGlobalSearchParams.js.map
