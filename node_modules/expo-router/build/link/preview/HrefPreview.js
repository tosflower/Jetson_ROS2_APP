'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HrefPreview", {
    enumerable: true,
    get: function() {
        return HrefPreview;
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
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
const _constants = require("../../constants");
const _compositionoptions = require("../../fork/native-stack/composition-options");
const _routerConfigContext = require("../../global-state/routerConfigContext");
const _useRouteInfo = require("../../global-state/useRouteInfo");
const _utils = require("../../global-state/utils");
const _hooks = require("../../hooks");
const _RootNavigationStateContext = require("../../react-navigation/core/RootNavigationStateContext");
const _native = require("../../react-navigation/native");
const _routeNode = require("../../routeNode");
const _useNavigation = require("../../useNavigation");
const _useScreens = require("../../useScreens");
const _getStateForHref = require("../getStateForHref");
const _linking = require("../linking");
const _PreviewRouteContext = require("./PreviewRouteContext");
function HrefPreview({ href }) {
    // TODO(@ubax): Extract `linking` and `routeNode` into separate contexts to avoid unrelated rerenders.
    const { segments: routeSegments } = (0, _useRouteInfo.useRouteInfo)();
    const { linking, routeNode } = (0, _react().use)(_routerConfigContext.RouterConfigContext) ?? {};
    const rootNavigationState = (0, _react().use)(_RootNavigationStateContext.RootNavigationStateContext);
    const hrefState = (0, _react().useMemo)(()=>(0, _getStateForHref.getStateForHref)(href, {
            segments: routeSegments
        }, linking), [
        href,
        routeSegments,
        linking
    ]);
    const index = hrefState?.index ?? 0;
    let isProtected = false;
    if (hrefState?.routes[index]?.name === _constants.INTERNAL_SLOT_NAME) {
        let routerState = hrefState;
        let rnState = rootNavigationState;
        while(routerState && rnState){
            const routerRoute = routerState.routes[0];
            // When the route we want to show is not present in react-navigation state
            // Then most likely it is a protected route
            if (rnState.stale === false && !rnState.routeNames?.includes(routerRoute.name)) {
                isProtected = true;
                break;
            }
            const rnIndex = rnState.routes.findIndex((route)=>route.name === routerRoute.name);
            if (rnIndex === -1) {
                break;
            }
            routerState = routerRoute.state;
            rnState = rnState.routes[rnIndex]?.state;
        }
        if (!isProtected) {
            return /*#__PURE__*/ (0, _jsxruntime().jsx)(PreviewForRootHrefState, {
                hrefState: hrefState,
                href: href,
                rootRouteNode: routeNode
            });
        }
    }
    const pathname = href.toString();
    const segments = pathname.split('/').filter(Boolean);
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_PreviewRouteContext.PreviewRouteContext.Provider, {
        value: {
            params: {},
            pathname,
            segments
        },
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(PreviewForInternalRoutes, {})
    });
}
function PreviewForRootHrefState({ hrefState, href, rootRouteNode }) {
    const navigation = (0, _useNavigation.useNavigation)();
    const { routeNode, params, state } = getParamsAndNodeFromHref(hrefState, rootRouteNode);
    const path = state ? (0, _linking.getPathFromState)(state) : undefined;
    const value = (0, _react().useMemo)(()=>({
            params,
            pathname: href.toString(),
            segments: path?.split('/').filter(Boolean) || []
        }), [
        params,
        href
    ]);
    // This can happen in a theoretical case where the state is not yet initialized or is incorrectly initialized.
    // This check ensures TypeScript type safety as well.
    if (!routeNode) {
        return null;
    }
    const Component = (0, _useScreens.getQualifiedRouteComponent)(routeNode);
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_PreviewRouteContext.PreviewRouteContext, {
        value: value,
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_compositionoptions.CompositionContext, {
            value: {
                set: ()=>{},
                unset: ()=>{}
            },
            children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_native.NavigationContext, {
                value: navigationPropWithWarnings,
                children: /*#__PURE__*/ (0, _jsxruntime().jsx)(Component, {
                    navigation: navigation
                })
            })
        })
    });
}
function PreviewForInternalRoutes() {
    const pathname = (0, _hooks.usePathname)();
    return /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnative().View, {
        style: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
            backgroundColor: 'white'
        },
        children: [
            /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Text, {
                style: {
                    fontWeight: '600',
                    fontSize: 24
                },
                children: "Invalid preview"
            }),
            /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().Text, {
                style: {
                    fontWeight: '200',
                    fontSize: 14
                },
                children: pathname
            })
        ]
    });
}
function getParamsAndNodeFromHref(hrefState, rootRouteNode) {
    const index = hrefState?.index ?? 0;
    if (hrefState?.routes[index] && hrefState.routes[index].name !== _constants.INTERNAL_SLOT_NAME) {
        const error = `Expo Router Error: Expected navigation state to begin with one of [${(0, _utils.getRootStackRouteNames)().join(', ')}] routes`;
        if (process.env.NODE_ENV !== 'production') {
            throw new Error(error);
        } else {
            console.warn(error);
        }
    }
    const initialState = hrefState?.routes[index]?.state;
    const { routeNode, params } = (0, _routeNode.findRouteNodeAndParamsForState)(rootRouteNode, initialState);
    // Linking has already parsed these values into the public search-param shape.
    return {
        params: params,
        routeNode,
        state: initialState
    };
}
const displayWarningForProp = (prop)=>{
    if (process.env.NODE_ENV !== 'production') {
        console.warn(`navigation.${prop} should not be used in a previewed screen. To fix this issue, wrap navigation calls with 'if (!isPreview) { ... }'.`);
    }
};
const createNOOPWithWarning = (prop)=>()=>displayWarningForProp(prop);
const navigationPropWithWarnings = {
    setParams: createNOOPWithWarning('setParams'),
    setOptions: createNOOPWithWarning('setOptions'),
    addListener: ()=>()=>{},
    removeListener: ()=>{},
    isFocused: ()=>true,
    canGoBack: ()=>false,
    dispatch: createNOOPWithWarning('dispatch'),
    navigate: createNOOPWithWarning('navigate'),
    goBack: createNOOPWithWarning('goBack'),
    reset: createNOOPWithWarning('reset'),
    push: createNOOPWithWarning('push'),
    pop: createNOOPWithWarning('pop'),
    popToTop: createNOOPWithWarning('popToTop'),
    preload: createNOOPWithWarning('preload'),
    getId: ()=>{
        displayWarningForProp('getId');
        return '';
    },
    // @ts-expect-error
    getParent: createNOOPWithWarning('getParent'),
    getState: ()=>{
        displayWarningForProp('getState');
        return {
            key: '',
            routeKeySeq: 0,
            index: 0,
            routeNames: [],
            routes: [],
            type: '',
            stale: false
        };
    }
};

//# sourceMappingURL=HrefPreview.js.map
