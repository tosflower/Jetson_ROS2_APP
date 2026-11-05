"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    TabActions: null,
    TabRouter: null,
    ensureStateHistory: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get TabActions () {
        return TabActions;
    },
    get TabRouter () {
        return TabRouter;
    },
    get ensureStateHistory () {
        return ensureStateHistory;
    }
});
function _reactfastcompare() {
    const data = /*#__PURE__*/ _interop_require_default(require("react-fast-compare"));
    _reactfastcompare = function() {
        return data;
    };
    return data;
}
const _isArrayEqual = require("../core/isArrayEqual");
const _BaseRouter = require("./BaseRouter");
const _attachRouteState = require("./attachRouteState");
const _createRouteFromAction = require("./createRouteFromAction");
const _extendRouter = require("./extendRouter");
const _getBrowserHistoryForHistoryChange = require("./getBrowserHistoryForHistoryChange");
const _types = require("./types");
const _utils = require("./utils");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const TYPE_ROUTE = 'route';
function clearFocusedPreloadedRoute(state) {
    const route = state.routes[state.index];
    if (!route?.isPreloaded) {
        return state;
    }
    const { isPreloaded, ...focusedRoute } = route;
    const routes = [
        ...state.routes
    ];
    // Removing an optional field preserves the route's conditional params type, which TypeScript
    // cannot infer through the `Route` intersection.
    routes[state.index] = focusedRoute;
    return {
        ...state,
        routes
    };
}
// A route that `getId` re-keys is a new route instance, so it must not keep the nested navigator
// state of the previous ID.
function withoutStaleState(route, key) {
    if (key === route.key) {
        return route;
    }
    const { state, ...routeWithoutState } = route;
    return routeWithoutState;
}
const addFallbackRouteIfEmpty = (routes, routeNames, initialRouteName, mintRouteKey)=>{
    if (routes.length > 0 || routeNames.length === 0) {
        return routes;
    }
    const name = initialRouteName !== undefined && routeNames.includes(initialRouteName) ? initialRouteName : routeNames[0];
    return [
        {
            name,
            key: mintRouteKey(name)
        }
    ];
};
const addRouteIfMissing = (routes, name, createRoute)=>{
    const existingIndex = routes.findIndex((route)=>route.name === name);
    if (existingIndex !== -1) {
        return {
            routes,
            index: existingIndex
        };
    }
    return {
        routes: [
            ...routes,
            createRoute()
        ],
        index: routes.length
    };
};
const TabActions = {
    jumpTo (name, params) {
        return {
            type: 'JUMP_TO',
            payload: {
                name,
                params
            }
        };
    },
    replace (name, params) {
        return {
            type: 'REPLACE',
            payload: {
                name,
                params
            }
        };
    }
};
const getRouteHistory = (routes, index, backBehavior, initialRouteName)=>{
    if (routes.length === 0) {
        return [];
    }
    const history = [
        {
            type: TYPE_ROUTE,
            key: routes[index].key
        }
    ];
    let initialRouteIndex;
    switch(backBehavior){
        case 'order':
            for(let i = index; i > 0; i--){
                history.unshift({
                    type: TYPE_ROUTE,
                    key: routes[i - 1].key
                });
            }
            break;
        case 'firstRoute':
            if (index !== 0) {
                history.unshift({
                    type: TYPE_ROUTE,
                    key: routes[0].key
                });
            }
            break;
        case 'initialRoute':
            initialRouteIndex = routes.findIndex((route)=>route.name === initialRouteName);
            initialRouteIndex = initialRouteIndex === -1 ? 0 : initialRouteIndex;
            if (index !== initialRouteIndex) {
                history.unshift({
                    type: TYPE_ROUTE,
                    key: routes[initialRouteIndex].key
                });
            }
            break;
        case 'history':
        case 'fullHistory':
            break;
    }
    return history;
};
// Unvisited tabs use the same placeholder keys as their descriptors until navigation creates a route.
const getHistoryRoutes = (routes, routeNames)=>routeNames.map((name)=>routes.find((route)=>route.name === name) ?? {
            name,
            key: name
        });
