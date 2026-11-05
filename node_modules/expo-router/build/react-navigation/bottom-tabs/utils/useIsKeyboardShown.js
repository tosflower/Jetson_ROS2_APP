'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useIsKeyboardShown", {
    enumerable: true,
    get: function() {
        return useIsKeyboardShown;
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
function useIsKeyboardShown() {
    const [isKeyboardShown, setIsKeyboardShown] = _react().useState(false);
    _react().useEffect(()=>{
        const handleKeyboardShow = ()=>setIsKeyboardShown(true);
        const handleKeyboardHide = ()=>setIsKeyboardShown(false);
        let subscriptions;
        if (_reactnative().Platform.OS === 'ios') {
            subscriptions = [
                _reactnative().Keyboard.addListener('keyboardWillShow', handleKeyboardShow),
                _reactnative().Keyboard.addListener('keyboardWillHide', handleKeyboardHide)
            ];
        } else {
            subscriptions = [
                _reactnative().Keyboard.addListener('keyboardDidShow', handleKeyboardShow),
                _reactnative().Keyboard.addListener('keyboardDidHide', handleKeyboardHide)
            ];
        }
        return ()=>{
            subscriptions.forEach((s)=>s.remove());
        };
    }, []);
    return isKeyboardShown;
}

//# sourceMappingURL=useIsKeyboardShown.js.map
