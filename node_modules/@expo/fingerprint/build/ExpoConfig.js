"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    diffLoadedModules: null,
    getExpoConfigAsync: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get diffLoadedModules () {
        return diffLoadedModules;
    },
    get getExpoConfigAsync () {
        return getExpoConfigAsync;
    }
});
function _env() {
    const data = require("@expo/env");
    _env = function() {
        return data;
    };
    return data;
}
function _promises() {
    const data = /*#__PURE__*/ _interop_require_default(require("fs/promises"));
    _promises = function() {
        return data;
    };
    return data;
}
function _os() {
    const data = /*#__PURE__*/ _interop_require_default(require("os"));
    _os = function() {
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
function _resolvefrom() {
    const data = /*#__PURE__*/ _interop_require_default(require("resolve-from"));
    _resolvefrom = function() {
        return data;
    };
    return data;
}
const _ExpoConfigLoader = require("./ExpoConfigLoader");
const _LinkedDependencies = require("./utils/LinkedDependencies");
const _SpawnIPC = require("./utils/SpawnIPC");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const FINGERPRINT_ENV_MODE = 'development';
async function getExpoConfigAsync(projectRoot, options) {
    const result = {
        config: null,
        loadedModules: null
    };
    if (!_resolvefrom().default.silent(_path().default.resolve(projectRoot), 'expo/config')) {
        return result;
    }
    const tmpDir = await _promises().default.mkdtemp(_path().default.join(_os().default.tmpdir(), 'expo-fingerprint-'));
    const ignoredFile = await createTempIgnoredFileAsync(tmpDir, options);
    try {
        const [{ config, loadedModules: modulesWithPlugins }, { loadedModules: modulesWithoutPlugins }] = await Promise.all([
            spawnConfigLoaderAsync(projectRoot, ignoredFile, /* skipPlugins */ false),
            spawnConfigLoaderAsync(projectRoot, ignoredFile, /* skipPlugins */ true)
        ]);
        result.config = config;
        result.loadedModules = diffLoadedModules(modulesWithPlugins ?? [], modulesWithoutPlugins ?? [], (0, _LinkedDependencies.createLinkedDependencyMatcher)(_path().default.resolve(projectRoot)));
    } catch (e) {
        if (e instanceof Error) {
            console.warn(`Cannot get Expo config from an Expo project - ${e.message}: `, e.stack);
        }
    } finally{
        try {
            await _promises().default.rm(tmpDir, {
                recursive: true
            });
        } catch  {}
    }
    return result;
}
async function spawnConfigLoaderAsync(projectRoot, ignoredFile, skipPlugins) {
    const args = [
        (0, _ExpoConfigLoader.getExpoConfigLoaderPath)(),
        _path().default.resolve(projectRoot),
        ignoredFile,
        '--mode',
        FINGERPRINT_ENV_MODE
    ];
    if (skipPlugins) {
        args.push('--skipPlugins');
    }
    const childEnv = (0, _env().setNodeEnv)(FINGERPRINT_ENV_MODE, {
        systemEnv: (0, _env().getOriginalEnv)()
    });
    childEnv.__EXPO_CONFIG_MODE = FINGERPRINT_ENV_MODE;
    const { message } = await (0, _SpawnIPC.spawnWithIpcAsync)('node', args, {
        cwd: projectRoot,
        env: childEnv
    });
    return JSON.parse(message);
}
function diffLoadedModules(withPlugins, withoutPlugins, isLinkedDependencyFile = ()=>false) {
    const skippedKeys = new Set(withoutPlugins.map(getLoadedModuleKey));
    return withPlugins.filter((source)=>{
        const key = getLoadedModuleKey(source);
        return isInRepoLoadedModule(source) || !skippedKeys.has(key) || source.type === 'file' && isLinkedDependencyFile(key);
    });
}
/** Stable identity of a loaded module: its file path, or its id for a virtual module. */ function getLoadedModuleKey(source) {
    return source.type === 'file' ? source.path : source.id;
}
/** Whether a loaded module is a project-local file (e.g. a local config plugin) rather than a dependency. */ function isInRepoLoadedModule(source) {
    const key = getLoadedModuleKey(source);
    // `..` means the path escaped the project root (e.g. a hoisted or linked dependency).
    return !key.startsWith('..') && !key.includes('node_modules');
}
/**
 * Create a temporary file with ignored paths from options that will be read by the ExpoConfigLoader.
 */ async function createTempIgnoredFileAsync(tmpDir, options) {
    const ignoredFile = _path().default.join(tmpDir, '.fingerprintignore');
    const ignorePaths = options.ignorePathMatchObjects.map((match)=>match.pattern);
    await _promises().default.writeFile(ignoredFile, ignorePaths.join('\n'));
    return ignoredFile;
}

//# sourceMappingURL=ExpoConfig.js.map
