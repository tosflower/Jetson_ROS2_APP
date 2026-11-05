'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    NativeToolbarMenu: null,
    NativeToolbarMenuAction: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get NativeToolbarMenu () {
        return NativeToolbarMenu;
    },
    get NativeToolbarMenuAction () {
        return NativeToolbarMenuAction;
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
const _expoui = require("../../../../optional-libraries/expo-ui");
const _primitives = require("../../../../primitives");
const _AnimatedItemContainer = require("../../../../toolbar/AnimatedItemContainer");
const _children = require("../../../../utils/children");
const _ToolbarItemBadge = require("../ToolbarItemBadge");
const _context = require("../context");
const _defaults = require("../defaults");
const _getIconButtonContainerColors = require("../getIconButtonContainerColors");
const arrowRightIcon = require('../../../../../assets/arrow_right.xml');
const checkmarkIcon = require('../../../../../assets/checkmark.xml');
/**
 * Context for propagating menu close callbacks from root to nested menus.
 * - `null` means root level (no parent menu)
 * - A function means nested level (call to close entire menu chain)
 */ const ToolbarMenuCloseContext = /*#__PURE__*/ (0, _react().createContext)(null);
const NativeToolbarMenu = (props)=>{
    const { expoUI: { DropdownMenu, DropdownMenuItem, HorizontalDivider, Icon, IconButton, Text: ComposeText }, modifiers: { background } } = (0, _expoui.requireExpoUI)("Stack.Toolbar on Android requires '@expo/ui'. Install it with `npx expo install @expo/ui` and rebuild your app.");
    const [expanded, setExpanded] = (0, _react().useState)(false);
    const parentClose = (0, _react().use)(ToolbarMenuCloseContext);
    const isNested = parentClose !== null;
    const toolbarColors = (0, _context.useToolbarColors)();
    const tintColor = props.tintColor ?? toolbarColors.tintColor ?? (0, _defaults.DEFAULT_TOOLBAR_TINT_COLOR)();
    // `tint={null}` tells `<Icon>` to draw the source in its original colors.
    // `undefined` would fall back to `LocalContentColor` (i.e. still a tint).
    // Only the user-provided source respects `imageRenderingMode`; internal
    // ornaments (submenu arrow, action checkmark) are always tinted.
    const sourceTint = props.imageRenderingMode === 'original' ? null : tintColor;
    const backgroundColor = toolbarColors.backgroundColor ?? (0, _defaults.DEFAULT_TOOLBAR_BACKGROUND_COLOR)();
    const closeMenu = (0, _react().useCallback)(()=>{
        setExpanded(false);
        parentClose?.();
    }, [
        parentClose,
        setExpanded
    ]);
    if (process.env.NODE_ENV !== 'production' && isNested && props.badge) {
        console.warn('Stack.Toolbar.Badge on a nested Stack.Toolbar.Menu is not supported on Android; it is only rendered on a root menu. The badge will be ignored.');
    }
    // Inline nested: render children directly with a divider separator
    if (isNested && props.inline) {
        return /*#__PURE__*/ (0, _jsxruntime().jsxs)(_jsxruntime().Fragment, {
            children: [
                /*#__PURE__*/ (0, _jsxruntime().jsx)(HorizontalDivider, {}),
                props.children
            ]
        });
    }
    // Non-inline nested: DropdownMenu with DropdownMenuItem trigger
    if (isNested) {
        const trailingIcon = /*#__PURE__*/ (0, _jsxruntime().jsx)(DropdownMenuItem.TrailingIcon, {
            children: /*#__PURE__*/ (0, _jsxruntime().jsx)(Icon, {
                source: arrowRightIcon,
                tint: tintColor,
                size: 24
            })
        });
        const leadingIcon = props.source ? /*#__PURE__*/ (0, _jsxruntime().jsx)(DropdownMenuItem.LeadingIcon, {
            children: /*#__PURE__*/ (0, _jsxruntime().jsx)(Icon, {
                source: props.source,
                tint: sourceTint,
                size: 24
            })
        }) : null;
        return /*#__PURE__*/ (0, _jsxruntime().jsxs)(DropdownMenu, {
            expanded: expanded,
            onDismissRequest: ()=>setExpanded(false),
            color: backgroundColor,
            cornerRadius: props.cornerRadius,
            children: [
                /*#__PURE__*/ (0, _jsxruntime().jsx)(DropdownMenu.Trigger, {
                    children: /*#__PURE__*/ (0, _jsxruntime().jsxs)(DropdownMenuItem, {
                        onClick: ()=>{
                            if (!props.disabled) setExpanded(true);
                        },
                        modifiers: [
                            background(backgroundColor)
                        ],
                        enabled: !props.disabled,
                        children: [
                            leadingIcon,
                            /*#__PURE__*/ (0, _jsxruntime().jsx)(DropdownMenuItem.Text, {
                                children: /*#__PURE__*/ (0, _jsxruntime().jsx)(ComposeText, {
                                    color: typeof props.tintColor === 'string' ? props.tintColor : toolbarColors.tintColor ?? (0, _defaults.DEFAULT_TOOLBAR_TINT_COLOR)(),
                                    children: props.label
                                })
                            }),
                            trailingIcon
                        ]
                    })
                }),
                /*#__PURE__*/ (0, _jsxruntime().jsx)(DropdownMenu.Items, {
                    children: /*#__PURE__*/ (0, _jsxruntime().jsx)(ToolbarMenuCloseContext, {
                        value: closeMenu,
                        children: props.children
                    })
                })
            ]
        });
    }
    // Root: AnimatedItemContainer + IconButton trigger + DropdownMenu
    if (!props.source) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn('Stack.Toolbar.Menu on Android requires an ImageSourcePropType icon. SF Symbols and xcasset icons are not supported. Use the `icon` prop with a require() or { uri } source, or use <Stack.Toolbar.Icon src={...} />.');
        }
        return null;
    }
    const iconButton = /*#__PURE__*/ (0, _jsxruntime().jsx)(IconButton, {
        onClick: ()=>setExpanded(true),
        enabled: !props.disabled,
        colors: (0, _getIconButtonContainerColors.getIconButtonContainerColors)(toolbarColors.buttonContainerColor),
        // The background modifier would paint a square behind the round container
        modifiers: toolbarColors.buttonContainerColor ? [] : [
            background(backgroundColor)
        ],
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(Icon, {
            source: props.source,
            tint: sourceTint,
            size: 24,
            contentDescription: (0, _ToolbarItemBadge.getBadgeContentDescription)(props.accessibilityLabel, props.badge)
        })
    });
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_AnimatedItemContainer.AnimatedItemContainer, {
        visible: !props.hidden,
        children: /*#__PURE__*/ (0, _jsxruntime().jsxs)(DropdownMenu, {
            expanded: expanded,
            onDismissRequest: ()=>setExpanded(false),
            color: backgroundColor,
            cornerRadius: props.cornerRadius,
            children: [
                /*#__PURE__*/ (0, _jsxruntime().jsx)(DropdownMenu.Trigger, {
                    children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_ToolbarItemBadge.ToolbarItemBadge, {
                        badge: props.badge,
                        disabled: props.disabled,
                        children: iconButton
                    })
                }),
                /*#__PURE__*/ (0, _jsxruntime().jsx)(DropdownMenu.Items, {
                    children: /*#__PURE__*/ (0, _jsxruntime().jsx)(ToolbarMenuCloseContext, {
                        value: closeMenu,
                        children: props.children
                    })
                })
            ]
        })
    });
};
const NativeToolbarMenuAction = (props)=>{
    const { expoUI: { DropdownMenuItem, Icon, Text: ComposeText }, modifiers: { background } } = (0, _expoui.requireExpoUI)("Stack.Toolbar on Android requires '@expo/ui'. Install it with `npx expo install @expo/ui` and rebuild your app.");
    const closeMenu = (0, _react().use)(ToolbarMenuCloseContext);
    const toolbarColors = (0, _context.useToolbarColors)();
    const tintColor = props.destructive ? (0, _defaults.DEFAULT_DESTRUCTIVE_COLOR)() : toolbarColors.tintColor ?? (0, _defaults.DEFAULT_TOOLBAR_TINT_COLOR)();
    const backgroundColor = toolbarColors.backgroundColor ?? (0, _defaults.DEFAULT_TOOLBAR_BACKGROUND_COLOR)();
    const handleClick = (0, _react().useCallback)(()=>{
        props.onPress?.();
        if (!props.unstable_keepPresented) {
            closeMenu?.();
        }
    }, [
        props.onPress,
        props.unstable_keepPresented,
        closeMenu
    ]);
    const areChildrenString = typeof props.children === 'string';
    const label = areChildrenString ? props.children : (0, _children.getFirstChildOfType)(props.children, _primitives.Label)?.props.children ?? '';
    if (props.hidden) return null;
    return /*#__PURE__*/ (0, _jsxruntime().jsxs)(DropdownMenuItem, {
        onClick: handleClick,
        modifiers: [
            background(backgroundColor)
        ],
        enabled: !props.disabled,
        children: [
            /*#__PURE__*/ (0, _jsxruntime().jsx)(DropdownMenuItem.Text, {
                children: /*#__PURE__*/ (0, _jsxruntime().jsx)(ComposeText, {
                    color: tintColor,
                    children: label
                })
            }),
            props.source && /*#__PURE__*/ (0, _jsxruntime().jsx)(DropdownMenuItem.LeadingIcon, {
                children: /*#__PURE__*/ (0, _jsxruntime().jsx)(Icon, {
                    source: props.source,
                    tint: tintColor,
                    size: 24
                })
            }),
            props.isOn && /*#__PURE__*/ (0, _jsxruntime().jsx)(DropdownMenuItem.TrailingIcon, {
                children: /*#__PURE__*/ (0, _jsxruntime().jsx)(Icon, {
                    source: checkmarkIcon,
                    tint: tintColor,
                    size: 24
                })
            })
        ]
    });
};

//# sourceMappingURL=native.android.js.map
