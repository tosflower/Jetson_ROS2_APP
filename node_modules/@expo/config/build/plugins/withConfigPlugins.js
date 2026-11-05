"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "withConfigPlugins", {
    enumerable: true,
    get: function() {
        return withConfigPlugins;
    }
});
function _configplugins() {
    const data = require("@expo/config-plugins");
    _configplugins = function() {
        return data;
    };
    return data;
}
const _Serialize = require("../Serialize");
const withConfigPlugins = (config, skipPlugins)=>{
    // @ts-ignore: plugins not on config type yet -- TODO
    if (!Array.isArray(config.plugins) || !config.plugins?.length) {
        return config;
    }
    if (!skipPlugins) {
        // Resolve and evaluate plugins
        // @ts-ignore: TODO: add plugins to the config schema
        config = (0, _configplugins().withPlugins)(config, config.plugins);
    } else {
        // Delete the plugins array in case someone added functions or other values which cannot be automatically serialized.
        delete config.plugins;
    }
    // plugins aren't serialized by default, serialize the plugins after resolving them.
    return (0, _Serialize.serializeAfterStaticPlugins)(config);
};

//# sourceMappingURL=withConfigPlugins.js.map
