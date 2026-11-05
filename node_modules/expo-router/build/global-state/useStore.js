'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useRouterConfig", {
    enumerable: true,
    get: function() {
        return useRouterConfig;
    }
});
function _expoconstants() {
    const data = /*#__PURE__*/ _interop_require_default(require("expo-constants"));
    _expoconstants = function() {
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
const _getStateFromPathforks = require("../fork/getStateFromPath-forks");
const _getLinkingConfig = require("../getLinkingConfig");
const _getReactNavigationConfig = require("../getReactNavigationConfig");
const _getRoutes = require("../getRoutes");
const _useScreens = require("../useScreens");
const _splash = require("../utils/splash");
const _url = require("../utils/url");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function useRouterConfig(context, linkingConfigOptions, serverUrl) {
    const config = _expoconstants().default.expoConfig?.extra?.router;
    const configValue = (0, _react().useMemo)(()=>{
        let linking;
        let rootComponent = _react().Fragment;
        const routeNode = (0, _getRoutes.getRoutes)(context, {
            ...config,
            skipGenerated: true,
            ignoreEntryPoints: true,
            platform: _reactnative().Platform.OS,
            preserveRedirectAndRewrites: true
        });
        const redirects = [
            config?.redirects,
            config?.rewrites
        ].filter(Boolean).flat().map((route)=>{
            return [
                (0, _getStateFromPathforks.routePatternToRegex)((0, _getReactNavigationConfig.parseRouteSegments)(route.source)),
                route,
                (0, _url.shouldLinkExternally)(route.destination)
            ];
        });
        if (routeNode) {
            // We have routes, so get the linking config and the root component
            linking = (0, _getLinkingConfig.getLinkingConfig)(routeNode, context, {
                metaOnly: linkingConfigOptions.metaOnly,
                serverUrl,
                redirects,
                skipGenerated: config?.skipGenerated ?? false,
                sitemap: config?.sitemap ?? true,
                notFound: config?.notFound ?? true
            });
            rootComponent = (0, _useScreens.getQualifiedRouteComponent)(routeNode);
        } else {
            // Only error in production, in development we will show the onboarding screen
            if (process.env.NODE_ENV === 'production') {
                throw new Error('No routes found');
            }
            // In development, we will show the onboarding screen
            rootComponent = _react().Fragment;
        }
        return {
            routerConfig: {
                linking,
                redirects,
                routeNode
            },
            rootComponent
        };
    }, [
        config,
        context,
        linkingConfigOptions,
        serverUrl
    ]);
    (0, _react().useEffect)(()=>{
        return _splash.cancelSplashScreenAnimationFrame;
    }, []);
    return configValue;
}

//# sourceMappingURL=useStore.js.map
