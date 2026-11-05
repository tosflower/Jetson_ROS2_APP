"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    DrawerActions: null,
    DrawerRouter: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get DrawerActions () {
        return DrawerActions;
    },
    get DrawerRouter () {
        return DrawerRouter;
    }
});
const _TabRouter = require("./TabRouter");
const _extendRouter = require("./extendRouter");
const _getBrowserHistoryForHistoryChange = require("./getBrowserHistoryForHistoryChange");
const _types = require("./types");
const _utils = require("./utils");
const DrawerActions = {
    ..._TabRouter.TabActions,
    openDrawer () {
        return {
            type: 'OPEN_DRAWER'
        };
    },
    closeDrawer () {
        return {
            type: 'CLOSE_DRAWER'
        };
    },
    toggleDrawer () {
        return {
            type: 'TOGGLE_DRAWER'
        };
    }
};
function drawerRouterExtension({ baseRouter: router, options: { defaultStatus = 'closed', backBehavior = 'firstRoute', initialRouteName } }) {
    // `ensureStateHistory` is typed for the tab state. The drawer state differs only by the extra
    // drawer entries in `history`, which reconstruction never produces.
    const ensureDrawerStateHistory = (state)=>(0, _TabRouter.ensureStateHistory)(state, backBehavior, initialRouteName);
    const isDrawerInHistory = (state)=>Boolean(state.history?.some((it)=>it.type === 'drawer'));
    const addDrawerToHistory = (state)=>{
        if (isDrawerInHistory(state)) {
            return state;
        }
        return {
            ...state,
            history: [
                ...state.history ?? [],
                {
                    type: 'drawer',
                    status: defaultStatus === 'open' ? 'closed' : 'open'
                }
            ]
        };
    };
    const removeDrawerFromHistory = (state)=>{
        if (!isDrawerInHistory(state)) {
            return state;
        }
        return {
            ...state,
            history: (state.history ?? []).filter((it)=>it.type !== 'drawer')
        };
    };
    const openDrawer = (state)=>{
        if (defaultStatus === 'open') {
            return removeDrawerFromHistory(state);
        }
        return addDrawerToHistory(state);
    };
    const closeDrawer = (state)=>{
        if (defaultStatus === 'open') {
            return addDrawerToHistory(state);
        }
        return removeDrawerFromHistory(state);
    };
    return {
        getBrowserHistoryForAction (previous, next, action) {
            switch(action.type){
                case 'OPEN_DRAWER':
                case 'CLOSE_DRAWER':
                case 'TOGGLE_DRAWER':
                    return (0, _getBrowserHistoryForHistoryChange.getBrowserHistoryForHistoryChange)(ensureDrawerStateHistory(previous), next);
                case 'PUSH':
                case 'NAVIGATE':
                case 'JUMP_TO':
                    if (isDrawerInHistory(previous) && (backBehavior === 'history' || backBehavior === 'fullHistory') && previous.routes[previous.index]?.key !== next.routes[next.index]?.key) {
                        // Switching routes closes the drawer and reuses its browser entry.
                        return undefined;
                    }
            }
            return router.getBrowserHistoryForAction?.(previous, next, action);
        },
        getBrowserHistoryForRouteFocus (previous, next, childAction) {
            if (isDrawerInHistory(previous) && !isDrawerInHistory(next) && (childAction?.type === 'push' || previous.routes[previous.index]?.key !== next.routes[next.index]?.key)) {
                // Pushing Details from an open drawer replaces the drawer entry with Details.
                // Back then returns to the page with the drawer closed.
                return {
                    type: 'replace'
                };
            }
            return (0, _getBrowserHistoryForHistoryChange.getBrowserHistoryForHistoryChange)(ensureDrawerStateHistory(previous), next);
        },
        getStateForRouteFocus (state, key) {
            const result = router.getStateForRouteFocus(ensureDrawerStateHistory(state), key);
            return closeDrawer(result);
        },
        getStateForAction (inputState, action, options) {
            // Restore route history before drawer actions can add drawer-only history.
            const state = ensureDrawerStateHistory(inputState);
            const focusedRouteKey = state.routes[state.index]?.key;
            switch(action.type){
                case 'OPEN_DRAWER':
                    return {
                        state: openDrawer(state),
                        affectedRouteKey: focusedRouteKey
                    };
                case 'CLOSE_DRAWER':
                    return {
                        state: closeDrawer(state),
                        affectedRouteKey: focusedRouteKey
                    };
                case 'TOGGLE_DRAWER':
                    if (isDrawerInHistory(state)) {
                        return {
                            state: removeDrawerFromHistory(state),
                            affectedRouteKey: focusedRouteKey
                        };
                    }
                    return {
                        state: addDrawerToHistory(state),
                        affectedRouteKey: focusedRouteKey
                    };
                case 'PUSH':
                case 'REPLACE':
                case 'JUMP_TO':
                case 'NAVIGATE':
                    {
                        const actionResult = router.getStateForAction(state, action, options);
                        if ((0, _utils.isActionHandled)(actionResult)) {
                            const nextState = actionResult.state;
                            if (nextState.index === state.index) {
                                return actionResult;
                            }
                            return {
                                ...actionResult,
                                state: closeDrawer(nextState)
                            };
                        }
                        return _types.RouterActionHandling.Unhandled;
                    }
                case 'GO_BACK':
                    if (isDrawerInHistory(state)) {
                        return {
                            state: removeDrawerFromHistory(state),
                            affectedRouteKey: focusedRouteKey
                        };
                    }
                    return router.getStateForAction(state, action, options);
                default:
                    return router.getStateForAction(state, action, options);
            }
        },
        actionCreators: DrawerActions
    };
}
const DrawerRouter = (0, _extendRouter.extendRouter)(_TabRouter.TabRouter, drawerRouterExtension, {
    type: 'drawer'
});

//# sourceMappingURL=DrawerRouter.js.map
