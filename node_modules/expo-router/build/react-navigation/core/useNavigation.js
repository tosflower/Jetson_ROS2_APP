'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useNavigation", {
    enumerable: true,
    get: function() {
        return useNavigation;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _NavigationContext = require("./NavigationContext");
function useNavigation() {
    const navigation = (0, _react().use)(_NavigationContext.NavigationContext);
    if (navigation === undefined) {
        throw new Error("Couldn't find a navigation object. Make sure the component is rendered inside your app's route tree. This is most likely a bug in expo-router. Please report it at https://github.com/expo/expo/issues.");
    }
    return navigation;
}

//# sourceMappingURL=useNavigation.js.map
