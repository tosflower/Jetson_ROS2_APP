'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useRoutePath", {
    enumerable: true,
    get: function() {
        return useRoutePath;
    }
});
function _react() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
const _getPathFromState = require("../../fork/getPathFromState");
const _core = require("../core");
const _LinkingContext = require("./LinkingContext");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function useRoutePath() {
    const { options } = (0, _react().use)(_LinkingContext.LinkingContext);
    const state = (0, _core.useStateForPath)();
    if (state === undefined) {
        throw new Error("Couldn't find a state for the route object. Is your component inside a screen in a navigator?");
    }
    const getPathFromStateHelper = options?.getPathFromState ?? _getPathFromState.getPathFromState;
    const path = _react().useMemo(()=>{
        const path = getPathFromStateHelper(state, options?.config);
        return path;
    }, [
        options?.config,
        state,
        getPathFromStateHelper
    ]);
    return path;
}

//# sourceMappingURL=useRoutePath.js.map
