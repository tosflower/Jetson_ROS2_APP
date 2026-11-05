"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    INTERNAL_EXPO_ROUTER_GESTURE_ENABLED_OPTION_NAME: null,
    INTERNAL_EXPO_ROUTER_IS_PREVIEW_NAVIGATION_PARAM_NAME: null,
    INTERNAL_EXPO_ROUTER_NO_ANIMATION_PARAM_NAME: null,
    INTERNAL_EXPO_ROUTER_PREVIEW_ID_PARAM_NAME: null,
    INTERNAL_EXPO_ROUTER_ZOOM_TRANSITION_SCREEN_ID_PARAM_NAME: null,
    INTERNAL_EXPO_ROUTER_ZOOM_TRANSITION_SOURCE_ID_PARAM_NAME: null,
    appendInternalExpoRouterParams: null,
    getInternalExpoRouterParams: null,
    hasParam: null,
    removeInternalExpoRouterParams: null,
    removeParams: null,
    warnIfNestedParams: null,
    warnIfScreenParam: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get INTERNAL_EXPO_ROUTER_GESTURE_ENABLED_OPTION_NAME () {
        return INTERNAL_EXPO_ROUTER_GESTURE_ENABLED_OPTION_NAME;
    },
    get INTERNAL_EXPO_ROUTER_IS_PREVIEW_NAVIGATION_PARAM_NAME () {
        return INTERNAL_EXPO_ROUTER_IS_PREVIEW_NAVIGATION_PARAM_NAME;
    },
    get INTERNAL_EXPO_ROUTER_NO_ANIMATION_PARAM_NAME () {
        return INTERNAL_EXPO_ROUTER_NO_ANIMATION_PARAM_NAME;
    },
    get INTERNAL_EXPO_ROUTER_PREVIEW_ID_PARAM_NAME () {
        return INTERNAL_EXPO_ROUTER_PREVIEW_ID_PARAM_NAME;
    },
    get INTERNAL_EXPO_ROUTER_ZOOM_TRANSITION_SCREEN_ID_PARAM_NAME () {
        return INTERNAL_EXPO_ROUTER_ZOOM_TRANSITION_SCREEN_ID_PARAM_NAME;
    },
    get INTERNAL_EXPO_ROUTER_ZOOM_TRANSITION_SOURCE_ID_PARAM_NAME () {
        return INTERNAL_EXPO_ROUTER_ZOOM_TRANSITION_SOURCE_ID_PARAM_NAME;
    },
    get appendInternalExpoRouterParams () {
        return appendInternalExpoRouterParams;
    },
    get getInternalExpoRouterParams () {
        return getInternalExpoRouterParams;
    },
    get hasParam () {
        return hasParam;
    },
    get removeInternalExpoRouterParams () {
        return removeInternalExpoRouterParams;
    },
    get removeParams () {
        return removeParams;
    },
    get warnIfNestedParams () {
        return warnIfNestedParams;
    },
    get warnIfScreenParam () {
        return warnIfScreenParam;
    }
});
const INTERNAL_EXPO_ROUTER_NO_ANIMATION_PARAM_NAME = '__internal_expo_router_no_animation';
const INTERNAL_EXPO_ROUTER_IS_PREVIEW_NAVIGATION_PARAM_NAME = '__internal__expo_router_is_preview_navigation';
const INTERNAL_EXPO_ROUTER_ZOOM_TRANSITION_SOURCE_ID_PARAM_NAME = '__internal_expo_router_zoom_transition_source_id';
const INTERNAL_EXPO_ROUTER_ZOOM_TRANSITION_SCREEN_ID_PARAM_NAME = '__internal_expo_router_zoom_transition_screen_id';
const INTERNAL_EXPO_ROUTER_PREVIEW_ID_PARAM_NAME = '__internal_expo_router_preview_id';
const INTERNAL_EXPO_ROUTER_GESTURE_ENABLED_OPTION_NAME = 'internal_gestureEnabled';
const internalExpoRouterParamNames = [
    INTERNAL_EXPO_ROUTER_NO_ANIMATION_PARAM_NAME,
    INTERNAL_EXPO_ROUTER_IS_PREVIEW_NAVIGATION_PARAM_NAME,
    INTERNAL_EXPO_ROUTER_ZOOM_TRANSITION_SOURCE_ID_PARAM_NAME,
    INTERNAL_EXPO_ROUTER_ZOOM_TRANSITION_SCREEN_ID_PARAM_NAME,
    INTERNAL_EXPO_ROUTER_PREVIEW_ID_PARAM_NAME
];
const paramsObjectsWarnedForScreen = new WeakSet();
const paramsObjectsWarnedForNestedParams = new WeakSet();
function warnIfScreenParam(params) {
    if (process.env.NODE_ENV !== 'production' && params && 'screen' in params && !paramsObjectsWarnedForScreen.has(params)) {
        paramsObjectsWarnedForScreen.add(params);
        console.warn("Navigating with a `screen` param is no longer supported. Expo Router now builds real navigation state for nested destinations, so `screen` and `params` are treated as ordinary user params. Navigate with a full href instead, for example `router.push('/(tabs)/feed')`.");
    }
}
function warnIfNestedParams(params) {
    if (process.env.NODE_ENV !== 'production' && params && Object.values(params).some((value)=>value !== null && typeof value === 'object' && !Array.isArray(value)) && !paramsObjectsWarnedForNestedParams.has(params)) {
        paramsObjectsWarnedForNestedParams.add(params);
        console.warn('Navigating with nested object params is not supported. Expo Router URL params must be serializable as strings. Use flat params or serialize the object value.');
    }
}
function appendInternalExpoRouterParams(params, expoParams) {
    const newParams = {
        ...params,
        ...expoParams
    };
    if (Object.keys(newParams).length === 0 && params === undefined) {
        return undefined;
    }
    return newParams;
}
function getInternalExpoRouterParams(_params) {
    const expoParams = {};
    const params = _params ? _params : {};
    for (const key of internalExpoRouterParamNames){
        if (key in params) {
            expoParams[key] = params[key];
        }
    }
    return expoParams;
}
function hasParam(params, paramName) {
    if (!!params && typeof params === 'object') {
        const recordParams = params;
        if (recordParams[paramName] !== undefined) {
            return true;
        }
    }
    return false;
}
function removeParams(params, paramName) {
    if (!params) {
        return undefined;
    }
    return Object.fromEntries(Object.entries(params).filter(([key])=>!paramName.includes(key)));
}
function removeInternalExpoRouterParams(params) {
    if (!params) {
        return undefined;
    }
    return removeParams(params, internalExpoRouterParamNames);
}

//# sourceMappingURL=navigationParams.js.map
