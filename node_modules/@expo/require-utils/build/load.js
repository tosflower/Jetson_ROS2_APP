"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    evalModule: null,
    loadModule: null,
    loadModuleSync: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get evalModule () {
        return evalModule;
    },
    get loadModule () {
        return loadModule;
    },
    get loadModuleSync () {
        return loadModuleSync;
    }
});
function _nodefs() {
    const data = /*#__PURE__*/ _interop_require_default(require("node:fs"));
    _nodefs = function() {
        return data;
    };
    return data;
}
function _nodemodule() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("node:module"));
    _nodemodule = function() {
        return data;
    };
    return data;
}
function _nodeos() {
    const data = /*#__PURE__*/ _interop_require_default(require("node:os"));
    _nodeos = function() {
        return data;
    };
    return data;
}
function _nodepath() {
    const data = /*#__PURE__*/ _interop_require_default(require("node:path"));
    _nodepath = function() {
        return data;
    };
    return data;
}
function _nodeurl() {
    const data = /*#__PURE__*/ _interop_require_default(require("node:url"));
    _nodeurl = function() {
        return data;
    };
    return data;
}
function _nodevm() {
    const data = /*#__PURE__*/ _interop_require_default(require("node:vm"));
    _nodevm = function() {
        return data;
    };
    return data;
}
const _codeframe = require("./codeframe");
const _stacktrace = require("./stacktrace");
const _transform = require("./transform");
const _typescript = require("./typescript");
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
const parent = module;
const tsExtensionMapping = {
    '.ts': '.js',
    '.cts': '.cjs',
    '.mts': '.mjs'
};
function maybeReadFileSync(filename) {
    try {
        return _nodefs().default.readFileSync(filename, 'utf8');
    } catch (error) {
        if (error.code === 'ENOENT') {
            return null;
        }
        throw error;
    }
}
function toFormat(filename, isLegacy) {
    let mode;
    let legacy = false;
    if (filename.endsWith('.cjs')) {
        mode = 'commonjs';
    } else if (filename.endsWith('.mjs')) {
        mode = 'module';
    } else if (filename.endsWith('.js')) {
        legacy = isLegacy;
        mode = isLegacy ? 'commonjs' : undefined;
    } else if (filename.endsWith('.mts')) {
        mode = 'module-typescript';
    } else if (filename.endsWith('.cts')) {
        mode = 'commonjs-typescript';
    } else if (filename.endsWith('.ts')) {
        legacy = isLegacy;
        mode = isLegacy ? 'commonjs-typescript' : 'typescript';
    }
    return {
        mode,
        legacy
    };
}
function toRealDirname(filePath) {
    let normalized = _nodepath().default.resolve(filePath);
    // Try resolving the filename itself first
    try {
        normalized = _nodefs().default.realpathSync(normalized);
        return _nodepath().default.dirname(normalized);
    } catch (error) {
        normalized = _nodepath().default.dirname(normalized);
        // If we're getting another error than an ENOENT, return the dirname unchanged
        if (error?.code !== 'ENOENT') {
            return normalized;
        }
    }
    // Alternatively, if it's a fake path, resolve the directory directly instead
    try {
        return _nodefs().default.realpathSync(normalized);
    } catch  {
        return normalized;
    }
}
const hasModuleSourceMapsSupport = typeof _nodemodule().setSourceMapsSupport === 'function';
function getSourceMapsState() {
    return typeof _nodemodule().getSourceMapsSupport === 'function' ? _nodemodule().getSourceMapsSupport() : {
        enabled: !!process.sourceMapsEnabled
    };
}
function setSourceMapsState(state) {
    if (hasModuleSourceMapsSupport) {
        _nodemodule().setSourceMapsSupport(state.enabled, {
            nodeModules: state.nodeModules ?? false,
            generatedCode: state.generatedCode ?? false
        });
    } else {
        process.setSourceMapsEnabled(state.enabled);
    }
}
function makeSourceMapTempPath(filename) {
    let basename = _nodepath().default.basename(filename);
    const queryIdx = basename.search(/[?#]/);
    if (queryIdx >= 0) {
        basename = basename.slice(0, queryIdx);
    }
    return _nodepath().default.join(_nodeos().default.tmpdir(), `require-utils-${process.pid}-${basename}.map`);
}
function stripSourceMappingURL(code) {
    return code.replace(/^[ \t]*\/\/[#@][ \t]+sourceMappingURL=.*$/gm, '');
}
function compileModule(code, filename, opts) {
    const format = toFormat(filename, false);
    const shouldCache = opts.cache ?? true;
    const prependPaths = opts.paths ?? [];
    // See: https://github.com/nodejs/node/blob/ff080948666f28fbd767548d26bea034d30bc277/lib/internal/modules/cjs/loader.js#L767
    // If we get a symlinked path instead of the realpath, we assume the realpath is needed for Node module resolution
    const basePath = toRealDirname(filename);
    const nodeModulePaths = _nodemodule()._nodeModulePaths(basePath);
    const paths = [
        ...prependPaths,
        ...nodeModulePaths
    ];
    let inputCode = code;
    // We may get a Metro SSR relative path here, which isn't a valid absolute path, and we need to normalize
    // the filename before proceeding
    let compileFilename = filename;
    if (opts.sourceMap) {
        const queryIdx = filename.search(/[?#]/);
        const basePart = queryIdx >= 0 ? filename.slice(0, queryIdx) : filename;
        const queryPart = queryIdx >= 0 ? filename.slice(queryIdx) : '';
        if (!_nodepath().default.isAbsolute(basePart)) {
            compileFilename = _nodepath().default.resolve(basePart) + queryPart;
        }
    }
    let mapPath;
    let priorSourceMapsState;
    if (opts.sourceMap && !process.isBun) {
        try {
            mapPath = makeSourceMapTempPath(compileFilename);
            _nodefs().default.writeFileSync(mapPath, opts.sourceMap);
        } catch (error) {
            mapPath = undefined;
            // If we fail to write the source map, we can still continue without it, but log a warning since it's likely a misconfiguration
            console.warn(`Warning: Failed to write source map for ${filename} to ${mapPath}. Source maps will be unavailable for this module.\n${error?.message || error}`);
        }
        if (mapPath) {
            inputCode = stripSourceMappingURL(code);
            // NOTE(@kitten): This needs to be a plain absolute path because Node rejects file: URLs
            // On Windows, it additionally needs to be a URL.pathname-like format (POSIX with a leading slash)
            if (_nodepath().default.sep !== '/') {
                mapPath = `/${mapPath.replaceAll(_nodepath().default.sep, '/')}`;
            }
            inputCode += `\n//# sourceMappingURL=${mapPath}`;
            priorSourceMapsState = getSourceMapsState();
            (0, _stacktrace.installSourceMapStackTrace)();
            setSourceMapsState({
                enabled: true,
                nodeModules: true
            });
        }
    }
    const mod = Object.assign(new (_nodemodule()).Module(compileFilename, parent), {
        filename: compileFilename,
        paths
    });
    const childIdx = parent?.children?.indexOf(mod) ?? -1;
    if (childIdx >= 0) {
        parent.children.splice(childIdx, 1);
    }
    try {
        mod._compile(inputCode, compileFilename, format.mode);
        mod.loaded = true;
        if (shouldCache) {
            require.cache[compileFilename] = mod;
            if (compileFilename !== filename) {
                require.cache[filename] = mod;
            }
        }
        return mod;
    } catch (error) {
        if (shouldCache) {
            delete require.cache[compileFilename];
            if (compileFilename !== filename) {
                delete require.cache[filename];
            }
        }
        throw error;
    } finally{
        if (mapPath) {
            // Node 24.22 and later lazily parse the source-map, at which point it'll be removed. Looking it up now, forces this to be done in time
            try {
                _nodemodule().findSourceMap?.(compileFilename);
            } catch  {
            /* noop */ }
            // Restore, so subsequent requires of node_modules won't have their source-maps read
            setSourceMapsState(priorSourceMapsState ?? {
                enabled: false
            });
            try {
                _nodefs().default.unlinkSync(mapPath);
            } catch  {
            /* noop */ }
        }
    }
}
function containsModuleSyntax(code) {
    // Fast-path: We can assume that if there's no ESM keyword, we don't need to check at all
    if (!/\b(?:import|export|await)\b/.test(code)) {
        return false;
    }
    try {
        const CJS_WRAP_PARAMS = [
            'exports',
            'require',
            'module',
            '__filename',
            '__dirname'
        ];
        _nodevm().default.compileFunction(code, CJS_WRAP_PARAMS);
        return false;
    } catch  {
        return true;
    }
}
const hasStripTypeScriptTypes = typeof _nodemodule().stripTypeScriptTypes === 'function';
function supportsStripTypeScriptTypesTransform() {
    const nodeVersion = process.versions.node.split('.', 1).map(Number);
    return nodeVersion[0] < 26;
}
function stripTypeScriptTypes(code) {
    if (!supportsStripTypeScriptTypesTransform()) {
        return _nodemodule().stripTypeScriptTypes(code);
    }
    return _nodemodule().stripTypeScriptTypes(code, {
        mode: 'transform',
        sourceMap: true
    });
}
function evalModule(code, filename, opts = {}, format = toFormat(filename, true)) {
    const shouldCache = opts.cache ?? true;
    let inputCode = code;
    let inputFilename = filename;
    let diagnostic;
    if (format.mode === 'typescript' || format.mode === 'module-typescript' || format.mode === 'commonjs-typescript') {
        const output = (0, _typescript.transpile)(code, filename, format.mode);
        if (output) {
            inputCode = output.outputText;
            diagnostic = output.diagnostic;
        }
        if (hasStripTypeScriptTypes && inputCode === code) {
            // This may throw its own error, but this contains a code-frame already
            inputCode = stripTypeScriptTypes(code);
            if (format.mode === 'commonjs-typescript') {
                // NOTE(@kitten): Match TypeScript's CommonJS emit with esModuleInterop enabled.
                inputCode = (0, _transform.toCommonJS)(filename, inputCode, 'babel');
            }
        }
        if (inputCode !== code) {
            const ext = _nodepath().default.extname(filename);
            const inputExt = tsExtensionMapping[ext] ?? ext;
            if (inputExt !== ext) {
                inputFilename = _nodepath().default.join(_nodepath().default.dirname(filename), _nodepath().default.basename(filename, ext) + inputExt);
            }
        }
    } else if (format.mode === 'commonjs') {
        inputCode = (0, _transform.toCommonJS)(filename, code);
    }
    // NOTE(@kitten): If we've transpiling to CommonJS ourselves above, we should check if
    // the output contains module syntax, which prevents us from loading this file as CommonJS.
    // If it does, we run the non-legacy ESM code path instead
    if (format.legacy && (format.mode === 'commonjs' || format.mode === 'commonjs-typescript') && containsModuleSyntax(inputCode)) {
        format = toFormat(filename, false);
        return evalModule(code, filename, opts, format);
    }
    try {
        const mod = compileModule(inputCode, inputFilename, opts);
        if (shouldCache && inputFilename !== filename) {
            require.cache[filename] = mod;
        }
        return mod.exports;
    } catch (error) {
        // If we have a diagnostic from TypeScript, we issue its error with a codeframe first,
        // since it's likely more useful than the eval error
        const diagnosticError = (0, _codeframe.formatDiagnostic)(code, diagnostic);
        if (diagnosticError) {
            throw diagnosticError;
        }
        throw (0, _codeframe.annotateError)(code, filename, error) ?? error;
    }
}
async function requireOrImport(filename) {
    try {
        return require(filename);
    } catch  {
        const importFilename = _nodepath().default.isAbsolute(filename) ? _nodeurl().default.pathToFileURL(filename).toString() : filename;
        return await import(importFilename);
    }
}
async function loadModule(filename) {
    try {
        return await requireOrImport(filename);
    } catch (error) {
        if (error.code === 'ERR_UNKNOWN_FILE_EXTENSION' || error.code === 'MODULE_NOT_FOUND') {
            return loadModuleSync(filename);
        } else {
            throw error;
        }
    }
}
/** Require module or evaluate with TypeScript
 * NOTE: Requiring ESM has been added in all LTS versions (Node 20.19+, 22.12+, 24).
 * This already forms the minimum required Node version as of Expo SDK 54 */ function loadModuleSync(filename) {
    const format = toFormat(filename, true);
    const isTypeScript = format.mode === 'module-typescript' || format.mode === 'commonjs-typescript' || format.mode === 'typescript';
    try {
        if (format.mode !== 'module' && !isTypeScript) {
            return require(filename);
        }
    } catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            throw error;
        } else if (format.mode == null) {
            const code = maybeReadFileSync(filename);
            throw (0, _codeframe.annotateError)(code, filename, error) || error;
        }
    // We fallback to always evaluating the entrypoint module
    // This is out of safety, since we're not trusting the requiring ESM feature
    // and evaluating the module manually bypasses the error when it's flagged off
    }
    // Load from cache manually, if `loaded` is set and exports are defined, to avoid
    // double transform or double evaluation
    if (require.cache[filename]?.exports && require.cache[filename].loaded) {
        return require.cache[filename].exports;
    }
    const code = _nodefs().default.readFileSync(filename, 'utf8');
    return evalModule(code, filename, {}, format);
}

//# sourceMappingURL=load.js.map
