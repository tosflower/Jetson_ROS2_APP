'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useBottomTabBarHeight", {
    enumerable: true,
    get: function() {
        return useBottomTabBarHeight;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _BottomTabBarHeightContext = require("./BottomTabBarHeightContext");
function useBottomTabBarHeight() {
    const height = (0, _react().use)(_BottomTabBarHeightContext.BottomTabBarHeightContext);
    if (height === undefined) {
        throw new Error("Couldn't find the bottom tab bar height. Are you inside a screen in Bottom Tab Navigator?");
    }
    return height;
}

//# sourceMappingURL=useBottomTabBarHeight.js.map
