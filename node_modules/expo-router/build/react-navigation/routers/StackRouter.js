"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    StackActions: null,
    StackRouter: null,
    getStackBrowserHistoryAction: null,
    getStackRoutes: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get StackActions () {
        return StackActions;
    },
    get StackRouter () {
        return StackRouter;
    },
    get getStackBrowserHistoryAction () {
        return getStackBrowserHistoryAction;
    },
    get getStackRoutes () {
        return getStackRoutes;
    }
});
const _isArrayEqual = require("../core/isArrayEqual");
const _BaseRouter = require("./BaseRouter");
const _attachRouteState = require("./attachRouteState");
const _createRouteFromAction = require("./createRouteFromAction");
const _extendRouter = require("./extendRouter");
const _types = require("./types");
function getStackRoutes(state) {
    return {
        activeRoutes: state.routes.slice(0, state.index + 1),
        preloadedRoutes: state.routes.slice(state.index + 1)
    };
}
function markPreloadedRoutes(state) {
    let changed = false;
    const routes = state.routes.map((route, index)=>{
        if (index > state.index) {
            if (route.isPreloaded) {
                return route;
            }
            changed = true;
            return {
                ...route,
                isPreloaded: true
            };
        }
        if (route.isPreloaded) {
            changed = true;
            const { isPreloaded, ...activeRoute } = route;
            return activeRoute;
        }
        return route;
    });
    return changed ? {
        ...state,
        routes
    } : state;
}
function reconcileStackRoutes(state, activeRoutes, preloadedRoutes = getStackRoutes(state).preloadedRoutes) {
    const activeKeys = new Set(activeRoutes.map((route)=>route.key));
    return {
        ...state,
        index: activeRoutes.length - 1,
        routes: activeRoutes.concat(preloadedRoutes.filter((route)=>!activeKeys.has(route.key)))
    };
}
function getStackBrowserHistoryAction(previous, next, action) {
    switch(action.type){
        case 'NAVIGATE':
            {
                // Moving a singular route to the top is a new visit even when filtering keeps
                // the stack the same size. NAVIGATE(pop) is an explicit traversal instead.
                const isPop = action.payload && 'pop' in action.payload && action.payload.pop;
                if (!isPop) {
                    return next.routes[next.index]?.key !== previous.routes[previous.index]?.key ? {
                        type: 'push'
                    } : undefined;
                }
                break;
            }
    }
    const delta = next.index - previous.index;
    if (delta > 0) {
        return {
            type: 'push'
        };
    }
    if (delta < 0) {
        return {
            type: 'pop',
            count: -delta,
            target: {
                navigatorKey: next.key,
                routeKey: next.routes[next.index].key
            }
        };
    }
    return undefined;
}
const StackActions = {
    replace (name, params) {
        return {
            type: 'REPLACE',
            payload: {
                name,
                params
            }
        };
    },
    push (name, params) {
        return {
            type: 'PUSH',
            payload: {
                name,
                params
            }
        };
    },
    pop (count = 1) {
        return {
            type: 'POP',
            payload: {
                count
            }
        };
    },
    popToTop () {
        return {
            type: 'POP_TO_TOP'
        };
    },
    popTo (name, params, options) {
        if (typeof options === 'boolean') {
            console.warn(`Passing a boolean as the third argument to 'popTo' is deprecated. Pass '{ merge: true }' instead.`);
        }
        return {
            type: 'POP_TO',
            payload: {
                name,
                params,
                merge: typeof options === 'boolean' ? options : options?.merge
            }
        };
    }
};
function stackRouterExtension({ baseRouter, nextKey, options: { initialRouteName } }) {
    const router = {
        normalizeState: markPreloadedRoutes,
        getBrowserHistoryForAction: getStackBrowserHistoryAction,
        getBrowserHistoryForRouteFocus (previous, next) {
            return getStackBrowserHistoryAction(previous, next, {
                type: 'POP'
            });
        },
        getStateForDeclaredRoutes (state, routeNames) {
            const filteredState = baseRouter.getStateForDeclaredRoutes(state, routeNames);
            if (filteredState === state || filteredState.routes.length === 0) {
                return filteredState;
            }
            // Routes after `index` are preloaded, so the surviving prefix is the new active stack and its
            // last entry is the top. The default rule would focus the bottom of the stack instead.
            const declaredRouteNames = new Set(routeNames);
            const survivingActiveCount = getStackRoutes(state).activeRoutes.filter((route)=>declaredRouteNames.has(route.name)).length;
            return {
                ...filteredState,
                index: Math.max(0, survivingActiveCount - 1)
            };
        },
        getStateForRouteFocus (state, key) {
            const { activeRoutes } = getStackRoutes(state);
            const index = activeRoutes.findIndex((r)=>r.key === key);
            if (index === -1 || index === state.index) {
                return state;
            }
            return {
                ...state,
                index,
                routes: activeRoutes.slice(0, index + 1).concat(state.routes.slice(state.index + 1))
            };
        },
        getStateForAction (state, action, options) {
            const { activeRoutes, preloadedRoutes } = getStackRoutes(state);
            switch(action.type){
                case 'ROUTE_NAMES_CHANGED':
                    {
                        const routeNames = action.payload.routeNames;
                        if ((0, _isArrayEqual.isArrayEqual)(state.routeNames, routeNames)) {
                            return {
                                state,
                                affectedRouteKey: activeRoutes[state.index]?.key
                            };
                        }
                        const routes = activeRoutes.filter((route)=>routeNames.includes(route.name));
                        const filteredPreloadedRoutes = preloadedRoutes.filter((route)=>routeNames.includes(route.name));
                        if (routes.length === 0) {
                            const fallbackName = initialRouteName !== undefined && routeNames.includes(initialRouteName) ? initialRouteName : routeNames[0];
                            const preloadedIndex = filteredPreloadedRoutes.findIndex((route)=>route.name === fallbackName);
                            const fallbackRoute = preloadedIndex === -1 ? {
                                key: nextKey(fallbackName),
                                name: fallbackName
                            } : filteredPreloadedRoutes[preloadedIndex];
                            routes.push(fallbackRoute);
                        }
                        const result = {
                            ...reconcileStackRoutes(state, routes, filteredPreloadedRoutes),
                            routeNames
                        };
                        return {
                            state: result,
                            affectedRouteKey: result.routes[result.index]?.key
                        };
                    }
                case 'REPLACE':
                    {
                        const currentIndex = action.target === state.key && action.source ? activeRoutes.findIndex((r)=>r.key === action.source) : state.index;
                        if (currentIndex === -1) {
                            return _types.RouterActionHandling.Unhandled;
                        }
                        if (!state.routeNames.includes(action.payload.name)) {
                            return _types.RouterActionHandling.Unhandled;
                        }
                        const getId = options.routeGetIdList[action.payload.name];
                        const id = getId?.({
                            params: action.payload.params
                        });
                        // Re-use preloaded route if available
                        let route = preloadedRoutes.find((route)=>route.name === action.payload.name && id === getId?.({
                                params: route.params
                            }));
                        if (!route) {
                            route = (0, _createRouteFromAction.createRouteFromAction)({
                                action,
                                key: nextKey(action.payload.name)
                            });
                        }
                        route = (0, _attachRouteState.attachRouteState)(route, action);
                        return {
                            state: {
                                ...reconcileStackRoutes(state, activeRoutes.map((r, i)=>i === currentIndex ? route : r), preloadedRoutes.filter((r)=>r.key !== route.key))
                            },
                            affectedRouteKey: route.key
                        };
                    }
                case 'PUSH':
                case 'NAVIGATE':
                    {
                        if (!state.routeNames.includes(action.payload.name)) {
                            return _types.RouterActionHandling.Unhandled;
                        }
                        const getId = options.routeGetIdList[action.payload.name];
                        const id = getId?.({
                            params: action.payload.params
                        });
                        let route;
                        if (id !== undefined) {
                            route = activeRoutes.findLast((route)=>route.name === action.payload.name && id === getId?.({
                                    params: route.params
                                }));
                        } else if (action.type === 'NAVIGATE') {
                            const currentRoute = activeRoutes[state.index];
                            // If the route matches the current one, then navigate to it
                            if (action.payload.name === currentRoute.name) {
                                route = currentRoute;
                            } else if (action.payload.pop) {
                                route = activeRoutes.findLast((route)=>route.name === action.payload.name);
                            }
                        }
                        if (!route) {
                            route = preloadedRoutes.find((route)=>route.name === action.payload.name && id === getId?.({
                                    params: route.params
                                }));
                        }
                        if (route) {
                            route = (0, _attachRouteState.attachRouteState)(route, action);
                        }
                        let params;
                        if (action.type === 'NAVIGATE' && action.payload.merge && route) {
                            params = action.payload.params !== undefined ? {
                                ...route.params,
                                ...action.payload.params
                            } : route.params;
                        } else {
                            params = action.payload.params;
                        }
                        let routes;
                        if (route) {
                            if (action.type === 'NAVIGATE' && action.payload.pop) {
                                routes = [];
                                // Get all routes until the matching one
                                for (const r of activeRoutes){
                                    if (r.key === route.key) {
                                        routes.push({
                                            ...route,
                                            path: action.payload.path !== undefined ? action.payload.path : route.path,
                                            params
                                        });
                                        break;
                                    }
                                    routes.push(r);
                                }
                                // Promote the route when it is preloaded and therefore absent from the active routes.
                                if (!routes.some((r)=>r.key === route.key)) {
                                    routes.push({
                                        ...route,
                                        path: action.payload.path !== undefined ? action.payload.path : route.path,
                                        params
                                    });
                                }
                            } else {
                                routes = activeRoutes.filter((r)=>r.key !== route.key);
                                routes.push({
                                    ...route,
                                    path: action.type === 'NAVIGATE' && action.payload.path !== undefined ? action.payload.path : route.path,
                                    params
                                });
                            }
                        } else {
                            routes = [
                                ...activeRoutes,
                                (0, _attachRouteState.attachRouteState)({
                                    key: nextKey(action.payload.name),
                                    name: action.payload.name,
                                    path: action.type === 'NAVIGATE' ? action.payload.path : undefined,
                                    params
                                }, action)
                            ];
                        }
                        const affectedRouteKey = routes[routes.length - 1].key;
                        return {
                            state: {
                                ...reconcileStackRoutes(state, routes, preloadedRoutes.filter((route)=>affectedRouteKey !== route.key))
                            },
                            affectedRouteKey
                        };
                    }
                case 'REMOVE_ROUTES':
                    {
                        const focusedRoute = activeRoutes[state.index];
                        const routes = activeRoutes.filter((route)=>route.key === focusedRoute.key || !action.payload.routeNames.includes(route.name));
                        const nextPreloadedRoutes = preloadedRoutes.filter((route)=>!action.payload.routeNames.includes(route.name));
                        if (routes.length === activeRoutes.length && nextPreloadedRoutes.length === preloadedRoutes.length) {
                            return {
                                state,
                                affectedRouteKey: focusedRoute.key
                            };
                        }
                        return {
                            state: reconcileStackRoutes(state, routes, nextPreloadedRoutes),
                            affectedRouteKey: focusedRoute.key
                        };
                    }
                case 'POP':
                    {
                        const currentIndex = action.target === state.key && action.source ? activeRoutes.findIndex((r)=>r.key === action.source) : state.index;
                        if (currentIndex > 0) {
                            const count = Math.max(currentIndex - action.payload.count + 1, 1);
                            const routes = activeRoutes.slice(0, count).concat(activeRoutes.slice(currentIndex + 1));
                            const result = reconcileStackRoutes(state, routes);
                            return {
                                state: result,
                                affectedRouteKey: result.routes[result.index]?.key
                            };
                        }
                        return _types.RouterActionHandling.Unhandled;
                    }
                case 'POP_TO_TOP':
                    return router.getStateForAction(state, {
                        type: 'POP',
                        payload: {
                            count: state.index
                        }
                    }, options);
                case 'POP_TO':
                    {
                        const currentIndex = action.target === state.key && action.source ? activeRoutes.findLastIndex((r)=>r.key === action.source) : state.index;
                        if (currentIndex === -1) {
                            return _types.RouterActionHandling.Unhandled;
                        }
                        if (!state.routeNames.includes(action.payload.name)) {
                            return _types.RouterActionHandling.Unhandled;
                        }
                        // If the route already exists, navigate to it
                        let index = -1;
                        const getId = options.routeGetIdList[action.payload.name];
                        const id = getId?.({
                            params: action.payload.params
                        });
                        if (id !== undefined) {
                            index = activeRoutes.findIndex((route)=>route.name === action.payload.name && id === getId?.({
                                    params: route.params
                                }));
                        } else if (activeRoutes[currentIndex].name === action.payload.name) {
                            index = currentIndex;
                        } else {
                            for(let i = currentIndex; i >= 0; i--){
                                if (activeRoutes[i].name === action.payload.name) {
                                    index = i;
                                    break;
                                }
                            }
                        }
                        // If the route doesn't exist, remove the current route and add the new one
                        if (index === -1) {
                            // Re-use preloaded route if available
                            let route = preloadedRoutes.find((route)=>route.name === action.payload.name && id === getId?.({
                                    params: route.params
                                }));
                            if (!route) {
                                route = (0, _createRouteFromAction.createRouteFromAction)({
                                    action,
                                    key: nextKey(action.payload.name)
                                });
                            }
                            route = (0, _attachRouteState.attachRouteState)(route, action);
                            const routes = activeRoutes.slice(0, currentIndex).concat(route);
                            return {
                                state: {
                                    ...reconcileStackRoutes(state, routes, preloadedRoutes.filter((r)=>r.key !== route.key))
                                },
                                affectedRouteKey: route.key
                            };
                        }
                        const route = (0, _attachRouteState.attachRouteState)(activeRoutes[index], action);
                        let params;
                        if (action.payload.merge) {
                            params = action.payload.params !== undefined ? {
                                ...route.params,
                                ...action.payload.params
                            } : route.params;
                        } else {
                            params = action.payload.params;
                        }
                        return {
                            state: reconcileStackRoutes(state, [
                                ...activeRoutes.slice(0, index),
                                params !== route.params ? {
                                    ...route,
                                    params
                                } : route
                            ]),
                            affectedRouteKey: route.key
                        };
                    }
                case 'GO_BACK':
                    if (state.index > 0) {
                        return router.getStateForAction(state, {
                            type: 'POP',
                            payload: {
                                count: 1
                            },
                            target: action.target,
                            source: action.source
                        }, options);
                    }
                    return _types.RouterActionHandling.Unhandled;
                case 'PRELOAD':
                    {
                        const getId = options.routeGetIdList[action.payload.name];
                        const id = getId?.({
                            params: action.payload.params
                        });
                        let route;
                        if (id !== undefined) {
                            route = activeRoutes.find((route)=>route.name === action.payload.name && id === getId?.({
                                    params: route.params
                                }));
                        }
                        if (route) {
                            return {
                                state: {
                                    ...state,
                                    routes: state.routes.map((r)=>{
                                        if (r.key !== route?.key) {
                                            return r;
                                        }
                                        return (0, _attachRouteState.attachRouteState)({
                                            ...r,
                                            params: action.payload.params
                                        }, action);
                                    })
                                },
                                affectedRouteKey: route.key
                            };
                        } else {
                            const preloadedRoute = (0, _attachRouteState.attachRouteState)((0, _createRouteFromAction.createRouteFromAction)({
                                action,
                                key: nextKey(action.payload.name)
                            }), action);
                            return {
                                state: {
                                    ...reconcileStackRoutes(state, activeRoutes, preloadedRoutes.filter((r)=>r.name !== action.payload.name || id !== getId?.({
                                            params: r.params
                                        })).concat(preloadedRoute))
                                },
                                affectedRouteKey: preloadedRoute.key
                            };
                        }
                    }
                default:
                    return _types.RouterActionHandling.Delegate;
            }
        },
        actionCreators: StackActions
    };
    return router;
}
const StackRouter = (0, _extendRouter.extendRouter)(_BaseRouter.BaseRouter, stackRouterExtension, {
    type: 'stack'
});

//# sourceMappingURL=StackRouter.js.map
