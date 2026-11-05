'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useDrawerStatus", {
    enumerable: true,
    get: function() {
        return useDrawerStatus;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _DrawerStatusContext = require("./DrawerStatusContext");
function useDrawerStatus() {
    const drawerStatus = (0, _react().use)(_DrawerStatusContext.DrawerStatusContext);
    if (drawerStatus === undefined) {
        throw new Error("Couldn't find a drawer. Is your component inside a drawer navigator?");
    }
    return drawerStatus;
}

//# sourceMappingURL=useDrawerStatus.js.map
