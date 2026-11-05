'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useLocale", {
    enumerable: true,
    get: function() {
        return useLocale;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _LocaleDirContext = require("./LocaleDirContext");
function useLocale() {
    const direction = (0, _react().use)(_LocaleDirContext.LocaleDirContext);
    if (direction === undefined) {
        throw new Error("Couldn't determine the text direction. Is your component inside NavigationContainer?");
    }
    return {
        direction
    };
}

//# sourceMappingURL=useLocale.js.map
