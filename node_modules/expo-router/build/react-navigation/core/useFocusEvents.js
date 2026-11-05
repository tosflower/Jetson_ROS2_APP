'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useFocusEvents", {
    enumerable: true,
    get: function() {
        return useFocusEvents;
    }
});
function _react() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
const _NavigationContext = require("./NavigationContext");
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
function useFocusEvents({ state, emitter }) {
    const navigation = (0, _react().use)(_NavigationContext.NavigationContext);
    const lastFocusedKeyRef = _react().useRef(undefined);
    // TODO(@ubax): investigate if we can remove this ref, by for example moving this to global scope
    // Or reacting to state changes
    const isFocusedRef = _react().useRef(false);
    const currentFocusedKey = state.routes[state.index]?.key;
    // When the parent screen changes its focus state, we also need to change child's focus
    // Coz the child screen can't be focused if the parent screen is out of focus
    _react().useEffect(()=>{
        if (currentFocusedKey === undefined) {
            return;
        }
        return navigation?.addListener('focus', ()=>{
            if (isFocusedRef.current && lastFocusedKeyRef.current === currentFocusedKey) {
                return;
            }
            lastFocusedKeyRef.current = currentFocusedKey;
            isFocusedRef.current = true;
            emitter.emit({
                type: 'focus',
                target: currentFocusedKey
            });
        });
    }, [
        currentFocusedKey,
        emitter,
        navigation
    ]);
    _react().useEffect(()=>{
        if (currentFocusedKey === undefined) {
            return;
        }
        return navigation?.addListener('blur', ()=>{
            lastFocusedKeyRef.current = undefined;
            isFocusedRef.current = false;
            emitter.emit({
                type: 'blur',
                target: currentFocusedKey
            });
        });
    }, [
        currentFocusedKey,
        emitter,
        navigation
    ]);
    _react().useEffect(()=>{
        const lastFocusedKey = lastFocusedKeyRef.current;
        if (currentFocusedKey === undefined) {
            return;
        }
        lastFocusedKeyRef.current = currentFocusedKey;
        // A nested navigator can mount while its parent is already focused, such as after HMR.
        // Screen effects run first and ignore this event if they already observed focus.
        if (lastFocusedKey === undefined && (!navigation || navigation.isFocused())) {
            isFocusedRef.current = true;
            emitter.emit({
                type: 'focus',
                target: currentFocusedKey
            });
        }
        // We should only emit events when the focused key changed and navigator is focused
        // When navigator is not focused, screens inside shouldn't receive focused status either
        if (lastFocusedKey === currentFocusedKey || !(navigation ? navigation.isFocused() : true)) {
            return;
        }
        if (lastFocusedKey === undefined) {
            // Only fire events after initial mount
            return;
        }
        emitter.emit({
            type: 'blur',
            target: lastFocusedKey
        });
        isFocusedRef.current = true;
        emitter.emit({
            type: 'focus',
            target: currentFocusedKey
        });
    }, [
        currentFocusedKey,
        emitter,
        navigation
    ]);
}

//# sourceMappingURL=useFocusEvents.js.map
