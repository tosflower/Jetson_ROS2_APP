'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "unstable_createStandardStackNavigator", {
    enumerable: true,
    get: function() {
        return unstable_createStandardStackNavigator;
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
const _useClearGuardedRoutes = require("../../../layouts/useClearGuardedRoutes");
const _native = require("../../native");
const _StackView = require("../views/Stack/StackView");
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
function StackNavigatorContent({ state, descriptors, emitter, isPreloaded, isRemovalPrevented: _isRemovalPrevented, pop, removeRoutes, restoreRoute, subscribePopToTopOnParentTabPress, ...rest }) {
    const { direction } = (0, _native.useLocale)();
    (0, _useClearGuardedRoutes.useClearGuardedRoutes)(removeRoutes);
    _react().useEffect(()=>subscribePopToTopOnParentTabPress(), [
        subscribePopToTopOnParentTabPress
    ]);
    if (state.routes.length === 0) {
        return null;
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_StackView.StackView, {
        ...rest,
        direction: direction,
        state: state,
        descriptors: descriptors,
        emit: emitter.emit,
        isPreloaded: isPreloaded,
        pop: pop,
        restoreRoute: restoreRoute
    });
}
const unstable_createStandardStackNavigator = (0, _standardnavigation().createStandardNavigator)(StackNavigatorContent);

//# sourceMappingURL=createStackNavigator.js.map
