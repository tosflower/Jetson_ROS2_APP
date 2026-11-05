'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HeaderSegment", {
    enumerable: true,
    get: function() {
        return HeaderSegment;
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
const _elements = require("../../../elements");
const _native = require("../../../native");
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
function HeaderSegment(props) {
    const { direction } = (0, _native.useLocale)();
    const [leftLabelLayout, setLeftLabelLayout] = _react().useState(undefined);
    const [titleLayout, setTitleLayout] = _react().useState(undefined);
    const handleTitleLayout = (e)=>{
        const { height, width } = e.nativeEvent.layout;
        setTitleLayout((titleLayout)=>{
            if (titleLayout && height === titleLayout.height && width === titleLayout.width) {
                return titleLayout;
            }
            return {
                height,
                width
            };
        });
    };
    const handleLeftLabelLayout = (e)=>{
        const { height, width } = e.nativeEvent.layout;
        if (leftLabelLayout && height === leftLabelLayout.height && width === leftLabelLayout.width) {
            return;
        }
        setLeftLabelLayout({
            height,
            width
        });
    };
    const { progress, layout, modal, onGoBack, backHref, headerTitle: title, headerLeft: left = onGoBack ? (props)=>/*#__PURE__*/ (0, _jsxruntime().jsx)(_elements.HeaderBackButton, {
            ...props
        }) : undefined, headerRight: right, headerBackImage, headerBackTitle, headerBackButtonDisplayMode = _reactnative().Platform.OS === 'ios' ? 'default' : 'minimal', headerBackTruncatedTitle, headerBackAccessibilityLabel, headerBackTestID, headerBackAllowFontScaling, headerBackTitleStyle, headerTitleContainerStyle, headerLeftContainerStyle, headerRightContainerStyle, headerBackgroundContainerStyle, headerStyle: customHeaderStyle, headerStatusBarHeight, styleInterpolator, ...rest } = props;
    const defaultHeight = (0, _elements.getDefaultHeaderHeight)(layout, modal, headerStatusBarHeight);
    const { height = defaultHeight } = _reactnative().StyleSheet.flatten(customHeaderStyle || {});
    const headerHeight = typeof height === 'number' ? height : defaultHeight;
    const { titleStyle, leftButtonStyle, leftLabelStyle, rightButtonStyle, backgroundStyle } = _react().useMemo(()=>styleInterpolator({
            current: {
                progress: progress.current
            },
            next: progress.next && {
                progress: progress.next
            },
            direction,
            layouts: {
                header: {
                    height: headerHeight,
                    width: layout.width
                },
                screen: layout,
                title: titleLayout,
                leftLabel: leftLabelLayout
            }
        }), [
        styleInterpolator,
        progress,
        direction,
        headerHeight,
        layout,
        titleLayout,
        leftLabelLayout
    ]);
    const headerLeft = left ? (props)=>left({
            ...props,
            href: backHref,
            backImage: headerBackImage,
            accessibilityLabel: headerBackAccessibilityLabel,
            testID: headerBackTestID,
            allowFontScaling: headerBackAllowFontScaling,
            onPress: onGoBack,
            label: headerBackTitle,
            truncatedLabel: headerBackTruncatedTitle,
            labelStyle: [
                leftLabelStyle,
                headerBackTitleStyle
            ],
            onLabelLayout: handleLeftLabelLayout,
            screenLayout: layout,
            titleLayout,
            canGoBack: Boolean(onGoBack)
        }) : undefined;
    const headerRight = right ? (props)=>right({
            ...props,
            canGoBack: Boolean(onGoBack)
        }) : undefined;
    const headerTitle = typeof title !== 'function' ? (props)=>/*#__PURE__*/ (0, _jsxruntime().jsx)(_elements.HeaderTitle, {
            ...props,
            onLayout: handleTitleLayout
        }) : (props)=>title({
            ...props,
            onLayout: handleTitleLayout
        });
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_elements.Header, {
        modal: modal,
        layout: layout,
        headerTitle: headerTitle,
        headerLeft: headerLeft,
        headerRight: headerRight,
        headerTitleContainerStyle: [
            titleStyle,
            headerTitleContainerStyle
        ],
        headerLeftContainerStyle: [
            leftButtonStyle,
            headerLeftContainerStyle
        ],
        headerRightContainerStyle: [
            rightButtonStyle,
            headerRightContainerStyle
        ],
        headerBackButtonDisplayMode: headerBackButtonDisplayMode,
        headerBackgroundContainerStyle: [
            backgroundStyle,
            headerBackgroundContainerStyle
        ],
        headerStyle: customHeaderStyle,
        headerStatusBarHeight: headerStatusBarHeight,
        ...rest
    });
}

//# sourceMappingURL=HeaderSegment.js.map
