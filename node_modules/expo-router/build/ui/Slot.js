"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Slot", {
    enumerable: true,
    get: function() {
        return Slot;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
function _reactslot() {
    const data = require("@radix-ui/react-slot");
    _reactslot = function() {
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
/**
 * RadixUI has special logic to handle the merging of `style` and `className` props.
 * On the web styles are not allowed so Radix does not handle this scenario.
 * This could be fixed upstream (PR open), but it may not as RN is not their target
 * platform.
 *
 * This shim calls `StyleSheet.flatten` on the styles before we render the <Slot />
 *
 * @see https://github.com/expo/expo/issues/31352
 * @see https://github.com/radix-ui/primitives/issues/3107
 * @param Component
 * @returns
 */ function ShimSlotForReactNative(Component) {
    return /*#__PURE__*/ (0, _react().forwardRef)(function RNSlotHOC({ style, ...props }, ref) {
        const flattenedStyle = (0, _react().useMemo)(()=>_reactnative().StyleSheet.flatten(style), [
            style
        ]);
        if (process.env.NODE_ENV !== 'production') {
            if (/*#__PURE__*/ _react().default.isValidElement(props.children)) {
                if (typeof props.children.props === 'object' && props.children.props !== null && 'style' in props.children.props && Array.isArray(props.children.props.style)) {
                    throw new Error(`[expo-router]: You are passing an array of styles to a child of <Slot>. Consider flattening the styles with StyleSheet.flatten before passing them to the child component.`);
                }
            }
        }
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(Component, {
            ref: ref,
            ...props,
            style: flattenedStyle
        });
    });
}
const Slot = ShimSlotForReactNative(_reactslot().Slot);

//# sourceMappingURL=Slot.js.map
