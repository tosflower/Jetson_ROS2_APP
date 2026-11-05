'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CardA11yWrapper", {
    enumerable: true,
    get: function() {
        return CardA11yWrapper;
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
const CardA11yWrapper = ({ ref, focused, active, animated, isNextScreenTransparent, detachCurrentScreen, children })=>{
    // Manage this in separate component to avoid re-rendering card during gestures
    // Otherwise the gesture animation will be interrupted as state hasn't updated yet
    const [inert, setInert] = _react().useState(false);
    _react().useImperativeHandle(ref, ()=>({
            setInert
        }), []);
    const isHidden = !animated && isNextScreenTransparent === false && detachCurrentScreen !== false && !focused;
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
        "aria-hidden": !focused,
        style: [
            _reactnative().StyleSheet.absoluteFill,
            {
                pointerEvents: (animated ? inert : !focused) ? 'none' : 'box-none',
                // This is necessary to avoid unfocused larger pages increasing scroll area
                // The issue can be seen on the web when a smaller screen is pushed over a larger one
                overflow: active ? undefined : 'hidden',
                // We use visibility on web
                display: _reactnative().Platform.OS !== 'web' && isHidden ? 'none' : 'flex',
                // Hide unfocused screens when animation isn't enabled
                // This is also necessary for a11y on web
                visibility: isHidden ? 'hidden' : 'visible'
            }
        ],
        // Make sure this view is not removed on the new architecture, as it causes focus loss during navigation on Android.
        // This can happen when the view flattening results in different trees - due to `overflow` style changing in a parent.
        collapsable: false,
        children: children
    });
};

//# sourceMappingURL=CardA11yWrapper.js.map
