'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    CODE_FONT: null,
    Toast: null,
    ToastWrapper: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get CODE_FONT () {
        return CODE_FONT;
    },
    get Toast () {
        return Toast;
    },
    get ToastWrapper () {
        return ToastWrapper;
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
    const data = /*#__PURE__*/ _interop_require_default(require("react"));
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
const _bottomtabs = require("../react-navigation/bottom-tabs");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const CODE_FONT = _reactnative().Platform.select({
    default: 'Courier',
    ios: 'Courier New',
    android: 'monospace'
});
function useFadeIn() {
    // Returns a React Native Animated value for fading in
    const [value] = _react().default.useState(()=>new (_reactnative()).Animated.Value(0));
    _react().default.useEffect(()=>{
        _reactnative().Animated.timing(value, {
            toValue: 1,
            duration: 200,
            useNativeDriver: _reactnative().Platform.OS !== 'web'
        }).start();
    }, []);
    return value;
}
function ToastWrapper({ children }) {
    const inTabBar = _react().default.use(_bottomtabs.BottomTabBarHeightContext);
    const Wrapper = inTabBar ? _reactnative().View : _reactnativesafeareacontext().SafeAreaView;
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(Wrapper, {
        collapsable: false,
        style: {
            flex: 1
        },
        children: children
    });
}
function Toast({ children, filename, warning }) {
    const filenamePretty = _react().default.useMemo(()=>{
        if (!filename) return undefined;
        return 'app' + filename.replace(/^\./, '');
    }, [
        filename
    ]);
    const value = useFadeIn();
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
        style: styles.container,
        children: /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().Animated.View, {
            style: [
                styles.toast,
                {
                    position: _reactnative().Platform.select({
                        // NOTE(@kitten): This isn't typed to support Web properties
                        web: 'fixed',
                        default: 'absolute'
                    }),
                    opacity: value
                }
            ],
            children: [
                !warning && /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().ActivityIndicator, {
                    color: "white"
                }),
                warning && /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Image, {
                    source: require('expo-router/assets/error.png'),
                    style: styles.icon
                }),
                /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().View, {
                    style: {
                        marginLeft: 8
                    },
                    children: [
                        /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Text, {
                            style: styles.text,
                            children: children
                        }),
                        filenamePretty && /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Text, {
                            style: styles.filename,
                            children: filenamePretty
                        })
                    ]
                })
            ]
        })
    });
}
const styles = _reactnative().StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        flex: 1
    },
    icon: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    },
    toast: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        flexDirection: 'row',
        bottom: 8,
        left: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 4,
        backgroundColor: 'black'
    },
    text: {
        color: 'white',
        fontSize: 16
    },
    filename: {
        fontFamily: CODE_FONT,
        opacity: 0.8,
        color: 'white',
        fontSize: 12
    },
    code: {
        fontFamily: CODE_FONT
    }
});

//# sourceMappingURL=Toast.js.map
