'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LinkWithPreview", {
    enumerable: true,
    get: function() {
        return LinkWithPreview;
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
const _hooks = require("../hooks");
const _children = require("../utils/children");
const _url = require("../utils/url");
const _BaseExpoRouterLink = require("./BaseExpoRouterLink");
const _InternalLinkPreviewContext = require("./InternalLinkPreviewContext");
const _NativeMenuContext = require("./NativeMenuContext");
const _elements = require("./elements");
const _href = require("./href");
const _LinkPreviewContext = require("./preview/LinkPreviewContext");
const _native = require("./preview/native");
const _usePreviewActivationPath = require("./preview/usePreviewActivationPath");
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
const isPad = _reactnative().Platform.OS === 'ios' && _reactnative().Platform.isPad;
function LinkWithPreview({ children, ...rest }) {
    const router = (0, _hooks.useRouter)();
    const { setOpenPreviewKey } = (0, _LinkPreviewContext.useLinkPreviewContext)();
    const [isCurrentPreviewOpen, setIsCurrenPreviewOpen] = (0, _react().useState)(false);
    const hrefWithoutQuery = (0, _href.resolveHref)(rest.hrefForPreviewNavigation).split('?')[0];
    const prevHrefWithoutQuery = (0, _react().useRef)(hrefWithoutQuery);
    (0, _react().useEffect)(()=>{
        if (isCurrentPreviewOpen) {
            if (prevHrefWithoutQuery.current !== hrefWithoutQuery) {
                throw new Error('Link does not support changing the href prop after the preview has been opened. Please ensure that the href prop is stable and does not change between renders.');
            }
        } else {
            prevHrefWithoutQuery.current = hrefWithoutQuery;
        }
    }, [
        hrefWithoutQuery
    ]);
    const [activationPath, prefetch, cancelPrefetch] = (0, _usePreviewActivationPath.usePreviewActivationPath)();
    (0, _react().useEffect)(()=>{
        if (rest.replace) {
            if (process.env.NODE_ENV !== 'production') {
                throw new Error('Using replace links with preview is not supported');
            } else {
                console.warn('Using replace links with preview is not supported');
            }
        }
    }, [
        rest.href,
        rest.replace
    ]);
    const triggerElement = _react().default.useMemo(()=>(0, _children.getFirstChildOfType)(children, _elements.LinkTrigger), [
        children
    ]);
    const menuElement = _react().default.useMemo(()=>(0, _children.getFirstChildOfType)(children, _elements.LinkMenu), [
        children
    ]);
    const previewElement = _react().default.useMemo(()=>(0, _children.getFirstChildOfType)(children, _elements.LinkPreview), [
        children
    ]);
    if ((previewElement || menuElement) && !triggerElement) {
        if (process.env.NODE_ENV !== 'production') {
            throw new Error('When you use Link.Preview, you must use Link.Trigger to specify the trigger element.');
        } else {
            console.warn('When you use Link.Preview, you must use Link.Trigger to specify the trigger element.');
        }
    }
    const trigger = _react().default.useMemo(()=>triggerElement ?? /*#__PURE__*/ (0, _jsxruntime().jsx)(_elements.LinkTrigger, {
            children: children
        }), [
        triggerElement,
        children
    ]);
    const preview = _react().default.useMemo(()=>(0, _url.shouldLinkExternally)(String(rest.href)) || !previewElement ? null : previewElement, [
        previewElement,
        rest.href
    ]);
    const isPreviewTapped = (0, _react().useRef)(false);
    const preloadedScreenId = (0, _react().useRef)(undefined);
    const previewActivationPath = (0, _react().useMemo)(()=>activationPath ? {
            path: activationPath
        } : undefined, [
        activationPath
    ]);
    const hasPreview = !!previewElement;
    if (rest.replace) {
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(_BaseExpoRouterLink.BaseExpoRouterLink, {
            children: children,
            ...rest
        });
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_native.NativeLinkPreview, {
        previewActivationPath: previewActivationPath,
        onWillPreviewOpen: ()=>{
            if (hasPreview) {
                isPreviewTapped.current = false;
                preloadedScreenId.current = undefined;
                prefetch(rest.href);
                setIsCurrenPreviewOpen(true);
            }
        },
        onPreviewWillClose: ()=>{
            if (hasPreview) {
                setIsCurrenPreviewOpen(false);
                cancelPrefetch();
                // When preview was not tapped, then we need to enable the screen stack animation
                // Otherwise this will happen in StackNavigator, when new screen is opened
                if (!isPreviewTapped.current || isPad) {
                    setOpenPreviewKey(undefined);
                }
            }
        },
        onPreviewDidClose: ()=>{
            if (hasPreview && isPreviewTapped.current && isPad) {
                router.navigate(rest.href, {
                    __internal__PreviewKey: preloadedScreenId.current
                });
            }
        },
        onPreviewTapped: ({ nativeEvent: { screenId } })=>{
            isPreviewTapped.current = true;
            preloadedScreenId.current = screenId;
            if (screenId !== undefined) {
                setOpenPreviewKey(screenId);
            }
            if (!isPad) {
                router.navigate(rest.href, {
                    __internal__PreviewKey: screenId
                });
            }
        },
        style: {
            display: 'contents'
        },
        disableForceFlatten: true,
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_NativeMenuContext.NativeMenuContext, {
            value: true,
            children: /*#__PURE__*/ (0, _jsxruntime().jsxs)(_InternalLinkPreviewContext.InternalLinkPreviewContext, {
                value: {
                    isVisible: isCurrentPreviewOpen,
                    href: rest.hrefForPreviewNavigation
                },
                children: [
                    /*#__PURE__*/ (0, _jsxruntime().jsx)(_BaseExpoRouterLink.BaseExpoRouterLink, {
                        ...rest,
                        children: trigger,
                        ref: rest.ref
                    }),
                    preview,
                    menuElement
                ]
            })
        })
    });
}

//# sourceMappingURL=LinkWithPreview.js.map
