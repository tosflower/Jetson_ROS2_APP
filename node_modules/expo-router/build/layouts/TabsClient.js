'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createJSTabsProps: null,
    default: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get createJSTabsProps () {
        return createJSTabsProps;
    },
    get default () {
        return _default;
    }
});
0 && __export(require("../react-navigation/bottom-tabs"));
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
const _Link = require("../link/Link");
const _createBottomTabNavigator = require("../react-navigation/bottom-tabs/navigators/createBottomTabNavigator");
const _native = require("../react-navigation/native");
const _standardnavigation = require("../standard-navigation");
const _appendMissingPlaceholderTabRoutes = require("../standard-navigation/appendMissingPlaceholderTabRoutes");
const _createBaseTabProps = require("./createBaseTabProps");
_export_star(require("../react-navigation/bottom-tabs"), exports);
function _export_star(from, to) {
    Object.keys(from).forEach(function(k) {
        if (k !== "default" && !Object.prototype.hasOwnProperty.call(to, k)) {
            Object.defineProperty(to, k, {
                enumerable: true,
                get: function() {
                    return from[k];
                }
            });
        }
    });
    return from;
}
function createJSTabsProps(args) {
    const { dispatch, state } = args;
    return {
        ...(0, _createBaseTabProps.createBaseTabProps)(args),
        popNestedStackToTop: (routeKey)=>{
            const nestedState = state.routes.find((route)=>route.key === routeKey)?.state;
            // A targeted POP_TO_TOP is a no-op for nested navigators that are not stacks.
            if (nestedState?.key) {
                dispatch({
                    ..._native.StackActions.popToTop(),
                    target: nestedState.key
                });
            }
        }
    };
}
/**
 * Renders a tabs navigator.
 *
 * @hideType
 */ const Tabs = (0, _standardnavigation.integrateWithRouter)(_createBottomTabNavigator.createStandardBottomTabNavigator, _native.TabRouter, {
    activityDefaultThreshold: 1,
    processDescriptors: _appendMissingPlaceholderTabRoutes.appendMissingPlaceholderTabDescriptors,
    processState: _appendMissingPlaceholderTabRoutes.appendMissingPlaceholderTabRoutes,
    createProps: createJSTabsProps,
    // Support the `href` shortcut prop.
    processScreens: (screens)=>screens.map((screen)=>{
            if (typeof screen.options !== 'function' && screen.options?.href !== undefined) {
                const { href, ...options } = screen.options;
                if (options.tabBarButton) {
                    throw new Error('Cannot use `href` and `tabBarButton` together.');
                }
                if (href === null) {
                    // TODO(@ubax): Update the hiding-a-tab guide for the new redirect behavior.
                    return {
                        ...screen,
                        options: {
                            ...options,
                            hidden: true
                        }
                    };
                }
                return {
                    ...screen,
                    options: {
                        ...options,
                        tabBarButton: (props)=>{
                            const children = _reactnative().Platform.OS === 'web' ? props.children : /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Pressable, {
                                children: props.children
                            });
                            // TODO: React Navigation types these props as Animated.WithAnimatedValue<StyleProp<ViewStyle>>
                            //       While Link expects a TextStyle. We need to reconcile these types.
                            return /*#__PURE__*/ (0, _jsxruntime().jsx)(_Link.Link, {
                                ...props,
                                style: [
                                    {
                                        display: 'flex'
                                    },
                                    props.style
                                ],
                                href: href,
                                asChild: _reactnative().Platform.OS !== 'web',
                                children: children
                            });
                        }
                    }
                };
            }
            return screen;
        })
});
const _default = Tabs;

//# sourceMappingURL=TabsClient.js.map
