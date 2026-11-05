'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useDismissedRouteError", {
    enumerable: true,
    get: function() {
        return useDismissedRouteError;
    }
});
function _react() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
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
function useDismissedRouteError(state, isPreloaded) {
    const [nextDismissedKey, setNextDismissedKey] = _react().useState(null);
    const activeRoutes = state.routes.filter((route)=>!isPreloaded(route.key));
    const dismissedRouteName = nextDismissedKey ? activeRoutes.find((route)=>route.key === nextDismissedKey)?.name : null;
    _react().useEffect(()=>{
        if (dismissedRouteName) {
            const message = `The screen '${dismissedRouteName}' was removed natively but didn't get removed from JS state. ` + `This can happen if the action was prevented with 'usePreventRemove' after native dismissal began.\n\n` + `Keep 'usePreventRemove' enabled until the blocked navigation attempt has completed.`;
            console.error(message);
        }
    }, [
        dismissedRouteName
    ]);
    return {
        setNextDismissedKey
    };
}

//# sourceMappingURL=useDismissedRouteError.js.map
