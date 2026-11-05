'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useStateForPath", {
    enumerable: true,
    get: function() {
        return useStateForPath;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _NavigationFocusedRouteStateContext = require("./NavigationFocusedRouteStateContext");
function useStateForPath() {
    const state = (0, _react().use)(_NavigationFocusedRouteStateContext.NavigationFocusedRouteStateContext);
    return state;
}

//# sourceMappingURL=useStateForPath.js.map
