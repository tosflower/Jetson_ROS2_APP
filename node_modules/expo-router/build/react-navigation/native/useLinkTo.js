'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useLinkTo", {
    enumerable: true,
    get: function() {
        return useLinkTo;
    }
});
function _react() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
const _core = require("../core");
const _useLinkBuilder = require("./useLinkBuilder");
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
function useLinkTo() {
    const navigation = _react().useContext(_core.NavigationContainerRefContext);
    const buildAction = (0, _useLinkBuilder.useBuildAction)();
    const linkTo = _react().useCallback((href)=>{
        if (navigation === undefined) {
            throw new Error("Couldn't find a navigation object. Is your component inside NavigationContainer?");
        }
        const action = buildAction(href);
        navigation.dispatch(action);
    }, [
        buildAction,
        navigation
    ]);
    return linkTo;
}

//# sourceMappingURL=useLinkTo.js.map
