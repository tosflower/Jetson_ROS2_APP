"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MaterialTopTabBar", {
    enumerable: true,
    get: function() {
        return MaterialTopTabBar;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
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
const _color = require("../../../utils/color");
const _elements = require("../../elements");
const _native = require("../../native");
// Use dynamic import to avoid having direct dependency on react-native-tab-view.
// import { TabBar, TabBarIndicator } from 'react-native-tab-view';
let TabBar;
let TabBarIndicator;
try {
    const tabViewModule = require('react-native-tab-view');
    TabBar = tabViewModule.TabBar;
    TabBarIndicator = tabViewModule.TabBarIndicator;
} catch (e) {
    throw new Error("Install the 'react-native-tab-view' package and its peer dependencies to use the Expo Router's TopTabs.");
}
const renderLabelDefault = ({ color, labelText, style, allowFontScaling })=>{
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_elements.Text, {
        style: [
            {
                color
            },
            styles.label,
            style
        ],
        allowFontScaling: allowFontScaling,
        children: labelText
    });
};
function MaterialTopTabBar({ state, descriptors, emitter, // The built-in bar switches through `jumpTo`; only strip the custom callback from forwarded props.
navigateToTab: _navigateToTab, insets, ...rest }) {
    const { colors } = (0, _native.useTheme)();
    const { direction } = (0, _native.useLocale)();
    const { buildHref } = (0, _native.useLinkBuilder)();
    const focusedRoute = state.routes[state.index];
    const focusedOptions = descriptors[focusedRoute.key].options;
    const activeColor = focusedOptions.tabBarActiveTintColor ?? colors.primary;
    const inactiveColor = focusedOptions.tabBarInactiveTintColor ?? (0, _color.alpha)(activeColor, 0.5) ?? colors.text;
    const tabBarOptions = Object.fromEntries(state.routes.map((route)=>{
        const { options } = descriptors[route.key];
        const { title, tabBarLabel, tabBarButtonTestID, tabBarAccessibilityLabel, tabBarBadge, tabBarShowIcon, tabBarShowLabel, tabBarIcon, tabBarAllowFontScaling, tabBarLabelStyle } = options;
        const tabBarOption = {
            href: buildHref(route.name, route.params),
            testID: tabBarButtonTestID,
            accessibilityLabel: tabBarAccessibilityLabel,
            badge: tabBarBadge,
            icon: tabBarShowIcon === false ? undefined : tabBarIcon,
            label: tabBarShowLabel === false ? undefined : typeof tabBarLabel === 'function' ? ({ labelText, color })=>tabBarLabel({
                    focused: focusedRoute.key === route.key,
                    color,
                    children: labelText ?? route.name
                }) : renderLabelDefault,
            labelAllowFontScaling: tabBarAllowFontScaling,
            labelStyle: tabBarLabelStyle,
            labelText: options.tabBarShowLabel === false ? undefined : typeof tabBarLabel === 'string' ? tabBarLabel : title !== undefined ? title : route.name
        };
        return [
            route.key,
            tabBarOption
        ];
    }));
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(TabBar, {
        ...rest,
        navigationState: state,
        options: tabBarOptions,
        direction: direction,
        scrollEnabled: focusedOptions.tabBarScrollEnabled,
        bounces: focusedOptions.tabBarBounces,
        // TabBar declares strings, but Expo callbacks, style color, and android_ripple accept OpaqueColorValue at runtime, so PlatformColor works.
        activeColor: activeColor,
        inactiveColor: inactiveColor,
        pressColor: focusedOptions.tabBarPressColor,
        pressOpacity: focusedOptions.tabBarPressOpacity,
        tabStyle: focusedOptions.tabBarItemStyle,
        indicatorStyle: [
            {
                backgroundColor: colors.primary
            },
            focusedOptions.tabBarIndicatorStyle
        ],
        gap: focusedOptions.tabBarGap,
        android_ripple: focusedOptions.tabBarAndroidRipple,
        indicatorContainerStyle: focusedOptions.tabBarIndicatorContainerStyle,
        contentContainerStyle: [
            focusedOptions.tabBarContentContainerStyle,
            // Pad the tabs inside the horizontal safe area, such as beside the iPhone Duo rail, while
            // the bar's own style spans the screen edges.
            {
                paddingStart: (direction === 'rtl' ? insets.right : insets.left) || undefined,
                paddingEnd: (direction === 'rtl' ? insets.left : insets.right) || undefined
            }
        ],
        style: [
            {
                backgroundColor: colors.card
            },
            focusedOptions.tabBarStyle
        ],
        onTabPress: ({ route, preventDefault })=>{
            const event = emitter.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true
            });
            if (event.defaultPrevented) {
                preventDefault();
            }
        },
        onTabLongPress: ({ route })=>emitter.emit({
                type: 'tabLongPress',
                target: route.key
            }),
        renderIndicator: ({ navigationState: state, ...rest })=>{
            return focusedOptions.tabBarIndicator ? focusedOptions.tabBarIndicator({
                state,
                ...rest
            }) : /*#__PURE__*/ (0, _jsxruntime().jsx)(TabBarIndicator, {
                navigationState: state,
                ...rest
            });
        }
    });
}
const styles = _reactnative().StyleSheet.create({
    label: {
        textAlign: 'center',
        fontSize: 14,
        margin: 4,
        backgroundColor: 'transparent'
    }
});

//# sourceMappingURL=MaterialTopTabBar.js.map
