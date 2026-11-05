'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BaseExpoRouterLink", {
    enumerable: true,
    get: function() {
        return BaseExpoRouterLink;
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
const _Prefetch = require("../Prefetch");
const _Slot = require("../ui/Slot");
const _href = require("./href");
const _useLinkHooks = require("./useLinkHooks");
const _useLinkToPathProps = /*#__PURE__*/ _interop_require_default(require("./useLinkToPathProps"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
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
function BaseExpoRouterLink({ href, replace, push, dismissTo, // TODO: This does not prevent default on the anchor tag.
relativeToDirectory, asChild, rel, target, download, withAnchor, dangerouslySingular: singular, prefetch, ...rest }) {
    // Mutate the style prop to add the className on web.
    const style = (0, _useLinkHooks.useInteropClassName)(rest);
    // If not passing asChild, we need to forward the props to the anchor tag using React Native Web's `hrefAttrs`.
    const hrefAttrs = (0, _useLinkHooks.useHrefAttrs)({
        asChild,
        rel,
        target,
        download
    });
    const resolvedHref = (0, _react().useMemo)(()=>{
        if (href == null) {
            throw new Error('Link: href is required');
        }
        return (0, _href.resolveHref)(href);
    }, [
        href
    ]);
    let event;
    if (push) event = 'PUSH';
    if (replace) event = 'REPLACE';
    if (dismissTo) event = 'POP_TO';
    const props = (0, _useLinkToPathProps.default)({
        href: resolvedHref,
        event,
        relativeToDirectory,
        withAnchor,
        dangerouslySingular: singular
    });
    const onPress = (e)=>{
        if ('onPress' in rest) {
            rest.onPress?.(e);
        }
        props.onPress(e);
    };
    const Component = asChild ? _Slot.Slot : _reactnative().Text;
    if (asChild && _react().default.Children.count(rest.children) > 1) {
        throw new Error('Link: When using `asChild`, you must pass a single child element that will emit the `onPress` event.');
    }
    // Avoid using createElement directly, favoring JSX, to allow tools like NativeWind to perform custom JSX handling on native.
    const element = /*#__PURE__*/ (0, _jsxruntime().jsx)(Component, {
        ...props,
        ...hrefAttrs,
        ...rest,
        style: style,
        ..._reactnative().Platform.select({
            web: {
                onClick: onPress
            },
            default: {
                onPress
            }
        })
    });
    return prefetch ? /*#__PURE__*/ (0, _jsxruntime().jsxs)(_jsxruntime().Fragment, {
        children: [
            /*#__PURE__*/ (0, _jsxruntime().jsx)(_Prefetch.Prefetch, {
                href: href
            }),
            element
        ]
    }) : element;
}

//# sourceMappingURL=BaseExpoRouterLink.js.map
