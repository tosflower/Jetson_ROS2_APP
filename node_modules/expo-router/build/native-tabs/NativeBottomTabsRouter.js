"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NativeBottomTabsRouter", {
    enumerable: true,
    get: function() {
        return NativeBottomTabsRouter;
    }
});
const _navigationParams = require("../navigationParams");
const _native = require("../react-navigation/native");
const _utils = require("../react-navigation/routers/utils");
const zoomParamNames = [
    _navigationParams.INTERNAL_EXPO_ROUTER_ZOOM_TRANSITION_SCREEN_ID_PARAM_NAME,
    _navigationParams.INTERNAL_EXPO_ROUTER_ZOOM_TRANSITION_SOURCE_ID_PARAM_NAME
];
// TODO(@ubax): Simplify this logic, so it is clearer and easier to understand
// At the moment this is needed to remove zoom params from current level and all nested levels
// so that there is no zoom transition in tabs. Check if there are any better ways to address this
// problem
function removeZoomParamsFromState(state) {
    let changed = false;
    const routes = state.routes.map((route)=>{
        const hasZoomParams = route.params && zoomParamNames.some((paramName)=>paramName in route.params);
        const params = hasZoomParams ? (0, _navigationParams.removeParams)(route.params, zoomParamNames) : route.params;
        const childState = route.state ? removeZoomParamsFromState(route.state) : undefined;
        if (!hasZoomParams && childState === route.state) {
            return route;
        }
        changed = true;
        return {
            ...route,
            ...hasZoomParams ? {
                params
            } : undefined,
            ...childState ? {
                state: childState
            } : undefined
        };
    });
    // The mapped routes preserve the input state's full or partial route shape.
    return changed ? {
        ...state,
        routes
    } : state;
}
function appendNoAnimationParamToFocusedRoutes(state) {
    const focusedIndex = state.index ?? state.routes.length - 1;
    const focusedRoute = state.routes[focusedIndex];
    if (!focusedRoute) {
        return state;
    }
    const childState = focusedRoute.state ? appendNoAnimationParamToFocusedRoutes(focusedRoute.state) : undefined;
    const routes = state.routes.map((route, index)=>index === focusedIndex ? {
            ...route,
            params: (0, _navigationParams.appendInternalExpoRouterParams)(route.params, {
                [_navigationParams.INTERNAL_EXPO_ROUTER_NO_ANIMATION_PARAM_NAME]: true
            }),
            ...childState ? {
                state: childState
            } : undefined
        } : route);
    // The mapped routes preserve the input state's full or partial route shape.
    return {
        ...state,
        routes
    };
}
const NativeBottomTabsRouter = (0, _native.extendRouterActions)(_native.TabRouter, (state, action, { baseRouter })=>{
    switch(action.type){
        case 'PUSH':
        case 'NAVIGATE':
            {
                const actionResult = baseRouter.getStateForAction(state, action);
                if (!(0, _utils.isActionHandled)(actionResult)) {
                    return actionResult;
                }
                const newStateFromNavigation = actionResult.state;
                const focusedRouteKey = state.routes[state.index]?.key;
                const nextFocusedRouteKey = newStateFromNavigation.routes[newStateFromNavigation.index]?.key;
                const didTabChange = focusedRouteKey !== undefined && nextFocusedRouteKey !== undefined && focusedRouteKey !== nextFocusedRouteKey;
                const index = newStateFromNavigation.routes.findIndex((route)=>route.name === action.payload.name);
                if (index === -1) {
                    return actionResult;
                }
                const newState = {
                    ...newStateFromNavigation,
                    routes: newStateFromNavigation.routes.map((route)=>{
                        if (route.name !== action.payload.name) {
                            return route;
                        }
                        const expoParams = (0, _navigationParams.getInternalExpoRouterParams)(action.payload.params);
                        if (process.env.NODE_ENV !== 'production') {
                            if (expoParams[_navigationParams.INTERNAL_EXPO_ROUTER_ZOOM_TRANSITION_SOURCE_ID_PARAM_NAME]) {
                                console.warn('Zoom transition is not supported when navigating between tabs. Falling back to standard navigation transition.');
                            }
                        }
                        // Zoom transition needs to be disabled for navigation inside tabs
                        // Otherwise user can end up in a situation where a view is missing on one tab
                        // because it was used to perform zoom transition on another tab
                        const params = (0, _navigationParams.removeParams)((0, _navigationParams.appendInternalExpoRouterParams)(route.params, expoParams), zoomParamNames);
                        let childState = route.state ? removeZoomParamsFromState(route.state) : undefined;
                        if (childState && didTabChange && action.payload.state?.__internal__routerActionState === true) {
                            childState = appendNoAnimationParamToFocusedRoutes(childState);
                        }
                        return {
                            ...route,
                            ...childState ? {
                                state: childState
                            } : undefined,
                            params
                        };
                    })
                };
                return {
                    ...actionResult,
                    state: newState
                };
            }
    }
    return _native.RouterActionHandling.Delegate;
});

//# sourceMappingURL=NativeBottomTabsRouter.js.map
