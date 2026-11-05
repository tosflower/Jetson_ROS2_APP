'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useInvalidPreventRemoveError", {
    enumerable: true,
    get: function() {
        return useInvalidPreventRemoveError;
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
function useInvalidPreventRemoveError(descriptors, isRemovalPrevented) {
    // TODO(@ubax): remove this hook later.
    const preventedDescriptor = Object.values(descriptors).find(({ route })=>route.key !== undefined && isRemovalPrevented(route.key));
    const isHeaderBackButtonMenuEnabledOnPreventedScreen = preventedDescriptor?.options?.headerBackButtonMenuEnabled;
    const preventedRouteName = preventedDescriptor?.route?.name;
    _react().useEffect(()=>{
        if (preventedDescriptor != null && isHeaderBackButtonMenuEnabledOnPreventedScreen) {
            const message = `The screen ${preventedRouteName} uses 'usePreventRemove' hook alongside 'headerBackButtonMenuEnabled: true', which is not supported. \n\n` + `Consider removing 'headerBackButtonMenuEnabled: true' from ${preventedRouteName} screen to get rid of this error.`;
            console.error(message);
        }
    }, [
        preventedDescriptor,
        isHeaderBackButtonMenuEnabledOnPreventedScreen,
        preventedRouteName
    ]);
}

//# sourceMappingURL=useInvalidPreventRemoveError.js.map
