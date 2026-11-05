'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    Stack: null,
    createJSStackProps: null,
    default: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get Stack () {
        return Stack;
    },
    get createJSStackProps () {
        return createJSStackProps;
    },
    get default () {
        return _default;
    }
});
0 && __export(require("../react-navigation/stack"));
const _native = require("../react-navigation/native");
const _stack = _export_star(require("../react-navigation/stack"), exports);
const _makeRestoreRouteAction = require("../react-navigation/stack/utils/makeRestoreRouteAction");
const _standardnavigation = require("../standard-navigation");
const _Protected = require("../views/Protected");
const _Screen = require("../views/Screen");
const _createBaseStackProps = require("./stack-utils/createBaseStackProps");
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
function createJSStackProps(args) {
    return {
        ...(0, _createBaseStackProps.createBaseStackProps)(args),
        removeRoutes: (routeNames)=>args.dispatch({
                type: 'REMOVE_ROUTES',
                payload: {
                    routeNames
                }
            }),
        restoreRoute: (0, _makeRestoreRouteAction.makeRestoreRouteAction)(args.dispatchSync, args.state)
    };
}
// TODO(@ubax): Update docs/pages/router/migrate/from-react-navigation.mdx:387 for the removed prop.
const JSStack = (0, _standardnavigation.integrateWithRouter)(_stack.unstable_createStandardStackNavigator, _native.StackRouter, {
    activityDefaultThreshold: 2,
    createProps: createJSStackProps
});
/**
 * Renders a JavaScript-based stack navigator.
 *
 * @hideType
 */ const Stack = Object.assign(// `initialRouteName` is configured from the route node by the integration, not by layout props.
JSStack, {
    Screen: _Screen.Screen,
    Protected: _Protected.Protected
});
const _default = Stack;

//# sourceMappingURL=JSStack.js.map
