'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ExpoLink", {
    enumerable: true,
    get: function() {
        return ExpoLink;
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
const _url = require("../utils/url");
const _BaseExpoRouterLink = require("./BaseExpoRouterLink");
const _LinkWithPreview = require("./LinkWithPreview");
const _elements = require("./elements");
const _PreviewRouteContext = require("./preview/PreviewRouteContext");
const _useZoomHref = require("./zoom/useZoomHref");
const _zoomtransitioncontextproviders = require("./zoom/zoom-transition-context-providers");
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
function ExpoLink(props) {
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_zoomtransitioncontextproviders.ZoomTransitionSourceContextProvider, {
        linkProps: props,
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(ExpoLinkImpl, {
            ...props
        })
    });
}
function ExpoLinkImpl(props) {
    const isPreview = (0, _PreviewRouteContext.useIsPreview)();
    const href = (0, _useZoomHref.useZoomHref)(props);
    const shouldUseLinkWithPreview = process.env.EXPO_OS === 'ios' && isLinkWithPreview(props) && !isPreview;
    if (shouldUseLinkWithPreview) {
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(_LinkWithPreview.LinkWithPreview, {
            ...props,
            href: href,
            hrefForPreviewNavigation: props.href
        });
    }
    let children = props.children;
    if (_react().default.Children.count(props.children) > 1) {
        const arrayChildren = _react().default.Children.toArray(props.children).filter((child)=>!/*#__PURE__*/ (0, _react().isValidElement)(child) || child.type !== _elements.LinkPreview && child.type !== _elements.LinkMenu);
        children = arrayChildren.length === 1 ? arrayChildren[0] : props.children;
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_BaseExpoRouterLink.BaseExpoRouterLink, {
        ...props,
        href: href,
        children: children
    });
}
function isLinkWithPreview(props) {
    const isExternal = (0, _url.shouldLinkExternally)(String(props.href));
    return _react().Children.toArray(props.children).some((child)=>/*#__PURE__*/ (0, _react().isValidElement)(child) && (!isExternal && child.type === _elements.LinkPreview || child.type === _elements.LinkMenu));
}

//# sourceMappingURL=ExpoLink.js.map
