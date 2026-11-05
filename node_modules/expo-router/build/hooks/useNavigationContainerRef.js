'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useNavigationContainerRef", {
    enumerable: true,
    get: function() {
        return useNavigationContainerRef;
    }
});
const _navigationRef = require("../global-state/navigationRef");
function useNavigationContainerRef() {
    // TODO(@ubax): migrate this to NavigationContainerRefContext without changing the public return type
    return _navigationRef.navigationRef;
}

//# sourceMappingURL=useNavigationContainerRef.js.map
