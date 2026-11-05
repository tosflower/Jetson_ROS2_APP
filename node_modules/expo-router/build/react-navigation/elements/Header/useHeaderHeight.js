'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useHeaderHeight", {
    enumerable: true,
    get: function() {
        return useHeaderHeight;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _HeaderHeightContext = require("./HeaderHeightContext");
function useHeaderHeight() {
    const height = (0, _react().use)(_HeaderHeightContext.HeaderHeightContext);
    if (height === undefined) {
        throw new Error("Couldn't find the header height. Are you inside a screen in a navigator with a header?");
    }
    return height;
}

//# sourceMappingURL=useHeaderHeight.js.map
