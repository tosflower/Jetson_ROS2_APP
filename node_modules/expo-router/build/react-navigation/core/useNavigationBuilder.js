'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useNavigationBuilder", {
    enumerable: true,
    get: function() {
        return useNavigationBuilder;
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
    const data = /*#__PURE__*/ _interop_require_wildcard(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
function _reactis() {
    const data = require("react-is");
    _reactis = function() {
        return data;
    };
    return data;
}
const _Route = require("../../Route");
const _useComponent = require("../../fork/useComponent");
const _routerRegistry = require("../../global-state/routerRegistry");
const _routingQueueContext = require("../../global-state/routingQueueContext");
const _stateUtils = require("../../global-state/stateUtils");
const _useLatestCallback = /*#__PURE__*/ _interop_require_default(require("../../utils/useLatestCallback"));
const _Group = require("./Group");
const _NavigationBuilderContext = require("./NavigationBuilderContext");
const _NavigationHelpersContext = require("./NavigationHelpersContext");
const _NavigationMetaContext = require("./NavigationMetaContext");
const _NavigationStateContext = require("./NavigationStateContext");
const _NavigatorTypeContext = require("./NavigatorTypeContext");
const _RootNavigationStateContext = require("./RootNavigationStateContext");
const _Screen = require("./Screen");
const _isArrayEqual = require("./isArrayEqual");
const _types = require("./types");
const _useChildListeners = require("./useChildListeners");
const _useClientLayoutEffect = require("./useClientLayoutEffect");
const _useCurrentRender = require("./useCurrentRender");
const _useDescriptors = require("./useDescriptors");
const _useEventEmitter = require("./useEventEmitter");
const _useFocusEvents = require("./useFocusEvents");
const _useFocusedListenersChildrenAdapter = require("./useFocusedListenersChildrenAdapter");
const _useIsFocused = require("./useIsFocused");
const _useLazyValue = require("./useLazyValue");
const _useNavigationHelpers = require("./useNavigationHelpers");
const _useNavigationState = require("./useNavigationState");
const _useRegisterNavigator = require("./useRegisterNavigator");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
// This is to make TypeScript compiler happy
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
_types.PrivateValueStore;
const isScreen = (child)=>{
    return child.type === _Screen.Screen;
};
const isGroup = (child)=>{
    return child.type === _react().Fragment || child.type === _Group.Group;
};
/**
 * Extract route config object from React children elements.
 *
 * @param children React Elements to extract the config from.
 */ const getRouteConfigsFromChildren = (children, groupOptions, groupLayout)=>{
    const configs = _react().Children.toArray(children).reduce((acc, child)=>{
        if (/*#__PURE__*/ _react().isValidElement(child)) {
            if (isScreen(child)) {
                // We can only extract the config from `Screen` elements
                // If something else was rendered, it's probably a bug
                if (typeof child.props !== 'object' || child.props === null) {
                    throw new Error(`Got an invalid element for screen.`);
                }
                if (typeof child.props.name !== 'string' || child.props.name === '') {
                    throw new Error(`Got an invalid name (${JSON.stringify(child.props.name)}) for the screen. It must be a non-empty string.`);
                }
                acc.push({
                    options: groupOptions,
                    layout: groupLayout,
                    props: child.props
                });
                return acc;
            }
            if (isGroup(child)) {
                // When we encounter a fragment or group, we need to dive into its children to extract the configs
                // This is handy to conditionally define a group of screens
                acc.push(...getRouteConfigsFromChildren(child.props.children, // FIXME
                // @ts-expect-error: add validation
                child.type !== _Group.Group ? groupOptions : groupOptions != null ? [
                    ...groupOptions,
                    child.props.screenOptions
                ] : [
                    child.props.screenOptions
                ], typeof child.props.screenLayout === 'function' ? child.props.screenLayout : groupLayout));
                return acc;
            }
        }
        throw new Error(`A navigator can only contain 'Screen', 'Group' or 'React.Fragment' as its direct children (found ${/*#__PURE__*/ _react().isValidElement(child) ? `'${typeof child.type === 'string' ? child.type : child.type?.name}'${child.props != null && typeof child.props === 'object' && 'name' in child.props && child.props?.name ? ` for the screen '${child.props.name}'` : ''}` : typeof child === 'object' ? JSON.stringify(child) : `'${String(child)}'`}). To render this component in the navigator, pass it in the 'component' prop to 'Screen'.`);
    }, []);
    if (process.env.NODE_ENV !== 'production') {
        configs.forEach((config)=>{
            const { name, children, component, getComponent } = config.props;
            if (children != null || component !== undefined || getComponent !== undefined) {
                if (children != null && component !== undefined) {
                    throw new Error(`Got both 'component' and 'children' props for the screen '${name}'. You must pass only one of them.`);
                }
                if (children != null && getComponent !== undefined) {
                    throw new Error(`Got both 'getComponent' and 'children' props for the screen '${name}'. You must pass only one of them.`);
                }
                if (component !== undefined && getComponent !== undefined) {
                    throw new Error(`Got both 'component' and 'getComponent' props for the screen '${name}'. You must pass only one of them.`);
                }
                if (children != null && typeof children !== 'function') {
                    throw new Error(`Got an invalid value for 'children' prop for the screen '${name}'. It must be a function returning a React Element.`);
                }
                if (component !== undefined && !(0, _reactis().isValidElementType)(component)) {
                    throw new Error(`Got an invalid value for 'component' prop for the screen '${name}'. It must be a valid React Component.`);
                }
                if (getComponent !== undefined && typeof getComponent !== 'function') {
                    throw new Error(`Got an invalid value for 'getComponent' prop for the screen '${name}'. It must be a function returning a React Component.`);
                }
                if (typeof component === 'function') {
                    if (component.name === 'component') {
                        // Inline anonymous functions passed in the `component` prop will have the name of the prop
                        // It's relatively safe to assume that it's not a component since it should also have PascalCase name
                        // We won't catch all scenarios here, but this should catch a good chunk of incorrect use.
                        console.warn(`Looks like you're passing an inline function for 'component' prop for the screen '${name}' (e.g. component={() => <SomeComponent />}). Passing an inline function will cause the component state to be lost on re-render and cause perf issues since it's re-created every render. You can pass the function as children to 'Screen' instead to achieve the desired behaviour.`);
                    } else if (/^[a-z]/.test(component.name)) {
                        console.warn(`Got a component with the name '${component.name}' for the screen '${name}'. React Components must start with an uppercase letter. If you're passing a regular function and not a component, pass it as children to 'Screen' instead. Otherwise capitalize your component's name.`);
                    }
                }
            } else {
                throw new Error(`Couldn't find a 'component', 'getComponent' or 'children' prop for the screen '${name}'. This can happen if you passed 'undefined'. You likely forgot to export your component from the file it's defined in, or mixed up default import and named import when importing.`);
            }
        });
    }
    return configs;
};
function useNavigationBuilder(createRouter, options, { activityDefaultThreshold = 1 } = {}) {
    (0, _useRegisterNavigator.useRegisterNavigator)();
    const routeNode = (0, _Route.useRouteNode)();
    const enqueue = (0, _routingQueueContext.useEnqueueRoutingIntent)();
    const { children, activityEnabled, layout, screenOptions, screenLayout, screenListeners, UNSTABLE_router, ...rest } = options;
    const routeConfigs = getRouteConfigsFromChildren(children);
    const router = (0, _useLazyValue.useLazyValue)(()=>{
        if (rest.initialRouteName != null && routeConfigs.every((config)=>config.props.name !== rest.initialRouteName)) {
            throw new Error(`Couldn't find a screen named '${rest.initialRouteName}' to use as 'initialRouteName'.`);
        }
        const original = createRouter(rest);
        if (UNSTABLE_router != null) {
            const overrides = UNSTABLE_router(original);
            // TODO(@ubax): Remove the UNSTABLE_router prop
            return {
                ...original,
                ...overrides
            };
        }
        return original;
    });
    const screens = routeConfigs.reduce((acc, config)=>{
        if (config.props.name in acc) {
            throw new Error(`A navigator cannot contain multiple 'Screen' components with the same name (found duplicate screen named '${config.props.name}')`);
        }
        acc[config.props.name] = config;
        return acc;
    }, {});
    const routeNames = routeConfigs.map((config)=>config.props.name);
    const routeGetIdList = routeNames.reduce((acc, curr)=>Object.assign(acc, {
            [curr]: screens[curr].props.getId
        }), {});
    if (!routeNames.length) {
        throw new Error("Couldn't find any screens for the navigator. Have you defined any screens as its children?");
    }
    // Track screen-list changes without recalculating state when only the array identity changes.
    const routeNamesKey = routeNames.join('\0');
    const { state: currentState } = (0, _react().use)(_NavigationStateContext.NavigationStateContext);
    const rootState = (0, _react().use)(_RootNavigationStateContext.RootNavigationStateContext);
    const { resetNavigator, handleAction } = (0, _react().use)(_NavigationBuilderContext.NavigationBuilderContext);
    if (currentState === undefined || currentState.stale !== false || typeof currentState.key !== 'string' || !Array.isArray(currentState.routeNames)) {
        throw new Error('A navigator received a missing, partial, or incompatible navigation state. Navigation state is created globally now, so the container must provide a complete seeded state for every mounted navigator.');
    }
    const treeState = rootState ? (0, _stateUtils.findStateByKey)(rootState, currentState.key) ?? currentState : currentState;
    const isForeignType = treeState.type !== undefined && treeState.type !== router.type;
    // The reset keeps the complete fields required by every navigator state.
    const committedState = isForeignType ? (0, _stateUtils.resetNavigatorState)(treeState, router.type) : treeState;
    const state = _react().useMemo(()=>{
        const declaredState = router.getStateForDeclaredRoutes(committedState, routeNames);
        // The seeded state cannot know the order declared by mounted screens yet.
        return (0, _isArrayEqual.isArrayEqual)(declaredState.routeNames, routeNames) ? declaredState : {
            ...declaredState,
            routeNames
        };
    }, [
        committedState,
        routeNamesKey,
        router
    ]);
    const reduce = (0, _useLatestCallback.default)((registryState, action)=>// The registry stores states from different router types; this entry only receives its own state key.
        router.getStateForAction(registryState, action, {
            routeNames,
            routeGetIdList
        }));
    const emitter = (0, _useEventEmitter.useEventEmitter)((e)=>{
        const routeNames = [];
        let route;
        let isPlaceholder = false;
        if (e.target) {
            route = state.routes.find((route)=>route.key === e.target);
            const config = screens[e.target];
            if (!route && config) {
                route = {
                    key: e.target,
                    name: e.target
                };
                isPlaceholder = true;
            }
            if (route?.name) {
                routeNames.push(route.name);
            }
        } else {
            route = state.routes[state.index];
            routeNames.push(...Object.keys(screens).filter((name)=>route?.name === name));
        }
        if (route == null) {
            return;
        }
        const descriptor = isPlaceholder ? describe({
            ...route,
            key: undefined
        }) : descriptors[route.key];
        const navigation = descriptor.navigation;
        const listeners = [].concat(// Get an array of listeners for all screens + common listeners on navigator
        ...[
            screenListeners,
            ...routeNames.map((name)=>{
                const { listeners } = screens[name].props;
                return listeners;
            })
        ].map((listeners)=>{
            const map = typeof listeners === 'function' ? listeners({
                route: route,
                navigation
            }) : listeners;
            return map ? Object.keys(map).filter((type)=>type === e.type).map((type)=>map?.[type]) : undefined;
        }))// We don't want same listener to be called multiple times for same event
        // So we remove any duplicate functions from the array
        .filter((cb, i, self)=>cb && self.lastIndexOf(cb) === i);
        listeners.forEach((listener)=>listener?.(e));
    });
    (0, _useFocusEvents.useFocusEvents)({
        state,
        emitter
    });
    const { listeners: childListeners, addListener } = (0, _useChildListeners.useChildListeners)();
    // TODO(@ubax): Check whether this ref can be safely removed.
    const onAction = (0, _useLatestCallback.default)((action)=>handleAction(action, committedState.key));
    const registryEntry = _react().useMemo(()=>({
            reduce,
            shouldActionChangeFocus: router.shouldActionChangeFocus,
            getStateForRouteFocus: (registryState, routeKey)=>router.getStateForRouteFocus(registryState, routeKey),
            getBrowserHistoryForRouteFocus: (previous, next, childAction)=>router.getBrowserHistoryForRouteFocus?.(previous, next, childAction),
            routeNode: routeNode ?? undefined
        }), [
        reduce,
        routeNode,
        router
    ]);
    (0, _routerRegistry.useRegisterRouter)(committedState.key, registryEntry);
    (0, _useClientLayoutEffect.useClientLayoutEffect)(()=>{
        if (isForeignType) {
            resetNavigator(committedState.key, router.type);
        }
    });
    const pendingRouteNamesRef = _react().useRef(undefined);
    (0, _useClientLayoutEffect.useClientLayoutEffect)(()=>{
        // Wait for the type reset to commit so route-name changes use the mounting router's registry entry.
        if (isForeignType) {
            return;
        }
        const committed = committedState;
        if ((0, _isArrayEqual.isArrayEqual)(committed.routeNames, routeNames)) {
            pendingRouteNamesRef.current = undefined;
        } else if (!(0, _isArrayEqual.isArrayEqual)(pendingRouteNamesRef.current ?? [], routeNames)) {
            pendingRouteNamesRef.current = routeNames;
            enqueue({
                type: 'ACTION',
                payload: {
                    action: {
                        type: 'ROUTE_NAMES_CHANGED',
                        payload: {
                            routeNames
                        },
                        target: committed.key
                    },
                    originKey: committed.key
                }
            });
        }
    });
    const navigation = (0, _useNavigationHelpers.useNavigationHelpers)({
        id: options.id,
        handleAction: onAction,
        state: committedState,
        emitter,
        router
    });
    // Declared after `useNavigationHelpers` so that `navigation.getState()` already
    // returns the new state when `state` listeners run.
    _react().useEffect(()=>{
        emitter.emit({
            type: 'state',
            data: {
                state
            }
        });
    }, [
        emitter,
        state
    ]);
    (0, _useFocusedListenersChildrenAdapter.useFocusedListenersChildrenAdapter)({
        navigation,
        focusedListeners: childListeners.focus
    });
    const { describe, descriptors } = (0, _useDescriptors.useDescriptors)({
        routes: state.routes,
        routeNames: state.routeNames,
        screens,
        activityEnabled,
        activityDefaultThreshold,
        navigation,
        screenOptions,
        screenLayout,
        state: committedState,
        addListener,
        router,
        emitter
    });
    (0, _useCurrentRender.useCurrentRender)({
        state,
        descriptors
    });
    const NavigationContent = (0, _useComponent.useComponent)((children)=>{
        const element = layout != null ? layout({
            state,
            descriptors,
            navigation,
            children
        }) : children;
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(_NavigationMetaContext.NavigationMetaContext.Provider, {
            value: undefined,
            children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_NavigationHelpersContext.NavigationHelpersContext.Provider, {
                value: navigation,
                children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_useNavigationState.NavigatorStateContext.Provider, {
                    value: state,
                    children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_useIsFocused.FocusedRouteKeyContext.Provider, {
                        value: state.routes[state.index]?.key,
                        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_NavigatorTypeContext.NavigatorTypeContext.Provider, {
                            value: router.type,
                            children: element
                        })
                    })
                })
            })
        });
    });
    return {
        state,
        navigation,
        describe,
        descriptors,
        NavigationContent
    };
}

//# sourceMappingURL=useNavigationBuilder.js.map
