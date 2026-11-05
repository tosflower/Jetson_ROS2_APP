'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    StackRouter: null,
    default: null,
    stackRouterOverride: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get StackRouter () {
        return _stackrouter.StackRouter;
    },
    get default () {
        return _default;
    },
    get stackRouterOverride () {
        return _stackrouter.stackRouterOverride;
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
const _createNativeStackNavigator = require("../fork/native-stack/createNativeStackNavigator");
const _LinkPreviewContext = require("../link/preview/LinkPreviewContext");
const _navigationParams = require("../navigationParams");
const _standardnavigation = require("../standard-navigation");
const _children = require("../utils/children");
const _Protected = require("../views/Protected");
const _createNativeStackProps = require("./createNativeStackProps");
const _stackrouter = require("./stack-router");
const _stackutils = require("./stack-utils");
const RNStack = (0, _standardnavigation.integrateWithRouter)(_createNativeStackNavigator.createStandardNativeStackNavigator, _stackrouter.StackRouter, {
    activityDefaultThreshold: 2,
    createProps: _createNativeStackProps.createNativeStackProps
});
/**
 * Renders a native stack navigator.
 *
 * @hideType
 */ const Stack = Object.assign((props)=>{
    const { isStackAnimationDisabled } = (0, _LinkPreviewContext.useLinkPreviewContext)();
    const screenOptionsWithCompositionAPIOptions = (0, _react().useMemo)(()=>{
        const stackHeader = _react().Children.toArray(props.children).find((child)=>(0, _children.isChildOfType)(child, _stackutils.StackHeader));
        if (stackHeader) {
            const screenStackProps = {
                children: stackHeader
            };
            const currentOptions = props.screenOptions;
            if (currentOptions) {
                if (typeof currentOptions === 'function') {
                    return (...args)=>{
                        const options = currentOptions(...args);
                        return (0, _stackutils.appendScreenStackPropsToOptions)(options, screenStackProps);
                    };
                }
                return (0, _stackutils.appendScreenStackPropsToOptions)(currentOptions, screenStackProps);
            } else {
                return (0, _stackutils.appendScreenStackPropsToOptions)({}, screenStackProps);
            }
        } else if (props.screenOptions) {
            const screenOptions = props.screenOptions;
            if (typeof screenOptions === 'function') {
                return (0, _stackutils.validateStackPresentation)(screenOptions);
            }
            return (0, _stackutils.validateStackPresentation)(screenOptions);
        }
        return props.screenOptions;
    }, [
        props.screenOptions,
        props.children
    ]);
    const screenOptions = (0, _react().useMemo)(()=>{
        const condition = isStackAnimationDisabled ? ()=>true : shouldDisableAnimationBasedOnParams;
        return disableAnimationInScreenOptions(screenOptionsWithCompositionAPIOptions, condition);
    }, [
        screenOptionsWithCompositionAPIOptions,
        isStackAnimationDisabled
    ]);
    const rnChildren = (0, _react().useMemo)(()=>(0, _stackutils.mapProtectedScreen)({
            guard: true,
            children: props.children
        }).children, [
        props.children
    ]);
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_standardnavigation.IsWithinNativeNavigator, {
        value: true,
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(RNStack, {
            ...props,
            children: rnChildren,
            screenOptions: screenOptions
        })
    });
}, {
    Screen: _stackutils.StackScreen,
    Protected: _Protected.Protected,
    Header: _stackutils.StackHeader,
    SearchBar: _stackutils.StackSearchBar,
    Title: _stackutils.StackTitle,
    Toolbar: _stackutils.StackToolbar
});
function disableAnimationInScreenOptions(options, condition) {
    if (options && typeof options === 'function') {
        return (props)=>{
            const oldOptions = options(props);
            if (condition(props.route)) {
                return {
                    ...oldOptions,
                    animation: 'none'
                };
            }
            return oldOptions ?? {};
        };
    }
    return (props)=>{
        if (condition(props.route)) {
            return {
                ...options ?? {},
                animation: 'none'
            };
        }
        return options ?? {};
    };
}
function shouldDisableAnimationBasedOnParams(route) {
    const expoParams = (0, _navigationParams.getInternalExpoRouterParams)(route.params);
    return !!expoParams[_navigationParams.INTERNAL_EXPO_ROUTER_NO_ANIMATION_PARAM_NAME];
}
const _default = Stack;

//# sourceMappingURL=StackClient.js.map
