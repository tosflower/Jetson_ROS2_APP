'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useRoute", {
    enumerable: true,
    get: function() {
        return useRoute;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _NavigationProvider = require("./NavigationProvider");
function useRoute() {
    const route = (0, _react().use)(_NavigationProvider.NavigationRouteContext);
    if (route === undefined) {
        throw new Error("Couldn't find a route object. Is your component inside a screen in a navigator?");
    }
    return route;
}

//# sourceMappingURL=useRoute.js.map
