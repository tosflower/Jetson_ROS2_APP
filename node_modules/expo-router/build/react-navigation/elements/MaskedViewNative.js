/**
 * The native MaskedView that we explicitly re-export for supported platforms: Android, iOS.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MaskedView", {
    enumerable: true,
    get: function() {
        return MaskedView;
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
let RNCMaskedView;
try {
    // Add try/catch to support usage even if it's not installed, since it's optional.
    // Newer versions of Metro will handle it properly.
    RNCMaskedView = require('@react-native-masked-view/masked-view').default;
} catch (e) {
// Ignore
}
const isMaskedViewAvailable = _reactnative().UIManager.getViewManagerConfig('RNCMaskedView') != null;
function MaskedView({ children, ...rest }) {
    if (isMaskedViewAvailable && RNCMaskedView) {
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(RNCMaskedView, {
            ...rest,
            children: children
        });
    }
    return children;
}

//# sourceMappingURL=MaskedViewNative.js.map
