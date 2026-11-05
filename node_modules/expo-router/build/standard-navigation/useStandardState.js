"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useStandardState", {
    enumerable: true,
    get: function() {
        return useStandardState;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _useBuildHref = require("./useBuildHref");
function useStandardState(builderState) {
    const buildHref = (0, _useBuildHref.useBuildHref)();
    return (0, _react().useMemo)(()=>{
        return {
            index: builderState.index,
            routes: builderState.routes.map((route)=>({
                    href: buildHref(route),
                    key: route.key,
                    name: route.name,
                    params: route.params,
                    // `makeRestoreRouteAction` needs these to restore cancelled nested transitions.
                    path: route.path,
                    state: route.state
                }))
        };
    }, [
        builderState,
        buildHref
    ]);
}

//# sourceMappingURL=useStandardState.js.map
