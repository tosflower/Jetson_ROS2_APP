/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return nodeCrawl;
    }
});
function _fs() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("fs"));
    _fs = function() {
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
const _RootPathUtils = require("../../lib/RootPathUtils");
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
function find(roots, extensions, ignore, includeSymlinks, rootDir, console, previousFileSystem, callback) {
    const result = new Map();
    let activeCalls = 0;
    const pathUtils = new _RootPathUtils.RootPathUtils(rootDir);
    const exts = extensions.reduce((acc, ext)=>{
        acc[ext] = true;
        return acc;
    }, {});
    function search(directory, dirNormal, isWithinRoot) {
        activeCalls++;
        _fs().readdir(directory, {
            withFileTypes: true
        }, (err, entries)=>{
            activeCalls--;
            if (err) {
            // NOTE(@kitten): This isn't necessarily a problem and we can ignore this
            /*
        console.warn(
          `Error "${(err as any).code ?? err.message}" reading contents of "${directory}", skipping. Add this directory to your ignore list to exclude it.`
        );
        */ } else {
                for(let idx = 0; idx < entries.length; idx++){
                    const entry = entries[idx];
                    const name = entry.name;
                    // NOTE(@kitten): This replaces the VCS_DIRECTORIES ignore pattern
                    // NOTE(@kitten): `.cxx` is ephemeral and should always be safe to ignore
                    const isDirectory = entry.isDirectory();
                    if (isDirectory && (name === '.git' || name === '.hg' || name === '.cxx')) {
                        continue;
                    }
                    const file = directory + _path().sep + name;
                    const isSymbolicLink = entry.isSymbolicLink();
                    if (ignore(file) || !includeSymlinks && isSymbolicLink) {
                        continue;
                    }
                    // Deriving a normal path above the root dir requires slicing off an up-fragment
                    // then checking if the target matches the next segment of the root dir. It's therefore
                    // easier to fall back to `pathUtils.absoluteToNormal`
                    const childNormal = !isWithinRoot ? pathUtils.absoluteToNormal(file) : dirNormal === '' ? name : dirNormal + _path().sep + name;
                    if (isDirectory) {
                        // NOTE(@kitten): We'd like to be able to apply excludes to directories selectively based
                        // on their normal paths, so we can exclude using `^...`
                        if (!ignore(childNormal)) {
                            search(file, childNormal, isWithinRoot || childNormal === '');
                        }
                        continue;
                    }
                    const ext = _path().extname(file).substr(1);
                    if (!isSymbolicLink && !exts[ext]) {
                        continue;
                    }
                    const mtime = previousFileSystem?.getMtimeByNormalPath(childNormal);
                    if (mtime == null || mtime === 0) {
                        // When we're in a cold start or a previous file doesn't exist, we can skip
                        // the mtime/size lstat now and treat the file as new
                        result.set(childNormal, [
                            null,
                            0,
                            0,
                            null,
                            isSymbolicLink ? 1 : 0,
                            null
                        ]);
                    } else {
                        activeCalls++;
                        _fs().lstat(file, (err, stat)=>{
                            activeCalls--;
                            if (!err && stat) {
                                result.set(childNormal, [
                                    stat.mtime.getTime(),
                                    stat.size,
                                    0,
                                    null,
                                    isSymbolicLink ? 1 : 0,
                                    null
                                ]);
                            }
                            if (activeCalls === 0) {
                                callback(result);
                            }
                        });
                    }
                }
            }
            if (activeCalls === 0) {
                callback(result);
            }
        });
    }
    if (roots.length > 0) {
        for (const root of roots){
            const rootNormal = pathUtils.absoluteToNormal(root);
            const isWithinRoot = !rootNormal.startsWith('..' + _path().sep);
            search(root, rootNormal, isWithinRoot);
        }
    } else {
        callback(result);
    }
}
async function nodeCrawl(options) {
    const { console, previousState, extensions, ignore, rootDir, includeSymlinks, perfLogger, roots, abortSignal, subpath } = options;
    abortSignal?.throwIfAborted();
    perfLogger?.point('nodeCrawl_start');
    return new Promise((resolve, reject)=>{
        const callback = (fileData)=>{
            const difference = previousState.fileSystem.getDifference(fileData, {
                subpath
            });
            perfLogger?.point('nodeCrawl_end');
            try {
                // TODO: Use AbortSignal.reason directly when Flow supports it
                abortSignal?.throwIfAborted();
            } catch (e) {
                reject(e);
            }
            resolve(difference);
        };
        find(roots, extensions, ignore, includeSymlinks, rootDir, console, previousState.fileSystem, callback);
    });
}

//# sourceMappingURL=index.js.map
