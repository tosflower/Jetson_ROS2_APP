"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    withBaseMod: null,
    withMod: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get withBaseMod () {
        return withBaseMod;
    },
    get withMod () {
        return withMod;
    }
});
function _chalk() {
    const data = /*#__PURE__*/ _interop_require_default(require("chalk"));
    _chalk = function() {
        return data;
    };
    return data;
}
function _getenv() {
    const data = require("getenv");
    _getenv = function() {
        return data;
    };
    return data;
}
const _errors = require("../utils/errors");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const EXPO_DEBUG = (0, _getenv().boolish)('EXPO_DEBUG', false);
function withBaseMod(config, { platform, mod, action, skipEmptyMod, isProvider, isIntrospective, saveToInternal }) {
    if (!config.mods) {
        config.mods = {};
    }
    if (!config.mods[platform]) {
        config.mods[platform] = {};
    }
    let interceptedMod = config.mods[platform][mod];
    // No existing mod to intercept
    if (!interceptedMod) {
        if (skipEmptyMod) {
            // Skip running the action
            return config;
        }
        // Use a noop mod and continue
        const noopMod = (config)=>config;
        interceptedMod = noopMod;
    }
    // Create a stack trace for debugging ahead of time
    let debugTrace = '';
    // Use the possibly user defined value. Otherwise fallback to the env variable.
    // We support the env variable because user mods won't have _internal defined in time.
    const isDebug = config._internal?.isDebug ?? EXPO_DEBUG;
    if (isDebug) {
        // Get a stack trace via the Error API
        const stack = new Error().stack;
        // Format the stack trace to create the debug log
        debugTrace = getDebugPluginStackFromStackTrace(stack);
        const modStack = _chalk().default.bold(`${platform}.${mod}`);
        debugTrace = `${modStack}: ${debugTrace}`;
    }
    // Prevent adding multiple providers to a mod.
    // Base mods that provide files ignore any incoming modResults and therefore shouldn't have provider mods as parents.
    if (interceptedMod.isProvider) {
        if (isProvider) {
            throw new _errors.PluginError(`Cannot set provider mod for "${platform}.${mod}" because another is already being used.`, 'CONFLICTING_PROVIDER');
        } else {
            throw new _errors.PluginError(`Cannot add mod to "${platform}.${mod}" because the provider has already been added. Provider must be the last mod added.`, 'INVALID_MOD_ORDER');
        }
    }
    async function interceptingMod({ modRequest, ...config }) {
        if (isDebug) {
            // In debug mod, log the plugin stack in the order which they were invoked
            console.log(debugTrace);
        }
        const results = await action({
            ...config,
            modRequest: {
                ...modRequest,
                nextMod: interceptedMod
            }
        });
        if (saveToInternal) {
            saveToInternalObject(results, platform, mod, results.modResults);
        }
        return results;
    }
    // Ensure this base mod is registered as the provider.
    interceptingMod.isProvider = isProvider;
    if (isIntrospective) {
        // Register the mode as idempotent so introspection doesn't remove it.
        interceptingMod.isIntrospective = isIntrospective;
    }
    config.mods[platform][mod] = interceptingMod;
    return config;
}
function saveToInternalObject(config, platformName, modName, results) {
    if (!config._internal) config._internal = {};
    if (!config._internal.modResults) config._internal.modResults = {};
    if (!config._internal.modResults[platformName]) config._internal.modResults[platformName] = {};
    config._internal.modResults[platformName][modName] = results;
}
function getDebugPluginStackFromStackTrace(stacktrace) {
    if (!stacktrace) {
        return '';
    }
    const treeStackLines = [];
    for (const line of stacktrace.split('\n')){
        const [first, second] = line.trim().split(' ');
        if (first === 'at' && second != null) {
            treeStackLines.push(second);
        }
    }
    const plugins = treeStackLines.map((first)=>{
        // Match the first part of the stack trace against the plugin naming convention
        // "with" followed by a capital letter.
        return first?.match(/^(\bwith[A-Z].*?\b)/)?.[1]?.trim() ?? first?.match(/\.(\bwith[A-Z].*?\b)/)?.[1]?.trim() ?? null;
    }).filter(Boolean).filter((plugin)=>{
        // redundant as all debug logs are captured in withBaseMod
        return ![
            'withMod',
            'withBaseMod',
            'withExtendedMod'
        ].includes(plugin);
    });
    const commonPlugins = [
        'withPlugins',
        'withRunOnce',
        'withStaticPlugin'
    ];
    return plugins.reverse().map((pluginName, index)=>{
        // Base mods indicate a logical section.
        if (pluginName.includes('BaseMod')) {
            pluginName = _chalk().default.bold(pluginName);
        }
        // highlight dangerous mods
        if (pluginName.toLowerCase().includes('dangerous')) {
            pluginName = _chalk().default.red(pluginName);
        }
        if (index === 0) {
            return _chalk().default.blue(pluginName);
        } else if (commonPlugins.includes(pluginName)) {
            // Common mod names often clutter up the logs, dim them out
            return _chalk().default.dim(pluginName);
        }
        return pluginName;
    })// Join the results:
    // withAndroidExpoPlugins ➜ withPlugins ➜ withIcons ➜ withDangerousMod ➜ withMod
    .join(' ➜ ');
}
function withMod(config, { platform, mod, action }) {
    return withBaseMod(config, {
        platform,
        mod,
        isProvider: false,
        async action ({ modRequest: { nextMod, ...modRequest }, modResults, ...config }) {
            const results = await action({
                modRequest,
                modResults: modResults,
                ...config
            });
            return nextMod(results);
        }
    });
}

//# sourceMappingURL=withMod.js.map
