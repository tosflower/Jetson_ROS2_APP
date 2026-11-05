/**
 * A helper script to load the Expo config and loaded plugins from a project
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createESModuleLoadHook: null,
    getExpoConfigLoaderPath: null,
    installModuleCaptureHook: null,
    resolveLoadedModuleSourcesAsync: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get createESModuleLoadHook () {
        return createESModuleLoadHook;
    },
    get getExpoConfigLoaderPath () {
        return getExpoConfigLoaderPath;
    },
    get installModuleCaptureHook () {
        return installModuleCaptureHook;
    },
    get resolveLoadedModuleSourcesAsync () {
        return resolveLoadedModuleSourcesAsync;
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
function _module() {
    const data = /*#__PURE__*/ _interop_require_default(require("module"));
    _module = function() {
        return data;
    };
    return data;
}
function _nodeprocess() {
    const data = /*#__PURE__*/ _interop_require_default(require("node:process"));
    _nodeprocess = function() {
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
function _url() {
    const data = require("url");
    _url = function() {
        return data;
    };
    return data;
}
const _Options = require("./Options");
const _Path = require("./utils/Path");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function runAsync(programName, args = []) {
    if (args[0] == null) {
        console.log(`Usage: ${programName} <projectRoot> [ignoredFile] --mode <development|production> [--skipPlugins]`);
        return;
    }
    const projectRoot = _path().default.resolve(args[0]);
    const skipPlugins = args.includes('--skipPlugins');
    const ignoredFileArg = args[1] && !args[1].startsWith('--') ? args[1] : null;
    const ignoredFile = ignoredFileArg ? _path().default.resolve(ignoredFileArg) : null;
    const modeFlagIndex = args.indexOf('--mode');
    const mode = modeFlagIndex >= 0 ? args[modeFlagIndex + 1] : undefined;
    if (mode !== 'development' && mode !== 'production') {
        throw new Error(`Unsupported Expo config mode: ${mode}`);
    }
    (0, _env().consumeConfigEnvMode)();
    globalThis.__DEV__ = mode === 'development';
    (0, _env().loadProjectEnv)(projectRoot, {
        mode
    });
    const { getCapturedModules, uninstall } = installModuleCaptureHook();
    let config;
    try {
        const { getConfig } = require((0, _resolvefrom().default)(_path().default.resolve(projectRoot), 'expo/config'));
        config = await getConfig(projectRoot, {
            skipSDKVersionRequirement: true,
            skipPlugins
        });
    } finally{
        uninstall();
    }
    const ignoredPaths = [
        ...DEFAULT_CONFIG_LOADING_IGNORE_PATHS,
        ...await loadIgnoredPathsAsync(ignoredFile)
    ];
    const loadedModules = await resolveLoadedModuleSourcesAsync(getCapturedModules(), projectRoot, ignoredPaths);
    const result = JSON.stringify({
        // The plugins-skipped pass only contributes its module list to the diff; its config is unused.
        config: skipPlugins ? null : config,
        loadedModules
    });
    if (_nodeprocess().default.send) {
        _nodeprocess().default.send(result);
    } else {
        console.log(result);
    }
}
// If running from the command line
if (require.main?.filename === __filename) {
    (async ()=>{
        const programIndex = _nodeprocess().default.argv.findIndex((arg)=>arg === __filename);
        const programName = _nodeprocess().default.argv[programIndex] ?? __filename;
        try {
            await runAsync(programName, _nodeprocess().default.argv.slice(programIndex + 1));
        } catch (e) {
            console.error('Uncaught Error', e);
            _nodeprocess().default.exit(1);
        }
    })();
}
/**
 * Load the generated ignored paths file from caller and remove the file after loading
 */ async function loadIgnoredPathsAsync(ignoredFile) {
    if (!ignoredFile) {
        return _Options.DEFAULT_IGNORE_PATHS;
    }
    const ignorePaths = [];
    try {
        const fingerprintIgnore = await _promises().default.readFile(ignoredFile, 'utf8');
        const fingerprintIgnoreLines = fingerprintIgnore.split('\n');
        for (const line of fingerprintIgnoreLines){
            const trimmedLine = line.trim();
            if (trimmedLine) {
                ignorePaths.push(trimmedLine);
            }
        }
    } catch  {}
    return ignorePaths;
}
function installModuleCaptureHook() {
    const capturedModules = [];
    const loadHooks = typeof _module().default.registerHooks === 'function' ? _module().default.registerHooks({
        load: createESModuleLoadHook(capturedModules)
    }) : null;
    const moduleProto = _module().default.prototype;
    const originalCompile = moduleProto._compile;
    moduleProto._compile = function(content, filename, ...rest) {
        capturedModules.push({
            id: this.id ?? filename,
            filename,
            content
        });
        return originalCompile.call(this, content, filename, ...rest);
    };
    return {
        getCapturedModules: ()=>capturedModules,
        uninstall: ()=>{
            moduleProto._compile = originalCompile;
            loadHooks?.deregister();
        }
    };
}
function createESModuleLoadHook(capturedModules) {
    return (url, context, nextLoad)=>{
        const result = nextLoad(url, context);
        const isESModule = result.format === 'module' || result.format === 'module-typescript';
        if (isESModule && url.startsWith('file:') && result.source != null) {
            const filename = (0, _url().fileURLToPath)(url);
            const content = typeof result.source === 'string' ? result.source : new TextDecoder().decode(result.source);
            capturedModules.push({
                id: filename,
                filename,
                content
            });
        }
        return result;
    };
}
async function resolveLoadedModuleSourcesAsync(capturedModules, projectRoot, ignoredPaths) {
    const seen = new Set();
    const ignoredPathMatchObjects = (0, _Path.buildPathMatchObjects)(ignoredPaths);
    const candidates = capturedModules.map(({ filename, content })=>({
            relativePath: (0, _Path.toPosixPath)(_path().default.relative(projectRoot, filename)),
            filename,
            content
        })).filter(({ relativePath })=>{
        if (seen.has(relativePath) || (0, _Path.isIgnoredPathWithMatchObjects)(relativePath, ignoredPathMatchObjects)) {
            return false;
        }
        seen.add(relativePath);
        return true;
    });
    const sources = await Promise.all(candidates.map(async ({ relativePath, filename, content })=>{
        try {
            const stat = await _promises().default.stat(filename);
            return stat.isFile() ? {
                type: 'file',
                path: relativePath
            } : null;
        } catch (error) {
            if (error.code === 'ENOENT') {
                return {
                    type: 'contents',
                    id: relativePath,
                    contents: content
                };
            }
            throw error;
        }
    }));
    return sources.filter((source)=>source !== null);
}
function getExpoConfigLoaderPath() {
    return _path().default.join(__dirname, 'ExpoConfigLoader.js');
}
// Ignore known non-native packages loaded while applying config plugins, which the plugins-skipped
// diff can't drop since they only load during plugin application.
const DEFAULT_CONFIG_LOADING_IGNORE_PATHS = [
    '**/node_modules/@expo/**/*',
    `**/node_modules/{${[
        'ansi-styles',
        'base64-js',
        'big-integer',
        'bplist-creator',
        'chalk',
        'cross-spawn',
        'debug',
        'has-flag',
        'isexe',
        'jimp-compact',
        'ms',
        'parse-png',
        'path-key',
        'plist',
        'pngjs',
        'sax',
        'semver',
        'shebang-command',
        'shebang-regex',
        'simple-plist',
        'stream-buffers',
        'supports-color',
        'uuid',
        'which',
        'xcode',
        'xml2js',
        'xmlbuilder'
    ].join(',')}}/**/*`
];

//# sourceMappingURL=ExpoConfigLoader.js.map
