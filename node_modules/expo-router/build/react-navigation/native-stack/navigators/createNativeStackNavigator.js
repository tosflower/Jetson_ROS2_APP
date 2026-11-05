'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createNativeStackNavigator", {
    enumerable: true,
    get: function() {
        return createNativeStackNavigator;
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
const _removalPrevention = require("../../../global-state/removalPrevention");
const _native = require("../../native");
const _makePopAction = require("../utils/makePopAction");
const _NativeStackView = require("../views/NativeStackView");
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
function NativeStackNavigator({ id, initialRouteName, children, layout, screenListeners, screenOptions, screenLayout, UNSTABLE_router, ...rest }) {
    const { state, descriptors, navigation, NavigationContent } = (0, _native.useNavigationBuilder)(_native.StackRouter, {
        id,
        initialRouteName,
        children,
        layout,
        screenListeners,
        screenOptions,
        screenLayout,
        UNSTABLE_router
    });
    const meta = (0, _react().use)(_native.NavigationMetaContext);
    const routesWithRemovalPrevented = (0, _removalPrevention.useRoutesWithRemovalPrevented)();
    _react().useEffect(()=>{
        if (meta && 'type' in meta && meta.type === 'native-tabs') {
            // If we're inside native tabs, we don't need to handle popToTop
            // It's handled natively by native tabs
            return;
        }
        // @ts-expect-error: there may not be a tab navigator in parent
        return navigation?.addListener?.('tabPress', (e)=>{
            const isFocused = navigation.isFocused();
            // Run the operation in the next frame so we're sure all listeners have been run
            // This is necessary to know if preventDefault() has been called
            requestAnimationFrame(()=>{
                if (state.index > 0 && isFocused && !e.defaultPrevented) {
                    // When user taps on already focused tab and we're inside the tab,
                    // reset the stack to replicate native behaviour
                    navigation.dispatch({
                        ..._native.StackActions.popToTop(),
                        target: state.key
                    });
                }
            });
        });
    }, [
        meta,
        navigation,
        state.index,
        state.key
    ]);
    const pop = (0, _makePopAction.makePopAction)(navigation.dispatchSync, state.key);
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(NavigationContent, {
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_NativeStackView.NativeStackView, {
            ...rest,
            state: state,
            descriptors: descriptors,
            emit: navigation.emit,
            isPreloaded: (key)=>state.routes.find((route)=>route.key === key)?.isPreloaded === true,
            isRemovalPrevented: (key)=>routesWithRemovalPrevented.has(key),
            pop: pop
        })
    });
}
function createNativeStackNavigator() {
    return (0, _native.createNavigatorFactory)(NativeStackNavigator)();
}

//# sourceMappingURL=createNativeStackNavigator.js.map
