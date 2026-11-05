"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    StackTitle: null,
    appendStackTitlePropsToOptions: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get StackTitle () {
        return StackTitle;
    },
    get appendStackTitlePropsToOptions () {
        return appendStackTitlePropsToOptions;
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
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
const _compositionoptions = require("../../fork/native-stack/composition-options");
const _style = require("../../utils/style");
const _shared = require("./toolbar/shared");
function StackTitle({ children, asChild, style, largeStyle, large }) {
    const options = (0, _react().useMemo)(()=>appendStackTitlePropsToOptions({}, // satisfies ensures every prop is listed here
        {
            children,
            asChild,
            style,
            largeStyle,
            large
        }), [
        children,
        asChild,
        style,
        largeStyle,
        large
    ]);
    (0, _compositionoptions.useCompositionOption)(options);
    return null;
}
function appendStackTitlePropsToOptions(options, props) {
    const flattenedStyle = _reactnative().StyleSheet.flatten(props.style);
    const flattenedLargeStyle = _reactnative().StyleSheet.flatten(props.largeStyle);
    let titleOptions = props.asChild ? {
        headerTitle: ()=>/*#__PURE__*/ (0, _jsxruntime().jsx)(_jsxruntime().Fragment, {
                children: props.children
            })
    } : {
        title: (0, _shared.convertChildrenToString)(props.children)
    };
    if (props.asChild && typeof props.children === 'string') {
        if (__DEV__) {
            console.warn("Stack.Title (or the deprecated Stack.Screen.Title): 'asChild' expects a custom component as children, string received.");
        }
        titleOptions = {};
    }
    if (!props.asChild && props.children != null && !(0, _shared.areAllChildrenPrimitiveValues)(props.children)) {
        if (__DEV__) {
            console.warn('Stack.Title (or the deprecated Stack.Screen.Title): Component passed without `asChild` enabled. In order to render a custom component as the title, set `asChild` to true.');
        }
        titleOptions = {};
    }
    return {
        ...options,
        ...titleOptions,
        headerLargeTitle: props.large,
        ...flattenedStyle?.textAlign !== undefined ? {
            headerTitleAlign: flattenedStyle.textAlign
        } : {},
        headerTitleStyle: {
            ...flattenedStyle,
            ...flattenedStyle?.fontWeight ? {
                fontWeight: (0, _style.convertFontWeightToStringFontWeight)(flattenedStyle?.fontWeight)
            } : {}
        },
        headerLargeTitleStyle: {
            ...flattenedLargeStyle,
            ...flattenedLargeStyle?.fontWeight ? {
                fontWeight: (0, _style.convertFontWeightToStringFontWeight)(flattenedLargeStyle?.fontWeight)
            } : {}
        }
    };
}

//# sourceMappingURL=StackTitle.js.map
