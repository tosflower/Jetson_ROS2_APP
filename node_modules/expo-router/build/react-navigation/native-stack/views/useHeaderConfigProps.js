'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useHeaderConfigProps", {
    enumerable: true,
    get: function() {
        return useHeaderConfigProps;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
function _expoglasseffect() {
    const data = require("expo-glass-effect");
    _expoglasseffect = function() {
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
function _reactnativescreens() {
    const data = require("react-native-screens");
    _reactnativescreens = function() {
        return data;
    };
    return data;
}
const _color = require("../../../utils/color");
const _elements = require("../../elements");
const _native = require("../../native");
const _FontProcessor = require("./FontProcessor");
const _headerAppearance = require("./headerAppearance");
const processBarButtonItems = (items, colors, fonts)=>{
    return items?.map((item, index)=>{
        if (item.type === 'custom') {
            // Handled with `ScreenStackHeaderLeftView` or `ScreenStackHeaderRightView`
            return null;
        }
        if (item.type === 'spacing') {
            if (item.spacing == null) {
                throw new Error(`Spacing item must have a 'spacing' property defined: ${JSON.stringify(item)}`);
            }
            return item;
        }
        if (item.type === 'button' || item.type === 'menu') {
            if (item.type === 'menu' && item.menu == null) {
                throw new Error(`Menu item must have a 'menu' property defined: ${JSON.stringify(item)}`);
            }
            const { badge, label, labelStyle, icon, ...rest } = item;
            const processedItemCommon = {
                ...rest,
                index,
                title: label,
                titleStyle: {
                    ...fonts.regular,
                    ...labelStyle
                },
                icon: transformIcon(icon)
            };
            let processedItem;
            if (processedItemCommon.type === 'menu' && item.type === 'menu') {
                const { multiselectable, layout } = item.menu;
                processedItem = {
                    ...processedItemCommon,
                    menu: {
                        ...processedItemCommon.menu,
                        singleSelection: !multiselectable,
                        displayAsPalette: layout === 'palette',
                        items: item.menu.items.map(getMenuItem)
                    }
                };
            } else if (processedItemCommon.type === 'button' && item.type === 'button') {
                processedItem = processedItemCommon;
            } else {
                throw new Error(`Invalid item type: ${JSON.stringify(item)}. Valid types are 'button' and 'menu'.`);
            }
            if (badge) {
                const badgeBackgroundColor = badge.style?.backgroundColor ?? colors.notification;
                const badgeTextColor = (0, _color.isLight)(badgeBackgroundColor) ? 'black' : 'white';
                processedItem = {
                    ...processedItem,
                    badge: {
                        ...badge,
                        value: String(badge.value),
                        style: {
                            backgroundColor: badgeBackgroundColor,
                            color: badgeTextColor,
                            ...fonts.regular,
                            ...badge.style
                        }
                    }
                };
            }
            return processedItem;
        }
        throw new Error(`Invalid item type: ${JSON.stringify(item)}. Valid types are 'button', 'menu', 'custom' and 'spacing'.`);
    }).filter((item)=>item != null);
};
const transformIcon = (icon)=>{
    if (icon?.type === 'image') {
        return icon.tinted === false ? {
            type: 'imageSource',
            imageSource: icon.source
        } : {
            type: 'templateSource',
            templateSource: icon.source
        };
    }
    return icon;
};
const getMenuItem = (item)=>{
    if (item.type === 'submenu') {
        const { label, icon, inline, layout, items, multiselectable, ...rest } = item;
        return {
            ...rest,
            icon: transformIcon(icon),
            title: label,
            displayAsPalette: layout === 'palette',
            displayInline: inline,
            singleSelection: !multiselectable,
            items: items.map(getMenuItem)
        };
    }
    const { label, icon, description, ...rest } = item;
    return {
        ...rest,
        icon: transformIcon(icon),
        title: label,
        subtitle: description
    };
};
function useHeaderConfigProps({ headerBackIcon, headerBackImageSource, headerBackButtonDisplayMode, headerBackButtonMenuEnabled, headerBackTitle, headerBackTitleStyle, headerBackVisible, headerShadowVisible, headerLargeStyle, headerLargeTitle: headerLargeTitleDeprecated, headerLargeTitleEnabled = headerLargeTitleDeprecated, headerLargeTitleShadowVisible, headerLargeTitleStyle, headerBackground, headerLeft, headerRight, headerShown, headerStyle, headerBlurEffect, headerUserInterfaceStyle, headerTintColor, headerTitle, headerTitleAlign, headerTitleStyle, headerTransparent: headerTransparentOption, headerSearchBarOptions, headerTopInsetEnabled, headerBack, route, title, unstable_headerLeftItems: headerLeftItems, unstable_headerRightItems: headerRightItems, unstable_nativeProps }) {
    const { direction } = (0, _native.useLocale)();
    const { colors, fonts, dark } = (0, _native.useTheme)();
    const tintColor = headerTintColor ?? (_reactnative().Platform.OS === 'ios' ? colors.primary : colors.text);
    const headerNativeProps = unstable_nativeProps?.headerConfig;
    const platformHeaderTransparent = (0, _headerAppearance.getPlatformHeaderTransparent)(headerTransparentOption);
    // With Liquid Glass, the header uses the system fonts and bar unless the legacy appearance is enabled
    const usesNativeAppearance = _reactnative().Platform.OS === 'ios' && (0, _expoglasseffect().isLiquidGlassAvailable)() && !(0, _headerAppearance.isLegacyHeaderAppearanceEnabled)();
    const usesThemeFonts = !usesNativeAppearance;
    const headerBackTitleStyleFlattened = _reactnative().StyleSheet.flatten([
        usesThemeFonts && fonts.regular,
        headerBackTitleStyle
    ]) || {};
    const headerLargeTitleStyleFlattened = _reactnative().StyleSheet.flatten([
        usesThemeFonts && _reactnative().Platform.select({
            ios: fonts.heavy,
            default: fonts.medium
        }),
        headerLargeTitleStyle
    ]) || {};
    const headerTitleStyleFlattened = _reactnative().StyleSheet.flatten([
        usesThemeFonts && _reactnative().Platform.select({
            ios: fonts.bold,
            default: fonts.medium
        }),
        headerTitleStyle
    ]) || {};
    const headerStyleFlattened = _reactnative().StyleSheet.flatten(headerStyle) || {};
    const headerLargeStyleFlattened = _reactnative().StyleSheet.flatten(headerLargeStyle) || {};
    // When nothing sets the header background, the native appearance uses the Liquid Glass system bar
    const usesSystemBackground = usesNativeAppearance && platformHeaderTransparent == null && headerStyleFlattened.backgroundColor == null && headerBackground == null;
    const headerTransparent = usesSystemBackground || platformHeaderTransparent;
    const headerBackgroundColor = headerStyleFlattened.backgroundColor ?? (headerBackground != null || headerTransparent || // The title becomes invisible if background color is set with large title on iOS 26
    _reactnative().Platform.OS === 'ios' && headerLargeTitleEnabled ? 'transparent' : colors.card);
    const [backTitleFontFamily, largeTitleFontFamily, titleFontFamily] = (0, _FontProcessor.processFonts)([
        headerBackTitleStyleFlattened.fontFamily,
        headerLargeTitleStyleFlattened.fontFamily,
        headerTitleStyleFlattened.fontFamily
    ]);
    const backTitleFontSize = 'fontSize' in headerBackTitleStyleFlattened ? headerBackTitleStyleFlattened.fontSize : undefined;
    const titleText = (0, _elements.getHeaderTitle)({
        title,
        headerTitle
    }, route.name);
    const titleColor = 'color' in headerTitleStyleFlattened ? headerTitleStyleFlattened.color : (0, _expoglasseffect().isLiquidGlassAvailable)() && (headerTransparent || headerBackgroundColor === 'transparent') ? // So we don't set an explicit color when header is transparent
    // Unless a custom tint color is explicitly provided
    headerTintColor : headerTintColor ?? colors.text;
    const titleFontSize = 'fontSize' in headerTitleStyleFlattened ? headerTitleStyleFlattened.fontSize : undefined;
    const titleFontWeight = headerTitleStyleFlattened.fontWeight;
    // Also used by react-native-screens for the scroll edge appearance of a regular title
    const largeTitleBackgroundColor = headerLargeStyleFlattened.backgroundColor ?? (usesSystemBackground ? 'transparent' : undefined);
    const largeTitleColor = 'color' in headerLargeTitleStyleFlattened ? headerLargeTitleStyleFlattened.color : undefined;
    const largeTitleFontSize = 'fontSize' in headerLargeTitleStyleFlattened ? headerLargeTitleStyleFlattened.fontSize : undefined;
    const largeTitleFontWeight = headerLargeTitleStyleFlattened.fontWeight;
    const headerTitleStyleSupported = {
        color: titleColor
    };
    if (headerTitleStyleFlattened.fontFamily != null) {
        headerTitleStyleSupported.fontFamily = headerTitleStyleFlattened.fontFamily;
    }
    if (titleFontSize != null) {
        headerTitleStyleSupported.fontSize = titleFontSize;
    }
    if (titleFontWeight != null) {
        headerTitleStyleSupported.fontWeight = titleFontWeight;
    }
    const canGoBack = headerBack != null;
    const headerLeftElement = headerLeft?.({
        tintColor,
        canGoBack,
        backgroundColor: headerBackgroundColor,
        label: headerBackTitle ?? headerBack?.title,
        // `href` is only applicable to web
        href: undefined
    });
    const headerRightElement = headerRight?.({
        tintColor,
        canGoBack,
        backgroundColor: headerBackgroundColor
    });
    const headerTitleElement = typeof headerTitle === 'function' ? headerTitle({
        tintColor,
        children: titleText
    }) : null;
    const supportsHeaderSearchBar = typeof _reactnativescreens().isSearchBarAvailableForCurrentPlatform === 'boolean' ? _reactnativescreens().isSearchBarAvailableForCurrentPlatform : _reactnative().Platform.OS === 'ios' && _reactnativescreens().SearchBar != null;
    const hasHeaderSearchBar = supportsHeaderSearchBar && headerSearchBarOptions != null;
    /**
   * We need to set this in if:
   * - Back button should stay visible when `headerLeft` is specified
   * - If `headerTitle` for Android is specified, so we only need to remove the title and keep the back button
   */ const backButtonInCustomView = headerBackVisible || _reactnative().Platform.OS === 'android' && headerTitleElement != null && headerLeftElement == null;
    const translucent = headerBackground != null || headerTransparent || // When using a SearchBar or large title, the header needs to be translucent for it to work on iOS
    (hasHeaderSearchBar || headerLargeTitleEnabled) && _reactnative().Platform.OS === 'ios' && headerTransparent !== false;
    const isBackButtonDisplayModeAvailable = // On iOS 14+
    _reactnative().Platform.OS === 'ios' && parseInt(_reactnative().Platform.Version, 10) >= 14 && // Doesn't have custom styling, by default System, see: https://github.com/software-mansion/react-native-screens/pull/2105#discussion_r1565222738
    (backTitleFontFamily == null || backTitleFontFamily === 'System') && backTitleFontSize == null && // Back button menu is not disabled
    headerBackButtonMenuEnabled !== false;
    const isCenterViewRenderedAndroid = headerTitleAlign === 'center';
    const leftItems = headerLeftItems?.({
        tintColor,
        canGoBack
    });
    let rightItems = headerRightItems?.({
        tintColor,
        canGoBack
    });
    if (rightItems) {
        // iOS renders right items in reverse order
        // So we need to reverse them here to match the order
        rightItems = [
            ...rightItems
        ].reverse();
    }
    const children = /*#__PURE__*/ (0, _jsxruntime().jsxs)(_jsxruntime().Fragment, {
        children: [
            _reactnative().Platform.OS === 'ios' ? /*#__PURE__*/ (0, _jsxruntime().jsxs)(_jsxruntime().Fragment, {
                children: [
                    leftItems ? leftItems.map((item, index)=>{
                        if (item.type === 'custom') {
                            return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnativescreens().ScreenStackHeaderLeftView, {
                                hidesSharedBackground: item.hidesSharedBackground,
                                children: item.element
                            }, index);
                        }
                        return null;
                    }) : headerLeftElement != null ? /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnativescreens().ScreenStackHeaderLeftView, {
                        children: headerLeftElement
                    }) : null,
                    headerTitleElement != null ? /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnativescreens().ScreenStackHeaderCenterView, {
                        children: headerTitleElement
                    }) : null
                ]
            }) : /*#__PURE__*/ (0, _jsxruntime().jsxs)(_jsxruntime().Fragment, {
                children: [
                    headerLeftElement != null || typeof headerTitle === 'function' ? // The style passed to header left, together with title element being wrapped
                    // in flex view is required for proper header layout, in particular,
                    // for the text truncation to work.
                    /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnativescreens().ScreenStackHeaderLeftView, {
                        style: !isCenterViewRenderedAndroid ? {
                            flex: 1
                        } : null,
                        children: [
                            headerLeftElement,
                            headerTitleAlign !== 'center' ? typeof headerTitle === 'function' ? /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
                                style: {
                                    flex: 1
                                },
                                children: headerTitleElement
                            }) : /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
                                style: {
                                    flex: 1
                                },
                                children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_elements.HeaderTitle, {
                                    tintColor: tintColor,
                                    style: headerTitleStyleSupported,
                                    children: titleText
                                })
                            }) : null
                        ]
                    }) : null,
                    isCenterViewRenderedAndroid ? /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnativescreens().ScreenStackHeaderCenterView, {
                        children: typeof headerTitle === 'function' ? headerTitleElement : /*#__PURE__*/ (0, _jsxruntime().jsx)(_elements.HeaderTitle, {
                            tintColor: tintColor,
                            style: headerTitleStyleSupported,
                            children: titleText
                        })
                    }) : null
                ]
            }),
            headerBackIcon !== undefined || headerBackImageSource !== undefined ? /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnativescreens().ScreenStackHeaderBackButtonImage, {
                source: headerBackIcon?.source ?? headerBackImageSource
            }) : null,
            _reactnative().Platform.OS === 'ios' && rightItems ? rightItems.map((item, index)=>{
                if (item.type === 'custom') {
                    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnativescreens().ScreenStackHeaderRightView, {
                        hidesSharedBackground: item.hidesSharedBackground,
                        children: item.element
                    }, index);
                }
                return null;
            }) : headerRightElement != null ? /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnativescreens().ScreenStackHeaderRightView, {
                children: headerRightElement
            }) : null,
            hasHeaderSearchBar ? /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnativescreens().ScreenStackHeaderSearchBarView, {
                children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnativescreens().SearchBar, {
                    ...headerSearchBarOptions
                })
            }) : null
        ]
    });
    return {
        backButtonInCustomView,
        backgroundColor: headerBackgroundColor,
        backTitle: headerBackTitle,
        backTitleVisible: isBackButtonDisplayModeAvailable ? undefined : headerBackButtonDisplayMode !== 'minimal',
        backButtonDisplayMode: isBackButtonDisplayModeAvailable ? headerBackButtonDisplayMode : undefined,
        backTitleFontFamily,
        backTitleFontSize,
        blurEffect: headerBlurEffect,
        color: tintColor,
        direction,
        disableBackButtonMenu: headerBackButtonMenuEnabled === false,
        hidden: headerShown === false,
        hideBackButton: headerBackVisible === false,
        hideShadow: headerShadowVisible === false || headerBackground != null || platformHeaderTransparent && headerShadowVisible !== true,
        largeTitle: headerLargeTitleEnabled,
        largeTitleBackgroundColor,
        largeTitleColor,
        largeTitleFontFamily,
        largeTitleFontSize,
        largeTitleFontWeight,
        largeTitleHideShadow: headerLargeTitleShadowVisible === false,
        title: titleText,
        titleColor,
        titleFontFamily,
        titleFontSize,
        titleFontWeight: titleFontWeight != null ? String(titleFontWeight) : undefined,
        topInsetEnabled: headerTopInsetEnabled,
        translucent: translucent === true,
        children,
        headerLeftBarButtonItems: processBarButtonItems(leftItems, colors, fonts),
        headerRightBarButtonItems: processBarButtonItems(rightItems, colors, fonts),
        experimental_userInterfaceStyle: headerUserInterfaceStyle ?? (dark ? 'dark' : 'light'),
        ...headerNativeProps
    };
}

//# sourceMappingURL=useHeaderConfigProps.js.map
