'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useLoaderData", {
    enumerable: true,
    get: function() {
        return useLoaderData;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _Route = require("../Route");
const _LoaderContext = require("../loaders/LoaderContext");
const _ServerDataLoaderContext = require("../loaders/ServerDataLoaderContext");
const _readLoaderData = require("../loaders/readLoaderData");
const _resolveLoaderPath = require("../loaders/resolveLoaderPath");
const _utils = require("../loaders/utils");
const _useCurrentRouteInfo = require("./useCurrentRouteInfo");
function useLoaderData() {
    const ctx = (0, _react().use)(_LoaderContext.LoaderContext);
    const serverDataLoaderContext = (0, _react().use)(_ServerDataLoaderContext.ServerDataLoaderContext);
    const { client, store } = ctx;
    const routeInfo = (0, _useCurrentRouteInfo.useCurrentRouteInfo)();
    const contextKey = (0, _Route.useContextKey)();
    const resolvedPath = (0, _react().useMemo)(()=>(0, _resolveLoaderPath.resolveLoaderPath)(contextKey, routeInfo), [
        contextKey,
        routeInfo
    ]);
    // Loader data stays in the shared Suspense store; local state only invalidates this reader.
    const [, setVersion] = (0, _react().useState)(0);
    // Seed first so hydration is not mistaken for an update missed before subscription.
    if (!serverDataLoaderContext) {
        const hydrationData = globalThis.__EXPO_ROUTER_LOADER_DATA__;
        if (hydrationData && resolvedPath in hydrationData) {
            store.seed(resolvedPath, hydrationData[resolvedPath]);
            delete hydrationData[resolvedPath];
        }
    }
    // Keep this render-scoped rather than in a ref: only the committed render's effect should
    // compare the entry it rendered with the entry present when the subscription attaches.
    const entryAtRender = store.get(resolvedPath);
    (0, _react().useEffect)(()=>{
        // Seeded routes do not reach a read miss, so register their fetcher explicitly for HMR.
        client.registerFetcher(resolvedPath, _utils.fetchLoader);
        const unsubscribe = client.subscribeLoader(resolvedPath, (result, isCurrentSource)=>{
            if (isCurrentSource) {
                store.set(resolvedPath, result);
                setVersion((version)=>version + 1);
            }
        }, {
            committed: true
        });
        if (store.get(resolvedPath) !== entryAtRender) {
            setVersion((version)=>version + 1);
        }
        return ()=>{
            store.dispose(resolvedPath);
            unsubscribe(()=>store.teardown(resolvedPath));
        };
    // NOTE(@hassankhan): `entryAtRender` is intentionally omitted: including it would recreate
    // the persistent subscription whenever the store entry changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        client,
        resolvedPath,
        store
    ]);
    // Server renders read request-injected loader data directly.
    if (serverDataLoaderContext) {
        return serverDataLoaderContext[resolvedPath];
    }
    const result = (0, _readLoaderData.readLoaderData)(ctx, resolvedPath, _utils.fetchLoader);
    // React can replay a suspended render once its promise settles. The store then holds the
    // settled value, so the replay must still call `use()`, or React throws "Update hook called
    // on initial render" for every hook after this one. A fulfilled thenable makes React reuse
    // the original promise without suspending.
    return (0, _react().use)(result instanceof Promise ? result : fulfilled(result));
}
function fulfilled(value) {
    return {
        status: 'fulfilled',
        value,
        then: (onFulfilled)=>Promise.resolve(value).then(onFulfilled)
    }; // `status` and `value` are the React thenable extensions, not part of `PromiseLike`.
}

//# sourceMappingURL=useLoaderData.js.map
