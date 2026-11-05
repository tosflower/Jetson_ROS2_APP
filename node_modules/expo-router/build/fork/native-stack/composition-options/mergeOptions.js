"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "mergeOptions", {
    enumerable: true,
    get: function() {
        return mergeOptions;
    }
});
function mergeOptions(descriptors, registry, state) {
    const result = {};
    const activeRoutes = state.routes.slice(0, state.index + 1);
    const preloadedRoutes = state.routes.slice(state.index + 1);
    const focusedKey = activeRoutes[state.index]?.key;
    for(const key in descriptors){
        const descriptor = descriptors[key];
        const routeOptions = registry[key];
        // No composition options or empty array → pass through
        if (!routeOptions || routeOptions.length === 0) {
            result[key] = descriptor;
            continue;
        }
        // Check if route is preloaded and not focused → skip composition
        const isPreloaded = preloadedRoutes.some((route)=>route.key === key);
        if (isPreloaded && key !== focusedKey) {
            result[key] = descriptor;
            continue;
        }
        // Merge: descriptor options as base, composition options override
        const mergedOptions = Object.assign({}, descriptor.options, ...routeOptions);
        const merged = {
            ...descriptor,
            options: mergedOptions
        };
        result[key] = merged;
    }
    return result;
}

//# sourceMappingURL=mergeOptions.js.map
