'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ExperimentalStack: null,
    default: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ExperimentalStack () {
        return ExperimentalStack;
    },
    get default () {
        return _default;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _native = require("../../react-navigation/native");
const _standardnavigation = require("../../standard-navigation");
const _children = require("../../utils/children");
const _Protected = require("../../views/Protected");
const _StackClient = require("../StackClient");
const _stackutils = require("../stack-utils");
const _createBaseStackProps = require("../stack-utils/createBaseStackProps");
const _createExperimentalStackNavigator = require("./createExperimentalStackNavigator");
const RNExperimentalStack = (0, _standardnavigation.integrateWithRouter)(_createExperimentalStackNavigator.createStandardExperimentalStackNavigator, _native.StackRouter, {
    activityDefaultThreshold: 2,
    createProps: (args)=>({
            ...(0, _createBaseStackProps.createBaseStackProps)(args),
            removeRoutes: (routeNames)=>args.dispatch({
                    type: 'REMOVE_ROUTES',
                    payload: {
                        routeNames
                    }
                })
        })
});
/**
 * Renders the new `react-native-screens/experimental` native stack.
 *
 * Sibling to `Stack`. Native-only — on web it falls back to the standard `Stack`.
 * Opt-in per navigator: replace `<Stack />` with `<ExperimentalStack />` in the
 * specific layout you want to migrate.
 *
 * @experimental
 */ const ExperimentalStack = Object.assign((props)=>{
    const rnChildren = (0, _react().useMemo)(()=>{
        const filtered = _react().Children.toArray(props.children).filter((child)=>!(0, _children.isChildOfType)(child, _stackutils.StackHeader));
        return (0, _stackutils.mapProtectedScreen)({
            guard: true,
            children: filtered
        }).children;
    }, [
        props.children
    ]);
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_standardnavigation.IsWithinNativeNavigator, {
        value: true,
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(RNExperimentalStack, {
            ...props,
            children: rnChildren,
            UNSTABLE_router: _StackClient.stackRouterOverride
        })
    });
}, {
    Screen: _stackutils.StackScreen,
    Protected: _Protected.Protected
});
const _default = ExperimentalStack;

//# sourceMappingURL=index.js.map
