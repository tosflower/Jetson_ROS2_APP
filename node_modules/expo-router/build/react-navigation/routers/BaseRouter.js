"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BaseRouter", {
    enumerable: true,
    get: function() {
        return BaseRouter;
    }
});
const _NoopRouter = require("./NoopRouter");
const _extendRouter = require("./extendRouter");
const _stateKeys = require("./stateKeys");
const _types = require("./types");
const BaseRouter = (0, _extendRouter.extendRouter)(_NoopRouter.NoopRouter, ({ baseRouter })=>({
        getStateForDeclaredRoutes (state, routeNames) {
            const declaredRouteNames = new Set(routeNames);
            const routes = state.routes.filter((route)=>declaredRouteNames.has(route.name));
            if (routes.length === state.routes.length) {
                return state;
            }
            const focusedKey = state.routes[state.index]?.key;
            // `-1` reports that nothing is focused; consumers of the focused route handle it.
            const index = routes.length === 0 ? -1 : Math.max(0, routes.findIndex((route)=>route.key === focusedKey));
            return {
                ...state,
                routes,
                index
            };
        },
        getStateForAction (state, action, options) {
            switch(action.type){
                case 'SET_PARAMS':
                case 'REPLACE_PARAMS':
                    {
                        const index = action.source ? state.routes.findIndex((r)=>r.key === action.source) : state.index;
                        if (index === -1) {
                            return _types.RouterActionHandling.Unhandled;
                        }
                        return {
                            state: {
                                ...state,
                                routes: state.routes.map((r, i)=>i === index ? {
                                        ...r,
                                        params: action.type === 'REPLACE_PARAMS' ? action.payload.params : {
                                            ...r.params,
                                            ...action.payload.params
                                        }
                                    } : r)
                            },
                            affectedRouteKey: state.routes[index].key
                        };
                    }
                case 'RESET':
                    {
                        const nextState = action.payload;
                        if (nextState.routes.length === 0 || nextState.routes.some((route)=>!state.routeNames.includes(route.name))) {
                            return _types.RouterActionHandling.Unhandled;
                        }
                        if (nextState.stale === false) {
                            if (state.routeNames.length !== nextState.routeNames.length || nextState.routeNames.some((name)=>!state.routeNames.includes(name))) {
                                return _types.RouterActionHandling.Unhandled;
                            }
                            // The payload may carry a higher sequence than the current state, so RESET mints on
                            // its own instead of using `nextKey`.
                            const minter = (0, _stateKeys.createRouteKeyMinter)({
                                key: state.key,
                                routeKeySeq: Math.max(state.routeKeySeq, nextState.routeKeySeq ?? 0)
                            });
                            const result = {
                                ...nextState,
                                routes: nextState.routes.map((route)=>route.key ? route : {
                                        ...route,
                                        key: minter.mint(route.name)
                                    }),
                                routeKeySeq: minter.routeKeySeq
                            };
                            return {
                                state: result,
                                affectedRouteKey: result.routes[result.index]?.key
                            };
                        }
                        // TODO: support completing partial reset payloads at dispatch (follow-up PR).
                        // Until then the action is ignored so a partial payload warns instead of
                        // crashing the render.
                        console.warn('The RESET action payload must contain a complete navigation state. Partial states can no longer be completed during render. Include `key`, `index`, `routeNames`, `routeKeySeq`, and `stale: false` when resetting.');
                        return _types.RouterActionHandling.Unhandled;
                    }
                default:
                    return _types.RouterActionHandling.Delegate;
            }
        },
        shouldActionChangeFocus (action) {
            return action.type === 'PUSH' || action.type === 'NAVIGATE';
        }
    }));

//# sourceMappingURL=BaseRouter.js.map
