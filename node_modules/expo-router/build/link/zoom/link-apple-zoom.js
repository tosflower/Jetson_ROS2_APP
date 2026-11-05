'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LinkAppleZoom", {
    enumerable: true,
    get: function() {
        return LinkAppleZoom;
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
const _Slot = require("../../ui/Slot");
const _native = require("../preview/native");
const _ZoomTransitionEnabler = require("./ZoomTransitionEnabler");
const _zoomtransitioncontext = require("./zoom-transition-context");
function LinkAppleZoom(props) {
    if (!(0, _ZoomTransitionEnabler.isZoomTransitionEnabled)()) {
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(_Slot.Slot, {
            ...props
        });
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(LinkAppleZoomImpl, {
        ...props
    });
}
function LinkAppleZoomImpl({ children, alignmentRect, ...rest }) {
    const value = (0, _react().use)(_zoomtransitioncontext.ZoomTransitionSourceContext);
    if (!value) {
        throw new Error('[expo-router] Link.ZoomTransitionSource must be used within a Link');
    }
    const { identifier, addSource, removeSource } = value;
    (0, _react().useEffect)(()=>{
        addSource();
        return removeSource;
    }, [
        addSource,
        removeSource
    ]);
    const hasTooManyChildren = _react().Children.count(children) > 1;
    (0, _react().useEffect)(()=>{
        if (process.env.NODE_ENV !== 'production' && hasTooManyChildren) {
            console.warn('[expo-router] Link.ZoomTransitionSource only accepts a single child component. Please wrap multiple children in a View or another container component.');
        }
    }, [
        hasTooManyChildren
    ]);
    if (hasTooManyChildren) {
        return null;
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_native.LinkZoomTransitionSource, {
        identifier: identifier,
        alignment: alignmentRect,
        // Note(@ubax): Even though we always set this to true, I want to keep the prop here for easier future changes.
        animateAspectRatioChange: true,
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_Slot.Slot, {
            ...rest,
            children: children
        })
    });
}

//# sourceMappingURL=link-apple-zoom.js.map
