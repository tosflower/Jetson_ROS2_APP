"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "findPreviewActivationPath", {
    enumerable: true,
    get: function() {
        return findPreviewActivationPath;
    }
});
function _reactfastcompare() {
    const data = /*#__PURE__*/ _interop_require_default(require("react-fast-compare"));
    _reactfastcompare = function() {
        return data;
    };
    return data;
}
const _navigationParams = require("../../navigationParams");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function findPreviewActivationPath(state, routeKey, previewId) {
    const routeIndex = state.routes.findIndex((route)=>route.key === routeKey);
    if (routeIndex !== -1) {
        const route = state.routes[routeIndex];
        if ((0, _navigationParams.getInternalExpoRouterParams)(route.params)[_navigationParams.INTERNAL_EXPO_ROUTER_PREVIEW_ID_PARAM_NAME] !== previewId || isDuplicateOfFocusedRoute(state, routeIndex)) {
            return undefined;
        }
        return [
            {
                key: route.key
            }
        ];
    }
    for (const route of state.routes){
        if (route.state?.stale === false) {
            const childPath = findPreviewActivationPath(route.state, routeKey, previewId);
            if (childPath) {
                return [
                    {
                        key: route.key
                    },
                    ...childPath
                ];
            }
        }
    }
    return undefined;
}
function isDuplicateOfFocusedRoute(state, routeIndex) {
    const route = state.routes[routeIndex];
    const focusedRoute = state.routes[state.index];
    return routeIndex !== state.index && focusedRoute?.name === route.name && (0, _reactfastcompare().default)((0, _navigationParams.removeInternalExpoRouterParams)(focusedRoute.params ?? {}), (0, _navigationParams.removeInternalExpoRouterParams)(route.params ?? {}));
}

//# sourceMappingURL=utils.js.map
