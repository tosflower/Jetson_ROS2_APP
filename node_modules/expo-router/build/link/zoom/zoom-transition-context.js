'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ZoomTransitionSourceContext: null,
    ZoomTransitionTargetContext: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ZoomTransitionSourceContext () {
        return ZoomTransitionSourceContext;
    },
    get ZoomTransitionTargetContext () {
        return ZoomTransitionTargetContext;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const ZoomTransitionSourceContext = /*#__PURE__*/ (0, _react().createContext)(undefined);
const ZoomTransitionTargetContext = /*#__PURE__*/ (0, _react().createContext)({
    identifier: null,
    dismissalBoundsRect: null,
    setDismissalBoundsRect: ()=>{},
    addEnabler: ()=>{},
    removeEnabler: ()=>{},
    hasEnabler: false
});

//# sourceMappingURL=zoom-transition-context.js.map
