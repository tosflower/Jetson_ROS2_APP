'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useKeyboardManager", {
    enumerable: true,
    get: function() {
        return useKeyboardManager;
    }
});
function _react() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
const _useLatestCallback = /*#__PURE__*/ _interop_require_default(require("../../../utils/useLatestCallback"));
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
function useKeyboardManager({ enabled, focused }) {
    // Numeric id of the previously focused text input
    // When a gesture didn't change the tab, we can restore the focused input with this
    const previouslyFocusedTextInputRef = _react().useRef(undefined);
    const startTimestampRef = _react().useRef(0);
    const keyboardTimeoutRef = _react().useRef(undefined);
    const clearKeyboardTimeout = _react().useCallback(()=>{
        if (keyboardTimeoutRef.current !== undefined) {
            clearTimeout(keyboardTimeoutRef.current);
            keyboardTimeoutRef.current = undefined;
        }
    }, []);
    const onPageChangeStart = (0, _useLatestCallback.default)(()=>{
        if (!enabled) {
            return;
        }
        clearKeyboardTimeout();
        const input = _reactnative().TextInput.State.currentlyFocusedInput();
        // When a page change begins, blur the currently focused input
        input?.blur();
        // Store the id of this input so we can refocus it if change was cancelled
        previouslyFocusedTextInputRef.current = input;
        // Store timestamp for touch start
        startTimestampRef.current = Date.now();
    });
    const onPageChangeCancel = (0, _useLatestCallback.default)(()=>{
        if (!enabled) {
            return;
        }
        clearKeyboardTimeout();
        // The page didn't change, we should restore the focus of text input
        const input = previouslyFocusedTextInputRef.current;
        if (input) {
            // If the interaction was super short we should make sure keyboard won't hide again.
            // Too fast input refocus will result only in keyboard flashing on screen and hiding right away.
            // During first ~100ms keyboard will be dismissed no matter what,
            // so we have to make sure it won't interrupt input refocus logic.
            // That's why when the interaction is shorter than 100ms we add delay so it won't hide once again.
            // Subtracting timestamps makes us sure the delay is executed only when needed.
            if (Date.now() - startTimestampRef.current < 100) {
                keyboardTimeoutRef.current = setTimeout(()=>{
                    input?.focus();
                    previouslyFocusedTextInputRef.current = undefined;
                }, 100);
            } else {
                input?.focus();
                previouslyFocusedTextInputRef.current = undefined;
            }
        }
    });
    const onPageChangeConfirm = (0, _useLatestCallback.default)(({ gesture, active, closing })=>{
        if (!enabled) {
            return;
        }
        if (!closing) {
            onPageChangeCancel();
            return;
        }
        clearKeyboardTimeout();
        if (!gesture) {
            // Always dismiss input, even if we don't have a ref to it
            // We might not have the ref if onPageChangeStart was never called
            // This can happen if page change was not from a gesture
            _reactnative().Keyboard.dismiss();
        } else if (active) {
            const input = previouslyFocusedTextInputRef.current;
            // Dismiss the keyboard only if an input was a focused before
            // This makes sure we don't dismiss input on going back and focusing an input
            input?.blur();
        }
        // Cleanup the ID on successful page change
        previouslyFocusedTextInputRef.current = undefined;
    });
    // Dismiss keyboard when screen loses focus (e.g. when pushing a new screen).
    // This handles the "navigate forward" case so we don't dismiss the new screen's
    // auto-focused input from handleTransition.
    // `focused` is passed in so the layout effect below has a clear reason to depend on it.
    const dismissKeyboardOnBlur = _react().useEffectEvent((focused)=>{
        if (enabled && !focused) {
            _reactnative().Keyboard.dismiss();
        }
    });
    _react().useLayoutEffect(()=>{
        dismissKeyboardOnBlur(focused);
    }, [
        focused
    ]);
    _react().useEffect(()=>{
        return ()=>clearKeyboardTimeout();
    }, [
        clearKeyboardTimeout
    ]);
    return {
        onPageChangeStart,
        onPageChangeConfirm,
        onPageChangeCancel
    };
}

//# sourceMappingURL=useKeyboardManager.js.map
