/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    DependencyPlugin: null,
    DiskCacheManager: null,
    DuplicateHasteCandidatesError: null,
    HasteConflictsError: null,
    HastePlugin: null,
    default: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get DependencyPlugin () {
        return _DependencyPlugin.default;
    },
    get DiskCacheManager () {
        return _DiskCacheManager.DiskCacheManager;
    },
    get DuplicateHasteCandidatesError () {
        return _DuplicateHasteCandidatesError.DuplicateHasteCandidatesError;
    },
    get HasteConflictsError () {
        return _HasteConflictsError.HasteConflictsError;
    },
    get HastePlugin () {
        return _HastePlugin.default;
    },
    get /**
 * FileMap includes a JavaScript implementation of Facebook's haste module system.
 *
 * This implementation is inspired by https://github.com/facebook/node-haste
 * and was built with for high-performance in large code repositories with
 * hundreds of thousands of files. This implementation is scalable and provides
 * predictable performance.
 *
 * Because the file map creation and synchronization is critical to startup
 * performance and most tasks are blocked by I/O this class makes heavy use of
 * synchronous operations. It uses worker processes for parallelizing file
 * access and metadata extraction.
 *
 * The data structures created by `metro-file-map` can be used directly from the
 * cache without further processing. The metadata objects in the `files` and
 * `map` objects contain cross-references: a metadata object from one can look
 * up the corresponding metadata object in the other map. Note that in most
 * projects, the number of files will be greater than the number of haste
 * modules one module can refer to many files based on platform extensions.
 *
 * type CacheData = {
 *   clocks: WatchmanClocks,
 *   files: {[filepath: string]: FileMetadata},
 *   map: {[id: string]: HasteMapItem},
 *   mocks: {[id: string]: string},
 * }
 *
 * // Watchman clocks are used for query synchronization and file system deltas.
 * type WatchmanClocks = {[filepath: string]: string};
 *
 * type FileMetadata = {
 *   id: ?string, // used to look up module metadata objects in `map`.
 *   mtime: number, // check for outdated files.
 *   size: number, // size of the file in bytes.
 *   visited: boolean, // whether the file has been parsed or not.
 *   dependencies: Array<string>, // all relative dependencies of this file.
 *   sha1: ?string, // SHA-1 of the file, if requested via options.
 *   symlink: ?(1 | 0 | string), // Truthy if symlink, string is target
 * };
 *
 * // Modules can be targeted to a specific platform based on the file name.
 * // Example: platform.ios.js and Platform.android.js will both map to the same
 * // `Platform` module. The platform should be specified during resolution.
 * type HasteMapItem = {[platform: string]: ModuleMetadata};
 *
 * //
 * type ModuleMetadata = {
 *   path: string, // the path to look up the file object in `files`.
 *   type: string, // the module type (either `package` or `module`).
 * };
 *
 * Note that the data structures described above are conceptual only. The actual
 * implementation uses arrays and constant keys for metadata storage. Instead of
 * `{id: 'flatMap', mtime: 3421, size: 42, visited: true, dependencies: []}` the real
 * representation is similar to `['flatMap', 3421, 42, 1, []]` to save storage space
 * and reduce parse and write time of a big JSON blob.
 *
 * The FileMap is created as follows:
 *  1. read data from the cache or create an empty structure.
 *
 *  2. crawl the file system.
 *     * empty cache: crawl the entire file system.
 *     * cache available:
 *       * if watchman is available: get file system delta changes.
 *       * if watchman is unavailable: crawl the entire file system.
 *     * build metadata objects for every file. This builds the `files` part of
 *       the `FileMap`.
 *
 *  3. visit and extract metadata from changed files, including sha1,
 *     dependencies, and any plugins.
 *     * this is done in parallel over worker processes to improve performance.
 *     * the worst case is to visit all files.
 *     * the best case is no file system access and retrieving all data from
 *       the cache.
 *     * the average case is a small number of changed files.
 *
 *  4. serialize the new `FileMap` in a cache file.
 *
 */ default () {
        return FileMap;
    }
});
function _events() {
    const data = /*#__PURE__*/ _interop_require_default(require("events"));
    _events = function() {
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
function _invariant() {
    const data = /*#__PURE__*/ _interop_require_default(require("invariant"));
    _invariant = function() {
        return data;
    };
    return data;
}
function _path() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("path"));
    _path = function() {
        return data;
    };
    return data;
}
function _perf_hooks() {
    const data = require("perf_hooks");
    _perf_hooks = function() {
        return data;
    };
    return data;
}
const _Watcher = require("./Watcher");
const _DiskCacheManager = require("./cache/DiskCacheManager");
const _constants = /*#__PURE__*/ _interop_require_default(require("./constants"));
const _fallback = /*#__PURE__*/ _interop_require_default(require("./crawlers/node/fallback"));
const _events1 = require("./events");
const _FileProcessor = require("./lib/FileProcessor");
const _FileSystemChangeAggregator = require("./lib/FileSystemChangeAggregator");
const _RootPathUtils = require("./lib/RootPathUtils");
const _TreeFS = /*#__PURE__*/ _interop_require_default(require("./lib/TreeFS"));
const _checkWatchmanCapabilities = /*#__PURE__*/ _interop_require_default(require("./lib/checkWatchmanCapabilities"));
const _normalizePathSeparatorsToPosix = /*#__PURE__*/ _interop_require_default(require("./lib/normalizePathSeparatorsToPosix"));
const _normalizePathSeparatorsToSystem = /*#__PURE__*/ _interop_require_default(require("./lib/normalizePathSeparatorsToSystem"));
const _removeOverlappingRoots = /*#__PURE__*/ _interop_require_default(require("./lib/removeOverlappingRoots"));
const _DependencyPlugin = /*#__PURE__*/ _interop_require_default(require("./plugins/DependencyPlugin"));
const _DuplicateHasteCandidatesError = require("./plugins/haste/DuplicateHasteCandidatesError");
const _HasteConflictsError = require("./plugins/haste/HasteConflictsError");
const _HastePlugin = /*#__PURE__*/ _interop_require_default(require("./plugins/HastePlugin"));
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
const debug = require('debug')('Metro:FileMap');
// This should be bumped whenever a code change to `metro-file-map` itself
// would cause a change to the cache data structure and/or content (for a given
// filesystem state and build parameters).
const CACHE_BREAKER = '12';
const CHANGE_INTERVAL = 30;
const NODE_MODULES = _path().sep + 'node_modules' + _path().sep;
const WATCHMAN_REQUIRED_CAPABILITIES = [
    'field-content.sha1hex',
    'relative_root',
    'suffix-set',
    'wildmatch'
];
class FileMap extends _events().default {
    // NOTE(@kitten): Expo brand to recognize patched `metro-file-map -> @expo/metro-file-map`
    __expo = true;
    #buildPromise;
    #cacheManager;
    #canUseWatchmanPromise;
    #changeID;
    #changeInterval;
    #console;
    #crawlerAbortController;
    #fileProcessor;
    #healthCheckInterval;
    #options;
    #pathUtils;
    #plugins;
    #startupPerfLogger;
    #watcher;
    #usedWatchman = false;
    static create(options) {
        return new FileMap(options);
    }
    constructor(options){
        super();
        if (options.perfLoggerFactory) {
            this.#startupPerfLogger = options.perfLoggerFactory?.('START_UP').subSpan('fileMap') ?? null;
            this.#startupPerfLogger?.point('constructor_start');
        }
        const ignorePattern = options.ignorePattern ?? null;
        if (ignorePattern && !(ignorePattern instanceof RegExp)) {
            throw new Error('metro-file-map: the `ignorePattern` option must be a RegExp');
        }
        this.#console = options.console || globalThis.console;
        let dataSlot = _constants.default.PLUGINDATA;
        const indexedPlugins = [];
        const pluginWorkers = [];
        const plugins = options.plugins ?? [];
        for (const plugin of plugins){
            const maybeWorker = plugin.getWorker();
            indexedPlugins.push({
                plugin,
                dataIdx: maybeWorker != null ? dataSlot++ : null
            });
            if (maybeWorker != null) {
                pluginWorkers.push(maybeWorker);
            }
        }
        this.#plugins = indexedPlugins;
        const enableFallback = options.enableFallback ?? true;
        const scopeFallback = options.scopeFallback ?? true;
        const buildParameters = {
            cacheBreaker: CACHE_BREAKER,
            computeSha1: options.computeSha1 || false,
            enableSymlinks: options.enableSymlinks || false,
            extensions: options.extensions,
            ignorePattern,
            plugins,
            retainAllFiles: options.retainAllFiles,
            rootDir: options.rootDir,
            roots: (0, _removeOverlappingRoots.default)(options.roots)
        };
        this.#options = {
            ...buildParameters,
            healthCheck: options.healthCheck,
            perfLoggerFactory: options.perfLoggerFactory,
            resetCache: options.resetCache,
            useWatchman: options.useWatchman ?? false,
            watch: !!options.watch,
            watchmanDeferStates: options.watchmanDeferStates ?? [],
            enableFallback,
            scopeFallback: enableFallback && scopeFallback,
            serverRoot: options.serverRoot
        };
        const cacheFactoryOptions = {
            buildParameters
        };
        this.#cacheManager = options.cacheManagerFactory ? options.cacheManagerFactory.call(null, cacheFactoryOptions) : new _DiskCacheManager.DiskCacheManager(cacheFactoryOptions, {});
        this.#fileProcessor = new _FileProcessor.FileProcessor({
            maxFilesPerWorker: options.maxFilesPerWorker,
            maxWorkers: options.maxWorkers,
            perfLogger: this.#startupPerfLogger,
            pluginWorkers,
            rootDir: options.rootDir
        });
        this.#buildPromise = null;
        this.#pathUtils = new _RootPathUtils.RootPathUtils(options.rootDir);
        this.#startupPerfLogger?.point('constructor_end');
        this.#crawlerAbortController = new AbortController();
        this.#changeID = 0;
    }
    build() {
        this.#startupPerfLogger?.point('build_start');
        if (!this.#buildPromise) {
            const doneBuild = _events1.event.span();
            this.#buildPromise = (async ()=>{
                const doneHydrate = _events1.debugEvent.span();
                let initialData;
                if (this.#options.resetCache !== true) {
                    initialData = await this.read();
                }
                if (!initialData) {
                    debug('Not using a cache');
                } else {
                    debug('Cache loaded (%d clock(s))', initialData.clocks.size);
                }
                const rootDir = this.#options.rootDir;
                const ignorePattern = this.#options.ignorePattern;
                this.#startupPerfLogger?.point('constructFileSystem_start');
                const processFile = async (normalPath, metadata, opts)=>{
                    const result = await this.#fileProcessor.processRegularFile(normalPath, metadata, {
                        computeSha1: opts.computeSha1,
                        maybeReturnContent: true
                    });
                    debug('Lazily processed file: %s', normalPath);
                    // Emit an event to inform caches that there is new data to save.
                    this.emit('metadata');
                    return result?.content;
                };
                const fallbackFilesystem = this.#options.enableFallback ? (0, _fallback.default)({
                    rootPathUtils: this.#pathUtils,
                    extensions: this.#options.extensions,
                    ignore: ignorePattern ? (filePath)=>ignorePattern.test(filePath) : ()=>false,
                    includeSymlinks: this.#options.enableSymlinks
                }) : null;
                const { roots } = this.#options;
                const serverRoot = this.#options.scopeFallback ? this.#options.serverRoot : null;
                const fileSystem = initialData != null ? _TreeFS.default.fromDeserializedSnapshot({
                    // Typed `mixed` because we've read this from an external
                    // source. It'd be too expensive to validate at runtime, so
                    // trust our cache manager that this is correct.
                    fileSystemData: initialData.fileSystemData,
                    processFile,
                    rootDir,
                    fallbackFilesystem,
                    roots,
                    serverRoot
                }) : new _TreeFS.default({
                    processFile,
                    rootDir,
                    fallbackFilesystem,
                    roots,
                    serverRoot
                });
                this.#startupPerfLogger?.point('constructFileSystem_end');
                doneHydrate('hydrate', {
                    fromCache: initialData != null
                });
                const plugins = this.#plugins;
                // Initialize plugins from cached file system and plugin state while
                // crawling to build a diff of current state vs cached. `fileSystem`
                // is not mutated during either operation.
                const [fileDelta] = await Promise.all([
                    this.#buildFileDelta({
                        clocks: initialData?.clocks ?? new Map(),
                        fileSystem
                    }),
                    Promise.all(plugins.map(({ plugin, dataIdx })=>plugin.initialize({
                            files: {
                                lookup: (mixedPath)=>{
                                    const result = fileSystem.lookup(mixedPath);
                                    if (!result.exists) {
                                        return {
                                            exists: false
                                        };
                                    }
                                    if (result.type === 'd') {
                                        return {
                                            exists: true,
                                            type: 'd'
                                        };
                                    }
                                    return {
                                        exists: true,
                                        type: 'f',
                                        pluginData: dataIdx != null ? result.metadata[dataIdx] : null
                                    };
                                },
                                fileIterator: (opts)=>mapIterable(fileSystem.metadataIterator(opts), ({ baseName, canonicalPath, metadata })=>({
                                            baseName,
                                            canonicalPath,
                                            pluginData: dataIdx != null ? metadata[dataIdx] : null
                                        }))
                            },
                            pluginState: initialData?.plugins.get(plugin.name)
                        })))
                ]);
                // Update `fileSystem` and plugins based on the file delta.
                const actualChanges = await this.#applyFileDelta(fileSystem, plugins, fileDelta);
                const changeSize = actualChanges.getSize();
                // Validate plugins before persisting them.
                plugins.forEach(({ plugin })=>plugin.assertValid());
                const watchmanClocks = new Map('clocks' in fileDelta ? fileDelta.clocks : []);
                await this.#takeSnapshotAndPersist(fileSystem, watchmanClocks, plugins, changeSize > 0);
                debug('Finished mapping files (%d changes).', changeSize);
                await this.#watch(fileSystem, watchmanClocks, plugins);
                doneBuild('build', {
                    crawler: this.#usedWatchman ? 'watchman' : 'node',
                    fromCache: initialData != null
                });
                return {
                    fileSystem
                };
            })();
        }
        return this.#buildPromise.then((result)=>{
            this.#startupPerfLogger?.point('build_end');
            return result;
        });
    }
    /**
   * 1. read data from the cache or create an empty structure.
   */ async read() {
        let data;
        this.#startupPerfLogger?.point('read_start');
        try {
            data = await this.#cacheManager.read();
        } catch (e) {
            this.#console.warn('Error while reading cache, falling back to a full crawl:\n', e);
            this.#startupPerfLogger?.annotate({
                string: {
                    cacheReadError: e.toString()
                }
            });
            (0, _events1.event)('cache:read_error', {
                error: _events1.event.error(e)
            });
        }
        this.#startupPerfLogger?.point('read_end');
        return data;
    }
    /**
   * 2. crawl the file system.
   */ async #buildFileDelta(previousState) {
        this.#startupPerfLogger?.point('buildFileDelta_start');
        const { computeSha1, enableSymlinks, extensions, ignorePattern, retainAllFiles, roots, rootDir, watch, watchmanDeferStates } = this.#options;
        const ignoreForCrawl = (()=>{
            if (ignorePattern && !retainAllFiles) {
                return (filePath)=>ignorePattern.test(filePath) || filePath.includes(NODE_MODULES);
            } else if (ignorePattern) {
                return (filePath)=>ignorePattern.test(filePath);
            } else if (!retainAllFiles) {
                return (filePath)=>filePath.includes(NODE_MODULES);
            } else {
                return ()=>false;
            }
        })();
        this.#usedWatchman = await this.#shouldUseWatchman();
        const crawler = this.#usedWatchman ? 'watchman' : 'node';
        const full = !previousState.clocks || previousState.clocks.size === 0;
        const doneCrawl = _events1.debugEvent.span();
        this.#watcher = new _Watcher.Watcher({
            abortSignal: this.#crawlerAbortController.signal,
            computeSha1,
            console: this.#console,
            enableSymlinks,
            extensions,
            healthCheckFilePrefix: this.#options.healthCheck.enabled ? this.#options.healthCheck.filePrefix : null,
            ignoreForCrawl,
            ignorePatternForWatch: ignorePattern,
            perfLogger: this.#startupPerfLogger,
            previousState,
            rootDir,
            roots,
            useWatchman: this.#usedWatchman,
            watch,
            watchmanDeferStates
        });
        const watcher = this.#watcher;
        watcher.on('status', (status)=>this.emit('status', status));
        const result = await watcher.crawl();
        this.#startupPerfLogger?.point('buildFileDelta_end');
        doneCrawl('crawl', {
            crawler,
            full,
            changed: result.changedFiles.size,
            removed: result.removedFiles.size
        });
        return result;
    }
    #maybeReadLink(normalPath, fileMetadata) {
        // If we only need to read a link, it's more efficient to do it in-band
        // (with async file IO) than to have the overhead of worker IO.
        if (fileMetadata[_constants.default.SYMLINK] === 1) {
            return _fs().promises.readlink(this.#pathUtils.normalToAbsolute(normalPath)).then((symlinkTarget)=>{
                fileMetadata[_constants.default.VISITED] = 1;
                fileMetadata[_constants.default.SYMLINK] = (0, _normalizePathSeparatorsToPosix.default)(this.#pathUtils.resolveSymlinkToNormal(normalPath, symlinkTarget));
            });
        }
        return null;
    }
    async #applyFileDelta(fileSystem, plugins, delta) {
        this.#startupPerfLogger?.point('applyFileDelta_start');
        const doneProcess = _events1.debugEvent.span();
        const { changedFiles, removedFiles } = delta;
        this.#startupPerfLogger?.point('applyFileDelta_preprocess_start');
        // Remove files first so that we don't mistake moved modules
        // modules as duplicates.
        this.#startupPerfLogger?.point('applyFileDelta_remove_start');
        const changeAggregator = new _FileSystemChangeAggregator.FileSystemChangeAggregator();
        for (const relativeFilePath of removedFiles){
            fileSystem.remove(relativeFilePath, changeAggregator);
        }
        this.#startupPerfLogger?.point('applyFileDelta_remove_end');
        const readLinkPromises = [];
        const readLinkErrors = [];
        const filesToProcess = [];
        for (const [normalFilePath, fileData] of changedFiles){
            // A crawler may preserve the H.VISITED flag to indicate that the file
            // contents are unchanged and it doesn't need visiting again.
            if (fileData[_constants.default.VISITED] === 1) {
                continue;
            }
            if (fileData[_constants.default.SYMLINK] === 0) {
                filesToProcess.push([
                    normalFilePath,
                    fileData
                ]);
            } else if (fileData[_constants.default.MTIME] != null && fileData[_constants.default.MTIME] !== 0) {
                // Symlink was previously resolved and its mtime changed — resolve
                // eagerly to update the cached target. Symlinks with null mtime
                // (cold start or never accessed) are deferred to lazy resolution
                // in TreeFS.#resolveSymlinkTargetToNormalPath.
                const maybeReadLink = this.#maybeReadLink(normalFilePath, fileData);
                if (maybeReadLink) {
                    readLinkPromises.push(maybeReadLink.catch((error)=>{
                        readLinkErrors.push({
                            normalFilePath,
                            error
                        });
                    }));
                }
            }
        }
        this.#startupPerfLogger?.point('applyFileDelta_preprocess_end');
        debug('Found %d added/modified files and %d symlinks.', filesToProcess.length, readLinkPromises.length);
        this.#startupPerfLogger?.point('applyFileDelta_process_start');
        const [batchResult] = await Promise.all([
            this.#fileProcessor.processBatch(filesToProcess, {
                computeSha1: this.#options.computeSha1,
                maybeReturnContent: false
            }),
            Promise.all(readLinkPromises)
        ]);
        this.#startupPerfLogger?.point('applyFileDelta_process_end');
        // It's possible that a file could be deleted between being seen by the
        // crawler and our attempt to process it. For our purposes, this is
        // equivalent to the file being deleted before the crawl, being absent
        // from `changedFiles`, and (if we loaded from cache, and the file
        // existed previously) possibly being reported in `removedFiles`.
        //
        // Treat the file accordingly - don't add it to `FileSystem`, and remove
        // it if it already exists. We're not emitting events at this point in
        // startup, so there's nothing more to do.
        this.#startupPerfLogger?.point('applyFileDelta_missing_start');
        for (const { normalFilePath, error } of batchResult.errors.concat(readLinkErrors)){
            if ([
                'ENOENT',
                'EACCESS'
            ].includes(error.code ?? '')) {
                delta.changedFiles.delete(normalFilePath);
                fileSystem.remove(normalFilePath, changeAggregator);
            } else {
                // Anything else is fatal.
                throw error;
            }
        }
        this.#startupPerfLogger?.point('applyFileDelta_missing_end');
        this.#startupPerfLogger?.point('applyFileDelta_add_start');
        fileSystem.bulkAddOrModify(changedFiles, changeAggregator);
        this.#startupPerfLogger?.point('applyFileDelta_add_end');
        this.#startupPerfLogger?.point('applyFileDelta_updatePlugins_start');
        this.#plugins.forEach(({ plugin, dataIdx })=>{
            plugin.onChanged(changeAggregator.getMappedView(dataIdx != null ? (metadata)=>metadata[dataIdx] : ()=>null));
        });
        this.#startupPerfLogger?.point('applyFileDelta_updatePlugins_end');
        this.#startupPerfLogger?.point('applyFileDelta_end');
        doneProcess('process', {
            processed: filesToProcess.length
        });
        return changeAggregator;
    }
    /**
   * 4. Serialize a snapshot of our raw data via the configured cache manager
   */ async #takeSnapshotAndPersist(fileSystem, clocks, plugins, changedSinceCacheRead) {
        this.#startupPerfLogger?.point('persist_start');
        const donePersist = _events1.debugEvent.span();
        await this.#cacheManager.write(()=>({
                clocks: new Map(clocks),
                fileSystemData: fileSystem.getSerializableSnapshot(),
                plugins: new Map(plugins.map(({ plugin })=>[
                        plugin.name,
                        plugin.getSerializableSnapshot()
                    ]))
            }), {
            changedSinceCacheRead,
            eventSource: {
                onChange: (cb)=>{
                    // Inform the cache about changes to internal state, including:
                    //  - File system changes
                    this.on('change', cb);
                    //  - Changes to stored metadata, e.g. on lazy processing.
                    this.on('metadata', cb);
                    return ()=>{
                        this.removeListener('change', cb);
                        this.removeListener('metadata', cb);
                    };
                }
            },
            onWriteError: (error)=>{
                this.#console.warn('[metro-file-map] Cache write error\n:', error);
            }
        });
        this.#startupPerfLogger?.point('persist_end');
        donePersist('persist', {});
    }
    /**
   * Watch mode
   */ async #watch(fileSystem, clocks, plugins) {
        this.#startupPerfLogger?.point('watch_start');
        if (!this.#options.watch) {
            this.#startupPerfLogger?.point('watch_end');
            return;
        }
        const hasWatchedExtension = (filePath)=>this.#options.extensions.some((ext)=>filePath.endsWith(ext));
        let nextEmit = null;
        const emitChange = ()=>{
            if (nextEmit == null) {
                // Nothing to emit
                return;
            }
            const { events, firstEventTimestamp, firstEnqueuedTimestamp } = nextEmit;
            const changeAggregator = new _FileSystemChangeAggregator.FileSystemChangeAggregator();
            // Process a sequence of events. Note that preserving ordering is
            // important here - a file may be both removed and added in the same
            // batch.
            // `changeAggregator` flattens this over time into the net change from
            // this sequence.
            for (const event of events){
                const { relativeFilePath, clock } = event;
                if (event.type === 'delete') {
                    fileSystem.remove(relativeFilePath, changeAggregator);
                } else {
                    fileSystem.addOrModify(relativeFilePath, event.metadata, changeAggregator);
                }
                this.#updateClock(clocks, clock);
            }
            const changeSize = changeAggregator.getSize();
            if (changeSize === 0) {
                // We had events, but they've exactly cancelled each other out, reset
                // so that timers are correct for the next change.
                nextEmit = null;
                return;
            }
            this.#plugins.forEach(({ plugin, dataIdx })=>{
                plugin.onChanged(changeAggregator.getMappedView(dataIdx != null ? (metadata)=>metadata[dataIdx] : ()=>null));
            });
            const toPublicMetadata = (metadata)=>({
                    isSymlink: metadata[_constants.default.SYMLINK] !== 0,
                    modifiedTime: metadata[_constants.default.MTIME] ?? null
                });
            const changesWithMetadata = changeAggregator.getMappedView(toPublicMetadata);
            const hmrPerfLogger = this.#options.perfLoggerFactory?.('HMR', {
                key: this.#getNextChangeID()
            });
            if (hmrPerfLogger != null) {
                hmrPerfLogger.start({
                    timestamp: firstEventTimestamp
                });
                hmrPerfLogger.point('waitingForChangeInterval_start', {
                    timestamp: firstEnqueuedTimestamp
                });
                hmrPerfLogger.point('waitingForChangeInterval_end');
                hmrPerfLogger.annotate({
                    int: {
                        changeSize
                    }
                });
                hmrPerfLogger.point('fileChange_start');
            }
            const changeEvent = {
                changes: changesWithMetadata,
                logger: hmrPerfLogger,
                rootDir: this.#options.rootDir
            };
            this.emit('change', changeEvent);
            nextEmit = null;
        };
        let changeQueue = Promise.resolve();
        const onChange = (change)=>{
            // Recrawl events bypass normal filtering - they trigger a full subdirectory scan
            if (change.event !== 'recrawl' && change.metadata && // Ignore all directory events
            (change.metadata.type === 'd' || // Ignore regular files with unwatched extensions
            change.metadata.type === 'f' && !hasWatchedExtension(change.relativePath) || // Don't emit events relating to symlinks if enableSymlinks: false
            !this.#options.enableSymlinks && change.metadata?.type === 'l')) {
                return;
            }
            const absoluteFilePath = _path().join(change.root, (0, _normalizePathSeparatorsToSystem.default)(change.relativePath));
            // Ignore files (including symlinks) whose path matches ignorePattern
            // (we don't ignore node_modules in watch mode)
            // TODO(@kitten): Can be dropped, assuming that regexes aren't violating constraints
            if (this.#options.ignorePattern?.test(absoluteFilePath) === true) {
                return;
            }
            const relativeFilePath = this.#pathUtils.absoluteToNormal(absoluteFilePath);
            const onChangeStartTime = _perf_hooks().performance.timeOrigin + _perf_hooks().performance.now();
            const enqueueEvent = (event)=>{
                nextEmit ??= {
                    events: [],
                    firstEnqueuedTimestamp: _perf_hooks().performance.timeOrigin + _perf_hooks().performance.now(),
                    firstEventTimestamp: onChangeStartTime
                };
                nextEmit.events.push(event);
            };
            changeQueue = changeQueue.then(async ()=>{
                // If we get duplicate events for the same file, ignore them.
                if (nextEmit != null && nextEmit.events.find((event)=>event.type === change.event && event.relativeFilePath === relativeFilePath && (!('metadata' in event) && !change.metadata || 'metadata' in event && change.metadata && event.metadata[_constants.default.MTIME] != null && change.metadata.modifiedTime != null && event.metadata[_constants.default.MTIME] === change.metadata.modifiedTime))) {
                    return null;
                }
                // If the file was added or modified,
                // parse it and update the file map.
                if (change.event === 'touch') {
                    (0, _invariant().default)(change.metadata.size != null, 'since the file exists or changed, it should have known size');
                    const fileMetadata = [
                        change.metadata.modifiedTime ?? null,
                        change.metadata.size,
                        0,
                        null,
                        change.metadata.type === 'l' ? 1 : 0,
                        null
                    ];
                    try {
                        if (change.metadata.type === 'l') {
                            await this.#maybeReadLink(relativeFilePath, fileMetadata);
                        } else {
                            await this.#fileProcessor.processRegularFile(relativeFilePath, fileMetadata, {
                                computeSha1: this.#options.computeSha1,
                                maybeReturnContent: false
                            });
                        }
                        enqueueEvent({
                            clock: change.clock,
                            relativeFilePath,
                            metadata: fileMetadata,
                            type: change.event
                        });
                    } catch (e) {
                        if (![
                            'ENOENT',
                            'EACCESS'
                        ].includes(e.code)) {
                            throw e;
                        }
                    // Swallow ENOENT/ACCESS errors silently. Safe because either:
                    // - We never knew about the file, so neither did any consumers.
                    // Or,
                    // - The watcher will soon (or has already) report a "delete"
                    //   event for it, and we'll clean up in the usual way at that
                    //   point.
                    }
                } else if (change.event === 'delete') {
                    enqueueEvent({
                        clock: change.clock,
                        relativeFilePath,
                        type: 'delete'
                    });
                } else if (change.event === 'recrawl') {
                    // Recrawl event: flush pending changes and re-crawl the directory
                    emitChange();
                    // The relativePath is relative to the watcher root (change.root),
                    // but we need a path relative to rootDir for the recrawl.
                    const absoluteDirPath = _path().join(change.root, (0, _normalizePathSeparatorsToSystem.default)(change.relativePath));
                    const subpath = this.#pathUtils.absoluteToNormal(absoluteDirPath);
                    // Crawl the specific subdirectory
                    const watcher = this.#watcher;
                    (0, _invariant().default)(watcher != null, 'Watcher must be initialized');
                    const crawlResult = await watcher.recrawl(subpath, fileSystem);
                    // Skip if no changes
                    if (crawlResult.changedFiles.size === 0 && crawlResult.removedFiles.size === 0) {
                        return null;
                    }
                    // Reuse the same batch processing logic as build()
                    const recrawlChangeAggregator = await this.#applyFileDelta(fileSystem, this.#plugins, crawlResult);
                    // Update clock if provided
                    this.#updateClock(clocks, change.clock);
                    // Skip emit if no changes after processing
                    if (recrawlChangeAggregator.getSize() === 0) {
                        return null;
                    }
                    // Emit changes directly
                    const toPublicMetadata = (metadata)=>({
                            isSymlink: metadata[_constants.default.SYMLINK] !== 0,
                            modifiedTime: metadata[_constants.default.MTIME] ?? null
                        });
                    const changesWithMetadata = recrawlChangeAggregator.getMappedView(toPublicMetadata);
                    const changeEvent = {
                        changes: changesWithMetadata,
                        logger: null,
                        rootDir: this.#options.rootDir
                    };
                    this.emit('change', changeEvent);
                } else {
                    throw new Error(`metro-file-map: Unrecognized event type from watcher: ${change.event}`);
                }
                return null;
            }).catch((error)=>{
                this.#console.error(`metro-file-map: watch error:\n  ${error.stack}\n`);
            });
        };
        this.#changeInterval = setInterval(emitChange, CHANGE_INTERVAL);
        (0, _invariant().default)(this.#watcher != null, 'Expected #watcher to have been initialised by build()');
        await this.#watcher.watch(onChange);
        if (this.#options.healthCheck.enabled) {
            const performHealthCheck = ()=>{
                if (!this.#watcher) {
                    return;
                }
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                this.#watcher.checkHealth(this.#options.healthCheck.timeout).then((result)=>{
                    this.emit('healthCheck', result);
                });
            };
            performHealthCheck();
            this.#healthCheckInterval = setInterval(performHealthCheck, this.#options.healthCheck.interval);
        }
        this.#startupPerfLogger?.point('watch_end');
    }
    async end() {
        if (this.#changeInterval) {
            clearInterval(this.#changeInterval);
        }
        if (this.#healthCheckInterval) {
            clearInterval(this.#healthCheckInterval);
        }
        this.#crawlerAbortController.abort();
        await Promise.all([
            this.#fileProcessor.end(),
            this.#watcher?.close(),
            this.#cacheManager.end()
        ]);
    }
    async #shouldUseWatchman() {
        if (!this.#options.useWatchman) {
            return false;
        }
        if (!this.#canUseWatchmanPromise) {
            this.#canUseWatchmanPromise = (0, _checkWatchmanCapabilities.default)(WATCHMAN_REQUIRED_CAPABILITIES).then(({ version })=>{
                this.#startupPerfLogger?.annotate({
                    string: {
                        watchmanVersion: version
                    }
                });
                return true;
            }).catch((e)=>{
                // TODO: Advise people to either install Watchman or set
                // `useWatchman: false` here?
                this.#startupPerfLogger?.annotate({
                    string: {
                        watchmanFailedCapabilityCheck: e?.message ?? '[missing]'
                    }
                });
                (0, _events1.event)('watchman:unavailable', {
                    reason: e?.message ?? '[missing]'
                });
                return false;
            });
        }
        return this.#canUseWatchmanPromise;
    }
    #getNextChangeID() {
        if (this.#changeID >= Number.MAX_SAFE_INTEGER) {
            this.#changeID = 0;
        }
        return ++this.#changeID;
    }
    #updateClock(clocks, newClock) {
        if (newClock == null) {
            return;
        }
        const [absoluteWatchRoot, clockSpec] = newClock;
        const relativeFsRoot = this.#pathUtils.absoluteToNormal(absoluteWatchRoot);
        clocks.set((0, _normalizePathSeparatorsToPosix.default)(relativeFsRoot), clockSpec);
    }
    static H = _constants.default;
}
// TODO: Replace with it.map() from Node 22+
function mapIterable(it, fn) {
    return function* mapped() {
        for (const item of it){
            yield fn(item);
        }
    }();
}

//# sourceMappingURL=index.js.map
