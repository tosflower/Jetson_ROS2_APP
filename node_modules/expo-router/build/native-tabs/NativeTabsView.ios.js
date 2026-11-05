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
function _reactnativesafeareacontext() {
    const data = require("react-native-safe-area-context");
    _reactnativesafeareacontext = function() {
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
const _useDeprecated = require("../useDeprecated");
const _children = require("../utils/children");
const _NativeTabsViewshared = require("./NativeTabsView.shared");
const _appearance = require("./appearance");
const _elements = require("./common/elements");
const _types = require("./types");
const _bottomAccessory = require("./utils/bottomAccessory");
const _optionsIconConverter = require("./utils/optionsIconConverter");
function NativeTabsView(props) {
    const { minimizeBehavior, tabs, sidebarAdaptable, preferredPlacement, nonTriggerChildren, unstable_nativeProps } = props;
    // `ios`/`android` are the only platform-nested keys on `TabsHostProps`. We drop the inactive
    // platform's slice so users writing universal code don't pass Android-only props to the iOS host.
    const { ios: rawIosProps, android: _ignoredRawAndroidProps, ...rawHostRestProps } = unstable_nativeProps ?? {};
    const { selectedScreenKey, provenance } = (0, _NativeTabsViewshared.useSelectedScreenKey)(props);
    const onTabSelected = (0, _NativeTabsViewshared.useOnTabSelectedHandler)(props.onTabChange);
    const onTabSelectionPrevented = (0, _NativeTabsViewshared.useOnTabSelectionPreventedHandler)(props.onTabChange);
    const prominentScreenKey = useProminentScreenKey(tabs);
    const iosAppearances = tabs.map((tab)=>({
            standardAppearance: (0, _appearance.createStandardAppearanceFromOptions)(tab.options),
            scrollEdgeAppearance: (0, _appearance.createScrollEdgeAppearanceFromOptions)(tab.options)
        }));
    const bottomAccessory = (0, _react().useMemo)(()=>(0, _children.getFirstChildOfType)(nonTriggerChildren, _elements.NativeTabsBottomAccessory), [
        nonTriggerChildren
    ]);
    const bottomAccessoryFn = (0, _bottomAccessory.useBottomAccessoryFunctionFromBottomAccessories)(bottomAccessory);
    (0, _useDeprecated.useWarnOnce)('NativeTabs ignores `preferredPlacement` because `sidebarAdaptable` is `false`. ' + 'The placement has an effect only when the tab bar can turn into a sidebar. ' + 'Remove `sidebarAdaptable={false}` to use the placement, or remove `preferredPlacement`.', sidebarAdaptable === false && preferredPlacement !== undefined);
    if (process.env.NODE_ENV !== 'production' && bottomAccessory && rawIosProps && 'bottomAccessory' in rawIosProps) {
        console.warn('<NativeTabs.BottomAccessory> is being overridden by `unstable_nativeProps.ios.bottomAccessory`. ' + 'Either remove the `<NativeTabs.BottomAccessory>` child or stop passing `ios.bottomAccessory` via `unstable_nativeProps`.');
    }
    const children = tabs.map((tab, index)=>/*#__PURE__*/ (0, _jsxruntime().jsx)(Screen, {
            name: tab.name,
            routeKey: tab.routeKey,
            options: tab.options,
            isFocused: selectedScreenKey === tab.name,
            standardAppearance: iosAppearances[index].standardAppearance,
            scrollEdgeAppearance: iosAppearances[index].scrollEdgeAppearance,
            contentRenderer: tab.contentRenderer
        }, tab.name));
    if (children.length === 0) {
        return null;
    }
    // The placement works only in `tabSidebar` mode, so setting it enables that mode.
    const tabBarControllerMode = sidebarAdaptable === false ? 'tabBar' : sidebarAdaptable || preferredPlacement ? 'tabSidebar' : 'automatic';
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(TabsHostWrapper, {
        ios: {
            tabBarTintColor: props.tintColor,
            tabBarMinimizeBehavior: minimizeBehavior,
            tabBarControllerMode,
            tabBarSidebarPreferredPlacement: preferredPlacement,
            bottomAccessory: bottomAccessoryFn,
            tabBarHiddenAnimationEnabled: props.disableHiddenAnimation ? false : undefined,
            prominentScreenKey,
            ...rawIosProps
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
// `tabs` holds only visible tabs, so a hidden tab can never be prominent.
function useProminentScreenKey(tabs) {
    const [prominentTab, ...otherProminentTabs] = tabs.filter((tab)=>tab.options.prominent);
    (0, _useDeprecated.useWarnOnce)(`NativeTabs supports only one prominent tab, so only the "${prominentTab?.name}" tab is prominent. ` + `Remove \`prominent\` from these tabs: ${otherProminentTabs.map((tab)=>`"${tab.name}"`).join(', ')}.`, otherProminentTabs.length > 0);
    return prominentTab?.name;
}
function Screen(props) {
    const { options, standardAppearance, scrollEdgeAppearance, contentRenderer } = props;
    const shared = (0, _NativeTabsViewshared.useSharedScreenProps)(props);
    const selectedIcon = shared.selectedIcon ?? shared.icon;
    // React Native Screens requires `icon` and `selectedIcon` to resolve to the same icon type and
    // throws otherwise, so both states have to share a rendering mode. The two can disagree when a
    // color is set for only one of the states, or when `renderingMode` is set explicitly.
    const normalRenderingMode = (0, _optionsIconConverter.resolveIconRenderingMode)(shared.icon, standardAppearance?.stacked?.normal?.tabBarItemIconColor);
    const selectedRenderingMode = (0, _optionsIconConverter.resolveIconRenderingMode)(selectedIcon, standardAppearance?.stacked?.selected?.tabBarItemIconColor);
    if (process.env.NODE_ENV !== 'production' && normalRenderingMode && selectedRenderingMode && normalRenderingMode !== selectedRenderingMode) {
        console.warn(`NativeTabs does not currently support rendering icons in different modes, so the "${props.name}" tab renders both icons with the default icon's mode. ` + 'The modes disagree when an icon color applies to only one of the states — `tintColor`, `iconColor={{ selected }}`, or the `Icon` `selectedColor` prop — or when `renderingMode` is set for only one state. ' + 'To render both the same way, set a color for both states (for example `iconColor` rather than only `tintColor`), or set `renderingMode` on the `Icon`.');
    }
    // The normal state wins, so the selected icon follows the mode the tab bar shows most of the time.
    const effectiveRenderingMode = normalRenderingMode ?? selectedRenderingMode;
    const iosIcon = (0, _optionsIconConverter.convertOptionsIconToScreensPropsIcon)(shared.icon, effectiveRenderingMode);
    const iosSelectedIcon = (0, _optionsIconConverter.convertOptionsIconToScreensPropsIcon)(selectedIcon, effectiveRenderingMode);
    const content = /*#__PURE__*/ (0, _jsxruntime().jsx)(_NativeTabsViewshared.ScreenContent, {
        options: options,
        contentRenderer: contentRenderer
    });
    const wrappedContent = (0, _react().useMemo)(()=>/*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnativesafeareacontext().SafeAreaProvider, {
            children: content
        }), [
        content
    ]);
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_NativeTabsViewshared.TabsScreen, {
        ...shared.options,
        pointerEvents: shared.pointerEvents,
        ios: {
            icon: iosIcon?.platform === 'ios' ? iosIcon.icon : undefined,
            selectedIcon: iosSelectedIcon?.platform === 'ios' ? iosSelectedIcon.icon : undefined,
            standardAppearance,
            scrollEdgeAppearance,
            systemItem: options.role,
            // On by default: on iOS 27, UIKit detaches the search tab only while activation is on.
            ...options.role === 'search' ? {
                role: 'search',
                automaticallyActivatesSearch: !options.disableAutomaticSearchActivation
            } : {},
            overrideScrollViewContentInsetAdjustmentBehavior: !options.disableAutomaticContentInsets,
            ...shared.nativeIosOverrides
        },
        title: shared.title,
        preventNativeSelection: options.disabled,
        ...shared.nativeRestOverrides,
        screenKey: shared.screenKey,
        nativeID: props.routeKey ? `expo-router-tab:${props.routeKey}` : undefined,
        children: wrappedContent
    });
}
const supportedTabBarMinimizeBehaviorsSet = new Set(_types.SUPPORTED_TAB_BAR_MINIMIZE_BEHAVIORS);
function TabsHostWrapper(props) {
    // TODO(@ubax): add function for validation
    let validatedIos = props.ios;
    if (validatedIos?.tabBarMinimizeBehavior) {
        if (!supportedTabBarMinimizeBehaviorsSet.has(validatedIos.tabBarMinimizeBehavior)) {
            console.warn(`Unsupported minimizeBehavior: ${validatedIos.tabBarMinimizeBehavior}. Supported values are: ${_types.SUPPORTED_TAB_BAR_MINIMIZE_BEHAVIORS.map((behavior)=>`"${behavior}"`).join(', ')}`);
            validatedIos = {
                ...validatedIos,
                tabBarMinimizeBehavior: undefined
            };
        }
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnativescreens().Tabs.Host, {
        ...props,
        ios: validatedIos
    });
}

//# sourceMappingURL=NativeTabsView.ios.js.map
