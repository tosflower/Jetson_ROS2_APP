"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ExpoTabRouter", {
    enumerable: true,
    get: function() {
        return ExpoTabRouter;
    }
});
const _native = require("../react-navigation/native");
const _TabRouter = require("../react-navigation/routers/TabRouter");
const _attachRouteState = require("../react-navigation/routers/attachRouteState");
const _common = require("./common");
const ExpoTabRouter = (0, _native.extendRouterActions)(_native.TabRouter, (state, action, { baseRouter, options })=>{
    if (action.type !== 'JUMP_TO') {
        return _native.RouterActionHandling.Delegate;
    }
    const { route, isSwitching } = (0, _common.getTabRoute)(state, action.payload.name);
    if (!route) {
        return _native.RouterActionHandling.Delegate;
    }
    const shouldReset = 'resetOnFocus' in action.payload && Boolean(action.payload.resetOnFocus && isSwitching);
    if (shouldReset) {
        state = {
            ...state,
            routes: state.routes.map((r)=>{
                if (r.key !== route.key) {
                    return r;
                }
                return {
                    ...r,
                    state: undefined
                };
            })
        };
    }
    if (!isSwitching && route.state !== undefined) {
        const selectedRoute = (0, _attachRouteState.attachRouteState)(route, action);
        if (selectedRoute === route) {
            state = (0, _TabRouter.ensureStateHistory)(state, options.backBehavior ?? 'firstRoute', options.initialRouteName);
            return {
                state,
                affectedRouteKey: route.key
            };
        }
    }
    return baseRouter.getStateForAction(state, action);
});

//# sourceMappingURL=TabRouter.js.map
