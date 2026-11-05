"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LinkAppleZoomTarget", {
    enumerable: true,
    get: function() {
        return LinkAppleZoomTarget;
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
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _native = require("../preview/native");
const _zoomtransitioncontext = require("./zoom-transition-context");
function LinkAppleZoomTarget({ children }) {
    if (_react().Children.count(children) > 1) {
        console.warn('[expo-router] Link.AppleZoomTarget only accepts a single child component. Please wrap multiple children in a View or another container component.');
        return null;
    }
    const { identifier } = (0, _react().use)(_zoomtransitioncontext.ZoomTransitionTargetContext);
    if (!identifier) {
        return children;
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_native.LinkZoomTransitionAlignmentRectDetector, {
        identifier: identifier,
        children: children
    });
}

//# sourceMappingURL=link-apple-zoom-target.js.map
