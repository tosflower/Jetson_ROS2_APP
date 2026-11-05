'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useCurrentRouteInfo", {
    enumerable: true,
    get: function() {
        return useCurrentRouteInfo;
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
const _native = require("../react-navigation/native");
function useCurrentRouteInfo() {
    const state = (0, _native.useStateForPath)();
    return (0, _react().useMemo)(()=>state ? (0, _getRouteInfoFromState.getRouteInfoFromState)(state) : undefined, [
        state
    ]);
}

//# sourceMappingURL=useCurrentRouteInfo.js.map
