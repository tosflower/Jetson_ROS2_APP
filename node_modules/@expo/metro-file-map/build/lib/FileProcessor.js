/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FileProcessor", {
    enumerable: true,
    get: function() {
        return FileProcessor;
    }
});
function _jestworker() {
    const data = require("jest-worker");
    _jestworker = function() {
        return data;
    };
    return data;
}
function _path() {
    const data = require("path");
    _path = function() {
        return data;
    };
    return data;
}
const _constants = /*#__PURE__*/ _interop_require_default(require("../constants"));
const _worker = require("../worker");
const _RootPathUtils = require("./RootPathUtils");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const debug = require('debug')('Metro:FileMap');
const NODE_MODULES_SEP = 'node_modules' + _path().sep;
const MAX_FILES_PER_WORKER = 100;
class FileProcessor {
    #maxFilesPerWorker;
    #maxWorkers;
    #perfLogger;
    #pluginWorkers;
    #inBandWorker;
    #rootPathUtils;
    constructor(opts){
        this.#maxFilesPerWorker = opts.maxFilesPerWorker ?? MAX_FILES_PER_WORKER;
        this.#maxWorkers = opts.maxWorkers;
        this.#pluginWorkers = opts.pluginWorkers ?? [];
        this.#inBandWorker = new _worker.Worker({
            plugins: this.#pluginWorkers.map((plugin)=>plugin.worker)
        });
        this.#perfLogger = opts.perfLogger;
        this.#rootPathUtils = new _RootPathUtils.RootPathUtils(opts.rootDir);
    }
    async processBatch(files, req) {
        const errors = [];
        const workerJobs = files.map(([normalFilePath, fileMetadata])=>{
            const maybeWorkerInput = this.#getWorkerInput(normalFilePath, fileMetadata, req);
            if (!maybeWorkerInput) {
                return null;
            }
            return [
                maybeWorkerInput,
                fileMetadata
            ];
        }).filter((x)=>x != null);
        const numWorkers = Math.min(this.#maxWorkers, Math.ceil(workerJobs.length / this.#maxFilesPerWorker));
        const batchWorker = this.#getBatchWorker(numWorkers);
        if (req.maybeReturnContent) {
            throw new Error('Batch processing does not support returning file contents');
        }
        await Promise.all(workerJobs.map(([workerInput, fileMetadata])=>{
            return batchWorker.processFile(workerInput).then((reply)=>processWorkerReply(reply, workerInput.pluginsToRun, fileMetadata)).catch((error)=>errors.push({
                    normalFilePath: this.#rootPathUtils.absoluteToNormal(workerInput.filePath),
                    error: normalizeWorkerError(error)
                }));
        }));
        await batchWorker.end();
        return {
            errors
        };
    }
    async processRegularFile(normalPath, fileMetadata, req) {
        const workerInput = this.#getWorkerInput(normalPath, fileMetadata, req);
        return workerInput ? {
            content: processWorkerReply(await this.#inBandWorker.processFile(workerInput), workerInput.pluginsToRun, fileMetadata)
        } : null;
    }
    #getWorkerInput(normalPath, fileMetadata, req) {
        if (fileMetadata[_constants.default.SYMLINK] !== 0) {
            // Only process regular files
            return null;
        }
        const computeSha1 = req.computeSha1 && fileMetadata[_constants.default.SHA1] == null;
        const { maybeReturnContent } = req;
        const nodeModulesIdx = normalPath.indexOf(NODE_MODULES_SEP);
        // Path may begin 'node_modules/' or contain '/node_modules/'.
        const isNodeModules = nodeModulesIdx === 0 || nodeModulesIdx > 0 && normalPath[nodeModulesIdx - 1] === _path().sep;
        // Indices of plugins with a passing filter
        const pluginsToRun = this.#pluginWorkers?.reduce((prev, plugin, idx)=>{
            if (plugin.filter({
                isNodeModules,
                normalPath
            })) {
                prev.push(idx);
            }
            return prev;
        }, []) ?? [];
        if (!computeSha1 && pluginsToRun.length === 0) {
            // Nothing to process
            return null;
        }
        // Use a cheaper worker configuration for node_modules files, because
        // they may never be Haste modules or packages.
        //
        // Note that we'd only expect node_modules files to reach this point if
        // retainAllFiles is true, or they're touched during watch mode.
        if (isNodeModules) {
            if (computeSha1) {
                return {
                    computeSha1: true,
                    filePath: this.#rootPathUtils.normalToAbsolute(normalPath),
                    maybeReturnContent,
                    pluginsToRun
                };
            }
            return null;
        }
        return {
            computeSha1,
            filePath: this.#rootPathUtils.normalToAbsolute(normalPath),
            maybeReturnContent,
            pluginsToRun
        };
    }
    /**
   * Creates workers or parses files and extracts metadata in-process.
   */ #getBatchWorker(numWorkers) {
        if (numWorkers <= 1) {
            // In-band worker with the same interface as a Jest worker farm
            return {
                processFile: async (message)=>this.#inBandWorker.processFile(message),
                end: async ()=>{}
            };
        }
        const workerPath = require.resolve('../worker');
        debug('Creating worker farm of %d worker threads', numWorkers);
        this.#perfLogger?.point('initWorkers_start');
        const jestWorker = new (_jestworker()).Worker(workerPath, {
            exposedMethods: [
                'processFile'
            ],
            maxRetries: 3,
            numWorkers,
            enableWorkerThreads: true,
            forkOptions: {
                // Don't pass Node arguments down to workers. In particular, avoid
                // unnecessarily registering Babel when we're running Metro from
                // source (our worker is plain CommonJS).
                execArgv: []
            },
            setupArgs: [
                {
                    plugins: this.#pluginWorkers.map((plugin)=>plugin.worker)
                }
            ]
        });
        this.#perfLogger?.point('initWorkers_end');
        // Only log worker init once
        this.#perfLogger = null;
        return jestWorker;
    }
    async end() {}
}
function processWorkerReply(metadata, pluginsRun, fileMetadata) {
    fileMetadata[_constants.default.VISITED] = 1;
    const pluginData = metadata.pluginData;
    if (pluginData) {
        for (const [i, pluginIdx] of pluginsRun.entries()){
            fileMetadata[_constants.default.PLUGINDATA + pluginIdx] = pluginData[i];
        }
    }
    if (metadata.sha1 != null) {
        fileMetadata[_constants.default.SHA1] = metadata.sha1;
    }
    return metadata.content;
}
function normalizeWorkerError(mixedError) {
    if (mixedError == null || typeof mixedError !== 'object' || mixedError.message == null || mixedError.stack == null) {
        const error = new Error(mixedError);
        error.stack = ''; // Remove stack for stack-less errors.
        return error;
    }
    return mixedError;
}

//# sourceMappingURL=FileProcessor.js.map
