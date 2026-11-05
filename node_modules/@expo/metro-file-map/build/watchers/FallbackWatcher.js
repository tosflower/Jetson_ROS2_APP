/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */ /**
 * Originally vendored from https://github.com/amasad/sane/blob/64ff3a870c42e84f744086884bf55a4f9c22d376/src/node_watcher.js
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return FallbackWatcher;
    }
});
function _fs() {
    const data = /*#__PURE__*/ _interop_require_default(require("fs"));
    _fs = function() {
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
const _AbstractWatcher = require("./AbstractWatcher");
const _common = /*#__PURE__*/ _interop_require_wildcard(require("./common"));
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
// NOTE(@kitten): No typings
const walker = require('walker');
const platform = _os().default.platform();
const fsPromises = _fs().default.promises;
const TOUCH_EVENT = _common.TOUCH_EVENT;
const DELETE_EVENT = _common.DELETE_EVENT;
/**
 * This setting delays all events. It suppresses 'change' events that
 * immediately follow an 'add', and debounces successive 'change' events to
 * only emit the latest.
 */ const DEBOUNCE_MS = 100;
class FallbackWatcher extends _AbstractWatcher.AbstractWatcher {
    #changeTimers = new Map();
    #dirRegistry = Object.create(null);
    #watched = Object.create(null);
    async startWatching() {
        this.#watchdir(this.root);
        await new Promise((resolve)=>{
            recReaddir(this.root, (dir)=>{
                this.#watchdir(dir);
            }, (filename)=>{
                this.#register(filename, 'f');
            }, (symlink)=>{
                this.#register(symlink, 'l');
            }, ()=>{
                resolve();
            }, this.#checkedEmitError, this.ignored);
        });
    }
    /**
   * Register files that matches our globs to know what to type of event to
   * emit in the future.
   *
   * Registry looks like the following:
   *
   *  dirRegister => Map {
   *    dirpath => Map {
   *       filename => true
   *    }
   *  }
   *
   *  Return false if ignored or already registered.
   */ #register(filepath, type) {
        const dir = _path().default.dirname(filepath);
        const filename = _path().default.basename(filepath);
        if (this.#dirRegistry[dir] && this.#dirRegistry[dir][filename]) {
            return false;
        }
        const relativePath = _path().default.relative(this.root, filepath);
        if (this.doIgnore(relativePath) || type === 'f' && !_common.isIncluded('f', this.included, relativePath)) {
            return false;
        }
        if (!this.#dirRegistry[dir]) {
            this.#dirRegistry[dir] = Object.create(null);
        }
        this.#dirRegistry[dir][filename] = true;
        return true;
    }
    /**
   * Removes a file from the registry.
   */ #unregister(filepath) {
        const dir = _path().default.dirname(filepath);
        if (this.#dirRegistry[dir]) {
            const filename = _path().default.basename(filepath);
            delete this.#dirRegistry[dir][filename];
        }
    }
    /**
   * Removes a dir from the registry, returning all files that were registered
   * under it (recursively).
   */ #unregisterDir(dirpath) {
        const removedFiles = [];
        // Find and remove all entries under this directory
        for (const registeredDir of Object.keys(this.#dirRegistry)){
            if (registeredDir === dirpath || registeredDir.startsWith(dirpath + _path().default.sep)) {
                // Collect all files in this directory
                for (const filename of Object.keys(this.#dirRegistry[registeredDir])){
                    removedFiles.push(_path().default.join(registeredDir, filename));
                }
                delete this.#dirRegistry[registeredDir];
            }
        }
        return removedFiles;
    }
    /**
   * Checks if a file or directory exists in the registry.
   */ #registered(fullpath) {
        const dir = _path().default.dirname(fullpath);
        return !!(this.#dirRegistry[fullpath] || this.#dirRegistry[dir] && this.#dirRegistry[dir][_path().default.basename(fullpath)]);
    }
    /**
   * Emit "error" event if it's not an ignorable event
   */ #checkedEmitError = (error)=>{
        if (!isIgnorableFileError(error)) {
            this.emitError(error);
        }
    };
    /**
   * Watch a directory.
   */ #watchdir = (dir)=>{
        if (this.#watched[dir]) {
            return false;
        }
        let watcher;
        try {
            watcher = _fs().default.watch(dir, {
                persistent: true
            }, (event, filename)=>this.#normalizeChange(dir, event, filename));
        } catch (error) {
            // Directory can vanish before watch; filterDir must not throw.
            this.#checkedEmitError(error);
            return false;
        }
        this.#watched[dir] = watcher;
        watcher.on('error', (error)=>{
            // Node emits no `close` after `error`.
            if (this.#watched[dir] === watcher) {
                delete this.#watched[dir];
            }
            watcher.close();
            this.#checkedEmitError(error);
        });
        if (this.root !== dir) {
            this.#register(dir, 'd');
        }
        return true;
    };
    /**
   * Stop watching a directory.
   */ async #stopWatching(dir) {
        const watcher = this.#watched[dir];
        if (!watcher) {
            return;
        }
        delete this.#watched[dir];
        await new Promise((resolve)=>{
            watcher.once('close', ()=>process.nextTick(resolve));
            watcher.once('error', ()=>process.nextTick(resolve));
            watcher.close();
        });
    }
    /**
   * End watching.
   */ async stopWatching() {
        await super.stopWatching();
        const promises = Object.keys(this.#watched).map((dir)=>this.#stopWatching(dir));
        await Promise.all(promises);
    }
    /**
   * On some platforms, as pointed out on the fs docs (most likely just win32)
   * the file argument might be missing from the fs event. Try to detect what
   * change by detecting if something was deleted or the most recent file change.
   */ #detectChangedFile(dir, event, callback) {
        if (!this.#dirRegistry[dir]) {
            return;
        }
        let found = false;
        let closest = null;
        let c = 0;
        Object.keys(this.#dirRegistry[dir]).forEach((file, i, arr)=>{
            _fs().default.lstat(_path().default.join(dir, file), (error, stat)=>{
                if (found) {
                    return;
                }
                if (error) {
                    if (isIgnorableFileError(error)) {
                        found = true;
                        callback(file);
                    } else {
                        this.emitError(error);
                    }
                } else {
                    if (closest == null || stat.mtime > closest.mtime) {
                        closest = {
                            file,
                            mtime: stat.mtime
                        };
                    }
                    if (arr.length === ++c) {
                        callback(closest.file);
                    }
                }
            });
        });
    }
    /**
   * Normalize fs events and pass it on to be processed.
   */ #normalizeChange(dir, event, file) {
        if (!file) {
            if (!this.#dirRegistry[dir]) {
                // Windows may omit filename; list the new directory.
                this.#processChange(dir, event === 'change' ? 'rename' : event, '').catch((error)=>{
                    this.emitError(error);
                });
                return;
            }
            this.#detectChangedFile(dir, event, (actualFile)=>{
                if (actualFile) {
                    this.#processChange(dir, event, actualFile).catch((error)=>{
                        this.emitError(error);
                    });
                }
            });
        } else {
            this.#processChange(dir, event, _path().default.normalize(file)).catch((error)=>{
                this.emitError(error);
            });
        }
    }
    /**
   * Process changes.
   */ async #processChange(dir, event, file) {
        const fullPath = _path().default.join(dir, file);
        const relativePath = _path().default.join(_path().default.relative(this.root, dir), file);
        const registered = this.#registered(fullPath);
        try {
            const stat = await fsPromises.lstat(fullPath);
            if (stat.isDirectory()) {
                // win32 emits useless change events on dirs.
                if (event === 'change') {
                    return;
                }
                if (this.doIgnore(relativePath) || !_common.isIncluded('d', this.included, relativePath)) {
                    return;
                }
                recReaddir(_path().default.resolve(this.root, relativePath), (dir, stats)=>{
                    if (this.#watchdir(dir)) {
                        this.#emitEvent({
                            event: TOUCH_EVENT,
                            relativePath: _path().default.relative(this.root, dir),
                            metadata: {
                                modifiedTime: stats.mtime.getTime(),
                                size: stats.size,
                                type: 'd'
                            }
                        });
                    }
                }, (file, stats)=>{
                    if (this.#register(file, 'f')) {
                        this.#emitEvent({
                            event: TOUCH_EVENT,
                            relativePath: _path().default.relative(this.root, file),
                            metadata: {
                                modifiedTime: stats.mtime.getTime(),
                                size: stats.size,
                                type: 'f'
                            }
                        });
                    }
                }, (symlink, stats)=>{
                    if (this.#register(symlink, 'l')) {
                        this.emitFileEvent({
                            event: TOUCH_EVENT,
                            relativePath: _path().default.relative(this.root, symlink),
                            metadata: {
                                modifiedTime: stats.mtime.getTime(),
                                size: stats.size,
                                type: 'l'
                            }
                        });
                    }
                }, function endCallback() {}, this.#checkedEmitError, this.ignored);
            } else {
                const type = _common.typeFromStat(stat);
                if (type == null) {
                    return;
                }
                const metadata = {
                    modifiedTime: stat.mtime.getTime(),
                    size: stat.size,
                    type
                };
                if (registered) {
                    this.#emitEvent({
                        event: TOUCH_EVENT,
                        relativePath,
                        metadata
                    });
                } else {
                    if (this.#register(fullPath, type)) {
                        this.#emitEvent({
                            event: TOUCH_EVENT,
                            relativePath,
                            metadata
                        });
                    }
                }
            }
        } catch (error) {
            if (!isIgnorableFileError(error)) {
                this.emitError(error);
                return;
            }
            this.#unregister(fullPath);
            // When a directory is deleted, emit delete events for all files we
            // knew about under that directory
            const removedFiles = this.#unregisterDir(fullPath);
            for (const removedFile of removedFiles){
                this.#emitEvent({
                    event: DELETE_EVENT,
                    relativePath: _path().default.relative(this.root, removedFile)
                });
            }
            if (registered) {
                this.#emitEvent({
                    event: DELETE_EVENT,
                    relativePath
                });
            }
            await this.#stopWatching(fullPath);
        }
    }
    /**
   * Emits the given event after debouncing, to emit only the latest
   * information when we receive several events in quick succession. E.g.,
   * Linux emits two events for every new file.
   *
   * See also note above for DEBOUNCE_MS.
   */ #emitEvent(change) {
        const { event, relativePath } = change;
        const key = event + '-' + relativePath;
        const existingTimer = this.#changeTimers.get(key);
        if (existingTimer) {
            clearTimeout(existingTimer);
        }
        this.#changeTimers.set(key, setTimeout(()=>{
            this.#changeTimers.delete(key);
            this.emitFileEvent(change);
        }, DEBOUNCE_MS));
    }
    getPauseReason() {
        return null;
    }
}
/**
 * Determine if a given FS error can be ignored
 */ function isIgnorableFileError(error) {
    return error.code === 'ENOENT' || // Workaround Windows EPERM on watched folder deletion, and when
    // reading locked files (pending further writes or pending deletion).
    // In such cases, we'll receive a subsequent event when the file is
    // deleted or ready to read.
    // https://github.com/facebook/metro/issues/1001
    // https://github.com/nodejs/node-v0.x-archive/issues/4337
    error.code === 'EPERM' && platform === 'win32';
}
/**
 * Traverse a directory recursively calling `callback` on every directory.
 */ function recReaddir(dir, dirCallback, fileCallback, symlinkCallback, endCallback, errorCallback, ignored) {
    const walk = walker(dir);
    // Watch before readdir so a file written in between is not missed.
    walk.filterDir((currentDir, stats)=>{
        if (ignored && _common.posixPathMatchesPattern(ignored, currentDir)) {
            return false;
        }
        normalizeProxy(dirCallback)(currentDir, stats);
        return true;
    });
    walk.on('file', normalizeProxy(fileCallback)).on('symlink', normalizeProxy(symlinkCallback)).on('error', errorCallback).on('end', ()=>{
        if (platform === 'win32') {
            setTimeout(endCallback, 1000);
        } else {
            endCallback();
        }
    });
}
/**
 * Returns a callback that when called will normalize a path and call the
 * original callback
 */ function normalizeProxy(callback) {
    return (filepath, stats)=>callback(_path().default.normalize(filepath), stats);
}

//# sourceMappingURL=FallbackWatcher.js.map
