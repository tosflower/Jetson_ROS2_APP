'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Header", {
    enumerable: true,
    get: function() {
        return Header;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
function _expostatusbar() {
    const data = require("expo-status-bar");
    _expostatusbar = function() {
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
function _reactnativesafeareacontext() {
    const data = require("react-native-safe-area-context");
    _reactnativesafeareacontext = function() {
        return data;
    };
    return data;
}
const _elements = require("../../../elements");
const _getHeaderStatusBarHeight = require("../../../elements/Header/getHeaderStatusBarHeight");
const _native = require("../../../native");
const _ModalPresentationContext = require("../../utils/ModalPresentationContext");
const _throttle = require("../../utils/throttle");
const _HeaderSegment = require("./HeaderSegment");
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
const Header = /*#__PURE__*/ _react().memo(function Header({ back, layout, progress, options, route, navigation, styleInterpolator }) {
    const insets = (0, _reactnativesafeareacontext().useSafeAreaInsets)();
    const verticalBarEdge = (0, _expostatusbar().useVerticalBarEdgeIOS)();
    let previousTitle;
    // The label for the left back button shows the title of the previous screen
    // If a custom label is specified, we use it, otherwise use previous screen's title
    if (options.headerBackTitle !== undefined) {
        previousTitle = options.headerBackTitle;
    } else if (back) {
        previousTitle = back.title;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const goBack = _react().useCallback((0, _throttle.throttle)(()=>{
        if (navigation.isFocused() && navigation.canGoBack()) {
            navigation.dispatchSync({
                ..._native.StackActions.pop(),
                source: route.key
            });
        }
    }, 50), [
        navigation,
        route.key
    ]);
    const isModal = (0, _react().use)(_ModalPresentationContext.ModalPresentationContext);
    const isParentHeaderShown = (0, _react().use)(_elements.HeaderShownContext);
    const statusBarHeight = options.headerStatusBarHeight !== undefined ? options.headerStatusBarHeight : isModal || isParentHeaderShown ? 0 : (0, _getHeaderStatusBarHeight.getHeaderStatusBarHeight)(insets, verticalBarEdge);
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_HeaderSegment.HeaderSegment, {
        ...options,
        title: (0, _elements.getHeaderTitle)(options, route.name),
        progress: progress,
        layout: layout,
        modal: isModal,
        headerBackTitle: options.headerBackTitle !== undefined ? options.headerBackTitle : previousTitle,
        headerStatusBarHeight: statusBarHeight,
        onGoBack: back ? goBack : undefined,
        backHref: back ? back.href : undefined,
        styleInterpolator: styleInterpolator
    });
});

//# sourceMappingURL=Header.js.map
