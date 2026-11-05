'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    useHrefAttrs: null,
    useInteropClassName: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get useHrefAttrs () {
        return useHrefAttrs;
    },
    get useInteropClassName () {
        return useInteropClassName;
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
function useInteropClassName(props) {
    if (_reactnative().Platform.OS !== 'web') {
        return props.style;
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return (0, _react().useMemo)(()=>{
        if (props.className == null) {
            return props.style;
        }
        const cssStyle = {
            $$css: true,
            __routerLinkClassName: props.className
        };
        if (Array.isArray(props.style)) {
            return [
                ...props.style,
                cssStyle
            ];
        }
        return [
            props.style,
            cssStyle
        ];
    }, [
        props.style,
        props.className
    ]);
}
const useHrefAttrs = _reactnative().Platform.select({
    web: function useHrefAttrs({ asChild, rel, target, download }) {
        return (0, _react().useMemo)(()=>{
            const hrefAttrs = {
                rel,
                target,
                download
            };
            if (asChild) {
                return hrefAttrs;
            }
            return {
                hrefAttrs
            };
        }, [
            asChild,
            rel,
            target,
            download
        ]);
    },
    default: function useHrefAttrs() {
        return {};
    }
});

//# sourceMappingURL=useLinkHooks.js.map
