"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createContentsHashResultsAsync: null,
    createDirHashResultsAsync: null,
    createFileHashResultsAsync: null,
    createFingerprintFromSourcesAsync: null,
    createFingerprintSourceAsync: null,
    createPackageHashResultsAsync: null,
    createSourceId: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get createContentsHashResultsAsync () {
        return createContentsHashResultsAsync;
    },
    get createDirHashResultsAsync () {
        return createDirHashResultsAsync;
    },
    get createFileHashResultsAsync () {
        return createFileHashResultsAsync;
    },
    get createFingerprintFromSourcesAsync () {
        return createFingerprintFromSourcesAsync;
    },
    get createFingerprintSourceAsync () {
        return createFingerprintSourceAsync;
    },
    get createPackageHashResultsAsync () {
        return createPackageHashResultsAsync;
    },
    get createSourceId () {
        return createSourceId;
    }
});
function _crypto() {
    const data = require("crypto");
    _crypto = function() {
        return data;
    };
    return data;
}
function _fs() {
    const data = require("fs");
    _fs = function() {
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
function _path() {
    const data = /*#__PURE__*/ _interop_require_default(require("path"));
    _path = function() {
        return data;
    };
    return data;
}
function _stream() {
    const data = require("stream");
    _stream = function() {
        return data;
    };
    return data;
}
const _Concurrency = require("../utils/Concurrency");
const _Path = require("../utils/Path");
const _Predicates = require("../utils/Predicates");
const _Profile = require("../utils/Profile");
const _FileHookTransform = require("./FileHookTransform");
const _ReactImportsPatcher = require("./ReactImportsPatcher");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function createFingerprintFromSourcesAsync(sources, projectRoot, options) {
    const limiter = (0, _Concurrency.createLimiter)(options.concurrentIoLimit);
    const fingerprintSources = await Promise.all(sources.map((source)=>createFingerprintSourceAsync(source, limiter, projectRoot, options)));
    const hasher = (0, _crypto().createHash)(options.hashAlgorithm);
    for (const source of fingerprintSources){
        if (source.hash != null) {
            hasher.update(createSourceId(source));
            hasher.update(source.hash);
        }
    }
    const hash = hasher.digest('hex');
    return {
        sources: fingerprintSources,
        hash
    };
}
async function createFingerprintSourceAsync(source, limiter, projectRoot, options) {
    let result = null;
    switch(source.type){
        case 'contents':
            result = await createContentsHashResultsAsync(source, options);
            break;
        case 'file':
            result = await createFileHashResultsAsync(source.filePath, limiter, projectRoot, options);
            break;
        case 'dir':
            result = await (0, _Profile.profile)(options, createDirHashResultsAsync, `createDirHashResultsAsync(${source.filePath})`)(source.filePath, limiter, projectRoot, options);
            break;
        case 'package':
            result = await createPackageHashResultsAsync(source, options);
            break;
        default:
            throw new Error('Unsupported source type');
    }
    return {
        ...source,
        hash: result?.hex ?? null,
        ...options.debug ? {
            debugInfo: result?.debugInfo
        } : undefined
    };
}
async function createFileHashResultsAsync(filePath, limiter, projectRoot, options) {
    // Backup code for faster hashing
    /*
  return limiter(async () => {
    if (isIgnoredPathWithMatchObjects(filePath, options.ignorePathMatchObjects)) {
      return null;
    }

    const hasher = createHash(options.hashAlgorithm);

    const stat = await fs.stat(filePath);
    hasher.update(`${stat.size}`);

    const buffer = Buffer.alloc(4096);
    const fd = await fs.open(filePath, 'r');
    await fd.read(buffer, 0, buffer.length, 0);
    await fd.close();
    hasher.update(buffer);
    console.log('stat', filePath, stat.size);
    return { id: path.relative(projectRoot, filePath), hex: hasher.digest('hex') };
  });
  */ return limiter(()=>{
        return new Promise((resolve, reject)=>{
            if ((0, _Path.isIgnoredPathWithMatchObjects)(filePath, options.ignorePathMatchObjects)) {
                return resolve(null);
            }
            let resolved = false;
            const hasher = (0, _crypto().createHash)(options.hashAlgorithm);
            const fileHookTransform = options.fileHookTransform ? new _FileHookTransform.FileHookTransform({
                type: 'file',
                filePath
            }, options.fileHookTransform, options.debug) : null;
            let stream = (0, _fs().createReadStream)(_path().default.join(projectRoot, filePath), {
                highWaterMark: 1024
            });
            if (options.enableReactImportsPatcher && (filePath.endsWith('.h') || filePath.endsWith('.m') || filePath.endsWith('.mm'))) {
                const transform = new _ReactImportsPatcher.ReactImportsPatchTransform();
                stream = (0, _stream().pipeline)(stream, transform, (err)=>{
                    if (err) {
                        reject(err);
                    }
                });
            }
            if (fileHookTransform) {
                stream = (0, _stream().pipeline)(stream, fileHookTransform, (err)=>{
                    if (err) {
                        reject(err);
                    }
                });
            }
            stream.on('close', ()=>{
                if (!resolved) {
                    const hex = hasher.digest('hex');
                    const isTransformed = fileHookTransform?.isTransformed;
                    const debugInfo = options.debug ? {
                        path: filePath,
                        hash: hex,
                        ...isTransformed ? {
                            isTransformed
                        } : undefined
                    } : undefined;
                    resolve({
                        type: 'file',
                        id: filePath,
                        hex,
                        ...debugInfo ? {
                            debugInfo
                        } : undefined
                    });
                    resolved = true;
                }
            });
            stream.on('error', (e)=>{
                reject(e);
            });
            stream.on('data', (chunk)=>{
                hasher.update(chunk);
            });
        });
    });
}
async function createDirHashResultsAsync(dirPath, limiter, projectRoot, options, depth = 0) {
    // Using `ignoreDirMatchObjects` as an optimization to skip the whole directory
    if ((0, _Path.isIgnoredPathWithMatchObjects)(dirPath, options.ignoreDirMatchObjects)) {
        return null;
    }
    const dirents = (await _promises().default.readdir(_path().default.join(projectRoot, dirPath), {
        withFileTypes: true
    })).sort((a, b)=>a.name.localeCompare(b.name));
    const results = (await Promise.all(dirents.map(async (dirent)=>{
        if (dirent.isDirectory()) {
            // Skip nested node_modules inside a package.
            if (dirent.name === 'node_modules') {
                return null;
            }
            const filePath = (0, _Path.toPosixPath)(_path().default.join(dirPath, dirent.name));
            return await createDirHashResultsAsync(filePath, limiter, projectRoot, options, depth + 1);
        } else if (dirent.isFile()) {
            const filePath = (0, _Path.toPosixPath)(_path().default.join(dirPath, dirent.name));
            return await createFileHashResultsAsync(filePath, limiter, projectRoot, options);
        }
        return null;
    }))).filter(_Predicates.nonNullish);
    if (results.length === 0) {
        return null;
    }
    const hasher = (0, _crypto().createHash)(options.hashAlgorithm);
    const children = [];
    for (const result of results){
        hasher.update(result.id);
        hasher.update(result.hex);
        children.push(result.debugInfo);
    }
    const hex = hasher.digest('hex');
    return {
        type: 'dir',
        id: dirPath,
        hex,
        ...options.debug ? {
            debugInfo: {
                path: dirPath,
                children,
                hash: hex
            }
        } : undefined
    };
}
async function createContentsHashResultsAsync(source, options) {
    let isTransformed = undefined;
    if (options.fileHookTransform) {
        const transformedContents = options.fileHookTransform({
            type: 'contents',
            id: source.id
        }, source.contents, true, 'utf8') ?? '';
        if (options.debug) {
            isTransformed = transformedContents !== source.contents;
        }
        source.contents = transformedContents;
    }
    const hex = (0, _crypto().createHash)(options.hashAlgorithm).update(source.contents).digest('hex');
    const debugInfo = options.debug ? {
        hash: hex,
        ...isTransformed ? {
            isTransformed
        } : undefined
    } : undefined;
    return {
        type: 'contents',
        id: source.id,
        hex,
        ...debugInfo ? {
            debugInfo
        } : undefined
    };
}
async function createPackageHashResultsAsync(source, options) {
    if ((0, _Path.isIgnoredPathWithMatchObjects)(source.filePath, options.ignorePathMatchObjects)) {
        return null;
    }
    const { name, version } = source;
    const hex = (0, _crypto().createHash)(options.hashAlgorithm).update(JSON.stringify({
        name,
        version
    })).digest('hex');
    const debugInfo = options.debug ? {
        path: source.filePath,
        name,
        version,
        hash: hex
    } : undefined;
    return {
        type: 'package',
        id: createSourceId(source),
        hex,
        ...debugInfo ? {
            debugInfo
        } : undefined
    };
}
function createSourceId(source) {
    switch(source.type){
        case 'contents':
            return source.id;
        case 'file':
            return source.overrideHashKey ?? source.filePath;
        case 'dir':
            return source.overrideHashKey ?? source.filePath;
        case 'package':
            return source.overrideHashKey ?? `${source.name}@${source.version}`;
        default:
            throw new Error('Unsupported source type');
    }
}

//# sourceMappingURL=Hash.js.map
