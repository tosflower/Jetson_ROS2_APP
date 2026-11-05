'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useFocusedListenersChildrenAdapter", {
    enumerable: true,
    get: function() {
        return useFocusedListenersChildrenAdapter;
    }
});
function _react() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
const _NavigationBuilderContext = require("./NavigationBuilderContext");
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
function useFocusedListenersChildrenAdapter({ navigation, focusedListeners }) {
    const { addListener } = (0, _react().use)(_NavigationBuilderContext.NavigationBuilderContext);
    const listener = _react().useCallback((callback)=>{
        if (navigation.isFocused()) {
            for (const listener of focusedListeners){
                const { handled, result } = listener(callback);
                if (handled) {
                    return {
                        handled,
                        result
                    };
                }
            }
            return {
                handled: true,
                result: callback(navigation)
            };
        } else {
            return {
                handled: false,
                result: null
            };
        }
    }, [
        focusedListeners,
        navigation
    ]);
    _react().useEffect(()=>addListener?.('focus', listener), [
        addListener,
        listener
    ]);
}

//# sourceMappingURL=useFocusedListenersChildrenAdapter.js.map
