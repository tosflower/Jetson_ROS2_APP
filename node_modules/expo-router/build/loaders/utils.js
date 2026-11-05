"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    bumpDevLoaderRevision: null,
    fetchLoader: null,
    getLoaderModulePath: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get bumpDevLoaderRevision () {
        return bumpDevLoaderRevision;
    },
    get fetchLoader () {
        return fetchLoader;
    },
    get getLoaderModulePath () {
        return getLoaderModulePath;
    }
});
const _url = require("../utils/url");
function getLoaderModulePath(routePath) {
    const { pathname, search } = (0, _url.parseUrlUsingCustomBase)(routePath);
    const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
    const pathSegment = normalizedPath === '/' ? '/index' : normalizedPath;
    return `/_expo/loaders${pathSegment}${search}`;
}
// The platform HTTP cache has no eviction API; a fresh query-string revision is how dev HMR
// stops an edited loader's declared `max-age` from serving the pre-edit response.
let devLoaderCacheRevision = 0;
function bumpDevLoaderRevision() {
    devLoaderCacheRevision++;
}
async function fetchLoader(routePath, requestInit = {}) {
    let loaderPath = getLoaderModulePath(routePath);
    if (__DEV__ && devLoaderCacheRevision > 0) {
        loaderPath += `${loaderPath.includes('?') ? '&' : '?'}_expo_loader_v=${devLoaderCacheRevision}`;
    }
    const headers = new Headers(requestInit.headers);
    headers.set('Accept', 'application/json');
    const response = await fetch(loaderPath, {
        ...requestInit,
        headers
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch loader data: ${response.status}`);
    }
    try {
        return await response.json();
    } catch (error) {
        throw new Error(`Failed to parse loader data: ${error}`);
    }
}

//# sourceMappingURL=utils.js.map
