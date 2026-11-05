"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "usePreviewTransition", {
    enumerable: true,
    get: function() {
        return usePreviewTransition;
    }
});
function _react() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
const _LinkPreviewContext = require("../../link/preview/LinkPreviewContext");
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
function usePreviewTransition(state, originalEmit, isPreloaded) {
    const { getOpenPreviewKey, setOpenPreviewKey } = (0, _LinkPreviewContext.useLinkPreviewContext)();
    // Track the preview screen currently transitioning on the native side
    const [previewTransitioningScreenId, setPreviewTransitioningScreenId] = _react().useState();
    _react().useEffect(()=>{
        if (previewTransitioningScreenId) {
            // State was updated after the preview transition
            const position = state.routes.findIndex((route)=>route.key === previewTransitioningScreenId);
            if (position >= 0 && position <= state.index) {
                // No longer need to track the preview transitioning screen
                setPreviewTransitioningScreenId(undefined);
            }
        }
    }, [
        state,
        previewTransitioningScreenId
    ]);
    const emit = _react().useCallback((event)=>{
        const { target, type, data } = event;
        const key = getOpenPreviewKey();
        if (key !== undefined && target === key && data && 'closing' in data && !data.closing) {
            if (type === 'transitionStart') {
                setPreviewTransitioningScreenId(key);
            } else if (type === 'transitionEnd') {
                setOpenPreviewKey(undefined);
            }
        }
        return originalEmit(event);
    }, [
        getOpenPreviewKey,
        originalEmit,
        setOpenPreviewKey
    ]);
    const computedState = _react().useMemo(()=>{
        // The preview screen was pushed on the native side, but react-navigation state was not updated yet
        if (previewTransitioningScreenId) {
            const position = state.routes.findIndex((route)=>route.key === previewTransitioningScreenId);
            // Only a preloaded route (positioned after the focused one) can be promoted
            if (position > state.index) {
                const previewRoute = state.routes[position];
                if (position === state.index + 1) {
                    // The preloaded route is already next to the focused one, so only the focus moves.
                    // This is the common case: the PRELOAD action puts the newest preloaded route first.
                    return {
                        ...state,
                        index: state.index + 1
                    };
                }
                // On the native side the screen is already pushed, so move it right after the focused route
                const routes = state.routes.filter((route)=>route.key !== previewTransitioningScreenId);
                routes.splice(state.index + 1, 0, previewRoute);
                return {
                    ...state,
                    routes,
                    index: state.index + 1
                };
            }
        }
        return state;
    }, [
        state,
        previewTransitioningScreenId
    ]);
    const isComputedRoutePreloaded = _react().useCallback((key)=>computedState.routes[computedState.index]?.key !== key && isPreloaded(key), [
        computedState,
        isPreloaded
    ]);
    return {
        computedState,
        emit,
        isPreloaded: isComputedRoutePreloaded
    };
}

//# sourceMappingURL=usePreviewTransition.js.map
