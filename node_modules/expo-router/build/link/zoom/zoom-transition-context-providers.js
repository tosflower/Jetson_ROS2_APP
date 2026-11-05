"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ZoomTransitionSourceContextProvider: null,
    ZoomTransitionTargetContextProvider: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ZoomTransitionSourceContextProvider () {
        return ZoomTransitionSourceContextProvider;
    },
    get ZoomTransitionTargetContextProvider () {
        return ZoomTransitionTargetContextProvider;
    }
});
function ZoomTransitionSourceContextProvider({ children }) {
    return children;
}
function ZoomTransitionTargetContextProvider({ children }) {
    return children;
}

//# sourceMappingURL=zoom-transition-context-providers.js.map
