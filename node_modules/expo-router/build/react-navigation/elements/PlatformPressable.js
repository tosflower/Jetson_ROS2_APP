'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PlatformPressable", {
    enumerable: true,
    get: function() {
        return PlatformPressable;
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
const _native = require("../native");
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
const AnimatedPressable = _reactnative().Animated.createAnimatedComponent(_reactnative().Pressable);
const ANDROID_VERSION_LOLLIPOP = 21;
const ANDROID_SUPPORTS_RIPPLE = _reactnative().Platform.OS === 'android' && _reactnative().Platform.Version >= ANDROID_VERSION_LOLLIPOP;
const useNativeDriver = _reactnative().Platform.OS !== 'web';
/**
 * PlatformPressable provides an abstraction on top of Pressable to handle platform differences.
 */ function PlatformPressableInternal({ ref, disabled, onPress, onPressIn, onPressOut, android_ripple, pressColor, pressOpacity = 0.3, hoverEffect, style, children, ...rest }) {
    const { dark } = (0, _native.useTheme)();
    const [opacity] = _react().useState(()=>new (_reactnative()).Animated.Value(1));
    const animateTo = (toValue, duration)=>{
        if (ANDROID_SUPPORTS_RIPPLE) {
            return;
        }
        _reactnative().Animated.timing(opacity, {
            toValue,
            duration,
            easing: _reactnative().Easing.inOut(_reactnative().Easing.quad),
            useNativeDriver
        }).start();
    };
    const handlePress = (e)=>{
        if (_reactnative().Platform.OS === 'web' && rest.href !== null) {
            // ignore clicks with modifier keys
            const hasModifierKey = 'metaKey' in e && e.metaKey || 'altKey' in e && e.altKey || 'ctrlKey' in e && e.ctrlKey || 'shiftKey' in e && e.shiftKey;
            // only handle left clicks
            const isLeftClick = 'button' in e ? e.button == null || e.button === 0 : true;
            // let browser handle "target=_blank" etc.
            const isSelfTarget = e.currentTarget && 'target' in e.currentTarget ? [
                undefined,
                null,
                '',
                'self'
            ].includes(e.currentTarget.target) : true;
            if (!hasModifierKey && isLeftClick && isSelfTarget) {
                e.preventDefault();
                // call `onPress` only when browser default is prevented
                // this prevents app from handling the click when a link is being opened
                onPress?.(e);
            }
        } else {
            onPress?.(e);
        }
    };
    const handlePressIn = (e)=>{
        animateTo(pressOpacity, 0);
        onPressIn?.(e);
    };
    const handlePressOut = (e)=>{
        animateTo(1, 200);
        onPressOut?.(e);
    };
    return /*#__PURE__*/ (0, _jsxruntime().jsxs)(AnimatedPressable, {
        ref: ref,
        accessible: true,
        role: _reactnative().Platform.OS === 'web' && rest.href != null ? 'link' : 'button',
        onPress: disabled ? undefined : handlePress,
        onPressIn: disabled ? undefined : handlePressIn,
        onPressOut: disabled ? undefined : handlePressOut,
        android_ripple: ANDROID_SUPPORTS_RIPPLE && !disabled ? {
            color: pressColor !== undefined ? pressColor : dark ? 'rgba(255, 255, 255, .32)' : 'rgba(0, 0, 0, .32)',
            ...android_ripple
        } : undefined,
        style: [
            {
                cursor: (_reactnative().Platform.OS === 'web' || _reactnative().Platform.OS === 'ios') && !disabled ? // Hover effect on iPad and visionOS
                'pointer' : 'auto',
                opacity: !ANDROID_SUPPORTS_RIPPLE && !disabled ? opacity : 1
            },
            style
        ],
        ...rest,
        children: [
            !disabled ? /*#__PURE__*/ (0, _jsxruntime().jsx)(HoverEffect, {
                ...hoverEffect
            }) : null,
            children
        ]
    });
}
const PlatformPressable = PlatformPressableInternal;
const css = String.raw;
const CLASS_NAME = `__react-navigation_elements_Pressable_hover`;
const CSS_TEXT = css`
  .${CLASS_NAME} {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    background-color: var(--overlay-color);
    opacity: 0;
    transition: opacity 0.15s;
    pointer-events: none;
  }

  a:hover > .${CLASS_NAME}, button:hover > .${CLASS_NAME} {
    opacity: var(--overlay-hover-opacity);
  }

  a:active > .${CLASS_NAME}, button:active > .${CLASS_NAME} {
    opacity: var(--overlay-active-opacity);
  }
`;
const HoverEffect = ({ color, hoverOpacity = 0.08, activeOpacity = 0.16 })=>{
    if (_reactnative().Platform.OS !== 'web' || color == null) {
        return null;
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsxs)(_jsxruntime().Fragment, {
        children: [
            /*#__PURE__*/ (0, _jsxruntime().jsx)("style", {
                href: CLASS_NAME,
                precedence: "elements",
                children: CSS_TEXT
            }),
            /*#__PURE__*/ (0, _jsxruntime().jsx)("div", {
                className: CLASS_NAME,
                style: {
                    // @ts-expect-error: CSS variables are not typed
                    '--overlay-color': color,
                    '--overlay-hover-opacity': hoverOpacity,
                    '--overlay-active-opacity': activeOpacity
                }
            })
        ]
    });
};

//# sourceMappingURL=PlatformPressable.js.map
