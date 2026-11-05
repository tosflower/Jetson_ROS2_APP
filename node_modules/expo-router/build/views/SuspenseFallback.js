"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SuspenseFallback", {
    enumerable: true,
    get: function() {
        return SuspenseFallback;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
const _Toast = require("./Toast");
function SuspenseFallback({ route }) {
    if (__DEV__) {
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(_Toast.ToastWrapper, {
            children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_Toast.Toast, {
                filename: route,
                children: "Bundling..."
            })
        });
    }
    return null;
}

//# sourceMappingURL=SuspenseFallback.js.map
