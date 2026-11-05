// Copyright © 2024 650 Industries.
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Unmatched", {
    enumerable: true,
    get: function() {
        return Unmatched;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
function _expolinking() {
    const data = require("expo-linking");
    _expolinking = function() {
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
const _hooks = require("../hooks");
const _Link = require("../link/Link");
const _useNavigation = require("../useNavigation");
const _Pressable = require("../views/Pressable");
const _NoSSR = require("./NoSSR");
const _useSafeLayoutEffect = require("./useSafeLayoutEffect");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function Unmatched() {
    // Following the https://github.com/expo/expo/blob/ubax/router/move-404-and-sitemap-to-root/packages/expo-router/src/getRoutesSSR.ts#L51
    // we need to ensure that the Unmatched component is not rendered on the server.
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_NoSSR.NoSSR, {
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(UnmatchedInner, {})
    });
}
function UnmatchedInner() {
    const [render, setRender] = _react().default.useState(false);
    const router = (0, _hooks.useRouter)();
    const navigation = (0, _useNavigation.useNavigation)();
    const pathname = (0, _hooks.usePathname)();
    const url = (0, _expolinking().createURL)(pathname);
    _react().default.useEffect(()=>{
        setRender(true);
    }, []);
    /** This route may be prefetched if a <Link prefetch href="/<unmatched>" /> is used */ (0, _useSafeLayoutEffect.useSafeLayoutEffect)(()=>{
        navigation.setOptions({
            title: 'Not Found'
        });
    }, [
        navigation
    ]);
    return /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().View, {
        testID: "expo-router-unmatched",
        style: styles.container,
        children: [
            /*#__PURE__*/ (0, _jsxruntime().jsx)(NotFoundAsset, {}),
            /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Text, {
                role: "heading",
                "aria-level": 1,
                style: styles.title,
                children: "Unmatched Route"
            }),
            /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Text, {
                role: "heading",
                "aria-level": 2,
                style: [
                    styles.subtitle,
                    styles.secondaryText
                ],
                children: "Page could not be found."
            }),
            render ? /*#__PURE__*/ (0, _jsxruntime().jsx)(_Link.Link, {
                href: pathname,
                replace: true,
                ..._reactnative().Platform.select({
                    native: {
                        asChild: true
                    }
                }),
                children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_Pressable.Pressable, {
                    children: ({ hovered, pressed })=>/*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Text, {
                            style: [
                                styles.pageLink,
                                styles.secondaryText,
                                _reactnative().Platform.select({
                                    web: {
                                        transitionDuration: '200ms',
                                        opacity: 1
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
                            children: url
                        })
                })
            }) : /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
                style: [
                    styles.pageLink,
                    styles.placeholder
                ]
            }),
            /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().View, {
                style: styles.linkContainer,
                children: [
                    /*#__PURE__*/ (0, _jsxruntime().jsx)(_Pressable.Pressable, {
                        children: ({ hovered, pressed })=>/*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Text, {
                                onPress: ()=>{
                                    if (router.canGoBack()) {
                                        router.back();
                                    } else {
                                        router.replace('/');
                                    }
                                },
                                style: [
                                    styles.link,
                                    _reactnative().Platform.select({
                                        web: {
                                            transitionDuration: '200ms',
                                            opacity: 1
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
                                children: "Go back"
                            })
                    }),
                    /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Text, {
                        style: [
                            styles.linkSeparator,
                            styles.secondaryText
                        ],
                        children: "•"
                    }),
                    /*#__PURE__*/ (0, _jsxruntime().jsx)(_Link.Link, {
                        href: "/_sitemap",
                        replace: true,
                        ..._reactnative().Platform.select({
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
                                                opacity: 1
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
                                    children: "Sitemap"
                                })
                        })
                    })
                ]
            })
        ]
    });
}
function NotFoundAsset() {
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Image, {
        source: require('expo-router/assets/unmatched.png'),
        style: styles.image
    });
}
const styles = _reactnative().StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        padding: 24,
        paddingBottom: 64,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: 270,
        height: 168,
        resizeMode: 'contain',
        marginBottom: 28
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
    subtitle: {
        fontSize: 34,
        marginTop: 4,
        marginBottom: 12,
        fontWeight: '200',
        textAlign: 'center'
    },
    pageLink: {
        minHeight: 20
    },
    secondaryText: {
        color: '#9ba1a6'
    },
    placeholder: {
        backgroundColor: '#9ba1a644',
        minWidth: 180,
        borderRadius: 5
    },
    linkContainer: {
        marginTop: 28,
        flexDirection: 'row',
        gap: 12
    },
    link: {
        fontSize: 20,
        textAlign: 'center',
        color: '#52a9ff'
    },
    linkSeparator: {
        fontSize: 20
    }
});

//# sourceMappingURL=Unmatched.js.map
