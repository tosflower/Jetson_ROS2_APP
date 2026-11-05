"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NoSSR", {
    enumerable: true,
    get: function() {
        return NoSSR;
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
    const data = /*#__PURE__*/ _interop_require_default(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function NoSSR({ children }) {
    const [mounted, setMounted] = _react().default.useState(false);
    _react().default.useEffect(()=>{
        setMounted(true);
    }, []);
    if (!mounted) {
        // If the component is not mounted, return null to prevent server-side rendering.
        return null;
    }
    // This component is used to prevent server-side rendering of its children.
    // It can be useful for components that rely on browser-specific APIs or
    // need to be rendered only on the client side.
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_jsxruntime().Fragment, {
        children: children
    });
}

//# sourceMappingURL=NoSSR.js.map
