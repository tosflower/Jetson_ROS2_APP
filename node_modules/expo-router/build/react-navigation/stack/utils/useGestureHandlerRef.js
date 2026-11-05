'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useGestureHandlerRef", {
    enumerable: true,
    get: function() {
        return useGestureHandlerRef;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _GestureHandlerRefContext = require("./GestureHandlerRefContext");
function useGestureHandlerRef() {
    const ref = (0, _react().use)(_GestureHandlerRefContext.GestureHandlerRefContext);
    if (ref === undefined) {
        throw new Error("Couldn't find a ref for gesture handler. Are you inside a screen in Stack?");
    }
    return ref;
}

//# sourceMappingURL=useGestureHandlerRef.js.map
