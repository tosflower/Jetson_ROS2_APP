// Copyright © 2024 650 Industries.
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    Sitemap: null,
    getNavOptions: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get Sitemap () {
        return Sitemap;
    },
    get getNavOptions () {
        return getNavOptions;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
function _expoconstants() {
    const data = /*#__PURE__*/ _interop_require_default(require("expo-constants"));
    _expoconstants = function() {
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
const _Link = require("../link/Link");
const _NoSSR = require("./NoSSR");
const _Pressable = require("./Pressable");
const _useSitemap = require("./useSitemap");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const INDENT = 20;
function getNavOptions() {
    return {
        title: 'sitemap',
        presentation: 'modal',
        headerLargeTitle: false,
        headerTitleStyle: {
            color: 'white'
        },
        headerShown: true,
        headerTintColor: 'white',
        headerLargeTitleStyle: {
            color: 'white'
        },
        headerStyle: {
            backgroundColor: 'black',
            // @ts-expect-error: mistyped
            borderBottomColor: '#323232'
        },
        header: ()=>{
            const WrapperElement = _reactnative().Platform.OS === 'android' ? _reactnativesafeareacontext().SafeAreaView : _reactnative().View;
            return /*#__PURE__*/ (0, _jsxruntime().jsx)(WrapperElement, {
                style: styles.header,
                children: /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().View, {
                    style: styles.headerContent,
                    children: [
                        /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
                            style: styles.headerIcon,
                            children: /*#__PURE__*/ (0, _jsxruntime().jsx)(SitemapIcon, {})
                        }),
                        /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Text, {
                            role: "heading",
                            "aria-level": 1,
                            style: styles.title,
                            children: "Sitemap"
                        })
                    ]
                })
            });
        }
    };
}
const Sitemap = ()=>{
    // Following the https://github.com/expo/expo/blob/ubax/router/move-404-and-sitemap-to-root/packages/expo-router/src/getRoutesSSR.ts#L38
    // we need to ensure that the Sitemap component is not rendered on the server.
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_NoSSR.NoSSR, {
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(SitemapInner, {})
    });
};
function SitemapInner() {
    const sitemap = (0, _useSitemap.useSitemap)();
    const children = _react().default.useMemo(()=>sitemap?.children.filter(({ isInternal })=>!isInternal) ?? [], [
        sitemap
    ]);
    const Wrapper = _reactnative().Platform.OS === 'android' ? _reactnativesafeareacontext().SafeAreaView : _reactnative().View;
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(Wrapper, {
        style: styles.container,
        testID: "expo-router-sitemap",
        children: /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().ScrollView, {
            contentContainerStyle: styles.scroll,
            automaticallyAdjustContentInsets: true,
            contentInsetAdjustmentBehavior: "automatic",
            children: [
                children.map((child)=>/*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
                        testID: "sitemap-item-container",
                        style: styles.itemContainer,
                        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(SitemapItem, {
                            node: child
                        })
                    }, child.contextKey)),
                /*#__PURE__*/ (0, _jsxruntime().jsx)(SystemInfo, {})
            ]
        })
    });
}
function SitemapItem({ node, level = 0 }) {
    const isLayout = _react().default.useMemo(()=>node.children.length > 0 || node.contextKey.match(/_layout\.[jt]sx?$/), [
        node
    ]);
    const info = node.isGenerated ? 'Generated' : '';
    if (isLayout) {
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(LayoutSitemapItem, {
            node: node,
            level: level,
            info: info
        });
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(StandardSitemapItem, {
        node: node,
        level: level,
        info: info
    });
}
function LayoutSitemapItem({ node, level, info }) {
    const [isCollapsed, setIsCollapsed] = _react().default.useState(true);
    return /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().View, {
        style: styles.itemInnerContainer,
        children: [
            /*#__PURE__*/ (0, _jsxruntime().jsx)(SitemapItemPressable, {
                style: {
                    opacity: 0.4
                },
                leftIcon: /*#__PURE__*/ (0, _jsxruntime().jsx)(PkgIcon, {}),
                rightIcon: /*#__PURE__*/ (0, _jsxruntime().jsx)(ArrowIcon, {
                    rotation: isCollapsed ? 0 : 180
                }),
                filename: node.filename,
                level: level,
                info: info,
                onPress: ()=>setIsCollapsed((prev)=>!prev)
            }),
            !isCollapsed && node.children.map((child)=>/*#__PURE__*/ (0, _jsxruntime().jsx)(SitemapItem, {
                    node: child,
                    level: level + (node.isGenerated ? 0 : 1)
                }, child.contextKey))
        ]
    });
}
function StandardSitemapItem({ node, info, level }) {
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_Link.Link, {
        accessibilityLabel: node.contextKey,
        href: node.href,
        asChild: true,
        replace: true,
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(SitemapItemPressable, {
            leftIcon: /*#__PURE__*/ (0, _jsxruntime().jsx)(FileIcon, {}),
            rightIcon: /*#__PURE__*/ (0, _jsxruntime().jsx)(ForwardIcon, {}),
            filename: node.filename,
            level: level,
            info: info
        })
    });
}
function SitemapItemPressable({ style, leftIcon, rightIcon, filename, level, info, ...pressableProps }) {
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_Pressable.Pressable, {
        ...pressableProps,
        children: ({ pressed, hovered })=>/*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().View, {
                testID: "sitemap-item",
                style: [
                    styles.itemInnerContainer,
                    styles.itemPressable,
                    {
                        paddingLeft: INDENT + level * INDENT,
                        backgroundColor: hovered ? '#202425' : '#151718'
                    },
                    pressed && {
                        backgroundColor: '#26292b'
                    },
                    style
                ],
                children: [
                    /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().View, {
                        style: {
                            flexDirection: 'row',
                            alignItems: 'center'
                        },
                        children: [
                            leftIcon,
                            /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Text, {
                                style: styles.filename,
                                children: filename
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().View, {
                        style: {
                            flexDirection: 'row',
                            alignItems: 'center'
                        },
                        children: [
                            !!info && /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Text, {
                                style: [
                                    styles.virtual,
                                    {
                                        marginRight: 8
                                    }
                                ],
                                children: info
                            }),
                            rightIcon
                        ]
                    })
                ]
            })
    });
}
function FileIcon() {
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Image, {
        style: styles.image,
        source: require('expo-router/assets/file.png')
    });
}
function PkgIcon() {
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Image, {
        style: styles.image,
        source: require('expo-router/assets/pkg.png')
    });
}
function ForwardIcon() {
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Image, {
        style: styles.image,
        source: require('expo-router/assets/forward.png')
    });
}
function SitemapIcon() {
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Image, {
        style: styles.image,
        source: require('expo-router/assets/sitemap.png')
    });
}
function ArrowIcon({ rotation = 0 }) {
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Image, {
        style: [
            styles.image,
            {
                transform: [
                    {
                        rotate: `${rotation}deg`
                    }
                ]
            }
        ],
        source: require('expo-router/assets/arrow_down.png')
    });
}
function SystemInfo() {
    const getHermesVersion = ()=>{
        if (!global.HermesInternal) {
            return null;
        }
        const HERMES_RUNTIME = global.HermesInternal?.getRuntimeProperties?.() ?? {};
        const HERMES_VERSION = HERMES_RUNTIME['OSS Release Version'];
        const isStaticHermes = HERMES_RUNTIME['Static Hermes'];
        if (!HERMES_RUNTIME) {
            return null;
        }
        if (isStaticHermes) {
            return `${HERMES_VERSION} (shermes)`;
        }
        return HERMES_VERSION;
    };
    const locationOrigin = window.location.origin;
    const expoSdkVersion = _expoconstants().default.expoConfig?.sdkVersion || 'Unknown';
    const hermesVersion = getHermesVersion();
    return /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().View, {
        testID: "sitemap-system-info",
        style: {
            gap: 8,
            marginTop: 16
        },
        children: [
            /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Text, {
                style: styles.systemInfoTitle,
                children: "System Information"
            }),
            /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().View, {
                style: styles.systemInfoContainer,
                children: [
                    /*#__PURE__*/ (0, _jsxruntime().jsx)(FormText, {
                        right: process.env.NODE_ENV,
                        children: "Mode"
                    }),
                    /*#__PURE__*/ (0, _jsxruntime().jsx)(FormText, {
                        right: expoSdkVersion,
                        children: "Expo SDK"
                    }),
                    hermesVersion && /*#__PURE__*/ (0, _jsxruntime().jsx)(FormText, {
                        right: hermesVersion,
                        children: "Hermes version"
                    }),
                    locationOrigin && /*#__PURE__*/ (0, _jsxruntime().jsx)(FormText, {
                        right: locationOrigin,
                        children: "Location origin"
                    })
                ]
            })
        ]
    });
}
function FormText({ children, right }) {
    return /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().View, {
        style: styles.systemInfoItem,
        children: [
            /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Text, {
                style: styles.systemInfoLabel,
                numberOfLines: 1,
                ellipsizeMode: "tail",
                children: children
            }),
            /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
                style: {
                    flex: 1
                }
            }),
            /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Text, {
                selectable: true,
                style: [
                    styles.systemInfoValue,
                    styles.code
                ],
                numberOfLines: 1,
                ellipsizeMode: "tail",
                children: right
            })
        ]
    });
}
const styles = _reactnative().StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flex: 1,
        alignItems: 'stretch'
    },
    header: {
        backgroundColor: '#151718',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderColor: '#313538',
        boxShadow: '0px 3px 3px rgba(0, 0, 0, 0.33)'
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingHorizontal: '5%',
        ..._reactnative().Platform.select({
            web: {
                width: '100%',
                maxWidth: 960,
                marginHorizontal: 'auto'
            }
        })
    },
    title: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold'
    },
    scroll: {
        gap: 12,
        paddingHorizontal: '5%',
        paddingVertical: 16,
        ..._reactnative().Platform.select({
            ios: {
                paddingBottom: 24
            },
            web: {
                width: '100%',
                maxWidth: 960,
                marginHorizontal: 'auto',
                paddingBottom: 24
            },
            default: {
                paddingBottom: 12
            }
        })
    },
    itemContainer: {
        borderWidth: 1,
        borderColor: '#313538',
        backgroundColor: '#151718',
        borderRadius: 12,
        borderCurve: 'continuous'
    },
    itemInnerContainer: {
        backgroundColor: '#151718',
        borderRadius: 12,
        borderCurve: 'continuous',
        gap: 12
    },
    itemPressable: {
        paddingHorizontal: INDENT,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ..._reactnative().Platform.select({
            web: {
                transitionDuration: '100ms'
            }
        })
    },
    filename: {
        color: 'white',
        fontSize: 20,
        marginLeft: 12
    },
    virtual: {
        textAlign: 'right',
        color: 'white'
    },
    image: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        opacity: 0.6
    },
    headerIcon: {
        width: 40,
        height: 40,
        backgroundColor: '#202425',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    systemInfoContainer: {
        borderWidth: 1,
        borderColor: '#313538',
        backgroundColor: '#151718',
        borderRadius: 12,
        gap: 8,
        borderCurve: 'continuous',
        padding: INDENT
    },
    systemInfoTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        paddingHorizontal: INDENT
    },
    systemInfoItem: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    systemInfoLabel: {
        color: 'white',
        fontSize: 16,
        lineHeight: 24
    },
    systemInfoValue: {
        color: 'white',
        fontSize: 16,
        opacity: 0.7,
        flexShrink: 1,
        letterSpacing: 0.5
    },
    code: {
        fontVariant: [
            'tabular-nums'
        ],
        fontFamily: _reactnative().Platform.select({
            default: `SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
            ios: 'ui-monospace',
            android: 'monospace'
        }),
        fontWeight: '500'
    }
});

//# sourceMappingURL=Sitemap.js.map
