/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AbstractWatcher", {
    enumerable: true,
    get: function() {
        return AbstractWatcher;
    }
});
function _events() {
    const data = /*#__PURE__*/ _interop_require_default(require("events"));
    _events = function() {
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
const _isWatcherExcluded = /*#__PURE__*/ _interop_require_default(require("../lib/isWatcherExcluded"));
const _common = require("./common");
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
class AbstractWatcher {
    root;
    ignored;
    included;
    doIgnore;
    #emitter = new (_events()).default();
    constructor(dir, opts){
        const { ignored, included } = opts;
        this.ignored = ignored;
        this.included = included;
        this.doIgnore = ignored ? (filePath)=>(0, _isWatcherExcluded.default)(filePath) || (0, _common.posixPathMatchesPattern)(ignored, filePath) : _isWatcherExcluded.default;
        this.root = _path().resolve(dir);
    }
    onFileEvent(listener) {
        this.#emitter.on('fileevent', listener);
        return ()=>{
            this.#emitter.removeListener('fileevent', listener);
        };
    }
    onError(listener) {
        this.#emitter.on('error', listener);
        return ()=>{
            this.#emitter.removeListener('error', listener);
        };
    }
    async startWatching() {
    // Must be implemented by subclasses
    }
    async stopWatching() {
        this.#emitter.removeAllListeners();
    }
    emitFileEvent(event) {
        this.#emitter.emit('fileevent', {
            ...event,
            root: this.root
        });
    }
    emitError(error) {
        this.#emitter.emit('error', error);
    }
    getPauseReason() {
        return null;
    }
}

//# sourceMappingURL=AbstractWatcher.js.map
