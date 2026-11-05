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
 * Watches `dir`.
 */ "default", {
    enumerable: true,
    get: function() {
        return WatchmanWatcher;
    }
});
function _assert() {
    const data = /*#__PURE__*/ _interop_require_default(require("assert"));
    _assert = function() {
        return data;
    };
    return data;
}
function _crypto() {
    const data = require("crypto");
    _crypto = function() {
        return data;
    };
    return data;
}
function _fbwatchman() {
    const data = /*#__PURE__*/ _interop_require_default(require("fb-watchman"));
    _fbwatchman = function() {
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
const _normalizePathSeparatorsToSystem = /*#__PURE__*/ _interop_require_default(require("../lib/normalizePathSeparatorsToSystem"));
const _AbstractWatcher = require("./AbstractWatcher");
const _RecrawlWarning = /*#__PURE__*/ _interop_require_default(require("./RecrawlWarning"));
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
const debug = require('debug')('Metro:WatchmanWatcher');
const DELETE_EVENT = _common.DELETE_EVENT;
const TOUCH_EVENT = _common.TOUCH_EVENT;
const SUB_PREFIX = 'metro-file-map';
class WatchmanWatcher extends _AbstractWatcher.AbstractWatcher {
    #client;
    subscriptionName;
    #watchProjectInfo;
    #watchmanDeferStates;
    #deferringStates = null;
    constructor(dir, opts){
        const { watchmanDeferStates, ...baseOpts } = opts;
        super(dir, baseOpts);
        this.#watchmanDeferStates = watchmanDeferStates;
        // Use a unique subscription name per process per watched directory
        const watchKey = (0, _crypto().createHash)('md5').update(this.root).digest('hex');
        const readablePath = this.root.replace(/[/\\]/g, '-') // \ and / to -
        .replace(/[^\-\w]/g, ''); // Remove non-word/hyphen
        this.subscriptionName = `${SUB_PREFIX}-${process.pid}-${readablePath}-${watchKey}`;
    }
    async startWatching() {
        await new Promise((resolve, reject)=>this.#init(resolve, reject));
    }
    /**
   * Run the watchman `watch` command on the root and subscribe to changes.
   */ #init(onReady, onError) {
        if (this.#client) {
            this.#client.removeAllListeners();
        }
        // oxlint-disable-next-line typescript/no-this-alias
        const self = this;
        this.#client = new (_fbwatchman()).default.Client();
        this.#client.on('error', (error)=>{
            this.emitError(error);
        });
        this.#client.on('subscription', (changeEvent)=>this.#handleChangeEvent(changeEvent));
        this.#client.on('end', ()=>{
            console.warn('[metro-file-map] Warning: Lost connection to Watchman, reconnecting..');
            self.#init(()=>{}, (error)=>self.emitError(error));
        });
        this.#watchProjectInfo = null;
        function getWatchRoot() {
            return self.#watchProjectInfo ? self.#watchProjectInfo.root : self.root;
        }
        function onWatchProject(error, resp) {
            if (error) {
                onError(error);
                return;
            }
            debug('Received watch-project response: %s', resp.relative_path);
            handleWarning(resp);
            // NB: Watchman outputs posix-separated paths even on Windows, convert
            // them to system-native separators.
            self.#watchProjectInfo = {
                relativePath: resp.relative_path ? (0, _normalizePathSeparatorsToSystem.default)(resp.relative_path) : '',
                root: (0, _normalizePathSeparatorsToSystem.default)(resp.watch)
            };
            self.#client.command([
                'clock',
                getWatchRoot()
            ], onClock);
        }
        function onClock(error, resp) {
            if (error) {
                onError(error);
                return;
            }
            debug('Received clock response: %s', resp.clock);
            const watchProjectInfo = self.#watchProjectInfo;
            (0, _invariant().default)(watchProjectInfo != null, 'watch-project response should have been set before clock response');
            handleWarning(resp);
            const options = {
                fields: [
                    'name',
                    'exists',
                    'new',
                    'type',
                    'size',
                    'mtime_ms'
                ],
                since: resp.clock,
                defer: self.#watchmanDeferStates,
                relative_root: watchProjectInfo.relativePath
            };
            self.#client.command([
                'subscribe',
                getWatchRoot(),
                self.subscriptionName,
                options
            ], onSubscribe);
        }
        const onSubscribe = (error, resp)=>{
            if (error) {
                onError(error);
                return;
            }
            debug('Received subscribe response: %s', resp.subscribe);
            handleWarning(resp);
            if (resp['asserted-states'] != null) {
                this.#deferringStates = new Set(resp['asserted-states']);
            }
            onReady();
        };
        self.#client.command([
            'watch-project',
            getWatchRoot()
        ], onWatchProject);
    }
    /**
   * Handles a change event coming from the subscription.
   */ #handleChangeEvent(resp) {
        debug('Received subscription response: %s (fresh: %s, files: %s, enter: %s, leave: %s, clock: %s)', resp.subscription, resp.is_fresh_instance, resp.files?.length, resp['state-enter'], resp['state-leave'], resp.clock);
        _assert().default.equal(resp.subscription, this.subscriptionName, 'Invalid subscription event.');
        if (Array.isArray(resp.files)) {
            resp.files.forEach((change)=>this.#handleFileChange(change, resp.clock));
        }
        const { 'state-enter': stateEnter, 'state-leave': stateLeave } = resp;
        if (stateEnter != null && (this.#watchmanDeferStates ?? []).includes(stateEnter)) {
            this.#deferringStates?.add(stateEnter);
            debug('Watchman reports "%s" just started. Filesystem notifications are paused.', stateEnter);
        }
        if (stateLeave != null && (this.#watchmanDeferStates ?? []).includes(stateLeave)) {
            this.#deferringStates?.delete(stateLeave);
            debug('Watchman reports "%s" ended. Filesystem notifications resumed.', stateLeave);
        }
    }
    /**
   * Handles a single change event record.
   */ #handleFileChange(changeDescriptor, rawClock) {
        // oxlint-disable-next-line typescript/no-this-alias
        const self = this;
        const watchProjectInfo = self.#watchProjectInfo;
        (0, _invariant().default)(watchProjectInfo != null, 'watch-project response should have been set before receiving subscription events');
        const { name: relativePosixPath, new: isNew = false, exists = false, type, mtime_ms, size } = changeDescriptor;
        // Watchman emits posix-separated paths on Windows, which is inconsistent
        // with other watchers. Normalize to system-native separators.
        const relativePath = (0, _normalizePathSeparatorsToSystem.default)(relativePosixPath);
        debug('Handling change to: %s (new: %s, exists: %s, type: %s)', relativePath, isNew, exists, type);
        // Ignore files of an unrecognized type
        if (type != null && !(type === 'f' || type === 'd' || type === 'l')) {
            return;
        }
        if (this.doIgnore(relativePath) || !_common.isIncluded(type, this.included, relativePath)) {
            return;
        }
        const clock = typeof rawClock === 'string' && this.#watchProjectInfo != null ? [
            this.#watchProjectInfo.root,
            rawClock
        ] : undefined;
        if (!exists) {
            self.emitFileEvent({
                event: DELETE_EVENT,
                clock,
                relativePath
            });
        } else {
            (0, _invariant().default)(type != null && mtime_ms != null && size != null, 'Watchman file change event for "%s" missing some requested metadata. ' + 'Got type: %s, mtime_ms: %s, size: %s', relativePath, type, mtime_ms, size);
            if (// Change event on dirs are mostly useless.
            !(type === 'd' && !isNew)) {
                const mtime = Number(mtime_ms);
                self.emitFileEvent({
                    event: TOUCH_EVENT,
                    clock,
                    relativePath,
                    metadata: {
                        modifiedTime: mtime !== 0 ? mtime : null,
                        size,
                        type
                    }
                });
            }
        }
    }
    /**
   * Closes the watcher.
   */ async stopWatching() {
        await super.stopWatching();
        if (this.#client) {
            this.#client.removeAllListeners();
            this.#client.end();
        }
        this.#deferringStates = null;
    }
    getPauseReason() {
        if (this.#deferringStates == null || this.#deferringStates.size === 0) {
            return null;
        }
        const states = [
            ...this.#deferringStates
        ];
        if (states.length === 1) {
            return `The watch is in the '${states[0]}' state.`;
        }
        return `The watch is in the ${states.slice(0, -1).map((s)=>`'${s}'`).join(', ')} and '${states[states.length - 1]}' states.`;
    }
}
/**
 * Handles a warning in the watchman resp object.
 */ function handleWarning(resp) {
    if ('warning' in resp) {
        if (_RecrawlWarning.default.isRecrawlWarningDupe(resp.warning)) {
            return true;
        }
        console.warn(resp.warning);
        return true;
    } else {
        return false;
    }
}

//# sourceMappingURL=WatchmanWatcher.js.map
