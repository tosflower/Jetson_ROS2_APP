"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    TabTrigger: null,
    isTabTrigger: null,
    useTabTrigger: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get TabTrigger () {
        return TabTrigger;
    },
    get isTabTrigger () {
        return isTabTrigger;
    },
    get useTabTrigger () {
        return useTabTrigger;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
function _reactslot() {
    const data = require("@radix-ui/react-slot");
    _reactslot = function() {
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
const _getPathFromState = require("../fork/getPathFromState");
const _routingQueueContext = require("../global-state/routingQueueContext");
const _stateUtils = require("../global-state/stateUtils");
const _imperativeapi = require("../imperative-api");
const _useLinkToPathProps = require("../link/useLinkToPathProps");
const _matchers = require("../matchers");
const _Navigator = require("../views/Navigator");
const _TabContext = require("./TabContext");
const _common = require("./common");
const TabTriggerSlot = _reactslot().Slot;
function TabTrigger({ asChild, name, href, resetOnFocus, ...props }) {
    const { trigger, triggerProps } = useTabTrigger({
        name,
        resetOnFocus,
        ...props
    });
    if (trigger?.hidden) {
        return null;
    }
    // Pressable doesn't accept the extra props, so only pass them if we are using asChild
    if (asChild) {
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(TabTriggerSlot, {
            style: styles.tabTrigger,
            ...props,
            ...triggerProps,
            href: trigger?.resolvedHref,
            children: props.children
        });
    } else {
        // These props are not typed, but are allowed by React Native Web
        const reactNativeWebProps = {
            href: trigger?.resolvedHref
        };
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Pressable, {
            style: styles.tabTrigger,
            ...reactNativeWebProps,
            ...props,
            ...triggerProps,
            children: props.children
        });
    }
}
function isTabTrigger(child) {
    return child.type === TabTrigger;
}
function useTabTrigger(options) {
    const { state, navigation, contextKey, descriptors } = (0, _Navigator.useNavigatorContext)();
    const { name, resetOnFocus, onPress, onLongPress } = options;
    const triggerMap = (0, _react().use)(_TabContext.TabTriggerMapContext);
    const navigatorStates = (0, _react().use)(_TabContext.TabNavigatorStatesContext);
    const enqueue = (0, _routingQueueContext.useEnqueueRoutingIntent)();
    const getTrigger = (0, _react().useCallback)((name)=>{
        const config = triggerMap[name];
        if (!config) {
            return;
        }
        const route = config.type === 'internal' ? state.routes.find((route)=>route.name === config.routeNode.route) : undefined;
        const routeOptions = config.type === 'internal' ? descriptors[route?.key ?? config.routeNode.route]?.options : undefined;
        const hidden = routeOptions != null && 'hidden' in routeOptions && routeOptions.hidden === true;
        // Parent triggers are inherited, so read the state of the navigator that registered them.
        const owningState = config.type === 'internal' ? navigatorStates[config.contextKey] : undefined;
        const routeIndex = config.type === 'internal' ? owningState?.routes.findIndex((route)=>route.name === config.routeNode.route) ?? -1 : -1;
        return {
            hidden,
            isFocused: owningState?.index === routeIndex,
            route: owningState?.routes[routeIndex],
            resolvedHref: (0, _matchers.stripGroupSegmentsFromPath)((0, _getPathFromState.appendBaseUrl)(config.href)),
            ...config
        };
    }, [
        descriptors,
        navigatorStates,
        state,
        triggerMap
    ]);
    const trigger = name !== undefined ? getTrigger(name) : undefined;
    const switchTab = (0, _react().useCallback)((name, options)=>{
        const config = triggerMap[name];
        if (config) {
            if (config.type === 'external') {
                return _imperativeapi.router.navigate(config.href);
            } else {
                const owningState = navigatorStates[config.contextKey];
                if (!owningState) {
                    return;
                }
                return enqueue({
                    type: 'COMPUTED_ACTION',
                    payload: {
                        originKey: state.key,
                        compute (rootState, registry) {
                            const currentOwningState = (0, _stateUtils.findStateByKey)(rootState, owningState.key);
                            if (!currentOwningState) {
                                return;
                            }
                            const action = (0, _common.buildTabAction)(config, currentOwningState, registry, options?.resetOnFocus);
                            return config.contextKey !== contextKey ? {
                                ...action,
                                target: action.target ?? currentOwningState.key
                            } : action;
                        }
                    }
                });
            }
        } else {
            return navigation?.dispatch({
                type: 'JUMP_TO',
                payload: {
                    name
                }
            });
        }
    }, [
        contextKey,
        enqueue,
        navigation,
        navigatorStates,
        state.key,
        triggerMap
    ]);
    const handleOnPress = (0, _react().useCallback)((event)=>{
        onPress?.(event);
        if (!trigger) return;
        if (event?.isDefaultPrevented()) return;
        navigation?.emit({
            type: 'tabPress',
            target: trigger.route?.key ?? trigger.href,
            canPreventDefault: true
        });
        if (!(0, _useLinkToPathProps.shouldHandleMouseEvent)(event)) return;
        if (!trigger.isFocused || trigger.type === 'internal' && trigger.deep) {
            switchTab(name, {
                resetOnFocus
            });
        }
    }, [
        onPress,
        name,
        resetOnFocus,
        trigger
    ]);
    const handleOnLongPress = (0, _react().useCallback)((event)=>{
        onLongPress?.(event);
        if (!trigger) return;
        if (event?.isDefaultPrevented()) return;
        navigation?.emit({
            type: 'tabLongPress',
            target: trigger.route?.key ?? trigger.href
        });
        if (!(0, _useLinkToPathProps.shouldHandleMouseEvent)(event)) return;
        if (!trigger.isFocused) {
            switchTab(name, {
                resetOnFocus
            });
        }
    }, [
        onLongPress,
        name,
        resetOnFocus,
        trigger
    ]);
    const triggerProps = {
        isFocused: Boolean(trigger?.isFocused),
        onPress: handleOnPress,
        onLongPress: handleOnLongPress
    };
    return {
        switchTab,
        getTrigger,
        trigger,
        triggerProps
    };
}
const styles = _reactnative().StyleSheet.create({
    tabTrigger: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});

//# sourceMappingURL=TabTrigger.js.map
