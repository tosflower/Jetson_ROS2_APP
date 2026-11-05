"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createStandardNativeStackNavigator", {
    enumerable: true,
    get: function() {
        return createStandardNativeStackNavigator;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
function _expoglasseffect() {
    const data = require("expo-glass-effect");
    _expoglasseffect = function() {
        return data;
    };
    return data;
}
function _react() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
function _standardnavigation() {
    const data = require("standard-navigation");
    _standardnavigation = function() {
        return data;
    };
    return data;
}
const _useClearGuardedRoutes = require("../../layouts/useClearGuardedRoutes");
const _navigationParams = require("../../navigationParams");
const _nativestack = require("../../react-navigation/native-stack");
const _compositionoptions = require("./composition-options");
const _descriptorscontext = require("./descriptors-context");
const _usePreviewTransition = require("./usePreviewTransition");
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
const GLASS = (0, _expoglasseffect().isLiquidGlassAvailable)();
function NativeStackNavigatorContent({ state, descriptors, emitter, isPreloaded, isRemovalPrevented, pop, removeRoutes, subscribePopToTopOnParentTabPress, unstable_nativeProps }) {
    const fullDescriptors = descriptors;
    const { computedState, emit, isPreloaded: isComputedRoutePreloaded } = (0, _usePreviewTransition.usePreviewTransition)(state, emitter.emit, isPreloaded);
    (0, _useClearGuardedRoutes.useClearGuardedRoutes)(removeRoutes);
    _react().useEffect(()=>subscribePopToTopOnParentTabPress(), [
        subscribePopToTopOnParentTabPress
    ]);
    // Map internal gesture option to React Navigation's gestureEnabled option
    // This allows Expo Router to override gesture behavior without affecting user settings
    const finalDescriptors = _react().useMemo(()=>{
        let needsNewMap = false;
        const result = {};
        for (const key of Object.keys(fullDescriptors)){
            const descriptor = fullDescriptors[key];
            const options = descriptor.options;
            const internalGestureEnabled = options?.[_navigationParams.INTERNAL_EXPO_ROUTER_GESTURE_ENABLED_OPTION_NAME];
            const needsGestureFix = internalGestureEnabled !== undefined;
            const needsGlassFix = GLASS && options?.presentation === 'formSheet';
            if (needsGestureFix || needsGlassFix) {
                needsNewMap = true;
                const newOptions = {
                    ...options
                };
                if (needsGestureFix) {
                    newOptions.gestureEnabled = internalGestureEnabled;
                }
                if (needsGlassFix) {
                    newOptions.headerTransparent ??= true;
                    newOptions.contentStyle ??= {
                        backgroundColor: 'transparent'
                    };
                    newOptions.headerShadowVisible ??= false;
                    newOptions.headerLargeTitleShadowVisible ??= false;
                }
                result[key] = {
                    ...descriptor,
                    options: newOptions
                };
            } else {
                result[key] = descriptor;
            }
        }
        return needsNewMap ? result : fullDescriptors;
    }, [
        fullDescriptors
    ]);
    const { registry, contextValue } = (0, _compositionoptions.useCompositionRegistry)();
    const mergedDescriptors = _react().useMemo(()=>(0, _compositionoptions.mergeOptions)(finalDescriptors, registry, computedState), [
        finalDescriptors,
        computedState,
        registry
    ]);
    // Native can push a preloaded screen on its own (link preview commit), so it must not animate.
    // The screen gets its animation back when JS pushes it, which also keeps the pop animated.
    const stackDescriptors = _react().useMemo(()=>{
        const preloadedKeys = computedState.routes.map((route)=>route.key).filter(isComputedRoutePreloaded);
        if (preloadedKeys.length === 0) {
            return mergedDescriptors;
        }
        const result = {
            ...mergedDescriptors
        };
        for (const key of preloadedKeys){
            const descriptor = result[key];
            if (descriptor) {
                result[key] = {
                    ...descriptor,
                    options: {
                        ...descriptor.options,
                        animation: 'none'
                    }
                };
            }
        }
        return result;
    }, [
        mergedDescriptors,
        computedState,
        isComputedRoutePreloaded
    ]);
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_descriptorscontext.DescriptorsContext, {
        value: fullDescriptors,
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_compositionoptions.CompositionContext, {
            value: contextValue,
            children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_nativestack.NativeStackView, {
                state: computedState,
                descriptors: stackDescriptors,
                emit: emit,
                isPreloaded: isComputedRoutePreloaded,
                isRemovalPrevented: isRemovalPrevented,
                pop: pop,
                unstable_nativeProps: unstable_nativeProps
            })
        })
    });
}
const createStandardNativeStackNavigator = (0, _standardnavigation().createStandardNavigator)(NativeStackNavigatorContent);

//# sourceMappingURL=createNativeStackNavigator.js.map
