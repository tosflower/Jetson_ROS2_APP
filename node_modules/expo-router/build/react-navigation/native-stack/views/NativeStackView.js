'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NativeStackView", {
    enumerable: true,
    get: function() {
        return NativeStackView;
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
const _elements = require("../../elements");
const _native = require("../../native");
const _useAnimatedHeaderHeight = require("../utils/useAnimatedHeaderHeight");
const _headerAppearance = require("./headerAppearance");
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
const TRANSPARENT_PRESENTATIONS = [
    'transparentModal',
    'containedTransparentModal'
];
function NativeStackView({ state, descriptors, isPreloaded, isRemovalPrevented: _isRemovalPrevented }) {
    const parentHeaderBack = (0, _react().use)(_elements.HeaderBackContext);
    const { buildHref } = (0, _native.useLinkBuilder)();
    // Preloaded routes are rendered hidden and don't participate in back-affordance computations.
    const activeRoutes = state.routes.filter((route)=>!isPreloaded(route.key));
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_elements.SafeAreaProviderCompat, {
        children: state.routes.map((route, i)=>{
            const isFocused = state.index === i;
            const activeIndex = activeRoutes.findIndex((activeRoute)=>activeRoute.key === route.key);
            const previousKey = activeIndex > 0 ? activeRoutes[activeIndex - 1]?.key : undefined;
            const nextKey = activeIndex >= 0 ? activeRoutes[activeIndex + 1]?.key : undefined;
            const previousDescriptor = previousKey ? descriptors[previousKey] : undefined;
            const nextDescriptor = nextKey ? descriptors[nextKey] : undefined;
            const { options, navigation, render } = descriptors[route.key];
            const headerBack = previousDescriptor ? {
                title: (0, _elements.getHeaderTitle)(previousDescriptor.options, previousDescriptor.route.name),
                href: buildHref(previousDescriptor.route.name, previousDescriptor.route.params)
            } : parentHeaderBack;
            const canGoBack = headerBack != null;
            const { header, headerShown, headerBackIcon, headerBackImageSource, headerLeft, headerTransparent: headerTransparentOption, headerBackTitle, presentation, contentStyle, ...rest } = options;
            const headerTransparent = (0, _headerAppearance.getPlatformHeaderTransparent)(headerTransparentOption);
            const nextPresentation = nextDescriptor?.options.presentation;
            const routeIsPreloaded = isPreloaded(route.key);
            return /*#__PURE__*/ (0, _jsxruntime().jsx)(_elements.Screen, {
                focused: isFocused,
                route: route,
                navigation: navigation,
                headerShown: headerShown,
                headerTransparent: headerTransparent,
                header: header !== undefined ? header({
                    back: headerBack,
                    options,
                    route,
                    navigation
                }) : /*#__PURE__*/ (0, _jsxruntime().jsx)(_elements.Header, {
                    ...rest,
                    back: headerBack,
                    title: (0, _elements.getHeaderTitle)(options, route.name),
                    headerLeft: typeof headerLeft === 'function' ? ({ label, ...rest })=>headerLeft({
                            ...rest,
                            label: headerBackTitle ?? label
                        }) : headerLeft === undefined && canGoBack ? ({ tintColor, label, ...rest })=>/*#__PURE__*/ (0, _jsxruntime().jsx)(_elements.HeaderBackButton, {
                            ...rest,
                            label: headerBackTitle ?? label,
                            tintColor: tintColor,
                            backImage: headerBackIcon !== undefined || headerBackImageSource !== undefined ? ()=>/*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Image, {
                                    source: headerBackIcon?.source ?? headerBackImageSource,
                                    resizeMode: "contain",
                                    tintColor: tintColor,
                                    style: styles.backImage
                                }) : undefined,
                            onPress: navigation.goBack
                        }) : headerLeft,
                    headerTransparent: headerTransparent
                }),
                style: [
                    _reactnative().StyleSheet.absoluteFill,
                    {
                        display: (isFocused || nextPresentation != null && TRANSPARENT_PRESENTATIONS.includes(nextPresentation)) && !routeIsPreloaded ? 'flex' : 'none'
                    },
                    presentation != null && TRANSPARENT_PRESENTATIONS.includes(presentation) ? {
                        backgroundColor: 'transparent'
                    } : null
                ],
                children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_elements.HeaderBackContext.Provider, {
                    value: headerBack,
                    children: /*#__PURE__*/ (0, _jsxruntime().jsx)(AnimatedHeaderHeightProvider, {
                        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
                            style: [
                                styles.contentContainer,
                                contentStyle
                            ],
                            children: render()
                        })
                    })
                })
            }, route.key);
        })
    });
}
const AnimatedHeaderHeightProvider = ({ children })=>{
    const headerHeight = (0, _elements.useHeaderHeight)();
    const [animatedHeaderHeight] = _react().useState(()=>new (_reactnative()).Animated.Value(headerHeight));
    _react().useEffect(()=>{
        animatedHeaderHeight.setValue(headerHeight);
    }, [
        animatedHeaderHeight,
        headerHeight
    ]);
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_useAnimatedHeaderHeight.AnimatedHeaderHeightContext.Provider, {
        value: animatedHeaderHeight,
        children: children
    });
};
const styles = _reactnative().StyleSheet.create({
    contentContainer: {
        flex: 1
    },
    backImage: {
        height: 24,
        width: 24,
        margin: 3
    }
});

//# sourceMappingURL=NativeStackView.js.map
