'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    LinkMenu: null,
    LinkMenuAction: null,
    LinkPreview: null,
    LinkTrigger: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get LinkMenu () {
        return LinkMenu;
    },
    get LinkMenuAction () {
        return LinkMenuAction;
    },
    get LinkPreview () {
        return LinkPreview;
    },
    get LinkTrigger () {
        return LinkTrigger;
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
const _primitives = require("../primitives");
const _Slot = require("../ui/Slot");
const _children = require("../utils/children");
const _InternalLinkPreviewContext = require("./InternalLinkPreviewContext");
const _NativeMenuContext = require("./NativeMenuContext");
const _HrefPreview = require("./preview/HrefPreview");
const _PreviewRouteContext = require("./preview/PreviewRouteContext");
const _native = require("./preview/native");
const _linkapplezoom = require("./zoom/link-apple-zoom");
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
function LinkMenuAction(props) {
    const identifier = (0, _react().useId)();
    if ((0, _PreviewRouteContext.useIsPreview)() || process.env.EXPO_OS !== 'ios' || !(0, _react().use)(_NativeMenuContext.NativeMenuContext)) {
        return null;
    }
    const { unstable_keepPresented, onPress, children, title, ...rest } = props;
    const areChildrenString = typeof children === 'string';
    const label = areChildrenString ? children : (0, _children.getFirstChildOfType)(children, _primitives.Label)?.props.children;
    const iconComponent = !props.icon && !areChildrenString ? (0, _children.getFirstChildOfType)(children, _primitives.Icon) : undefined;
    const icon = props.icon ?? (iconComponent?.props && 'sf' in iconComponent.props ? iconComponent.props.sf : undefined);
    const sf = typeof icon === 'string' ? icon : undefined;
    const rawXcasset = iconComponent?.props && 'xcasset' in iconComponent.props ? iconComponent.props.xcasset : undefined;
    const xcassetName = typeof rawXcasset === 'string' ? rawXcasset : undefined;
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_native.NativeLinkPreviewAction, {
        ...rest,
        identifier: identifier,
        icon: sf,
        xcassetName: xcassetName,
        title: label ?? title ?? '',
        keepPresented: unstable_keepPresented,
        onSelected: ()=>onPress?.()
    });
}
const LinkMenu = (props)=>{
    const identifier = (0, _react().useId)();
    if ((0, _PreviewRouteContext.useIsPreview)() || process.env.EXPO_OS !== 'ios' || !(0, _react().use)(_NativeMenuContext.NativeMenuContext)) {
        return null;
    }
    const children = _react().default.Children.toArray(props.children).filter((child)=>/*#__PURE__*/ (0, _react().isValidElement)(child) && (child.type === LinkMenuAction || child.type === LinkMenu));
    const displayAsPalette = props.palette ?? props.displayAsPalette;
    const displayInline = props.inline ?? props.displayInline;
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_native.NativeLinkPreviewAction, {
        ...props,
        displayAsPalette: displayAsPalette,
        displayInline: displayInline,
        preferredElementSize: props.elementSize,
        title: props.title ?? '',
        onSelected: ()=>{},
        children: children,
        identifier: identifier
    });
};
function LinkPreview(props) {
    const { children, style } = props;
    const internalPreviewContext = (0, _react().use)(_InternalLinkPreviewContext.InternalLinkPreviewContext);
    if ((0, _PreviewRouteContext.useIsPreview)() || process.env.EXPO_OS !== 'ios' || !internalPreviewContext) {
        return null;
    }
    const { isVisible, href } = internalPreviewContext;
    const { width, height, ...restOfStyle } = style ?? {};
    const contentSize = {
        width: width ?? 0,
        height: height ?? 0
    };
    let content;
    if (children) {
        content = isVisible ? children : null;
    } else {
        content = isVisible ? /*#__PURE__*/ (0, _jsxruntime().jsx)(_HrefPreview.HrefPreview, {
            href: href
        }) : null;
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_native.NativeLinkPreviewContent, {
        style: restOfStyle,
        preferredContentSize: contentSize,
        children: content
    });
}
function LinkTrigger({ withAppleZoom, ...props }) {
    if (_react().default.Children.count(props.children) > 1 || !/*#__PURE__*/ (0, _react().isValidElement)(props.children)) {
        // If onPress is passed, this means that Link passed props to this component.
        // We can assume that asChild is used, so we throw an error, because link will not work in this case.
        if (props && typeof props === 'object' && 'onPress' in props) {
            throw new Error('When using Link.Trigger in an asChild Link, you must pass a single child element that will emit onPress event.');
        }
        return props.children;
    }
    const content = /*#__PURE__*/ (0, _jsxruntime().jsx)(_Slot.Slot, {
        ...props
    });
    if (withAppleZoom) {
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(_linkapplezoom.LinkAppleZoom, {
            children: content
        });
    }
    return content;
}

//# sourceMappingURL=elements.js.map
