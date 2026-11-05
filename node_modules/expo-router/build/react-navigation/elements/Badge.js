'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Badge", {
    enumerable: true,
    get: function() {
        return Badge;
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
const _color = require("../../utils/color");
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
const useNativeDriver = _reactnative().Platform.OS !== 'web';
function Badge({ children, style, visible = true, size = 18, ...rest }) {
    const [opacity] = _react().useState(()=>new (_reactnative()).Animated.Value(visible ? 1 : 0));
    const [rendered, setRendered] = _react().useState(visible);
    const { colors, fonts } = (0, _native.useTheme)();
    _react().useEffect(()=>{
        if (!rendered) {
            return;
        }
        _reactnative().Animated.timing(opacity, {
            toValue: visible ? 1 : 0,
            duration: 150,
            useNativeDriver
        }).start(({ finished })=>{
            if (finished && !visible) {
                setRendered(false);
            }
        });
        return ()=>opacity.stopAnimation();
    }, [
        opacity,
        rendered,
        visible
    ]);
    if (!rendered) {
        if (visible) {
            setRendered(true);
        } else {
            return null;
        }
    }
    // @ts-expect-error: backgroundColor definitely exists
    const { backgroundColor = colors.notification, ...restStyle } = _reactnative().StyleSheet.flatten(style) || {};
    const textColor = (0, _color.isLight)(backgroundColor) ? 'black' : 'white';
    const borderRadius = size / 2;
    const fontSize = Math.floor(size * 3 / 4);
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Animated.Text, {
        numberOfLines: 1,
        style: [
            {
                transform: [
                    {
                        scale: opacity.interpolate({
                            inputRange: [
                                0,
                                1
                            ],
                            outputRange: [
                                0.5,
                                1
                            ]
                        })
                    }
                ],
                color: textColor,
                lineHeight: size - 1,
                height: size,
                minWidth: size,
                opacity,
                backgroundColor,
                fontSize,
                borderRadius,
                borderCurve: 'continuous'
            },
            fonts.regular,
            styles.container,
            restStyle
        ],
        ...rest,
        children: children
    });
}
const styles = _reactnative().StyleSheet.create({
    container: {
        alignSelf: 'flex-end',
        textAlign: 'center',
        paddingHorizontal: 4,
        overflow: 'hidden'
    }
});

//# sourceMappingURL=Badge.js.map
