'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    Drawer: null,
    default: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get Drawer () {
        return Drawer;
    },
    get default () {
        return _default;
    }
});
const _drawer = require("../react-navigation/drawer");
const _native = require("../react-navigation/native");
const _standardnavigation = require("../standard-navigation");
const _appendMissingPlaceholderTabRoutes = require("../standard-navigation/appendMissingPlaceholderTabRoutes");
const Drawer = (0, _standardnavigation.integrateWithRouter)(_drawer.createStandardDrawerNavigator, _native.DrawerRouter, {
    activityDefaultThreshold: 1,
    processDescriptors: _appendMissingPlaceholderTabRoutes.appendMissingPlaceholderTabDescriptors,
    processState: _appendMissingPlaceholderTabRoutes.appendMissingPlaceholderTabRoutes,
    createProps: ({ state, navigation, dispatch, isPreloaded, isRemovalPrevented })=>({
            drawerState: state,
            isPreloaded,
            isRemovalPrevented,
            // `createProps` exposes base helpers, but `DrawerRouter` adds drawer action helpers at runtime.
            navigation: navigation,
            preload: (name)=>dispatch({
                    type: 'PRELOAD',
                    payload: {
                        name
                    }
                })
        })
});
const _default = Drawer;

//# sourceMappingURL=DrawerClient.js.map
