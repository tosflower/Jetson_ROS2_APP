"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    Tabs: null,
    useTabsWithChildren: null,
    useTabsWithTriggers: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get Tabs () {
        return Tabs;
    },
    get useTabsWithChildren () {
        return useTabsWithChildren;
    },
    get useTabsWithTriggers () {
        return useTabsWithTriggers;
    }
});
0 && __export(require("./TabContext")) && __export(require("./TabList")) && __export(require("./TabSlot")) && __export(require("./TabTrigger"));
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
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
const _Route = require("../Route");
const _useComponent = require("../fork/useComponent");
const _hooks = require("../hooks");
const _GuardContext = require("../layouts/GuardContext");
const _href = require("../link/href");
const _native = require("../react-navigation/native");
const _routeNode = require("../routeNode");
const _appendMissingPlaceholderTabRoutes = require("../standard-navigation/appendMissingPlaceholderTabRoutes");
const _useNonStackAnchorWarning = require("../standard-navigation/useNonStackAnchorWarning");
const _useReconcileTabHistory = require("../standard-navigation/useReconcileTabHistory");
const _useVisibleTabsWithRedirect = require("../standard-navigation/useVisibleTabsWithRedirect");
const _url = require("../utils/url");
const _Navigator = require("../views/Navigator");
const _TabContext = _export_star(require("./TabContext"), exports);
const _TabList = _export_star(require("./TabList"), exports);
const _TabRouter = require("./TabRouter");
const _TabSlot = _export_star(require("./TabSlot"), exports);
const _TabTrigger = _export_star(require("./TabTrigger"), exports);
const _common = require("./common");
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
const emptyGuardedRedirects = new Map();
function Tabs(props) {
    const { children, asChild, options, activityEnabled, ...rest } = props;
    const Comp = asChild ? _common.ViewSlot : _reactnative().View;
    const { NavigationContent } = useTabsWithChildren({
        // asChild adds an extra layer, so we need to process the child's children
        children: asChild && /*#__PURE__*/ (0, _react().isValidElement)(children) && children.props && typeof children.props === 'object' && 'children' in children.props ? children.props.children : children,
        ...options,
        activityEnabled: activityEnabled ?? options?.activityEnabled
    });
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(Comp, {
        style: styles.tabsRoot,
        ...rest,
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(NavigationContent, {
            children: children
        })
    });
}
function useTabsWithChildren(options) {
    const { children, ...rest } = options;
    return useTabsWithTriggers({
        triggers: parseTriggersFromChildren(children),
        ...rest
    });
}
function useTabsWithTriggers(options) {
    const { triggers, ...rest } = options;
    // Ensure we extend the parent triggers, so we can trigger them as well
    const parentTriggerMap = (0, _react().use)(_TabContext.TabTriggerMapContext);
    const parentNavigatorStates = (0, _react().use)(_TabContext.TabNavigatorStatesContext);
    const routeNode = (0, _Route.useRouteNode)();
    const contextKey = (0, _Route.useContextKey)();
    const linking = (0, _react().use)(_native.LinkingContext).options;
    const routeInfo = (0, _hooks.useRouteInfo)();
    if (!routeNode || !linking) {
        throw new Error('No RouteNode. This is likely a bug in expo-router.');
    }
    const initialRouteName = (0, _routeNode.getValidInitialRouteName)(routeNode);
    const backBehavior = rest.backBehavior ?? (initialRouteName ? 'initialRoute' : undefined);
    const { children, triggerMap } = (0, _common.useTriggersToScreens)(triggers, routeNode, linking, parentTriggerMap, routeInfo, contextKey);
    const navigatorContext = (0, _native.useNavigationBuilder)(_TabRouter.ExpoTabRouter, {
        children,
        ...rest,
        triggerMap,
        id: contextKey,
        initialRouteName,
        backBehavior
    }, {
        activityDefaultThreshold: 1
    });
    const { state, describe, descriptors: sparseDescriptors, navigation, NavigationContent: RNNavigationContent } = navigatorContext;
    (0, _useReconcileTabHistory.useReconcileTabHistory)({
        state,
        navigation
    });
    const descriptors = (0, _react().useMemo)(()=>(0, _appendMissingPlaceholderTabRoutes.appendMissingPlaceholderTabDescriptors)(sparseDescriptors, state, describe), [
        describe,
        sparseDescriptors,
        state
    ]);
    const navigatorStates = (0, _react().useMemo)(()=>({
            ...parentNavigatorStates,
            [contextKey]: state
        }), [
        contextKey,
        parentNavigatorStates,
        state
    ]);
    const navigatorContextValue = (0, _react().useMemo)(()=>({
            ...navigatorContext,
            descriptors: descriptors,
            contextKey,
            router: _TabRouter.ExpoTabRouter
        }), [
        navigatorContext,
        descriptors,
        contextKey,
        _TabRouter.ExpoTabRouter
    ]);
    const NavigationContent = (0, _useComponent.useComponent)((children)=>// Headless tabs have no guards, so shadow parent guards whose route names may collide.
        /*#__PURE__*/ (0, _jsxruntime().jsxs)(_GuardContext.GuardContextProvider, {
            node: routeNode,
            guardedRedirects: emptyGuardedRedirects,
            children: [
                /*#__PURE__*/ (0, _jsxruntime().jsx)(TabVisibilityRedirect, {
                    state: state,
                    descriptors: descriptors,
                    backBehavior: backBehavior
                }),
                /*#__PURE__*/ (0, _jsxruntime().jsx)(_TabContext.TabTriggerMapContext.Provider, {
                    value: triggerMap,
                    children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_TabContext.TabNavigatorStatesContext.Provider, {
                        value: navigatorStates,
                        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_Navigator.NavigatorContext.Provider, {
                            value: navigatorContextValue,
                            children: /*#__PURE__*/ (0, _jsxruntime().jsx)(RNNavigationContent, {
                                children: children
                            })
                        })
                    })
                })
            ]
        }));
    return {
        state,
        describe,
        descriptors,
        navigation,
        NavigationContent
    };
}
function TabVisibilityRedirect({ state, descriptors, backBehavior }) {
    const stateWithPlaceholders = (0, _react().useMemo)(()=>(0, _appendMissingPlaceholderTabRoutes.appendMissingPlaceholderTabRoutes)(state, descriptors), [
        descriptors,
        state
    ]);
    (0, _useNonStackAnchorWarning.useNonStackAnchorWarning)(backBehavior);
    (0, _useVisibleTabsWithRedirect.useVisibleTabsWithRedirect)({
        routes: stateWithPlaceholders.routes,
        routeNames: stateWithPlaceholders.routeNames,
        focusedRouteKey: stateWithPlaceholders.routes[stateWithPlaceholders.index]?.key,
        descriptors
    });
    return null;
}
function parseTriggersFromChildren(children, screenTriggers = [], isInTabList = false) {
    _react().Children.forEach(children, (child)=>{
        if (!child || !/*#__PURE__*/ (0, _react().isValidElement)(child) || (0, _TabSlot.isTabSlot)(child)) {
            return;
        }
        if (isFragment(child) && typeof child.props.children !== 'function') {
            return parseTriggersFromChildren(child.props.children, screenTriggers, isInTabList || (0, _TabList.isTabList)(child));
        }
        if ((0, _TabList.isTabList)(child) && typeof child.props.children !== 'function') {
            let children = child.props.children;
            // <TabList asChild /> adds an extra layer. We need to parse the child's children
            if (child.props.asChild && /*#__PURE__*/ (0, _react().isValidElement)(children) && children.props && typeof children.props === 'object' && 'children' in children.props) {
                children = children.props.children;
            }
            return parseTriggersFromChildren(children, screenTriggers, isInTabList || (0, _TabList.isTabList)(child));
        }
        // We should only process TabTriggers within the TabList. All other components will be ignored
        if (!isInTabList || !(0, _TabTrigger.isTabTrigger)(child)) {
            return;
        }
        const { href, name, activityEnabled } = child.props;
        if (!href) {
            if (process.env.NODE_ENV === 'development') {
                console.warn(`<TabTrigger name={${name}}> does not have a 'href' prop. TabTriggers within a <TabList /> are required to have an href.`);
            }
            return;
        }
        const resolvedHref = (0, _href.resolveHref)(href);
        if ((0, _url.shouldLinkExternally)(resolvedHref)) {
            return screenTriggers.push({
                type: 'external',
                name,
                href: resolvedHref
            });
        }
        if (!name) {
            if (process.env.NODE_ENV === 'development') {
                console.warn(`<TabTrigger> does not have a 'name' prop. TabTriggers within a <TabList /> are required to have a name.`);
            }
            return;
        }
        return screenTriggers.push({
            type: 'internal',
            href: resolvedHref,
            name,
            activityEnabled
        });
    });
    return screenTriggers;
}
function isFragment(child) {
    return child.type === _react().Fragment;
}
const styles = _reactnative().StyleSheet.create({
    tabsRoot: {
        flex: 1
    }
});

//# sourceMappingURL=Tabs.js.map
