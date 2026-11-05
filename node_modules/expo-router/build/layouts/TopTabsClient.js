'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    TopTabs: null,
    createJSTopTabsProps: null,
    default: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get TopTabs () {
        return TopTabs;
    },
    get createJSTopTabsProps () {
        return createJSTopTabsProps;
    },
    get default () {
        return _default;
    }
});
0 && __export(require("../react-navigation/material-top-tabs"));
const _createMaterialTopTabNavigator = require("../react-navigation/material-top-tabs/navigators/createMaterialTopTabNavigator");
const _native = require("../react-navigation/native");
const _standardnavigation = require("../standard-navigation");
const _appendMissingPlaceholderTabRoutes = require("../standard-navigation/appendMissingPlaceholderTabRoutes");
const _createBaseTabProps = require("./createBaseTabProps");
_export_star(require("../react-navigation/material-top-tabs"), exports);
function _export_star(from, to) {
    Object.keys(from).forEach(function(k) {
        if (k !== "default" && !Object.prototype.hasOwnProperty.call(to, k)) {
            Object.defineProperty(to, k, {
                enumerable: true,
                get: function() {
                    return from[k];
                }
            });
        }
    });
    return from;
}
function createJSTopTabsProps(args) {
    const { dispatchSync } = args;
    return {
        ...(0, _createBaseTabProps.createBaseTabProps)(args),
        navigateToTabSync: (name, params)=>dispatchSync(_native.CommonActions.navigate(name, params))
    };
}
const TopTabs = (0, _standardnavigation.integrateWithRouter)(_createMaterialTopTabNavigator.createStandardMaterialTopTabNavigator, _native.TabRouter, {
    activityDefaultThreshold: 1,
    processDescriptors: _appendMissingPlaceholderTabRoutes.appendMissingPlaceholderTabDescriptors,
    processState: _appendMissingPlaceholderTabRoutes.appendMissingPlaceholderTabRoutes,
    createProps: createJSTopTabsProps
});
const _default = TopTabs;

//# sourceMappingURL=TopTabsClient.js.map
