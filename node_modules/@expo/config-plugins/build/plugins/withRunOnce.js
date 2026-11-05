"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createRunOncePlugin: null,
    withRunOnce: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get createRunOncePlugin () {
        return createRunOncePlugin;
    },
    get withRunOnce () {
        return withRunOnce;
    }
});
const _history = require("../utils/history");
const withRunOnce = (config, { plugin, name, version })=>{
    // Detect if a plugin has already been run on this config.
    if ((0, _history.getHistoryItem)(config, name)) {
        return config;
    }
    // Push the history item so duplicates cannot be run.
    config = (0, _history.addHistoryItem)(config, {
        name,
        version
    });
    return plugin(config);
};
function createRunOncePlugin(plugin, name, version) {
    return (config, props)=>{
        return withRunOnce(config, {
            plugin: (config)=>plugin(config, props),
            name,
            version
        });
    };
}

//# sourceMappingURL=withRunOnce.js.map
