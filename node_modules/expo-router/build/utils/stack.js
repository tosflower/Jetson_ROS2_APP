"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getHistoryLength", {
    enumerable: true,
    get: function() {
        return getHistoryLength;
    }
});
function getHistoryLength(state) {
    if (state.history) {
        return state.history.length;
    }
    if (state.type === 'stack') {
        if (state.index === undefined) {
            return 1;
        }
        // All routes after `state.index` are preloaded.
        return state.index + 1;
    }
    // Without a type or history, stack and tabs both use the route count as their history length.
    return state.routes.length;
}

//# sourceMappingURL=stack.js.map
