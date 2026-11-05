"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    extrapolateGroups: null,
    generateDynamic: null,
    getContextKey: null,
    getExactRoutes: null,
    getReactNavigationConfig: null,
    getRoutes: null,
    getRoutesCore: null,
    isTypedRoute: null,
    matchDynamicName: null,
    matchGroupName: null,
    removeSupportedExtensions: null,
    sortRoutes: null,
    stripGroupSegmentsFromPath: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get extrapolateGroups () {
        return _getRoutesCore.extrapolateGroups;
    },
    get generateDynamic () {
        return _getRoutesCore.generateDynamic;
    },
    get getContextKey () {
        return _matchers.getContextKey;
    },
    get getExactRoutes () {
        return _getRoutes.getExactRoutes;
    },
    get getReactNavigationConfig () {
        return _getReactNavigationConfig.getReactNavigationConfig;
    },
    get getRoutes () {
        return _getRoutes.getRoutes;
    },
    get getRoutesCore () {
        return _getRoutesCore.getRoutes;
    },
    get isTypedRoute () {
        return _matchers.isTypedRoute;
    },
    get matchDynamicName () {
        return _matchers.matchDynamicName;
    },
    get matchGroupName () {
        return _matchers.matchGroupName;
    },
    get removeSupportedExtensions () {
        return _matchers.removeSupportedExtensions;
    },
    get sortRoutes () {
        return _sortRoutes.sortRoutes;
    },
    get stripGroupSegmentsFromPath () {
        return _matchers.stripGroupSegmentsFromPath;
    }
});
const _getReactNavigationConfig = require("../getReactNavigationConfig");
const _getRoutes = require("../getRoutes");
const _getRoutesCore = require("../getRoutesCore");
const _matchers = require("../matchers");
const _sortRoutes = require("../sortRoutes");

//# sourceMappingURL=routing.js.map
