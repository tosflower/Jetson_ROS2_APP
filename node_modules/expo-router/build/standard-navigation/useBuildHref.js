"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useBuildHref", {
    enumerable: true,
    get: function() {
        return useBuildHref;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _getRouteInfoFromState = require("../global-state/getRouteInfoFromState");
const _core = require("../react-navigation/core");
function useBuildHref() {
    const currentState = (0, _core.useStateForPath)();
    return (0, _react().useMemo)(()=>{
        // This cache uses object identity, so inline route objects never produce cache hits.
        const cache = new WeakMap();
        return (route)=>{
            const cached = cache.get(route);
            if (cached !== undefined) {
                return cached;
            }
            const state = {
                routes: [
                    {
                        name: route.name,
                        params: route.params
                    }
                ]
            };
            const addState = (parent)=>{
                const parentRoute = parent?.routes[0];
                if (parentRoute) {
                    return {
                        routes: [
                            {
                                ...parentRoute,
                                state: addState(parentRoute.state)
                            }
                        ]
                    };
                }
                return state;
            };
            const href = (0, _getRouteInfoFromState.getRouteInfoFromState)(addState(currentState)).pathnameWithParams;
            cache.set(route, href);
            return href;
        };
    }, [
        currentState
    ]);
}

//# sourceMappingURL=useBuildHref.js.map
