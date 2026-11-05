"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getNavigateAction", {
    enumerable: true,
    get: function() {
        return getNavigateAction;
    }
});
const _getRoutesRedirects = require("../getRoutesRedirects");
const _href = require("../link/href");
const _navigationParams = require("../navigationParams");
const _getRouteInfoFromState = require("./getRouteInfoFromState");
const _resolveNavigationDestination = require("./resolveNavigationDestination");
function getNavigateAction(baseHref, options, config, type, withAnchor, singular, previewKey, navigationState) {
    if (!config.linking || !config.routeNode) {
        throw new Error('Attempted to link to route when no routes are present');
    }
    const routeInfo = (0, _getRouteInfoFromState.getRouteInfoFromState)(navigationState);
    const href = (0, _getRoutesRedirects.applyRedirects)((0, _href.resolveHrefStringWithSegments)(baseHref, routeInfo, options), config.redirects);
    const state = config.linking.getStateFromPath(href, config.linking.config, routeInfo.segments);
    if (!state || state.routes.length === 0) {
        return {
            status: 'invalid',
            href
        };
    }
    const internalParams = {
        ...options.__internal__previewId !== undefined ? {
            [_navigationParams.INTERNAL_EXPO_ROUTER_PREVIEW_ID_PARAM_NAME]: options.__internal__previewId
        } : {}
    };
    const action = (0, _resolveNavigationDestination.resolveNavigationDestination)({
        targetState: state,
        navigationState,
        routeNode: config.routeNode,
        registry: config.registry,
        action: {
            type: type ?? 'NAVIGATE',
            payload: {
                singular,
                __internal__PreviewKey: previewKey,
                ...options.__internal__popToNavigator ? {
                    pop: true
                } : undefined
            }
        },
        withAnchor,
        internalParams
    });
    return {
        status: 'action',
        action
    };
}

//# sourceMappingURL=getNavigationAction.js.map
