"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    loadConfigAsync: null,
    normalizeSourceSkips: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get loadConfigAsync () {
        return loadConfigAsync;
    },
    get normalizeSourceSkips () {
        return normalizeSourceSkips;
    }
});
function _promises() {
    const data = /*#__PURE__*/ _interop_require_default(require("fs/promises"));
    _promises = function() {
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
const _SourceSkips = require("./sourcer/SourceSkips");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const CONFIG_FILES = [
    'fingerprint.config.js',
    'fingerprint.config.cjs'
];
const debug = require('debug')('expo:fingerprint:Config');
async function loadConfigAsync(projectRoot, silent = false) {
    let configFile;
    try {
        configFile = await resolveConfigFileAsync(projectRoot);
    } catch  {
        return null;
    }
    debug('Resolved config file:', configFile);
    const unregisterMuteLogs = silent ? muteLogs() : null;
    let rawConfig;
    try {
        rawConfig = require(configFile);
    } catch (e) {
        debug('Error loading config file:', e);
        rawConfig = {};
    }
    unregisterMuteLogs?.();
    const supportedConfigKeys = [
        'preset',
        'concurrentIoLimit',
        'hashAlgorithm',
        'ignorePaths',
        'extraSources',
        'sourceSkips',
        'enableReactImportsPatcher',
        'useRNCoreAutolinkingFromExpo',
        'nativeModuleSourceType',
        'configPluginSourceType',
        'debug',
        'fileHookTransform'
    ];
    const config = {};
    for (const key of supportedConfigKeys){
        if (key in rawConfig) {
            if (key === 'sourceSkips') {
                config[key] = normalizeSourceSkips(rawConfig[key]);
            } else {
                config[key] = rawConfig[key];
            }
        }
    }
    return config;
}
function normalizeSourceSkips(sourceSkips) {
    if (sourceSkips == null) {
        return _SourceSkips.SourceSkips.None;
    }
    if (typeof sourceSkips === 'number') {
        return sourceSkips;
    }
    if (Array.isArray(sourceSkips)) {
        let result = _SourceSkips.SourceSkips.None;
        for (const value of sourceSkips){
            if (typeof value !== 'string') {
                continue;
            }
            const skipValue = _SourceSkips.SourceSkips[value];
            if (skipValue != null) {
                result |= skipValue;
            }
        }
        return result;
    }
    throw new Error(`Invalid sourceSkips type: ${sourceSkips}`);
}
/**
 * Resolve the config file path from the project root.
 */ async function resolveConfigFileAsync(projectRoot) {
    return await Promise.any(CONFIG_FILES.map(async (file)=>{
        const configPath = _path().default.resolve(projectRoot, file);
        const stat = await _promises().default.stat(configPath);
        if (!stat.isFile()) {
            throw new Error(`Config file is not a file: ${configPath}`);
        }
        return configPath;
    }));
}
/**
 * Monkey-patch the console to mute logs.
 * @returns A function to unregister the monkey-patch.
 */ function muteLogs() {
    const originalConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error
    };
    const unregister = ()=>{
        console.log = originalConsole.log;
        console.warn = originalConsole.warn;
        console.error = originalConsole.error;
    };
    console.log = ()=>{};
    console.warn = ()=>{};
    console.error = ()=>{};
    return unregister;
}

//# sourceMappingURL=Config.js.map
