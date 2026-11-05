'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    NativeTabTrigger: null,
    convertTabPropsToOptions: null,
    isNativeTabTrigger: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get NativeTabTrigger () {
        return NativeTabTrigger;
    },
    get convertTabPropsToOptions () {
        return convertTabPropsToOptions;
    },
    get isNativeTabTrigger () {
        return isNativeTabTrigger;
    }
});
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
const _PreviewRouteContext = require("../link/preview/PreviewRouteContext");
const _core = require("../react-navigation/core");
const _native = require("../react-navigation/native");
const _useFocusEffect = require("../useFocusEffect");
const _children = require("../utils/children");
const _elements = require("./common/elements");
const _optionsIconConverter = require("./utils/optionsIconConverter");
/**
 * The component used to customize the native tab options both in the _layout file and from the tab screen.
 *
 * When used in the _layout file, you need to provide a `name` prop.
 * When used in the tab screen, the `name` prop takes no effect.
 *
 * @example
 * ```tsx app/_layout.tsx
 * import { NativeTabs } from 'expo-router/native-tabs';
 *
 * export default function Layout() {
 *   return (
 *     <NativeTabs>
 *       <NativeTabs.Trigger name="home" />
 *       <NativeTabs.Trigger name="settings" />
 *     </NativeTabs>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx app/home.tsx
 * import { NativeTabs } from 'expo-router/native-tabs';
 *
 * export default function HomeScreen() {
 *   return (
 *     <View>
 *       <NativeTabs.Trigger>
 *         <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
 *       </NativeTabs.Trigger>
 *       <Text>This is home screen!</Text>
 *     </View>
 *   );
 * }
 * ```
 */ function NativeTabTriggerImpl(props) {
    const route = (0, _native.useRoute)();
    const navigation = (0, _native.useNavigation)();
    const isInPreview = (0, _PreviewRouteContext.useIsPreview)();
    const navigatorType = (0, _react().use)(_core.NavigatorTypeContext);
    (0, _useFocusEffect.useFocusEffect)((0, _react().useCallback)(()=>{
        // This will cause the tab to update only when it is focused.
        // As long as all tabs are loaded at the start, we don't need this check.
        // It is here to ensure similar behavior to stack
        if (!isInPreview) {
            if (navigatorType !== 'tab') {
                throw new Error(`Trigger component can only be used in the tab screen. Current route: ${route.name}`);
            }
            if (process.env.NODE_ENV !== 'production' && props.prominent) {
                console.warn(`NativeTabs ignores \`prominent\` on the \`NativeTabs.Trigger\` inside the "${route.name}" screen. ` + 'The prominent tab can be set only in the layout. ' + `Set \`prominent\` on \`<NativeTabs.Trigger name="${route.name}">\` in the layout file.`);
            }
            const options = convertTabPropsToOptions(props, true);
            navigation.setOptions(options);
        }
    }, [
        props,
        isInPreview,
        navigatorType
    ]));
    return null;
}
const NativeTabTrigger = Object.assign(NativeTabTriggerImpl, {
    Label: _elements.NativeTabsTriggerLabel,
    Icon: _elements.NativeTabsTriggerIcon,
    Badge: _elements.NativeTabsTriggerBadge,
    VectorIcon: _elements.NativeTabsTriggerVectorIcon
});
function convertTabPropsToOptions({ hidden, children, role, prominent, disableAutomaticSearchActivation, disablePopToTop, disableScrollToTop, unstable_nativeProps, disableAutomaticContentInsets, contentStyle, disableTransparentOnScrollEdge, disabled, rippleColor, indicatorColor, disableIndicator, labelVisibilityMode, testID, accessibilityLabel }, isDynamic = false) {
    const initialOptions = isDynamic ? {
        ...unstable_nativeProps ? {
            nativeProps: unstable_nativeProps
        } : {},
        ...disableTransparentOnScrollEdge !== undefined ? {
            disableTransparentOnScrollEdge
        } : {},
        ...disableAutomaticSearchActivation !== undefined ? {
            disableAutomaticSearchActivation
        } : {},
        ...disabled !== undefined ? {
            disabled
        } : {},
        ...rippleColor !== undefined ? {
            rippleColor
        } : {},
        ...indicatorColor !== undefined ? {
            indicatorColor
        } : {},
        ...disableIndicator !== undefined ? {
            disableIndicator
        } : {},
        ...labelVisibilityMode !== undefined ? {
            labelVisibilityMode
        } : {},
        ...testID !== undefined ? {
            tabBarItemTestID: testID
        } : {},
        ...accessibilityLabel !== undefined ? {
            tabBarItemAccessibilityLabel: accessibilityLabel
        } : {}
    } : {
        hidden: !!hidden,
        specialEffects: {
            repeatedTabSelection: {
                popToRoot: !disablePopToTop,
                scrollToTop: !disableScrollToTop
            }
        },
        contentStyle,
        role,
        ...prominent !== undefined ? {
            prominent
        } : {},
        nativeProps: unstable_nativeProps,
        disableAutomaticContentInsets,
        ...disableTransparentOnScrollEdge !== undefined ? {
            disableTransparentOnScrollEdge
        } : {},
        ...disableAutomaticSearchActivation !== undefined ? {
            disableAutomaticSearchActivation
        } : {},
        ...disabled !== undefined ? {
            disabled
        } : {},
        ...rippleColor !== undefined ? {
            rippleColor
        } : {},
        ...indicatorColor !== undefined ? {
            indicatorColor
        } : {},
        ...disableIndicator !== undefined ? {
            disableIndicator
        } : {},
        ...labelVisibilityMode !== undefined ? {
            labelVisibilityMode
        } : {},
        ...testID !== undefined ? {
            tabBarItemTestID: testID
        } : {},
        ...accessibilityLabel !== undefined ? {
            tabBarItemAccessibilityLabel: accessibilityLabel
        } : {}
    };
    const allowedChildren = (0, _children.filterAllowedChildrenElements)(children, [
        _elements.NativeTabsTriggerBadge,
        _elements.NativeTabsTriggerLabel,
        _elements.NativeTabsTriggerIcon
    ]);
    return allowedChildren.reduce((acc, child)=>{
        if ((0, _children.isChildOfType)(child, _elements.NativeTabsTriggerBadge)) {
            appendBadgeOptions(acc, child.props);
        } else if ((0, _children.isChildOfType)(child, _elements.NativeTabsTriggerLabel)) {
            appendLabelOptions(acc, child.props);
        } else if ((0, _children.isChildOfType)(child, _elements.NativeTabsTriggerIcon)) {
            (0, _optionsIconConverter.appendIconOptions)(acc, child.props);
        }
        return acc;
    }, {
        ...initialOptions
    });
}
function appendBadgeOptions(options, props) {
    if (props.children) {
        options.badgeValue = String(props.children);
        options.selectedBadgeBackgroundColor = props.selectedBackgroundColor;
    } else if (!props.hidden) {
        // If no value is provided, we set it to a space to show the badge
        // Otherwise, the `react-native-screens` will interpret it as a hidden badge
        // https://github.com/software-mansion/react-native-screens/blob/b4358fd95dd0736fc54df6bb97f210dc89edf24c/ios/bottom-tabs/RNSBottomTabsScreenComponentView.mm#L172
        options.badgeValue = ' ';
    }
}
function appendLabelOptions(options, props) {
    if (props.hidden) {
        options.title = '';
    } else {
        options.title = props.children;
        if (props.selectedStyle) {
            options.selectedLabelStyle = _reactnative().StyleSheet.flatten(props.selectedStyle);
        }
    }
}
function isNativeTabTrigger(child, contextKey) {
    if ((0, _children.isChildOfType)(child, NativeTabTrigger)) {
        if ('name' in child.props && !child.props.name) {
            throw new Error(`<Trigger /> component in \`default export\` at \`app${contextKey}/_layout\` must have a \`name\` prop when used as a child of a Layout Route.`);
        }
        if (process.env.NODE_ENV !== 'production') {
            if ([
                'component',
                'getComponent'
            ].some((key)=>key in child.props)) {
                throw new Error(`<Trigger /> component in \`default export\` at \`app${contextKey}/_layout\` must not have a \`component\` or \`getComponent\` prop when used as a child of a Layout Route`);
            }
        }
        return true;
    }
    return false;
}

//# sourceMappingURL=NativeTabTrigger.js.map
