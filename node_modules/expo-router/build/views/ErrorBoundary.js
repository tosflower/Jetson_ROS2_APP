'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ErrorBoundary", {
    enumerable: true,
    get: function() {
        return ErrorBoundary;
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
function _reactnativesafeareacontext() {
    const data = require("react-native-safe-area-context");
    _reactnativesafeareacontext = function() {
        return data;
    };
    return data;
}
const _Link = require("../link/Link");
const _bottomtabs = require("../react-navigation/bottom-tabs");
const _errors = require("../rsc/router/errors");
const _Pressable = require("./Pressable");
function StandardErrorView({ error }) {
    return /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().View, {
        style: {
            marginBottom: 12,
            gap: 4,
            flexWrap: process.env.EXPO_OS === 'web' ? 'wrap' : 'nowrap'
        },
        children: [
            /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Text, {
                role: "heading",
                "aria-level": 1,
                style: styles.title,
                children: "Something went wrong"
            }),
            /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().Text, {
                testID: "router_error_message",
                role: "heading",
                "aria-level": 2,
                style: styles.errorMessage,
                children: [
                    "Error: ",
                    error.message
                ]
            })
        ]
    });
}
function ErrorBoundary({ error, retry }) {
    const inTabBar = (0, _react().use)(_bottomtabs.BottomTabBarHeightContext);
    const Wrapper = inTabBar ? _reactnative().View : _reactnativesafeareacontext().SafeAreaView;
    const isServerError = error instanceof _errors.ReactServerError;
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
        style: styles.container,
        children: /*#__PURE__*/ (0, _jsxruntime().jsxs)(Wrapper, {
            style: {
                flex: 1,
                gap: 8,
                maxWidth: 720,
                marginHorizontal: 'auto'
            },
            children: [
                isServerError ? /*#__PURE__*/ (0, _jsxruntime().jsx)(ReactServerErrorView, {
                    error: error
                }) : /*#__PURE__*/ (0, _jsxruntime().jsx)(StandardErrorView, {
                    error: error
                }),
                /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
                    style: {
                        flex: 1
                    }
                }),
                process.env.NODE_ENV === 'development' && /*#__PURE__*/ (0, _jsxruntime().jsx)(_Link.Link, {
                    testID: "router_error_sitemap",
                    href: "/_sitemap",
                    style: styles.link,
                    children: "Sitemap"
                }),
                /*#__PURE__*/ (0, _jsxruntime().jsx)(_Pressable.Pressable, {
                    testID: "router_error_retry",
                    onPress: retry,
                    children: ({ hovered, pressed })=>/*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
                            style: [
                                styles.buttonInner,
                                (hovered || pressed) && {
                                    backgroundColor: 'white'
                                }
                            ],
                            children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Text, {
                                style: [
                                    styles.buttonText,
                                    {
                                        color: hovered || pressed ? 'black' : 'white'
                                    }
                                ],
                                children: "Retry"
                            })
                        })
                })
            ]
        })
    });
}
const COMMON_ERROR_STATUS = {
    404: 'NOT_FOUND',
    500: 'INTERNAL_SERVER_ERROR',
    503: 'SERVICE_UNAVAILABLE',
    504: 'GATEWAY_TIMEOUT'
};
// TODO: This should probably be replaced by a DOM component that loads server errors in the future.
function ReactServerErrorView({ error }) {
    let title = String(error.statusCode);
    title += ': ' + (COMMON_ERROR_STATUS[error.statusCode] ?? 'Server Error');
    const errorId = error.headers.get('cf-ray');
    const date = error.headers.get('Date');
    return /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().View, {
        style: {
            padding: 12,
            gap: 8
        },
        children: [
            /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Text, {
                selectable: true,
                allowFontScaling: true,
                style: {
                    fontSize: _reactnative().Platform.select({
                        web: 24,
                        default: 16
                    }),
                    fontWeight: 'bold',
                    marginBottom: 4,
                    color: 'white'
                },
                children: title
            }),
            process.env.EXPO_OS === 'web' ? /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().ScrollView, {
                style: {
                    borderColor: 'rgba(255,255,255,0.5)',
                    borderTopWidth: _reactnative().StyleSheet.hairlineWidth,
                    borderBottomWidth: _reactnative().StyleSheet.hairlineWidth,
                    maxHeight: 150
                },
                contentContainerStyle: {
                    paddingVertical: 4
                },
                children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Text, {
                    testID: "router_error_message",
                    selectable: true,
                    allowFontScaling: true,
                    style: {
                        color: 'white'
                    },
                    children: error.message
                })
            }) : /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().TextInput, {
                testID: "router_error_message",
                scrollEnabled: true,
                multiline: true,
                editable: false,
                allowFontScaling: true,
                value: error.message,
                style: {
                    borderColor: 'rgba(255,255,255,0.5)',
                    borderTopWidth: _reactnative().StyleSheet.hairlineWidth,
                    borderBottomWidth: _reactnative().StyleSheet.hairlineWidth,
                    paddingVertical: 4,
                    maxHeight: 150,
                    color: 'white'
                }
            }),
            /*#__PURE__*/ (0, _jsxruntime().jsx)(InfoRow, {
                title: "Code",
                right: error.statusCode
            }),
            errorId && /*#__PURE__*/ (0, _jsxruntime().jsx)(InfoRow, {
                title: "ID",
                right: errorId
            }),
            date && /*#__PURE__*/ (0, _jsxruntime().jsx)(InfoRow, {
                title: "Date",
                right: date
            }),
            error.url && /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Text, {
                selectable: true,
                allowFontScaling: true,
                style: {
                    fontSize: 14,
                    opacity: 0.5,
                    color: 'white'
                },
                children: error.url
            })
        ]
    });
}
function InfoRow({ title, right }) {
    const style = {
        fontSize: 16,
        color: 'white'
    };
    return /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().View, {
        style: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        children: [
            /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Text, {
                selectable: true,
                allowFontScaling: true,
                style: style,
                children: title
            }),
            right && /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Text, {
                selectable: true,
                allowFontScaling: true,
                style: [
                    style,
                    styles.code
                ],
                children: right
            })
        ]
    });
}
const styles = _reactnative().StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        padding: 24,
        alignItems: 'stretch',
        justifyContent: 'center'
    },
    title: {
        color: 'white',
        fontSize: _reactnative().Platform.select({
            web: 32,
            default: 24
        }),
        fontWeight: 'bold'
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        ..._reactnative().Platform.select({
            web: {
                transitionDuration: '100ms'
            }
        })
    },
    buttonInner: {
        ..._reactnative().Platform.select({
            web: {
                transitionDuration: '100ms'
            }
        }),
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderColor: 'white',
        borderWidth: 2,
        marginLeft: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    code: {
        fontFamily: _reactnative().Platform.select({
            default: 'Courier',
            ios: 'Courier New',
            android: 'monospace'
        }),
        fontWeight: '500'
    },
    errorMessage: {
        color: 'white',
        fontSize: 16
    },
    subtitle: {
        color: 'white',
        fontSize: 14,
        marginBottom: 12
    },
    link: {
        color: 'rgba(255,255,255,0.4)',
        textDecorationStyle: 'solid',
        textDecorationLine: 'underline',
        fontSize: 14,
        textAlign: 'center'
    }
});

//# sourceMappingURL=ErrorBoundary.js.map
