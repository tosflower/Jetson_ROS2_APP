'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useOptionsGetters", {
    enumerable: true,
    get: function() {
        return useOptionsGetters;
    }
});
function _react() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
const _useLatestCallback = /*#__PURE__*/ _interop_require_default(require("../../utils/useLatestCallback"));
const _NavigationStateContext = require("./NavigationStateContext");
const _useIsFocused = require("./useIsFocused");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
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
function useOptionsGetters({ key, options }) {
    const optionsGettersFromChildRef = _react().useRef({});
    const { addOptionsGetter: parentAddOptionsGetter } = (0, _react().use)(_NavigationStateContext.NavigationStateContext);
    const isFocused = (0, _useIsFocused.useIsRouteFocused)(key);
    const getOptionsFromListener = _react().useCallback(()=>{
        for(const key in optionsGettersFromChildRef.current){
            if (key in optionsGettersFromChildRef.current) {
                const result = optionsGettersFromChildRef.current[key]?.();
                // null means unfocused route
                if (result !== null) {
                    return result;
                }
            }
        }
        return null;
    }, []);
    const getCurrentOptions = (0, _useLatestCallback.default)(()=>{
        if (!isFocused) {
            return null;
        }
        const optionsFromListener = getOptionsFromListener();
        if (optionsFromListener !== null) {
            return optionsFromListener;
        }
        return options;
    });
    _react().useEffect(()=>{
        return parentAddOptionsGetter?.(key, getCurrentOptions);
    }, [
        getCurrentOptions,
        parentAddOptionsGetter,
        key
    ]);
    const addOptionsGetter = _react().useCallback((key, getter)=>{
        optionsGettersFromChildRef.current[key] = getter;
        return ()=>{
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete optionsGettersFromChildRef.current[key];
        };
    }, []);
    return {
        addOptionsGetter,
        getCurrentOptions
    };
}

//# sourceMappingURL=useOptionsGetters.js.map
