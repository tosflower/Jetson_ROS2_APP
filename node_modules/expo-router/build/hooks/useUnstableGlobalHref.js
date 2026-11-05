'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useUnstableGlobalHref", {
    enumerable: true,
    get: function() {
        return useUnstableGlobalHref;
    }
});
const _useRouteInfo = require("../global-state/useRouteInfo");
function useUnstableGlobalHref() {
    return (0, _useRouteInfo.useRouteInfo)().unstable_globalHref;
}

//# sourceMappingURL=useUnstableGlobalHref.js.map
