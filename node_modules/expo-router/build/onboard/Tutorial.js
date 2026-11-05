"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Tutorial", {
    enumerable: true,
    get: function() {
        return Tutorial;
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
const _link = require("../link");
const _Pressable = require("../views/Pressable");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const canAutoTouchFile = process.env.EXPO_ROUTER_APP_ROOT != null;
function createEntryFileAsync() {
    if (process.env.NODE_ENV === 'production') {
        // No dev server
        console.warn('createEntryFile() cannot be used in production');
        return;
    }
    return fetch('/_expo/touch', {
        method: 'POST',
        body: JSON.stringify({
            type: 'router_index'
        })
    });
}
function Tutorial() {
    _react().default.useEffect(()=>{
        if (_reactnative().Platform.OS === 'web') {
            // Reset the route on web so the initial route isn't a 404 after
            // the user has created the entry file.
            // This is useful for cases where you are testing the tutorial.
            // To test: touch the new file, then navigate to a missing route `/foobar`, then delete the app folder.
            // you should see the tutorial again and be able to create the entry file once more.
            if (typeof location !== 'undefined' && location.pathname !== '/') {
                location.replace('/');
            }
            if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
                window.document.title = 'Welcome to Expo';
            }
        }
    }, []);
    return /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnativesafeareacontext().SafeAreaView, {
        style: styles.background,
        children: [
            /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().StatusBar, {
                barStyle: "light-content"
            }),
            /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().View, {
                style: styles.container,
                children: [
                    /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
                        style: styles.logotypeWrapper,
                        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Image, {
                            style: styles.logotype,
                            source: require('expo-router/assets/logotype.png')
                        })
                    }),
                    /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Text, {
                        role: "heading",
                        "aria-level": 1,
                        style: styles.title,
                        children: "Welcome to Expo"
                    }),
                    /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().Text, {
                        role: "heading",
                        "aria-level": 2,
                        style: [
                            styles.subtitle,
                            styles.textSecondary
                        ],
                        children: [
                            "Start by creating a file",
                            _reactnative().Platform.OS !== 'web' ? '\n' : ' ',
                            "in the",
                            ' ',
                            /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Text, {
                                style: {
                                    fontWeight: '600'
                                },
                                children: getRootDir()
                            }),
                            " directory."
                        ]
                    }),
                    /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Text, {
                        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_link.Link, {
                            href: "https://docs.expo.dev/router/introduction/",
                            ..._reactnative().Platform.select({
                                web: {
                                    target: '_blank'
                                },
                                native: {
                                    asChild: true
                                }
                            }),
                            children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_Pressable.Pressable, {
                                children: ({ hovered, pressed })=>/*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Text, {
                                        style: [
                                            styles.link,
                                            _reactnative().Platform.select({
                                                web: {
                                                    transitionDuration: '200ms',
                                                    marginBottom: 12
                                                }
                                            }),
                                            hovered && {
                                                opacity: 0.8,
                                                textDecorationLine: 'underline'
                                            },
                                            pressed && {
                                                opacity: 0.8
                                            }
                                        ],
                                        children: "Learn more about Expo Router in the documentation."
                                    })
                            })
                        })
                    }),
                    canAutoTouchFile && /*#__PURE__*/ (0, _jsxruntime().jsx)(Button, {})
                ]
            })
        ]
    });
}
function getRootDir() {
    const dir = process.env.EXPO_ROUTER_APP_ROOT ?? '';
    if (/[\\/]src[\\/]app$/.test(dir)) {
        return 'src/app';
    } else if (/[\\/]app$/.test(dir)) {
        return 'app';
    }
    return dir.split(/[\\/]/).pop() ?? '';
}
function Button() {
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_Pressable.Pressable, {
        onPress: ()=>{
            createEntryFileAsync();
        },
        style: styles.button,
        children: ({ pressed, hovered })=>/*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
                style: [
                    styles.buttonContainer,
                    hovered && {
                        backgroundColor: '#fff'
                    },
                    pressed && _reactnative().Platform.select({
                        web: {
                            transform: 'scale(0.98)',
                            transitionDuration: '200ms'
                        },
                        default: {
                            backgroundColor: '#fff'
                        }
                    })
                ],
                children: /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().Text, {
                    style: [
                        styles.code,
                        hovered && {
                            color: '#000'
                        },
                        pressed && _reactnative().Platform.select({
                            native: {
                                color: '#000'
                            }
                        })
                    ],
                    children: [
                        /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Text, {
                            style: styles.textSecondary,
                            children: "$"
                        }),
                        " touch ",
                        `${getRootDir()}/index.tsx`
                    ]
                })
            })
    });
}
const styles = _reactnative().StyleSheet.create({
    background: {
        backgroundColor: '#000',
        flex: 1
    },
    container: {
        flex: 1,
        padding: 24,
        paddingBottom: 64,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 'auto',
        gap: 16,
        ..._reactnative().Platform.select({
            web: {
                maxWidth: 960
            },
            native: {
                width: '100%'
            }
        })
    },
    logotypeWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#151718',
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#313538',
        width: 78,
        height: 78,
        marginBottom: 8
    },
    logotype: {
        width: 48,
        height: 44
    },
    title: {
        ..._reactnative().Platform.select({
            web: {
                fontSize: 64,
                lineHeight: 64
            },
            default: {
                fontSize: 56,
                lineHeight: 56
            }
        }),
        color: '#fff',
        fontWeight: '800',
        textAlign: 'center'
    },
    buttonContainer: {
        ..._reactnative().Platform.select({
            web: {
                transitionDuration: '200ms'
            }
        }),
        backgroundColor: 'transparent',
        borderColor: '#fff',
        borderWidth: 2,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8
    },
    button: {
        ..._reactnative().Platform.select({
            web: {
                marginTop: 12
            },
            native: {
                position: 'absolute',
                bottom: 24,
                left: 32,
                right: 32,
                overflow: 'hidden'
            }
        })
    },
    code: {
        ..._reactnative().Platform.select({
            web: {
                transitionDuration: '200ms',
                fontFamily: 'Courier, monospace'
            },
            default: {
                fontFamily: _reactnative().Platform.select({
                    ios: 'Courier New',
                    android: 'monospace'
                })
            }
        }),
        color: '#fff',
        textAlign: 'center',
        userSelect: 'none',
        fontSize: 18,
        fontWeight: 'bold'
    },
    subtitle: {
        fontSize: 34,
        fontWeight: '200',
        textAlign: 'center'
    },
    link: {
        fontSize: 20,
        lineHeight: 26,
        textAlign: 'center',
        color: '#52a9ff',
        marginTop: 12,
        ..._reactnative().Platform.select({
            web: {
                marginBottom: 24
            }
        })
    },
    textSecondary: {
        color: '#9ba1a6'
    }
});

//# sourceMappingURL=Tutorial.js.map
