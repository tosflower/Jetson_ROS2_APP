'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useCurrentRender", {
    enumerable: true,
    get: function() {
        return useCurrentRender;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _CurrentRenderContext = require("./CurrentRenderContext");
const _useIsFocused = require("./useIsFocused");
function useCurrentRender({ state, descriptors }) {
    const current = (0, _react().use)(_CurrentRenderContext.CurrentRenderContext);
    const focusedRoute = state.routes[state.index];
    const isFocused = (0, _useIsFocused.useIsRouteFocused)(undefined);
    if (current && focusedRoute && isFocused) {
        current.options = descriptors[focusedRoute.key]?.options;
    }
}

//# sourceMappingURL=useCurrentRender.js.map
