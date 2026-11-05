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
    Worker: null,
    processFile: null,
    setup: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get Worker () {
        return Worker;
    },
    get processFile () {
        return processFile;
    },
    get setup () {
        return setup;
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
    const data = /*#__PURE__*/ _interop_require_default(require("fs"));
    _fs = function() {
        return data;
    };
    return data;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function sha1hex(content) {
    return (0, _crypto().createHash)('sha1').update(content).digest('hex');
}
class Worker {
    #plugins;
    constructor({ plugins = [] }){
        this.#plugins = plugins.map(({ modulePath, setupArgs })=>{
            const mod = require(modulePath);
            const PluginWorker = mod.__esModule === true && 'default' in mod ? mod.default : mod;
            return new PluginWorker(setupArgs);
        });
    }
    async processFile(data) {
        let contentPromise;
        let sha1Promise;
        const { computeSha1, filePath, pluginsToRun } = data;
        const getContent = ()=>{
            if (contentPromise == null) {
                contentPromise = _fs().default.promises.readFile(filePath);
            }
            return contentPromise;
        };
        const workerUtils = {
            getContent
        };
        const pluginDataPromise = Promise.all(pluginsToRun.map((pluginIdx)=>this.#plugins[pluginIdx].processFile(data, workerUtils)));
        // If a SHA-1 is requested on update, compute it.
        if (computeSha1) {
            sha1Promise = getContent().then(sha1hex);
        }
        return contentPromise != null && data.maybeReturnContent ? {
            content: await contentPromise,
            pluginData: await pluginDataPromise,
            sha1: await sha1Promise
        } : {
            pluginData: await pluginDataPromise,
            sha1: await sha1Promise
        };
    }
}
let singletonWorker;
function setup(args) {
    if (singletonWorker) {
        throw new Error('metro-file-map: setup() should only be called once');
    }
    singletonWorker = new Worker(args);
}
async function processFile(data) {
    if (!singletonWorker) {
        throw new Error('metro-file-map: setup() must be called before processFile()');
    }
    return singletonWorker.processFile(data);
}

//# sourceMappingURL=worker.js.map
