"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useLinking", {
    enumerable: true,
    get: function() {
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
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
const _createSeededNavigationState = require("../global-state/createSeededNavigationState");
const _getRouteInfoFromState = require("../global-state/getRouteInfoFromState");
const _routerConfigContext = require("../global-state/routerConfigContext");
const _routingQueueContext = require("../global-state/routingQueueContext");
const _layoutAnchor = require("../layoutAnchor");
const _native = require("../react-navigation/native");
const _stateKeys = require("../react-navigation/routers/stateKeys");
const _extractPathFromURL = require("./extractPathFromURL");
const _getInitialURLWithTimeout = require("./getInitialURLWithTimeout");
const linkingHandlers = [];
function getInitialPath(prefixes, url) {
    const path = (0, _extractPathFromURL.extractExpoPathFromURL)(prefixes, url);
    return path.startsWith('/') ? path : `/${path}`;
}
function useLinking(ref, { prefixes, filter, config, getInitialURL = ()=>(0, _getInitialURLWithTimeout.getInitialURLWithTimeout)(), subscribe = (listener)=>{
    const callback = ({ url })=>listener(url);
    const subscription = _reactnative().Linking.addEventListener('url', callback);
    // Storing this in a local variable stops Jest from complaining about import after teardown
    // @ts-expect-error: removeEventListener is not present in newer RN versions
    const removeEventListener = _reactnative().Linking.removeEventListener?.bind(_reactnative().Linking);
    return ()=>{
        // https://github.com/facebook/react-native/commit/6d1aca806cee86ad76de771ed3a1cc62982ebcd7
        if (subscription?.remove) {
            subscription.remove();
        } else {
            removeEventListener?.('url', callback);
        }
    };
}, getStateFromPath = _native.getStateFromPath }) {
    const routerConfig = (0, _react().use)(_routerConfigContext.RouterConfigContext);
    const enqueue = (0, _routingQueueContext.useEnqueueRoutingIntent)();
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
    const getStateFromURL = (0, _react().useEffectEvent)((url)=>{
        if (!url || filter && !filter(url)) {
            return undefined;
        }
        const path = (0, _extractPathFromURL.extractExpoPathFromURL)(prefixes, url);
        if (path !== undefined) {
            // TODO(@ubax): check if ref.current?.getRootState() can be replaced with the context read
            const segments = (0, _getRouteInfoFromState.getRouteSegmentsFromState)(ref.current?.getRootState());
            return getStateFromPath(path, config, segments);
        }
        return undefined;
    });
    const getInitialState = (0, _react().useCallback)(()=>{
        const url = getInitialURL();
        const createInitialState = (url)=>{
            const shouldParseURL = url && (!filter || filter(url));
            const parsedState = shouldParseURL ? getStateFromPath(getInitialPath(prefixes, url), config) : undefined;
            const routeNode = routerConfig?.routeNode;
            return routeNode ? (0, _layoutAnchor.withLoadedLayouts)(()=>(0, _createSeededNavigationState.createSeededRootState)(parsedState, routeNode)) : (0, _createSeededNavigationState.completeParsedState)(parsedState, _stateKeys.ROOT_CHAIN);
        };
        if (url != null && typeof url !== 'string') {
            return url.then(createInitialState);
        }
        return createInitialState(url);
    }, [
        config,
        filter,
        getInitialURL,
        getStateFromPath,
        prefixes,
        routerConfig
    ]);
    (0, _react().useEffect)(()=>{
        const listener = (url)=>{
            const navigation = ref.current;
            const path = getInitialPath(prefixes, url);
            const state = navigation ? getStateFromURL(url) : undefined;
            if (navigation && state) {
                const rootState = navigation.getRootState();
                if (state.routes.some((r)=>!rootState?.routeNames.includes(r.name))) {
                    return;
                }
                enqueue({
                    type: 'NAVIGATE_TO_HREF',
                    payload: {
                        href: path,
                        originalHref: url,
                        options: {
                            event: 'NAVIGATE',
                            __internal__popToNavigator: true
                        }
                    }
                });
            }
        };
        return subscribe(listener);
    }, [
        enqueue,
        prefixes,
        ref,
        subscribe
    ]);
    return {
        getInitialState
    };
}

//# sourceMappingURL=useLinking.native.js.map
