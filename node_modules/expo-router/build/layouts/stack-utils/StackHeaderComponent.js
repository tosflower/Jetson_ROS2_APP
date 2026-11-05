"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    StackHeaderComponent: null,
    appendStackHeaderPropsToOptions: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get StackHeaderComponent () {
        return StackHeaderComponent;
    },
    get appendStackHeaderPropsToOptions () {
        return appendStackHeaderPropsToOptions;
    }
});
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
function StackHeaderComponent({ children, hidden, asChild, transparent, blurEffect, style, largeStyle }) {
    const options = (0, _react().useMemo)(()=>appendStackHeaderPropsToOptions({}, // satisfies ensures every prop is listed here
        {
            children,
            hidden,
            asChild,
            transparent,
            blurEffect,
            style,
            largeStyle
        }), [
        children,
        hidden,
        asChild,
        transparent,
        blurEffect,
        style,
        largeStyle
    ]);
    (0, _compositionoptions.useCompositionOption)(options);
    return null;
}
function appendStackHeaderPropsToOptions(options, props) {
    const flattenedStyle = _reactnative().StyleSheet.flatten(props.style);
    const flattenedLargeStyle = _reactnative().StyleSheet.flatten(props.largeStyle);
    if (props.hidden) {
        return {
            ...options,
            headerShown: false
        };
    }
    if (props.asChild) {
        return {
            ...options,
            header: ()=>props.children
        };
    }
    if (props.children && !props.asChild) {
        console.warn(`To render a custom header, set the 'asChild' prop to true on Stack.Header.`);
    }
    // Determine if header should be transparent:
    // 1. Explicitly set via `transparent` prop
    // 2. Implicitly via backgroundColor === 'transparent'
    // 3. Implicitly when blurEffect is set (required for blurEffect to work)
    const isBackgroundTransparent = flattenedStyle?.backgroundColor === 'transparent';
    const hasBlurEffect = props.blurEffect !== undefined;
    const shouldBeTransparent = props.transparent === true || props.transparent !== false && (isBackgroundTransparent || hasBlurEffect);
    // Warn if blurEffect is set but transparent is explicitly false
    if (props.blurEffect && props.transparent === false) {
        console.warn(`Stack.Header: 'blurEffect' requires 'transparent' to be enabled.`);
    }
    return {
        ...options,
        headerShown: !props.hidden,
        headerBlurEffect: props.blurEffect,
        ...shouldBeTransparent && {
            headerTransparent: true
        },
        ...props.transparent === false && {
            headerTransparent: false
        },
        ...flattenedStyle?.color && {
            headerTintColor: flattenedStyle.color
        },
        headerStyle: {
            backgroundColor: flattenedStyle?.backgroundColor
        },
        headerLargeStyle: {
            backgroundColor: flattenedLargeStyle?.backgroundColor
        },
        ...flattenedStyle?.shadowColor === 'transparent' && {
            headerShadowVisible: false
        },
        ...flattenedLargeStyle?.shadowColor === 'transparent' && {
            headerLargeTitleShadowVisible: false
        }
    };
}

//# sourceMappingURL=StackHeaderComponent.js.map
