"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useSafeLayoutEffect", {
    enumerable: true,
    get: function() {
        return useSafeLayoutEffect;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const useSafeLayoutEffect = typeof window !== 'undefined' ? _react().useLayoutEffect : function() {};

//# sourceMappingURL=useSafeLayoutEffect.js.map
