"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getRootStackRouteNames: null,
    shouldAppendNotFound: null,
    shouldAppendSitemap: null,
    shouldReactToColorSchemeChanges: null,
    useColorSchemeChangesIfNeeded: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getRootStackRouteNames () {
        return getRootStackRouteNames;
    },
    get shouldAppendNotFound () {
        return shouldAppendNotFound;
    },
    get shouldAppendSitemap () {
        return shouldAppendSitemap;
    },
    get shouldReactToColorSchemeChanges () {
        return shouldReactToColorSchemeChanges;
    },
    get useColorSchemeChangesIfNeeded () {
        return useColorSchemeChangesIfNeeded;
    }
});
function _expoconstants() {
    const data = /*#__PURE__*/ _interop_require_default(require("expo-constants"));
    _expoconstants = function() {
        return data;
    };
    return data;
}
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
const _constants = require("../constants");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function shouldAppendSitemap() {
    const config = _expoconstants().default.expoConfig?.extra?.router;
    return config?.sitemap !== false;
}
function shouldAppendNotFound() {
    const config = _expoconstants().default.expoConfig?.extra?.router;
    return config?.notFound !== false;
}
function shouldReactToColorSchemeChanges() {
    const config = _expoconstants().default.expoConfig?.extra?.router;
    return config?.adaptiveColors !== false;
}
const useColorSchemeChangesIfNeeded = shouldReactToColorSchemeChanges() ? _reactnative().useColorScheme : function() {};
function getRootStackRouteNames() {
    const routes = [
        _constants.INTERNAL_SLOT_NAME
    ];
    if (shouldAppendNotFound()) {
        routes.push(_constants.NOT_FOUND_ROUTE_NAME);
    }
    if (shouldAppendSitemap()) {
        routes.push(_constants.SITEMAP_ROUTE_NAME);
    }
    return routes;
}

//# sourceMappingURL=utils.js.map
