// Kept outside the vendored tree so Node.js code can import it without loading React Native.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "findFocusedRoute", {
    enumerable: true,
    get: function() {
        return findFocusedRoute;
    }
});
function findFocusedRoute(state) {
    let current = state;
    while(current?.routes[current.index ?? 0]?.state != null){
        current = current.routes[current.index ?? 0].state;
    }
    const route = current?.routes[current?.index ?? 0];
    return route;
}

//# sourceMappingURL=findFocusedRoute.js.map
