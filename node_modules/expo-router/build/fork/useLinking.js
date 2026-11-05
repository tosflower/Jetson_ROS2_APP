"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getInitialURLWithTimeout: null,
    useLinking: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getInitialURLWithTimeout () {
        return getInitialURLWithTimeout;
    },
    get useLinking () {
        return useLinking;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _createSeededNavigationState = require("../global-state/createSeededNavigationState");
const _routerConfigContext = require("../global-state/routerConfigContext");
const _layoutAnchor = require("../layoutAnchor");
const _native = require("../react-navigation/native");
const _stateKeys = require("../react-navigation/routers/stateKeys");
const _extractPathFromURL = require("./extractPathFromURL");
const linkingHandlers = [];
function useLinking(_ref, { prefixes, config, getInitialURL = getInitialURLWithTimeout, getStateFromPath = _native.getStateFromPath }) {
    const routerConfig = (0, _react().use)(_routerConfigContext.RouterConfigContext);
    (0, _react().useEffect)(()=>{
        if (process.env.NODE_ENV === 'production') {
            return undefined;
        }
        if (linkingHandlers.length) {
            console.error([
                'Looks like you have configured linking in multiple places. This is likely an error since deep links should only be handled in one place to avoid conflicts. Make sure that:',
                "- You don't have multiple NavigationContainers in the app",
                '- Only a single instance of the root component is rendered'
            ].join('\n').trim());
        }
        const handler = Symbol();
        linkingHandlers.push(handler);
        return ()=>{
            const index = linkingHandlers.indexOf(handler);
            if (index > -1) {
                linkingHandlers.splice(index, 1);
            }
        };
    }, []);
    // `NavigationContainer` only consumes this function from the first render, keeping initialization options consistent.
    const getInitialState = ()=>{
        const getStateFromURL = (url)=>{
            let path = url ? (0, _extractPathFromURL.extractExpoPathFromURL)(prefixes, url) : undefined;
            if (path !== undefined && !path.startsWith('/')) {
                path = `/${path}`;
            }
            const parsedState = path ? getStateFromPath(path, config) : undefined;
            const routeNode = routerConfig?.routeNode;
            return routeNode ? (0, _layoutAnchor.withLoadedLayouts)(()=>(0, _createSeededNavigationState.createSeededRootState)(parsedState, routeNode)) : (0, _createSeededNavigationState.completeParsedState)(parsedState, _stateKeys.ROOT_CHAIN);
        };
        const url = getInitialURL();
        if (typeof url !== 'string' && url != null) {
            return url.then(getStateFromURL);
        }
        return getStateFromURL(url);
    };
    return {
        getInitialState
    };
}
function getInitialURLWithTimeout() {
    return typeof window === 'undefined' ? '' : window.location.href;
}

//# sourceMappingURL=useLinking.js.map
