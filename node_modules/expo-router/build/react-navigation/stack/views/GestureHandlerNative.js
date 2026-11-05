'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    GestureHandlerRootView: null,
    GestureState: null,
    PanGestureHandler: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get GestureHandlerRootView () {
        return _reactnativegesturehandler().GestureHandlerRootView;
    },
    get GestureState () {
        return _reactnativegesturehandler().State;
    },
    get PanGestureHandler () {
        return PanGestureHandler;
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
function _reactnativegesturehandler() {
    const data = require("react-native-gesture-handler");
    _reactnativegesturehandler = function() {
        return data;
    };
    return data;
}
const _GestureHandlerRefContext = require("../utils/GestureHandlerRefContext");
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
function PanGestureHandler(props) {
    const gestureRef = _react().useRef(null);
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_GestureHandlerRefContext.GestureHandlerRefContext.Provider, {
        value: gestureRef,
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnativegesturehandler().PanGestureHandler, {
            ...props,
            ref: gestureRef
        })
    });
}

//# sourceMappingURL=GestureHandlerNative.js.map
