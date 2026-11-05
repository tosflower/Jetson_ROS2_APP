'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ExperimentalStackView", {
    enumerable: true,
    get: function() {
        return ExperimentalStackView;
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
    const data = /*#__PURE__*/ _interop_require_wildcard(require("react"));
    _react = function() {
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
const _reactnativescreens = require("../../optional-libraries/react-native-screens");
const _useDismissedRouteError = require("../../react-navigation/native-stack/utils/useDismissedRouteError");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const SUPPORTED_OPTION_KEYS = new Set([
    'title',
    'headerShown',
    'headerTransparent',
    'headerBackVisible'
]);
function ExperimentalStackView({ state, emit, pop, descriptors, isPreloaded, isRemovalPrevented }) {
    const { setNextDismissedKey } = (0, _useDismissedRouteError.useDismissedRouteError)(state, isPreloaded);
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
        style: styles.container,
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnativescreens.StackV5.Host, {
            children: state.routes.map((route)=>{
                const descriptor = descriptors[route.key];
                const routeIsPreloaded = isPreloaded(route.key);
                const routeIsRemovalPrevented = isRemovalPrevented(route.key);
                const options = descriptor.options;
                return /*#__PURE__*/ (0, _jsxruntime().jsx)(ScreenView, {
                    routeKey: route.key,
                    routeName: route.name,
                    descriptor: descriptor,
                    options: options,
                    isPreloaded: routeIsPreloaded,
                    preventNativeDismiss: routeIsRemovalPrevented,
                    onWillAppear: ()=>{
                        emit({
                            type: 'transitionStart',
                            data: {
                                closing: false
                            },
                            target: route.key
                        });
                    },
                    onWillDisappear: ()=>{
                        emit({
                            type: 'transitionStart',
                            data: {
                                closing: true
                            },
                            target: route.key
                        });
                    },
                    onDidAppear: ()=>{
                        emit({
                            type: 'transitionEnd',
                            data: {
                                closing: false
                            },
                            target: route.key
                        });
                    },
                    onDidDisappear: ()=>{
                        emit({
                            type: 'transitionEnd',
                            data: {
                                closing: true
                            },
                            target: route.key
                        });
                    },
                    onNativeDismiss: ()=>{
                        // Native dismissal (e.g. swipe-to-dismiss). JS state still has the route —
                        // catch up by dispatching pop and arming useDismissedRouteError so a stale
                        // `usePreventRemove` surfaces an actionable console.error.
                        pop(1, route.key);
                        setNextDismissedKey(route.key);
                    },
                    onNativeDismissPrevented: ()=>{
                        if (routeIsRemovalPrevented) {
                            // A real pop runs child-first prevention checks and notifies the nested route
                            // that owns the guard; emitting directly here would only reach this route.
                            pop(1, route.key);
                        } else {
                            console.warn(`ExperimentalStack received \`onNativeDismissPrevented\` for route '${route.name}' without an active removal guard. The dismiss action was ignored because prevention context and native state are out of sync.`);
                        }
                        emit({
                            type: 'gestureCancel',
                            data: undefined,
                            target: route.key
                        });
                    }
                }, route.key);
            })
        })
    });
}
function ScreenView({ routeKey, routeName, descriptor, options, isPreloaded, preventNativeDismiss, ...lifecycle }) {
    useUnsupportedOptionsWarning(options, routeName);
    const headerConfigProps = {
        title: options.title,
        hidden: options.headerShown === undefined ? undefined : !options.headerShown,
        transparent: options.headerTransparent,
        backButtonHidden: options.headerBackVisible === undefined ? undefined : !options.headerBackVisible
    };
    return /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnativescreens.StackV5.Screen, {
        activityMode: isPreloaded ? 'detached' : 'attached',
        screenKey: routeKey,
        preventNativeDismiss: preventNativeDismiss,
        ...lifecycle,
        children: [
            /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
                style: styles.scene,
                children: descriptor.render()
            }),
            /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnativescreens.StackV5.HeaderConfig, {
                ...headerConfigProps
            })
        ]
    });
}
// Composition components like <Stack.Screen.Title> and <Stack.Header> emit benign
// extras such as `headerTitleStyle: {}`, `headerLargeTitle: undefined`, or
// `headerStyle: { backgroundColor: undefined }` even when the user supplied no
// value. Treat any plain object whose enumerable values are all themselves no-op
// as no-op too, so the unsupported-option warning fires only on values that would
// actually have an effect under <Stack />.
function isNoOpOptionValue(value) {
    if (value === undefined) return true;
    if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
    const record = value;
    for(const key in record){
        if (!isNoOpOptionValue(record[key])) return false;
    }
    return true;
}
function useUnsupportedOptionsWarning(options, routeName) {
    const warnedRef = _react().useRef(false);
    _react().useEffect(()=>{
        if (!__DEV__ || warnedRef.current) return;
        const optionsRecord = options;
        const unsupported = Object.keys(options).filter((key)=>!SUPPORTED_OPTION_KEYS.has(key) && !isNoOpOptionValue(optionsRecord[key]));
        if (unsupported.length === 0) return;
        warnedRef.current = true;
        console.warn(`ExperimentalStack: ignoring unsupported screenOption${unsupported.length > 1 ? 's' : ''} ${unsupported.map((key)=>`'${key}'`).join(', ')} on route '${routeName}'. ` + `The new react-native-screens experimental Stack only supports 'title', 'headerShown', 'headerTransparent', and 'headerBackVisible'. ` + `Custom headers, presentation, animation, sheets, and status bar options are not yet available — keep using <Stack /> for those screens.`);
    }, [
        options,
        routeName
    ]);
}
const styles = _reactnative().StyleSheet.create({
    container: {
        flex: 1
    },
    scene: {
        flex: 1,
        backgroundColor: 'white'
    }
});

//# sourceMappingURL=ExperimentalStackView.js.map
