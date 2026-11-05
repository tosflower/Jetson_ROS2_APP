'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Screen", {
    enumerable: true,
    get: function() {
        return Screen;
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
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
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
const _native = require("../native");
const _Background = require("./Background");
const _HeaderHeightContext = require("./Header/HeaderHeightContext");
const _HeaderShownContext = require("./Header/HeaderShownContext");
const _getDefaultHeaderHeight = require("./Header/getDefaultHeaderHeight");
const _getHeaderStatusBarHeight = require("./Header/getHeaderStatusBarHeight");
const _useFrameSize = require("./useFrameSize");
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
function Screen(props) {
    const insets = (0, _reactnativesafeareacontext().useSafeAreaInsets)();
    const verticalBarEdge = (0, _expostatusbar().useVerticalBarEdgeIOS)();
    const isParentHeaderShown = (0, _react().use)(_HeaderShownContext.HeaderShownContext);
    const parentHeaderHeight = (0, _react().use)(_HeaderHeightContext.HeaderHeightContext);
    const { focused, modal = false, header, headerShown = true, headerTransparent, headerStatusBarHeight = isParentHeaderShown ? 0 : (0, _getHeaderStatusBarHeight.getHeaderStatusBarHeight)(insets, verticalBarEdge), navigation, route, children, style } = props;
    const defaultHeaderHeight = (0, _useFrameSize.useFrameSize)((size)=>(0, _getDefaultHeaderHeight.getDefaultHeaderHeight)(size, modal, headerStatusBarHeight));
    const headerRef = _react().useRef(null);
    const [headerHeight, setHeaderHeight] = _react().useState(defaultHeaderHeight);
    _react().useLayoutEffect(()=>{
        headerRef.current?.measure((_x, _y, _width, height)=>{
            setHeaderHeight(height);
        });
    }, [
        route.name
    ]);
    return /*#__PURE__*/ (0, _jsxruntime().jsxs)(_Background.Background, {
        "aria-hidden": !focused,
        style: [
            styles.container,
            style
        ],
        // On Fabric we need to disable collapsing for the background to ensure
        // that we won't render unnecessary views due to the view flattening.
        collapsable: false,
        children: [
            headerShown ? /*#__PURE__*/ (0, _jsxruntime().jsx)(_native.NavigationProvider, {
                route: route,
                navigation: navigation,
                children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
                    ref: headerRef,
                    onLayout: (e)=>{
                        const { height } = e.nativeEvent.layout;
                        setHeaderHeight(height);
                    },
                    style: [
                        styles.header,
                        headerTransparent ? styles.absolute : null
                    ],
                    children: header
                })
            }) : null,
            /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
                style: styles.content,
                children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_HeaderShownContext.HeaderShownContext.Provider, {
                    value: isParentHeaderShown || headerShown !== false,
                    children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_HeaderHeightContext.HeaderHeightContext.Provider, {
                        value: headerShown ? headerHeight : parentHeaderHeight ?? 0,
                        children: children
                    })
                })
            })
        ]
    });
}
const styles = _reactnative().StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        flex: 1
    },
    header: {
        zIndex: 1,
        pointerEvents: 'box-none'
    },
    absolute: {
        position: 'absolute',
        top: 0,
        start: 0,
        end: 0
    }
});

//# sourceMappingURL=Screen.js.map
