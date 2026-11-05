"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    compileModsAsync: null,
    evalModsAsync: null,
    sortMods: null,
    withDefaultBaseMods: null,
    withIntrospectionBaseMods: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get compileModsAsync () {
        return compileModsAsync;
    },
    get evalModsAsync () {
        return evalModsAsync;
    },
    get sortMods () {
        return sortMods;
    },
    get withDefaultBaseMods () {
        return withDefaultBaseMods;
    },
    get withIntrospectionBaseMods () {
        return withIntrospectionBaseMods;
    }
});
function _debug() {
    const data = /*#__PURE__*/ _interop_require_default(require("debug"));
    _debug = function() {
        return data;
    };
    return data;
}
function _path() {
    const data = /*#__PURE__*/ _interop_require_default(require("path"));
    _path = function() {
        return data;
    };
    return data;
}
const _Xcodeproj = require("../ios/utils/Xcodeproj");
const _errors = require("../utils/errors");
const _warnings = /*#__PURE__*/ _interop_require_wildcard(require("../utils/warnings"));
const _createBaseMod = require("./createBaseMod");
const _withAndroidBaseMods = require("./withAndroidBaseMods");
const _withIosBaseMods = require("./withIosBaseMods");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const debug = (0, _debug().default)('expo:config-plugins:mod-compiler');
function withDefaultBaseMods(config, props = {}) {
    config = (0, _withIosBaseMods.withIosBaseMods)(config, props);
    config = (0, _withAndroidBaseMods.withAndroidBaseMods)(config, props);
    return config;
}
function withIntrospectionBaseMods(config, props = {}) {
    config = (0, _withIosBaseMods.withIosBaseMods)(config, {
        saveToInternal: true,
        // This writing optimization can be skipped since we never write in introspection mode.
        // Including empty mods will ensure that all mods get introspected.
        skipEmptyMod: false,
        ...props
    });
    config = (0, _withAndroidBaseMods.withAndroidBaseMods)(config, {
        saveToInternal: true,
        skipEmptyMod: false,
        ...props
    });
    if (config.mods) {
        // Remove all mods that don't have an introspection base mod, for instance `dangerous` mods.
        for (const platform of Object.keys(config.mods)){
            // const platformPreserve = preserve[platform];
            for (const key of Object.keys(config.mods[platform] || {})){
                // @ts-ignore
                if (!config.mods[platform]?.[key]?.isIntrospective) {
                    debug(`removing non-idempotent mod: ${platform}.${key}`);
                    // @ts-ignore
                    delete config.mods[platform]?.[key];
                }
            }
        }
    }
    return config;
}
async function compileModsAsync(config, props) {
    if (props.introspect === true) {
        config = withIntrospectionBaseMods(config);
    } else {
        config = withDefaultBaseMods(config);
    }
    return await evalModsAsync(config, props);
}
function sortMods(commands, precedences) {
    const seen = new Set();
    const dedupedCommands = commands.filter(([key])=>{
        const duplicate = seen.has(key);
        seen.add(key);
        return !duplicate;
    });
    return dedupedCommands.sort(([keyA], [keyB])=>{
        const precedenceA = precedences[keyA] || 0;
        const precedenceB = precedences[keyB] || 0;
        return precedenceA - precedenceB;
    });
}
function getRawClone({ mods, ...config }) {
    // Configs should be fully serializable, so we can clone them without worrying about
    // the mods.
    return Object.freeze(JSON.parse(JSON.stringify(config)));
}
const precedences = {
    ios: {
        // dangerous runs first
        dangerous: -2,
        // run the XcodeProject mod second because many plugins attempt to read from it.
        xcodeproj: -1,
        // put the finalized mod at the last
        finalized: 1
    }
};
async function evalModsAsync(config, { projectRoot, introspect, platforms, assertMissingModProviders, ignoreExistingNativeFiles = false }) {
    const modRawConfig = getRawClone(config);
    for (const [platformName, platform] of Object.entries(config.mods ?? {})){
        if (platforms && !platforms.includes(platformName)) {
            debug(`skip platform: ${platformName}`);
            continue;
        }
        let entries = Object.entries(platform);
        if (entries.length) {
            // Move dangerous item to the first position and finalized item to the last position if it exists.
            // This ensures that all dangerous code runs first and finalized applies last.
            entries = sortMods(entries, precedences[platformName] ?? {
                dangerous: -1,
                finalized: 1
            });
            debug(`run in order: ${entries.map(([name])=>name).join(', ')}`);
            const platformProjectRoot = _path().default.join(projectRoot, platformName);
            const projectName = platformName === 'ios' ? (0, _Xcodeproj.getHackyProjectName)(projectRoot, config) : undefined;
            for (const [modName, mod] of entries){
                const modRequest = {
                    projectRoot,
                    projectName,
                    platformProjectRoot,
                    platform: platformName,
                    modName,
                    introspect: !!introspect,
                    ignoreExistingNativeFiles
                };
                if (!mod.isProvider) {
                    // In strict mode, throw an error.
                    const errorMessage = `Initial base modifier for "${platformName}.${modName}" is not a provider and therefore will not provide modResults to child mods`;
                    if (assertMissingModProviders !== false) {
                        throw new _errors.PluginError(errorMessage, 'MISSING_PROVIDER');
                    } else {
                        _warnings.addWarningForPlatform(platformName, `${platformName}.${modName}`, `Skipping: Initial base modifier for "${platformName}.${modName}" is not a provider and therefore will not provide modResults to child mods. This may be due to an outdated version of Expo CLI.`);
                        continue;
                    }
                }
                const results = await mod({
                    ...config,
                    modResults: null,
                    modRequest,
                    modRawConfig
                });
                // Sanity check to help locate non compliant mods.
                config = (0, _createBaseMod.assertModResults)(results, platformName, modName);
                // @ts-ignore: `modResults` is added for modifications
                delete config.modResults;
                // @ts-ignore: `modRequest` is added for modifications
                delete config.modRequest;
                // @ts-ignore: `modRawConfig` is added for modifications
                delete config.modRawConfig;
            }
        }
    }
    return config;
}

//# sourceMappingURL=mod-compiler.js.map
