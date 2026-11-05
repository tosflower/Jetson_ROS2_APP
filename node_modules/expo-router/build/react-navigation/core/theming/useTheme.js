'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useTheme", {
    enumerable: true,
    get: function() {
        return useTheme;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _ThemeContext = require("./ThemeContext");
function useTheme() {
    const theme = (0, _react().use)(_ThemeContext.ThemeContext);
    if (theme == null) {
        throw new Error("Couldn't find a theme. Is your component inside NavigationContainer or does it have a theme?");
    }
    return theme;
}

//# sourceMappingURL=useTheme.js.map
