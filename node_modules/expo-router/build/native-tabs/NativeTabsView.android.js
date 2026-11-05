"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NativeTabsView", {
    enumerable: true,
    get: function() {
        return NativeTabsView;
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
function _reactnativescreens() {
    const data = require("react-native-screens");
    _reactnativescreens = function() {
        return data;
    };
    return data;
}
function _experimental() {
    const data = require("react-native-screens/experimental");
    _experimental = function() {
        return data;
    };
    return data;
}
const _NativeTabsViewshared = require("./NativeTabsView.shared");
const _appearance = require("./appearance");
const _types = require("./types");
const _optionsIconConverter = require("./utils/optionsIconConverter");
function NativeTabsView(props) {
    const { tabBarRespectsIMEInsets, tabs, unstable_nativeProps } = props;
    const { android: rawAndroidProps, ios: _ignoredRawIosProps, ...rawHostRestProps } = unstable_nativeProps ?? {};
    const { selectedScreenKey, provenance } = (0, _NativeTabsViewshared.useSelectedScreenKey)(props);
    const onTabSelected = (0, _NativeTabsViewshared.useOnTabSelectedHandler)(props.onTabChange);
    const onTabSelectionPrevented = (0, _NativeTabsViewshared.useOnTabSelectionPreventedHandler)(props.onTabChange);
    const androidAppearances = (0, _react().useMemo)(()=>tabs.map((tab)=>(0, _appearance.createAndroidScreenAppearance)(sanitizeAndroidOptions(tab.options))), [
        tabs
    ]);
    const children = tabs.map((tab, index)=>/*#__PURE__*/ (0, _jsxruntime().jsx)(Screen, {
            name: tab.name,
            options: tab.options,
            isFocused: selectedScreenKey === tab.name,
            androidAppearance: androidAppearances[index],
            contentRenderer: tab.contentRenderer,
            tabBarHidden: props.hidden
        }, tab.name));
    if (children.length === 0) {
        return null;
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnativescreens().Tabs.Host, {
        android: {
            tabBarRespectsIMEInsets: !!tabBarRespectsIMEInsets,
            ...rawAndroidProps
        },
        tabBarHidden: props.hidden,
        ...rawHostRestProps,
        navStateRequest: {
            selectedScreenKey,
            baseProvenance: provenance
        },
        onTabSelected: onTabSelected,
        onTabSelectionPrevented: onTabSelectionPrevented,
        children: children
    });
}
function Screen(props) {
    const { options, androidAppearance, contentRenderer, tabBarHidden } = props;
    const shared = (0, _NativeTabsViewshared.useSharedScreenProps)(props);
    const androidIcon = (0, _optionsIconConverter.convertOptionsIconToScreensPropsIcon)(shared.icon);
    const androidSelectedIcon = (0, _optionsIconConverter.convertOptionsIconToScreensPropsIcon)(shared.selectedIcon ?? shared.icon);
    const content = /*#__PURE__*/ (0, _jsxruntime().jsx)(_NativeTabsViewshared.ScreenContent, {
        options: options,
        contentRenderer: contentRenderer
    });
    const wrappedContent = (0, _react().useMemo)(()=>{
        if (!options.disableAutomaticContentInsets) {
            return /*#__PURE__*/ (0, _jsxruntime().jsx)(_experimental().SafeAreaView, {
                // https://github.com/software-mansion/react-native-screens/issues/2662#issuecomment-2757735088
                collapsable: false,
                style: {
                    flex: 1
                },
                edges: {
                    bottom: true
                },
                insetType: tabBarHidden ? 'system' : 'all',
                children: content
            });
        }
        return content;
    }, [
        content,
        options.disableAutomaticContentInsets,
        tabBarHidden
    ]);
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_NativeTabsViewshared.TabsScreen, {
        ...shared.options,
        pointerEvents: shared.pointerEvents,
        android: {
            icon: androidIcon?.platform === 'android' ? androidIcon.icon : undefined,
            selectedIcon: androidSelectedIcon?.platform === 'android' ? androidSelectedIcon.icon : undefined,
            standardAppearance: androidAppearance,
            ...shared.nativeAndroidOverrides
        },
        title: shared.title,
        preventNativeSelection: options.disabled,
        ...shared.nativeRestOverrides,
        screenKey: shared.screenKey,
        children: wrappedContent
    });
}
const supportedTabBarItemLabelVisibilityModesSet = new Set(_types.SUPPORTED_TAB_BAR_ITEM_LABEL_VISIBILITY_MODES);
function sanitizeAndroidOptions(options) {
    if (options.labelVisibilityMode && !supportedTabBarItemLabelVisibilityModesSet.has(options.labelVisibilityMode)) {
        console.warn(`Unsupported labelVisibilityMode: ${options.labelVisibilityMode}. Supported values are: ${_types.SUPPORTED_TAB_BAR_ITEM_LABEL_VISIBILITY_MODES.map((mode)=>`"${mode}"`).join(', ')}`);
        return {
            ...options,
            labelVisibilityMode: undefined
        };
    }
    return options;
}

//# sourceMappingURL=NativeTabsView.android.js.map
