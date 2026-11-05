'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useRootNavigation", {
    enumerable: true,
    get: function() {
        return useRootNavigation;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _native = require("../react-navigation/native");
function useRootNavigation() {
    return (0, _react().use)(_native.NavigationContainerRefContext) ?? null;
}

//# sourceMappingURL=useRootNavigation.js.map
