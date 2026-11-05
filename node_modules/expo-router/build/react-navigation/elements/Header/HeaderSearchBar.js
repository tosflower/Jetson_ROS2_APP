'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HeaderSearchBar", {
    enumerable: true,
    get: function() {
        return HeaderSearchBar;
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
const _cleariconpng = /*#__PURE__*/ _interop_require_default(require("../../../../assets/react-navigation/elements/clear-icon.png"));
const _closeiconpng = /*#__PURE__*/ _interop_require_default(require("../../../../assets/react-navigation/elements/close-icon.png"));
const _searchiconpng = /*#__PURE__*/ _interop_require_default(require("../../../../assets/react-navigation/elements/search-icon.png"));
const _color = require("../../../utils/color");
const _native = require("../../native");
const _PlatformPressable = require("../PlatformPressable");
const _Text = require("../Text");
const _HeaderButton = require("./HeaderButton");
const _HeaderIcon = require("./HeaderIcon");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
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
const INPUT_TYPE_TO_MODE = {
    text: 'text',
    number: 'numeric',
    phone: 'tel',
    email: 'email'
};
const useNativeDriver = _reactnative().Platform.OS !== 'web';
function HeaderSearchBarInternal({ ref, visible, inputType, autoFocus = true, autoCapitalize, placeholder = 'Search', cancelButtonText = 'Cancel', enterKeyHint = 'search', onChangeText, onClose, tintColor, style, ...rest }) {
    const navigation = (0, _native.useNavigation)();
    const { dark, colors, fonts } = (0, _native.useTheme)();
    const [value, setValue] = _react().useState('');
    const [rendered, setRendered] = _react().useState(visible);
    const [visibleAnim] = _react().useState(()=>new (_reactnative()).Animated.Value(visible ? 1 : 0));
    const [clearVisibleAnim] = _react().useState(()=>new (_reactnative()).Animated.Value(0));
    const visibleValueRef = _react().useRef(visible);
    const clearVisibleValueRef = _react().useRef(false);
    const inputRef = _react().useRef(null);
    _react().useEffect(()=>{
        // Avoid act warning in tests just by rendering header
        if (visible === visibleValueRef.current) {
            return;
        }
        _reactnative().Animated.timing(visibleAnim, {
            toValue: visible ? 1 : 0,
            duration: 100,
            useNativeDriver
        }).start(({ finished })=>{
            if (finished) {
                setRendered(visible);
                visibleValueRef.current = visible;
            }
        });
        return ()=>{
            visibleAnim.stopAnimation();
        };
    }, [
        visible,
        visibleAnim
    ]);
    const hasText = value !== '';
    _react().useEffect(()=>{
        if (clearVisibleValueRef.current === hasText) {
            return;
        }
        _reactnative().Animated.timing(clearVisibleAnim, {
            toValue: hasText ? 1 : 0,
            duration: 100,
            useNativeDriver
        }).start(({ finished })=>{
            if (finished) {
                clearVisibleValueRef.current = hasText;
            }
        });
    }, [
        clearVisibleAnim,
        hasText
    ]);
    const clearText = _react().useCallback(()=>{
        inputRef.current?.clear();
        inputRef.current?.focus();
        setValue('');
    }, []);
    const onClear = _react().useCallback(()=>{
        clearText();
        // FIXME: figure out how to create a SyntheticEvent
        // @ts-expect-error: we don't have the native event here
        onChangeText?.({
            nativeEvent: {
                text: ''
            }
        });
    }, [
        clearText,
        onChangeText
    ]);
    const cancelSearch = _react().useCallback(()=>{
        onClear();
        onClose();
    }, [
        onClear,
        onClose
    ]);
    _react().useEffect(()=>navigation?.addListener('blur', cancelSearch), [
        cancelSearch,
        navigation
    ]);
    _react().useImperativeHandle(ref, ()=>({
            focus: ()=>{
                inputRef.current?.focus();
            },
            blur: ()=>{
                inputRef.current?.blur();
            },
            setText: (text)=>{
                inputRef.current?.setNativeProps({
                    text
                });
                setValue(text);
            },
            clearText,
            cancelSearch
        }), [
        cancelSearch,
        clearText
    ]);
    if (!visible && !rendered) {
        return null;
    }
    const textColor = tintColor ?? colors.text;
    return /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().Animated.View, {
        "aria-live": "polite",
        "aria-hidden": !visible,
        style: [
            styles.container,
            {
                pointerEvents: visible ? 'auto' : 'none',
                opacity: visibleAnim
            },
            style
        ],
        children: [
            /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().View, {
                style: styles.searchbarContainer,
                children: [
                    /*#__PURE__*/ (0, _jsxruntime().jsx)(_HeaderIcon.HeaderIcon, {
                        source: _searchiconpng.default,
                        tintColor: textColor,
                        style: styles.inputSearchIcon
                    }),
                    /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().TextInput, {
                        ...rest,
                        ref: inputRef,
                        onChange: onChangeText,
                        onChangeText: setValue,
                        autoFocus: autoFocus,
                        autoCapitalize: autoCapitalize === 'systemDefault' ? undefined : autoCapitalize,
                        inputMode: INPUT_TYPE_TO_MODE[inputType ?? 'text'],
                        enterKeyHint: enterKeyHint,
                        placeholder: placeholder,
                        placeholderTextColor: (0, _color.alpha)(textColor, 0.5),
                        cursorColor: colors.primary,
                        selectionHandleColor: colors.primary,
                        selectionColor: (0, _color.alpha)(colors.primary, 0.3),
                        style: [
                            fonts.regular,
                            styles.searchbar,
                            {
                                backgroundColor: _reactnative().Platform.select({
                                    ios: dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                                    default: 'transparent'
                                }),
                                color: textColor,
                                borderBottomColor: (0, _color.alpha)(textColor, 0.2) ?? (dark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)')
                            }
                        ]
                    }),
                    _reactnative().Platform.OS === 'ios' ? /*#__PURE__*/ (0, _jsxruntime().jsx)(_PlatformPressable.PlatformPressable, {
                        onPress: onClear,
                        style: [
                            {
                                opacity: clearVisibleAnim,
                                transform: [
                                    {
                                        scale: clearVisibleAnim
                                    }
                                ]
                            },
                            styles.clearButton
                        ],
                        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Image, {
                            source: _cleariconpng.default,
                            resizeMode: "contain",
                            tintColor: textColor,
                            style: styles.clearIcon
                        })
                    }) : null
                ]
            }),
            _reactnative().Platform.OS !== 'ios' ? /*#__PURE__*/ (0, _jsxruntime().jsx)(_HeaderButton.HeaderButton, {
                onPress: ()=>{
                    if (value) {
                        onClear();
                    } else {
                        onClose();
                    }
                },
                style: styles.closeButton,
                children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_HeaderIcon.HeaderIcon, {
                    source: _closeiconpng.default,
                    tintColor: textColor
                })
            }) : null,
            _reactnative().Platform.OS === 'ios' ? /*#__PURE__*/ (0, _jsxruntime().jsx)(_PlatformPressable.PlatformPressable, {
                onPress: cancelSearch,
                style: styles.cancelButton,
                children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_Text.Text, {
                    style: [
                        fonts.regular,
                        {
                            color: tintColor ?? colors.primary
                        },
                        styles.cancelText
                    ],
                    children: cancelButtonText
                })
            }) : null
        ]
    });
}
const styles = _reactnative().StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'stretch'
    },
    inputSearchIcon: {
        position: 'absolute',
        opacity: 0.5,
        left: _reactnative().Platform.select({
            ios: 16,
            default: 4
        }),
        top: _reactnative().Platform.select({
            ios: -1,
            default: 17
        }),
        ..._reactnative().Platform.select({
            ios: {
                height: 18,
                width: 18
            },
            default: {}
        })
    },
    closeButton: {
        position: 'absolute',
        opacity: 0.5,
        right: _reactnative().Platform.select({
            ios: 0,
            default: 8
        }),
        top: _reactnative().Platform.select({
            ios: -2,
            default: 17
        })
    },
    clearButton: {
        position: 'absolute',
        right: 0,
        top: -7,
        bottom: 0,
        justifyContent: 'center',
        padding: 8
    },
    clearIcon: {
        height: 16,
        width: 16,
        opacity: 0.5
    },
    cancelButton: {
        alignSelf: 'center',
        top: -4
    },
    cancelText: {
        fontSize: 17,
        marginHorizontal: 12
    },
    searchbarContainer: {
        flex: 1
    },
    searchbar: _reactnative().Platform.select({
        ios: {
            flex: 1,
            fontSize: 17,
            paddingHorizontal: 32,
            marginLeft: 16,
            marginTop: -1,
            marginBottom: 4,
            borderRadius: 8,
            borderCurve: 'continuous'
        },
        default: {
            flex: 1,
            fontSize: 18,
            paddingHorizontal: 36,
            marginRight: 8,
            marginTop: 8,
            marginBottom: 8,
            borderBottomWidth: 1
        }
    })
});
const HeaderSearchBar = HeaderSearchBarInternal;

//# sourceMappingURL=HeaderSearchBar.js.map
