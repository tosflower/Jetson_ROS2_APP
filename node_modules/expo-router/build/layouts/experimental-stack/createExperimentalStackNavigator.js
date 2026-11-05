'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createStandardExperimentalStackNavigator", {
    enumerable: true,
    get: function() {
        return createStandardExperimentalStackNavigator;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
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
const _compositionoptions = require("../../fork/native-stack/composition-options");
const _useClearGuardedRoutes = require("../useClearGuardedRoutes");
const _ExperimentalStackView = require("./ExperimentalStackView");
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
function ExperimentalStackNavigatorContent({ state, descriptors, emitter, isPreloaded, isRemovalPrevented, pop, removeRoutes, subscribePopToTopOnParentTabPress }) {
    const { registry, contextValue } = (0, _compositionoptions.useCompositionRegistry)();
    const mergedDescriptors = (0, _react().useMemo)(()=>(0, _compositionoptions.mergeOptions)(descriptors, registry, state), [
        descriptors,
        registry,
        state
    ]);
    (0, _useClearGuardedRoutes.useClearGuardedRoutes)(removeRoutes);
    _react().useEffect(()=>subscribePopToTopOnParentTabPress(), [
        subscribePopToTopOnParentTabPress
    ]);
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_compositionoptions.CompositionContext, {
        value: contextValue,
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_ExperimentalStackView.ExperimentalStackView, {
            state: state,
            emit: emitter.emit,
            isPreloaded: isPreloaded,
            isRemovalPrevented: isRemovalPrevented,
            pop: pop,
            descriptors: mergedDescriptors
        })
    });
}
const createStandardExperimentalStackNavigator = (0, _standardnavigation().createStandardNavigator)(ExperimentalStackNavigatorContent);

//# sourceMappingURL=createExperimentalStackNavigator.js.map
