"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getLinkingConfig: null,
    getNavigationConfig: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getLinkingConfig () {
        return getLinkingConfig;
    },
    get getNavigationConfig () {
        return getNavigationConfig;
    }
});
function _expo() {
    const data = require("expo");
    _expo = function() {
        return data;
    };
    return data;
}
const _constants = require("./constants");
const _getReactNavigationConfig = require("./getReactNavigationConfig");
const _getRoutesRedirects = require("./getRoutesRedirects");
const _linking = require("./link/linking");
function getNavigationConfig(routes, metaOnly, { sitemap, notFound }) {
    const config = (0, _getReactNavigationConfig.getReactNavigationConfig)(routes, metaOnly);
    const sitemapRoute = (()=>{
        const path = '_sitemap';
        if (sitemap === false || isPathInRootConfig(config, path)) {
            return {};
        }
        return generateLinkingPathInRoot(_constants.SITEMAP_ROUTE_NAME, path, metaOnly);
    })();
    const notFoundRoute = (()=>{
        const path = '*not-found';
        if (notFound === false || isPathInRootConfig(config, path)) {
            return {};
        }
        return generateLinkingPathInRoot(_constants.NOT_FOUND_ROUTE_NAME, path, metaOnly);
    })();
    return {
        screens: {
            [_constants.INTERNAL_SLOT_NAME]: {
                path: '',
                ...config
            },
            ...sitemapRoute,
            ...notFoundRoute
        }
    };
}
function getLinkingConfig(routes, context, { metaOnly = true, serverUrl, redirects, skipGenerated, sitemap, notFound }) {
    // Returning `undefined` / `null` from `getInitialURL` are valid values, so we need to track if it's been called.
    let hasCachedInitialUrl = false;
    let initialUrl;
    const nativeLinkingKey = context.keys().find((key)=>key.match(/^\.\/\+native-intent\.[tj]sx?$/));
    const nativeLinking = nativeLinkingKey ? context(nativeLinkingKey) : undefined;
    const config = getNavigationConfig(routes, metaOnly, {
        sitemap: skipGenerated ? false : sitemap,
        notFound: skipGenerated ? false : notFound
    });
    return {
        prefixes: [],
        config,
        // A custom getInitialURL is used on native to ensure the app always starts at
        // the root path if it's launched from something other than a deep link.
        // This helps keep the native functionality working like the web functionality.
        // For example, if you had a root navigator where the first screen was `/settings` and the second was `/index`
        // then `/index` would be used on web and `/settings` would be used on native.
        getInitialURL () {
            // Expo Router calls `getInitialURL` twice, which may confuse the user if they provide a custom `getInitialURL`.
            // Therefore we memoize the result.
            if (!hasCachedInitialUrl) {
                if (_expo().Platform.OS === 'web') {
                    initialUrl = serverUrl ?? (0, _linking.getInitialURL)();
                } else {
                    initialUrl = serverUrl ?? (0, _linking.getInitialURL)();
                    if (typeof initialUrl === 'string') {
                        initialUrl = (0, _getRoutesRedirects.applyRedirects)(initialUrl, redirects);
                        if (initialUrl && typeof nativeLinking?.redirectSystemPath === 'function') {
                            initialUrl = nativeLinking.redirectSystemPath({
                                path: initialUrl,
                                initial: true
                            });
                        }
                    } else if (initialUrl) {
                        initialUrl = initialUrl.then((url)=>{
                            url = (0, _getRoutesRedirects.applyRedirects)(url, redirects);
                            if (url && typeof nativeLinking?.redirectSystemPath === 'function') {
                                return nativeLinking.redirectSystemPath({
                                    path: url,
                                    initial: true
                                });
                            }
                            return url;
                        });
                    }
                }
                hasCachedInitialUrl = true;
            }
            return initialUrl;
        },
        subscribe: (0, _linking.subscribe)(nativeLinking, redirects),
        getStateFromPath: _linking.getStateFromPath,
        getPathFromState (state, options) {
            return (0, _linking.getPathFromState)(state, {
                ...config,
                ...options,
                screens: config.screens ?? options?.screens ?? {}
            }) ?? '/';
        }
    };
}
function isPathInRootConfig(config, path) {
    return Object.values(config.screens).some((screenConfig)=>typeof screenConfig === 'string' ? screenConfig === path : screenConfig.path === path);
}
function generateLinkingPathInRoot(name, path, metaOnly) {
    if (metaOnly) {
        return {
            [name]: path
        };
    }
    return {
        [name]: {
            path
        }
    };
}

//# sourceMappingURL=getLinkingConfig.js.map
