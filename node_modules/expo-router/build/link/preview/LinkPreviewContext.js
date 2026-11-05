"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    LinkPreviewContextProvider: null,
    useLinkPreviewContext: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get LinkPreviewContextProvider () {
        return LinkPreviewContextProvider;
    },
    get useLinkPreviewContext () {
        return useLinkPreviewContext;
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
const _internalNavigationEvents = require("../../global-state/internalNavigationEvents");
function containsActiveRoute(state, key) {
    // Preloaded routes are deliberately excluded, including their active children.
    const routes = state.type === 'stack' ? state.routes.slice(0, (state.index ?? 0) + 1) : state.routes;
    return routes.some((route)=>route.key === key || route.state && containsActiveRoute(route.state, key));
}
const LinkPreviewContext = /*#__PURE__*/ (0, _react().createContext)(undefined);
function createOpenPreviewKeyStore() {
    let key;
    const listeners = new Set();
    return {
        getSnapshot: ()=>key,
        subscribe: (listener)=>{
            listeners.add(listener);
            return ()=>{
                listeners.delete(listener);
            };
        },
        set: (nextKey)=>{
            if (key === nextKey) return;
            key = nextKey;
            listeners.forEach((listener)=>listener());
        }
    };
}
function LinkPreviewContextProvider({ children }) {
    const [store] = (0, _react().useState)(createOpenPreviewKeyStore);
    const openPreviewKey = (0, _react().useSyncExternalStore)(store.subscribe, store.getSnapshot, store.getSnapshot);
    const setOpenPreviewKey = (0, _react().useCallback)((key)=>{
        store.set(key);
    }, [
        store
    ]);
    (0, _react().useEffect)(()=>_internalNavigationEvents.internalNavigationEvents.addListener('actionDispatched', ({ payload, state })=>{
            const key = store.getSnapshot();
            if (key !== undefined && payload && '__internal__PreviewKey' in payload && payload.__internal__PreviewKey === key && !containsActiveRoute(state, key)) {
                // A stale native key falls back to ordinary navigation and won't receive
                // the matching transitionEnd. Restore animations after that action commits.
                setOpenPreviewKey(undefined);
            }
        }), [
        setOpenPreviewKey,
        store
    ]);
    const isStackAnimationDisabled = openPreviewKey !== undefined;
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(LinkPreviewContext.Provider, {
        value: {
            isStackAnimationDisabled,
            openPreviewKey,
            getOpenPreviewKey: store.getSnapshot,
            setOpenPreviewKey
        },
        children: children
    });
}
const useLinkPreviewContext = ()=>{
    const context = (0, _react().use)(LinkPreviewContext);
    if (context == null) {
        throw new Error('useLinkPreviewContext must be used within a LinkPreviewContextProvider. This is likely a bug in Expo Router.');
    }
    return context;
};

//# sourceMappingURL=LinkPreviewContext.js.map
