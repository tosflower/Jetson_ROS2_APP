"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ViewSlot: null,
    buildTabAction: null,
    getTabRoute: null,
    useTriggersToScreens: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ViewSlot () {
        return ViewSlot;
    },
    get buildTabAction () {
        return buildTabAction;
    },
    get getTabRoute () {
        return getTabRoute;
    },
    get useTriggersToScreens () {
        return useTriggersToScreens;
    }
});
const _Route = require("../Route");
const _constants = require("../constants");
const _resolveNavigationDestination = require("../global-state/resolveNavigationDestination");
const _href = require("../link/href");
const _routeNode = require("../routeNode");
const _useScreens = require("../useScreens");
const _Slot = require("./Slot");
const ViewSlot = _Slot.Slot;
function getTabRoute(state, name) {
    const route = state.routes.find((route)=>route.name === name);
    return {
        route,
        isSwitching: state.routes[state.index]?.key !== route?.key
    };
}
function buildTabAction(config, state, registry, resetOnFocus) {
    const { route, isSwitching } = getTabRoute(state, config.routeNode.route);
    const shouldResolve = config.deep || route?.state === undefined || Boolean(resetOnFocus && isSwitching);
    const navigationState = resetOnFocus && isSwitching && route?.state ? {
        ...state,
        routes: state.routes.map((currentRoute)=>currentRoute.key === route.key ? {
                ...currentRoute,
                state: undefined
            } : currentRoute)
    } : state;
    const action = {
        ...config.action,
        type: shouldResolve && !isSwitching ? 'NAVIGATE' : 'JUMP_TO',
        payload: {
            ...config.action.payload,
            ...resetOnFocus !== undefined ? {
                resetOnFocus
            } : undefined
        }
    };
    return shouldResolve && config.targetState ? (0, _resolveNavigationDestination.resolveNavigationDestination)({
        targetState: config.targetState,
        navigationState,
        routeNode: config.layoutRouteNode,
        registry,
        action
    }) : action;
}
function useTriggersToScreens(triggers, layoutRouteNode, linking, parentTriggerMap, routeInfo, contextKey) {
    const configs = [];
    for (const trigger of triggers){
        if (trigger.name in parentTriggerMap) {
            const parentTrigger = parentTriggerMap[trigger.name];
            throw new Error(`Trigger ${JSON.stringify({
                name: trigger.name,
                href: trigger.href
            })} has the same name as parent trigger ${JSON.stringify({
                name: parentTrigger.name,
                href: parentTrigger.href
            })}. Triggers must have unique names.`);
        }
        if (trigger.type === 'external') {
            configs.push(trigger);
            continue;
        }
        let resolvedHref = (0, _href.resolveHref)(trigger.href);
        if (resolvedHref.startsWith('../')) {
            throw new Error('Trigger href cannot link to a parent directory');
        }
        const segmentsWithoutGroups = contextKey.split('/').filter((segment)=>{
            return !(segment.startsWith('(') && segment.endsWith(')'));
        });
        resolvedHref = (0, _href.resolveHrefStringWithSegments)(resolvedHref, {
            ...routeInfo,
            segments: segmentsWithoutGroups
        }, {
            relativeToDirectory: true
        });
        let state = linking.getStateFromPath?.(resolvedHref, linking.config, routeInfo.segments)?.routes[0];
        if (!state) {
            // This shouldn't occur, as you should get the global +not-found
            console.warn(`Unable to find screen for trigger ${JSON.stringify(trigger)}. Does this point to a valid screen?`);
            continue;
        }
        let routeState = state;
        if (routeState.name === _constants.NOT_FOUND_ROUTE_NAME) {
            if (process.env.NODE_ENV !== 'production') {
                console.warn(`Tab trigger '${trigger.name}' has the href '${trigger.href}' which points to a +not-found route.`);
            }
            continue;
        }
        const targetStateName = layoutRouteNode.route || '__root';
        // The state object is the current state from the rootNavigator
        // We need to work out the state for just this trigger
        while(state?.state){
            if (state.name === targetStateName) break;
            state = state.state.routes[state.state.index ?? state.state.routes.length - 1];
        }
        const isWithinLayout = state?.name === targetStateName;
        routeState = state.state?.routes[state.state.index ?? state.state.routes.length - 1] || state;
        const routeNode = (0, _routeNode.findRouteNodeByName)(layoutRouteNode, routeState?.name);
        if (!isWithinLayout) {
            throw new Error(`Tab trigger '${trigger.name}' with href '${resolvedHref}' must point to a route within the tabs layout.`);
        }
        if (!routeNode) {
            console.warn(`Unable to find routeNode for trigger ${JSON.stringify(trigger)}. This might be a bug with Expo Router`);
            continue;
        }
        const duplicateTrigger = trigger.type === 'internal' && configs.find((config)=>{
            if (config.type === 'external') {
                return false;
            }
            return config.routeNode.route === routeNode.route;
        });
        if (duplicateTrigger) {
            const duplicateTriggerText = `${JSON.stringify({
                name: duplicateTrigger.name,
                href: duplicateTrigger.href
            })} and ${JSON.stringify({
                name: trigger.name,
                href: trigger.href
            })}`;
            // TODO(@ubax): Support multiple triggers for one dynamic route with different params.
            throw new Error(`A navigator cannot contain multiple trigger components that map to the same sub-segment. Consider adding a shared group and assigning a group to each trigger. Conflicting triggers:\n\t${duplicateTriggerText}.\nBoth triggers map to route ${routeNode.route}.`);
        }
        const action = {
            type: 'JUMP_TO',
            payload: {
                name: routeState.name,
                params: routeState.params
            }
        };
        configs.push({
            ...trigger,
            href: resolvedHref,
            routeNode,
            layoutRouteNode,
            contextKey,
            action,
            targetState: state.state,
            deep: hasDeepDestination(routeState, routeNode)
        });
    }
    const screenProps = [];
    const triggerMap = {
        ...parentTriggerMap
    };
    for (const config of configs){
        triggerMap[config.name] = config;
        if (config.type === 'internal') {
            // TODO(https://github.com/expo/expo/pull/48756): Resolved internal-trigger href params need
            // to flow through ExpoTabRouter to placeholder, fallback, and action-recreated routes without
            // restoring Screen.initialParams. Explicit action params must override these defaults.
            screenProps.push({
                name: config.routeNode.route,
                activityEnabled: config.activityEnabled
            });
        }
    }
    const children = (0, _useScreens.useSortedScreens)(screenProps);
    return {
        children,
        triggerMap
    };
}
function hasDeepDestination(route, routeNode) {
    let state = route.state;
    let node = routeNode;
    while(state){
        const childRoute = state.routes[state.index ?? state.routes.length - 1];
        const initialRouteName = (0, _routeNode.getValidInitialRouteName)(node) ?? [
            ...node.children
        ].sort((0, _Route.sortRoutesWithInitial)())[0]?.route;
        if (!childRoute || childRoute.name !== initialRouteName || childRoute.params && Object.keys(childRoute.params).length > 0) {
            return true;
        }
        const childNode = (0, _routeNode.findRouteNodeByName)(node, childRoute.name);
        if (!childNode) {
            return true;
        }
        node = childNode;
        state = childRoute.state;
    }
    return false;
}

//# sourceMappingURL=common.js.map
