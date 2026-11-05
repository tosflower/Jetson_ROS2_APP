"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * React hook which returns the latest callback without changing the reference.
 */ // TODO(@ubax): RN Migration - Consider replacing with useEffectEvent when it becomes stable
"default", {
    enumerable: true,
    get: function() {
        return useLatestCallback;
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
/**
 * Use `useEffect` during SSR and `useInsertionEffect` in the Browser & React Native to avoid warnings.
 */ const useClientInsertionEffect = typeof document !== 'undefined' || typeof navigator !== 'undefined' && navigator.product === 'ReactNative' ? _react().useInsertionEffect : _react().useEffect;
function useLatestCallback(callback) {
    const ref = _react().useRef(callback);
    const latestCallback = _react().useRef(function latestCallback(...args) {
        return ref.current.apply(this, args);
    }).current;
    useClientInsertionEffect(()=>{
        ref.current = callback;
    }, [
        callback
    ]);
    return latestCallback;
}

//# sourceMappingURL=useLatestCallback.js.map
