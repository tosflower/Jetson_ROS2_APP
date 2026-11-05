'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "usePreventRemove", {
    enumerable: true,
    get: function() {
        return usePreventRemove;
    }
});
function _react() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
const _removalPrevention = require("../../global-state/removalPrevention");
const _useLatestCallback = /*#__PURE__*/ _interop_require_default(require("../../utils/useLatestCallback"));
const _IsPreloadedContext = require("./IsPreloadedContext");
const _useClientLayoutEffect = require("./useClientLayoutEffect");
const _useNavigation = require("./useNavigation");
const _usePreventBeforeUnload = require("./usePreventBeforeUnload");
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
const NOOP = ()=>{};
function useWarnOnStalePreventRemoveDev(preventRemove) {
    const [shouldCheck, setShouldCheck] = _react().useState(false);
    _react().useEffect(()=>{
        if (!shouldCheck) {
            return;
        }
        setShouldCheck(false);
        if (preventRemove) {
            console.warn('`repeat` or `disablePrevention` from `usePreventRemove` was called, but `preventRemove` is ' + 'still `true`. The screen is no longer protected, but the hook will not re-enable ' + 'prevention until `preventRemove` changes. Set `preventRemove` to `false` in the same ' + 'handler to keep the prop and the prevention state in sync.');
        }
    }, [
        shouldCheck,
        preventRemove
    ]);
    return _react().useCallback(()=>setShouldCheck(true), []);
}
// Dev-only: warns when `disablePrevention` was called but `preventRemove` is still `true`.
const useWarnOnStalePreventRemove = process.env.NODE_ENV === 'production' ? ()=>NOOP : useWarnOnStalePreventRemoveDev;
function usePreventRemove(preventRemove, callback, options) {
    const id = _react().useId();
    const navigation = (0, _useNavigation.useNavigation)();
    const setPreventRemove = _react().use(_removalPrevention.ScreenRemovalPreventionSetterContext);
    const isPreloaded = _react().use(_IsPreloadedContext.IsPreloadedContext);
    const markDisabled = useWarnOnStalePreventRemove(preventRemove);
    const preventInPreloadedRoutes = options?.preventInPreloadedRoutes ?? false;
    const shouldPreventBeforeUnload = preventRemove && (!isPreloaded || preventInPreloadedRoutes);
    const disableBeforeUnload = (0, _usePreventBeforeUnload.usePreventBeforeUnload)(shouldPreventBeforeUnload);
    if (setPreventRemove === undefined) {
        throw new Error("Couldn't find the prevent remove context. Is your component inside Screen or Layout?");
    }
    (0, _useClientLayoutEffect.useClientLayoutEffect)(()=>{
        setPreventRemove(id, preventRemove, preventInPreloadedRoutes);
        return ()=>{
            setPreventRemove(id, false, preventInPreloadedRoutes);
        };
    }, [
        id,
        preventInPreloadedRoutes,
        preventRemove,
        setPreventRemove
    ]);
    // TODO(@ubax): use standard useCallback if possible
    const disablePrevention = (0, _useLatestCallback.default)(()=>{
        disableBeforeUnload();
        setPreventRemove(id, false, preventInPreloadedRoutes);
        markDisabled();
    });
    const removePreventedListener = (0, _useLatestCallback.default)((event)=>{
        if (preventRemove && callback) {
            callback({
                data: event.data,
                repeat: ()=>{
                    disablePrevention();
                    navigation.dispatch(event.data.action);
                }
            });
        }
    });
    _react().useEffect(()=>navigation.addListener('removePrevented', removePreventedListener), [
        navigation,
        removePreventedListener
    ]);
    return disablePrevention;
}

//# sourceMappingURL=usePreventRemove.js.map
