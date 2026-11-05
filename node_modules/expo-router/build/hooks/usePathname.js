'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "usePathname", {
    enumerable: true,
    get: function() {
        return usePathname;
    }
});
const _useRouteInfo = require("../global-state/useRouteInfo");
function usePathname() {
    return (0, _useRouteInfo.useRouteInfo)().pathname;
}

//# sourceMappingURL=usePathname.js.map
