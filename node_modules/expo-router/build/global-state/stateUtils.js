"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    findStateByKey: null,
    resetNavigatorState: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get findStateByKey () {
        return findStateByKey;
    },
    get resetNavigatorState () {
        return resetNavigatorState;
    }
});
function findStateByKey(root, key) {
    if (root.key === key) {
        return root;
    }
    for (const route of root.routes){
        if (route.state?.stale === false) {
            const state = findStateByKey(route.state, key);
            if (state) {
                return state;
            }
        }
    }
    return undefined;
}
function resetNavigatorState(state, routerType) {
    const focusedRoute = state.routes[state.index];
    return {
        stale: state.stale,
        key: state.key,
        routeKeySeq: state.routeKeySeq,
        type: routerType,
        routeNames: state.routeNames,
        routes: focusedRoute ? [
            focusedRoute
        ] : [],
        index: focusedRoute ? 0 : -1
    };
}

//# sourceMappingURL=stateUtils.js.map
