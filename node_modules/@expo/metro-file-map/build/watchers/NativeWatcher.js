/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * NativeWatcher uses Node's native fs.watch API with recursive: true.
 *
 * Supported on macOS (and potentially Windows), because both natively have a
 * concept of recursive watching, via FSEvents and ReadDirectoryChangesW
 * respectively. Notably Linux lacks this capability at the OS level.
 *
 * Node.js has at times supported the `recursive` option to fs.watch on Linux
 * by walking the directory tree and creating a watcher on each directory, but
 * this fits poorly with the synchronous `watch` API - either it must block for
 * arbitrarily large IO, or it may drop changes after `watch` returns. See:
 * https://github.com/nodejs/node/issues/48437
 *
 * Therefore, we retain a fallback to our own application-level recursive
 * FallbackWatcher for Linux, which has async `startWatching`.
 *
 * On Windows, this watcher could be used in principle, but needs work around
 * some Windows-specific edge cases handled in FallbackWatcher, like
 * deduping file change events, ignoring directory changes, and handling EPERM.
 */ "default", {
    enumerable: true,
    get: function() {
        return NativeWatcher;
    }
});
function _fs() {
    const data = require("fs");
    _fs = function() {
        return data;
    };
    return data;
}
function _os() {
    const data = require("os");
    _os = function() {
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
const _AbstractWatcher = require("./AbstractWatcher");
const _common = require("./common");
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
const debug = require('debug')('Metro:NativeWatcher');
const TOUCH_EVENT = 'touch';
const DELETE_EVENT = 'delete';
const RECRAWL_EVENT = 'recrawl';
class NativeWatcher extends _AbstractWatcher.AbstractWatcher {
    #fsWatcher;
    static isSupported() {
        return (0, _os().platform)() === 'darwin';
    }
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(dir, opts){
        // NOTE(@kitten): `!NativeWatcher.isSupported` was always truthy, so omitting check here
        super(dir, opts);
    }
    async startWatching() {
        this.#fsWatcher = (0, _fs().watch)(this.root, {
            // Don't hold the process open if we forget to close()
            persistent: false,
            // FSEvents or ReadDirectoryChangesW should mean this is cheap and
            // ~instant on macOS or Windows.
            recursive: true
        }, (event, relativePath)=>{
            this._handleEvent(event, relativePath).catch((error)=>{
                this.emitError(error);
            });
        });
        debug('Watching %s', this.root);
    }
    /**
   * End watching.
   */ async stopWatching() {
        await super.stopWatching();
        if (this.#fsWatcher) {
            this.#fsWatcher.close();
        }
    }
    async _handleEvent(event, relativePath) {
        if (relativePath == null) {
            return;
        }
        const absolutePath = _path().resolve(this.root, relativePath);
        if (this.doIgnore(relativePath)) {
            debug('Ignoring event "%s" on %s (root: %s)', event, relativePath, this.root);
            return;
        }
        debug('Handling event "%s" on %s (root: %s)', event, relativePath, this.root);
        try {
            const stat = await _fs().promises.lstat(absolutePath);
            const type = (0, _common.typeFromStat)(stat);
            // Ignore files of an unrecognized type
            if (!type) {
                return;
            }
            if (!(0, _common.isIncluded)(type, this.included, relativePath)) {
                return;
            }
            // For directory "rename" events, notify that we need a recrawl since we
            // won't receive events for unmodified files underneath a moved (or
            // cloned) directory. Renames are fired by the OS on moves, clones, and
            // creations. We ignore "change" events because they indicate a change
            // to directory metadata, rather than its path or existence.
            if (type === 'd' && event === 'rename') {
                debug('Directory rename detected on %s, requesting recrawl', relativePath);
                this.emitFileEvent({
                    event: RECRAWL_EVENT,
                    relativePath
                });
                return;
            }
            this.emitFileEvent({
                event: TOUCH_EVENT,
                relativePath,
                metadata: {
                    type,
                    modifiedTime: stat.mtime.getTime(),
                    size: stat.size
                }
            });
        } catch (error) {
            if (error?.code !== 'ENOENT') {
                this.emitError(error);
                return;
            }
            this.emitFileEvent({
                event: DELETE_EVENT,
                relativePath
            });
        }
    }
}

//# sourceMappingURL=NativeWatcher.js.map
