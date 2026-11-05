"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NavigationContainer", {
    enumerable: true,
    get: function() {
        return NavigationContainer;
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
    const data = /*#__PURE__*/ _interop_require_default(require("react"));
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
const _routerConfigContext = require("../global-state/routerConfigContext");
const _BaseNavigationContainer = require("../react-navigation/core/BaseNavigationContainer");
const _native = require("../react-navigation/native");
const _getPathFromState = require("./getPathFromState");
const _getStateFromPath = require("./getStateFromPath");
const _useBackButton = require("./useBackButton");
const _useLinking = require("./useLinking");
const _validatePathConfig = require("./validatePathConfig");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
globalThis.REACT_NAVIGATION_DEVTOOLS = new WeakMap();
/**
 * Container component which holds the navigation state designed for React Native apps.
 * This should be rendered at the root wrapping the whole app.
 *
 * @param props.direction Text direction of the components. Defaults to `'ltr'`.
 * @param props.theme Theme object for the UI elements.
 * @param props.linking Options for deep linking.
 * @param props.fallback Fallback component to render until we have finished getting initial state. Defaults to `null`.
 * @param props.children Child elements to render the content.
 * @param props.ref Ref object which refers to the navigation object containing helper methods.
 */ function NavigationContainerInner({ direction = _reactnative().I18nManager.getConstants().isRTL ? 'rtl' : 'ltr', theme = _native.DefaultTheme, linking, fallback = null, ref, ...rest }) {
    const routerConfig = _react().default.use(_routerConfigContext.RouterConfigContext);
    if (linking?.config) {
        (0, _validatePathConfig.validatePathConfig)(linking.config);
    }
    const refContainer = _react().default.useRef(null);
    (0, _useBackButton.useBackButton)(refContainer);
    const { getInitialState } = (0, _useLinking.useLinking)(refContainer, {
        prefixes: [],
        ...linking
    });
    const linkingContext = _react().default.useMemo(()=>({
            options: linking
        }), [
        linking
    ]);
    // Kept outside the Suspense boundary so a retry after loading reads the same promise.
    const [initialState] = _react().default.useState(getInitialState);
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_react().default.Suspense, {
        fallback: /*#__PURE__*/ (0, _jsxruntime().jsx)(_native.ThemeProvider, {
            value: theme,
            children: fallback
        }),
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_native.LocaleDirContext.Provider, {
            value: direction,
            children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_native.LinkingContext.Provider, {
                value: linkingContext,
                children: /*#__PURE__*/ (0, _jsxruntime().jsx)(InitialStateNavigationContainer, {
                    ...rest,
                    initialState: initialState,
                    linking: linking,
                    theme: theme,
                    routeNode: routerConfig?.routeNode ?? undefined,
                    containerRef: refContainer,
                    ref: ref
                })
            })
        })
    });
}
function InitialStateNavigationContainer({ initialState: initialStateOrPromise, linking, routeNode, containerRef, ref, ...rest }) {
    const initialState = isThenable(initialStateOrPromise) ? _react().default.use(initialStateOrPromise) : initialStateOrPromise;
    // Set here, not in the parent, so the ref is set once the container mounts after waiting.
    _react().default.useImperativeHandle(ref, ()=>containerRef.current);
    // Add additional linking related info to the ref
    // This will be used by the devtools
    _react().default.useEffect(()=>{
        if (containerRef.current) {
            REACT_NAVIGATION_DEVTOOLS.set(containerRef.current, {
                get linking () {
                    return {
                        ...linking,
                        prefixes: linking?.prefixes ?? [],
                        getStateFromPath: linking?.getStateFromPath ?? _getStateFromPath.getStateFromPath,
                        getPathFromState: linking?.getPathFromState ?? _getPathFromState.getPathFromState
                    };
                }
            });
        }
    });
    if (initialState === undefined) {
        throw new Error('Linking did not produce an initial navigation state. Expo Router always seeds a complete initial state before rendering the navigation container, so this is most likely a bug in expo-router. Please report it at https://github.com/expo/expo/issues.');
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_BaseNavigationContainer.BaseNavigationContainer, {
        ...rest,
        initialState: initialState,
        UNSTABLE_routeNode: routeNode,
        ref: containerRef
    });
}
function isThenable(value) {
    return typeof value === 'object' && value !== null && 'then' in value && typeof value.then === 'function';
}
const NavigationContainer = NavigationContainerInner;

//# sourceMappingURL=NavigationContainer.js.map
