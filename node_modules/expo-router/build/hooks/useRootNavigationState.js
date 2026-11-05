'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useRootNavigationState", {
    enumerable: true,
    get: function() {
        return useRootNavigationState;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _RootNavigationStateContext = require("../react-navigation/core/RootNavigationStateContext");
function useRootNavigationState() {
    const state = (0, _react().use)(_RootNavigationStateContext.RootNavigationStateContext);
    if (state === undefined) {
        throw new Error('useRootNavigationState was called from a generated route. This is likely a bug in Expo Router.');
    }
    return state;
}

//# sourceMappingURL=useRootNavigationState.js.map
