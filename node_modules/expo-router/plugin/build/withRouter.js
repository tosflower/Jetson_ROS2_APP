"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
function _schemautils() {
    const data = require("@expo/schema-utils");
    _schemautils = function() {
        return data;
    };
    return data;
}
function _configplugins() {
    const data = require("expo/config-plugins");
    _configplugins = function() {
        return data;
    };
    return data;
}
function _nodeutil() {
    const data = require("node:util");
    _nodeutil = function() {
        return data;
    };
    return data;
}
const schema = require('../options.json');
const withExpoHeadIos = (config)=>{
    return (0, _configplugins().withInfoPlist)(config, (config)=>{
        // TODO: Add a way to enable this...
        // config.modResults.CoreSpotlightContinuation = true;
        // $(PRODUCT_BUNDLE_IDENTIFIER).expo.index_route
        if (!Array.isArray(config.modResults.NSUserActivityTypes)) {
            config.modResults.NSUserActivityTypes = [];
        }
        // This ensures that stored `NSUserActivityType`s can be opened in-app.
        // This is important for moving between native devices or from opening a link that was saved
        // in a Quick Note or Siri Reminder.
        const activityType = '$(PRODUCT_BUNDLE_IDENTIFIER).expo.index_route';
        if (!config.modResults.NSUserActivityTypes.includes(activityType)) {
            config.modResults.NSUserActivityTypes.push(activityType);
        }
        return config;
    });
};
const withGammaScreens = (config)=>{
    return (0, _configplugins().withPodfile)(config, (config)=>{
        if (!config.modResults.contents.includes('RNS_GAMMA_ENABLED')) {
            config.modResults.contents = `# Set by expo-router. This enables Fabric-only features from react-native-screens\nENV['RNS_GAMMA_ENABLED'] ||= '1'\n${config.modResults.contents}`;
        }
        return config;
    });
};
const withRouter = (config, _props)=>{
    const props = _props || {};
    if (Object.hasOwn(props, 'unstable_useServerMiddleware')) {
        warnOnce('`unstable_useServerMiddleware` in the `expo-router` config plugin is deprecated as of SDK 58 and has no effect. Remove it from your app config.');
    }
    if (Object.hasOwn(props, 'unstable_useServerDataLoaders')) {
        warnOnce('`unstable_useServerDataLoaders` in the `expo-router` config plugin is deprecated as of SDK 58 and has no effect. Remove it from your app config.');
    }
    if (Object.hasOwn(props, 'unstable_useServerRendering')) {
        warnOnce('`unstable_useServerRendering` in the `expo-router` config plugin is deprecated as of SDK 58 and has no effect. Remove it from your app config.');
    }
    (0, _schemautils().validate)(schema, props);
    if (props.apiRoutes === true && ![
        'static',
        'server'
    ].includes(config.web?.output ?? '')) {
        throw new Error('The `apiRoutes` option requires `web.output` to be set to `static` or `server`.');
    }
    withExpoHeadIos(config);
    withGammaScreens(config);
    const router = normalizeAsyncRoutesProp({
        ...config.extra?.router,
        ...props
    });
    return {
        ...config,
        extra: {
            ...config.extra,
            router
        }
    };
};
function normalizeAsyncRoutesProp(props) {
    const asyncRoutes = props.asyncRoutes;
    if (asyncRoutes == null) {
        return {
            ...props,
            asyncRoutes: {
                web: true
            }
        };
    }
    if (typeof asyncRoutes === 'object' && asyncRoutes.web == null && asyncRoutes.default == null) {
        return {
            ...props,
            asyncRoutes: {
                ...asyncRoutes,
                web: true
            }
        };
    }
    return props;
}
const warnMap = {};
function warnOnce(message) {
    if (!warnMap[message]) {
        warnMap[message] = true;
        console.warn((0, _nodeutil().styleText)('red', message, {
            stream: process.stderr
        }));
    }
}
const _default = withRouter;

//# sourceMappingURL=withRouter.js.map