const ensureStateHistory = (state, backBehavior, initialRouteName)=>{
    if (state.history != null) {
        // The null check narrows the optional property, but TypeScript doesn't narrow the object type.
        return state;
    }
    const routes = getHistoryRoutes(state.routes, state.routeNames);
    const focusedRoute = state.routes[state.index];
    const index = routes.findIndex((route)=>route.key === focusedRoute?.key);
    // The declared routes can omit the focused route, so it can be missing from
    // `routes`. Keep it in history anyway, so the current route is always the last entry.
    const history = index === -1 ? focusedRoute === undefined ? [] : [
        {
            type: TYPE_ROUTE,
            key: focusedRoute.key
        }
    ] : getRouteHistory(routes, index, backBehavior, initialRouteName);
    if (backBehavior === 'fullHistory' && focusedRoute !== undefined) {
        history[history.length - 1] = {
            ...history[history.length - 1],
            params: focusedRoute.params
        };
    }
    return {
        ...state,
        history
    };
};
const changeIndex = (state, index, backBehavior, initialRouteName)=>{
    if (state.routes.length === 0) {
        return {
            ...state,
            index: -1,
            history: []
        };
    }
    let history = state.history;
    if (backBehavior === 'history' || backBehavior === 'fullHistory') {
        const currentRoute = state.routes[index];
        if (backBehavior === 'history') {
            // Remove the existing key from the history to de-duplicate it
            history = history.filter((it)=>it.type === 'route' ? it.key !== currentRoute.key : false);
        } else if (backBehavior === 'fullHistory') {
            const lastHistoryRouteItemIndex = history.findLastIndex((item)=>item.type === 'route');
            if (currentRoute.key === history[lastHistoryRouteItemIndex]?.key) {
                // For full-history, only remove if it matches the last route
                // Useful for drawer, if current route was in history, then drawer state changed
                // Then we only need to move the route to the front
                history = [
                    ...history.slice(0, lastHistoryRouteItemIndex),
                    ...history.slice(lastHistoryRouteItemIndex + 1)
                ];
            }
        }
        history = history.concat({
            type: TYPE_ROUTE,
            key: currentRoute.key,
            params: backBehavior === 'fullHistory' ? currentRoute.params : undefined
        });
    } else {
        const routes = getHistoryRoutes(state.routes, state.routeNames);
        const orderedIndex = routes.findIndex((route)=>route.key === state.routes[index].key);
        history = getRouteHistory(routes, orderedIndex, backBehavior, initialRouteName);
    }
    return {
        ...state,
        index,
        history
    };
};
function tabRouterExtension({ baseRouter, nextKey, options: { initialRouteName, backBehavior = 'firstRoute' } }) {
    const normalizeHistory = (state)=>{
        if (backBehavior === 'history' || backBehavior === 'fullHistory') {
            return ensureStateHistory(state, backBehavior, initialRouteName);
        }
        const normalized = ensureStateHistory({
            ...state,
            history: undefined
        }, backBehavior, initialRouteName);
        const history = [
            ...normalized.history,
            ...state.history?.filter((item)=>item.type !== 'route') ?? []
        ];
        return (0, _reactfastcompare().default)(history, state.history) ? state : {
            ...state,
            history
        };
    };
    const getBrowserHistoryForAction = (previous, next, action)=>{
        switch(action.type){
            case 'PUSH':
            case 'NAVIGATE':
            case 'JUMP_TO':
                // Selecting another tab is a new browser visit even if tab history removes a duplicate.
                // For example, Home -> Search -> Home still needs three browser entries.
                if ((backBehavior === 'history' || backBehavior === 'fullHistory') && previous.routes[previous.index]?.key !== next.routes[next.index]?.key) {
                    return {
                        type: 'push'
                    };
                }
                break;
            case 'GO_BACK':
                break;
            default:
                return undefined;
        }
        // URL-derived state may have no history yet. Action/focus handling already fills in `next`.
        // Reconstruct `previous` too, so that initialization is not counted as a new browser visit.
        return (0, _getBrowserHistoryForHistoryChange.getBrowserHistoryForHistoryChange)(ensureStateHistory(previous, backBehavior, initialRouteName), next);
    };
    // TODO: Simplify the action handling in this router.
    const router = {
        normalizeState: clearFocusedPreloadedRoute,
        getStateForDeclaredRoutes (state, routeNames) {
            const declared = baseRouter.getStateForDeclaredRoutes(state, routeNames);
            if (declared.history != null && (0, _isArrayEqual.isArrayEqual)(declared.routeNames, routeNames)) {
                return declared;
            }
            return normalizeHistory((0, _isArrayEqual.isArrayEqual)(declared.routeNames, routeNames) ? declared : {
                ...declared,
                routeNames
            });
        },
        getBrowserHistoryForAction,
        getBrowserHistoryForRouteFocus: (previous, next)=>getBrowserHistoryForAction(previous, next, {
                type: 'JUMP_TO'
            }),
        getStateForRouteFocus (inputState, key) {
            const state = ensureStateHistory(inputState, backBehavior, initialRouteName);
            const index = state.routes.findIndex((r)=>r.key === key);
            if (index === -1 || index === state.index) {
                return state;
            }
            return changeIndex(state, index, backBehavior, initialRouteName);
        },
        getStateForAction (inputState, action, options) {
            const { routeGetIdList } = options;
            const state = ensureStateHistory(inputState, backBehavior, initialRouteName);
            if (action.target && action.target !== state.key) {
                return _types.RouterActionHandling.Unhandled;
            }
            switch(action.type){
                case 'ROUTE_NAMES_CHANGED':
                    {
                        const routeNames = action.payload.routeNames;
                        if ((0, _isArrayEqual.isArrayEqual)(state.routeNames, routeNames)) {
                            return {
                                state: normalizeHistory(state),
                                affectedRouteKey: state.routes[state.index]?.key
                            };
                        }
                        const routes = addFallbackRouteIfEmpty(state.routes.filter((route)=>routeNames.includes(route.name)), routeNames, initialRouteName, nextKey);
                        if (routes.length === 0) {
                            return {
                                state: {
                                    ...state,
                                    routeNames,
                                    routes,
                                    index: -1,
                                    history: []
                                },
                                affectedRouteKey: undefined
                            };
                        }
                        const focusedKey = state.routes[state.index]?.key;
                        const focusedIndex = routes.findIndex((route)=>route.key === focusedKey);
                        const index = Math.max(focusedIndex, 0);
                        const routeKeys = routes.map((route)=>route.key);
                        let history = state.history.filter((item)=>item.type !== 'route' || routeKeys.includes(item.key));
                        if (focusedIndex === -1 && (backBehavior === 'history' || backBehavior === 'fullHistory')) {
                            const currentRoute = routes[index];
                            const nonRouteHistory = history.filter((item)=>item.type !== 'route');
                            let routeHistory = history.filter((item)=>item.type === 'route');
                            if (backBehavior === 'history') {
                                routeHistory = routeHistory.filter((item)=>item.key !== currentRoute.key);
                            } else if (routeHistory[routeHistory.length - 1]?.key === currentRoute.key) {
                                routeHistory = routeHistory.slice(0, -1);
                            }
                            history = [
                                ...routeHistory,
                                {
                                    type: TYPE_ROUTE,
                                    key: currentRoute.key,
                                    params: backBehavior === 'fullHistory' ? currentRoute.params : undefined
                                },
                                ...nonRouteHistory
                            ];
                        }
                        if (backBehavior === 'firstRoute' || backBehavior === 'initialRoute' || backBehavior === 'order') {
                            const orderedRoutes = getHistoryRoutes(routes, routeNames);
                            const orderedIndex = orderedRoutes.findIndex((route)=>route.key === routes[index].key);
                            history = [
                                ...getRouteHistory(orderedRoutes, orderedIndex, backBehavior, initialRouteName),
                                ...history.filter((item)=>item.type !== 'route')
                            ];
                        } else if (!history.some((item)=>item.type === 'route')) {
                            history = [
                                ...getRouteHistory(routes, index, backBehavior, initialRouteName),
                                ...history.filter((item)=>item.type !== 'route')
                            ];
                        }
                        return {
                            state: normalizeHistory({
                                ...state,
                                history,
                                routeNames,
                                routes,
                                index
                            }),
                            affectedRouteKey: routes[index].key
                        };
                    }
                case 'PUSH':
                case 'REPLACE':
                case 'JUMP_TO':
                case 'NAVIGATE':
                    {
                        if (!state.routeNames.includes(action.payload.name)) {
                            return _types.RouterActionHandling.Unhandled;
                        }
                        const { routes, index } = addRouteIfMissing(state.routes, action.payload.name, ()=>{
                            const route = (0, _createRouteFromAction.createRouteFromAction)({
                                action,
                                key: nextKey(action.payload.name)
                            });
                            return action.type === 'NAVIGATE' && action.payload.path != null ? {
                                ...route,
                                path: action.payload.path
                            } : route;
                        });
                        const updatedState = changeIndex({
                            ...state,
                            routes: routes.map((route)=>{
                                if (route.name !== action.payload.name) {
                                    return route;
                                }
                                const getId = routeGetIdList[route.name];
                                const currentId = getId?.({
                                    params: route.params
                                });
                                const nextId = getId?.({
                                    params: action.payload.params
                                });
                                // TODO(@ubax): Rewrite `history` when `getId` re-keys a route, as `PRELOAD` does with `replacedKey`.
                                const key = currentId === nextId ? route.key : nextKey(route.name);
                                let params;
                                if (action.type === 'NAVIGATE' && action.payload.merge && currentId === nextId) {
                                    params = action.payload.params !== undefined ? {
                                        ...route.params,
                                        ...action.payload.params
                                    } : route.params;
                                } else {
                                    params = action.payload.params;
                                }
                                const path = action.type === 'NAVIGATE' && action.payload.path != null ? action.payload.path : route.path;
                                const updatedRoute = params !== route.params || path !== route.path ? {
                                    ...withoutStaleState(route, key),
                                    key,
                                    path,
                                    params
                                } : route;
                                return (0, _attachRouteState.attachRouteState)(updatedRoute, action);
                            })
                        }, index, backBehavior, initialRouteName);
                        const result = action.type === 'REPLACE' ? removeReplacedRouteFromHistory(state, updatedState) : updatedState;
                        return {
                            state: result,
                            affectedRouteKey: result.routes[result.index]?.key
                        };
                    }
                case 'SET_PARAMS':
                case 'REPLACE_PARAMS':
                    {
                        const actionResult = baseRouter.getStateForAction(state, action, options);
                        if ((0, _utils.isActionHandled)(actionResult)) {
                            const nextState = actionResult.state;
                            const index = nextState.index;
                            if (index != null) {
                                const focusedRoute = nextState.routes[index];
                                const historyItemIndex = state.history.findLastIndex((item)=>item.key === focusedRoute.key);
                                let updatedHistory = state.history;
                                if (historyItemIndex !== -1) {
                                    updatedHistory = [
                                        ...state.history
                                    ];
                                    updatedHistory[historyItemIndex] = {
                                        ...updatedHistory[historyItemIndex],
                                        params: focusedRoute.params
                                    };
                                }
                                return {
                                    ...actionResult,
                                    state: {
                                        ...nextState,
                                        history: updatedHistory
                                    }
                                };
                            }
                        }
                        return actionResult;
                    }
                case 'GO_BACK':
                    {
                        if (backBehavior === 'none') {
                            return _types.RouterActionHandling.Unhandled;
                        }
                        const focusedRoute = state.routes[state.index];
                        if (!focusedRoute) {
                            return _types.RouterActionHandling.Unhandled;
                        }
                        let backTargetName;
                        if (backBehavior === 'firstRoute') {
                            backTargetName = state.routeNames[0];
                        } else if (backBehavior === 'initialRoute') {
                            backTargetName = initialRouteName !== undefined && state.routeNames.includes(initialRouteName) ? initialRouteName : state.routeNames[0];
                        } else if (backBehavior === 'order') {
                            const declaredIndex = state.routeNames.indexOf(focusedRoute.name);
                            backTargetName = declaredIndex > 0 ? state.routeNames[declaredIndex - 1] : undefined;
                        }
                        if (backTargetName !== undefined && backTargetName !== focusedRoute.name) {
                            const { routes, index } = addRouteIfMissing(state.routes, backTargetName, ()=>({
                                    name: backTargetName,
                                    key: nextKey(backTargetName)
                                }));
                            if (routes !== state.routes) {
                                const result = changeIndex({
                                    ...state,
                                    routes
                                }, index, backBehavior, initialRouteName);
                                return {
                                    state: result,
                                    affectedRouteKey: result.routes[result.index]?.key
                                };
                            }
                        }
                        if (state.history.length === 1) {
                            return _types.RouterActionHandling.Unhandled;
                        }
                        const previousHistoryItem = state.history[state.history.length - 2];
                        const previousKey = previousHistoryItem?.key;
                        const index = state.routes.findLastIndex((route)=>route.key === previousKey);
                        if (index === -1) {
                            return _types.RouterActionHandling.Unhandled;
                        }
                        let routes = state.routes;
                        if (backBehavior === 'fullHistory' && routes[index].params !== previousHistoryItem.params) {
                            routes = [
                                ...state.routes
                            ];
                            routes[index] = {
                                ...routes[index],
                                params: previousHistoryItem.params
                            };
                        }
                        return {
                            state: {
                                ...state,
                                routes,
                                history: state.history.slice(0, -1),
                                index
                            },
                            affectedRouteKey: routes[index].key
                        };
                    }
                case 'PRELOAD':
                    {
                        if (!state.routeNames.includes(action.payload.name)) {
                            return _types.RouterActionHandling.Unhandled;
                        }
                        const routeIndex = state.routes.findIndex((route)=>route.name === action.payload.name);
                        let affectedRouteKey;
                        let replacedKey;
                        let routes;
                        if (routeIndex === -1) {
                            const route = (0, _attachRouteState.attachRouteState)({
                                ...(0, _createRouteFromAction.createRouteFromAction)({
                                    action,
                                    key: nextKey(action.payload.name)
                                }),
                                isPreloaded: true
                            }, action);
                            routes = [
                                ...state.routes,
                                route
                            ];
                            affectedRouteKey = route.key;
                        } else {
                            const route = state.routes[routeIndex];
                            const getId = routeGetIdList[route.name];
                            const currentId = getId?.({
                                params: route.params
                            });
                            const nextId = getId?.({
                                params: action.payload.params
                            });
                            const key = currentId === nextId ? route.key : nextKey(route.name);
                            const params = action.payload.params;
                            const newRoute = (0, _attachRouteState.attachRouteState)(params !== route.params ? {
                                ...withoutStaleState(route, key),
                                key,
                                params,
                                ...key !== route.key && {
                                    isPreloaded: true
                                }
                            } : route, action);
                            replacedKey = key === route.key ? undefined : route.key;
                            routes = state.routes.map((route, index)=>index === routeIndex ? newRoute : route);
                            affectedRouteKey = newRoute.key;
                        }
                        let history = state.history;
                        if (backBehavior === 'history' || backBehavior === 'fullHistory') {
                            if (replacedKey !== undefined) {
                                // Re-key in place, so the focused route stays the last history entry for `goBack`.
                                // Only the newest entry takes the new params - `fullHistory` keeps duplicate entries
                                // and each older one still holds the params of its own visit.
                                const newRoute = routes[routeIndex];
                                const newestIndex = history.findLastIndex((record)=>record.type === TYPE_ROUTE && record.key === replacedKey);
                                history = history.map((record, index)=>record.type === TYPE_ROUTE && record.key === replacedKey ? {
                                        ...record,
                                        key: newRoute.key,
                                        params: backBehavior === 'fullHistory' && index === newestIndex ? newRoute.params : record.params
                                    } : record);
                            }
                        } else {
                            const orderedRoutes = getHistoryRoutes(routes, state.routeNames);
                            const focusedKey = routes[state.index]?.key;
                            const focusedIndex = orderedRoutes.findIndex((route)=>route.key === focusedKey);
                            const routeHistory = focusedIndex === -1 ? [] : getRouteHistory(orderedRoutes, focusedIndex, backBehavior, initialRouteName);
                            // TODO: Refactor history handling together with web state synchronization.
                            history = [
                                ...routeHistory,
                                ...history.filter((item)=>item.type !== 'route')
                            ];
                        }
                        return {
                            state: {
                                ...state,
                                routes,
                                history
                            },
                            affectedRouteKey
                        };
                    }
                default:
                    {
                        const result = baseRouter.getStateForAction(state, action, options);
                        if (!(0, _utils.isActionHandled)(result)) {
                            return result;
                        }
                        return {
                            ...result,
                            state: ensureStateHistory(result.state, backBehavior, initialRouteName)
                        };
                    }
            }
        },
        actionCreators: TabActions
    };
    return router;
}
const TabRouter = (0, _extendRouter.extendRouter)(_BaseRouter.BaseRouter, tabRouterExtension, {
    type: 'tab'
});
function removeReplacedRouteFromHistory(previousState, nextState) {
    const replacedRouteKey = previousState.routes[previousState.index]?.key;
    const focusedRouteKey = nextState.routes[nextState.index]?.key;
    if (!replacedRouteKey || replacedRouteKey === focusedRouteKey) {
        return nextState;
    }
    const replacedIndex = nextState.history.findLastIndex((item)=>item.key === replacedRouteKey);
    if (replacedIndex === -1) {
        return nextState;
    }
    return {
        ...nextState,
        history: nextState.history.filter((_, index)=>index !== replacedIndex)
    };
}

//# sourceMappingURL=TabRouter.js.map
