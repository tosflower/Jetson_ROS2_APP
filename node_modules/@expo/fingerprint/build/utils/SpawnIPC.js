"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "spawnWithIpcAsync", {
    enumerable: true,
    get: function() {
        return spawnWithIpcAsync;
    }
});
function _spawnasync() {
    const data = /*#__PURE__*/ _interop_require_default(require("@expo/spawn-async"));
    _spawnasync = function() {
        return data;
    };
    return data;
}
function _nodeassert() {
    const data = /*#__PURE__*/ _interop_require_default(require("node:assert"));
    _nodeassert = function() {
        return data;
    };
    return data;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function spawnWithIpcAsync(command, args, options) {
    (0, _nodeassert().default)(options?.stdio == null, 'Cannot override stdio when using IPC');
    const promise = (0, _spawnasync().default)(command, args, {
        ...options,
        stdio: [
            'pipe',
            'pipe',
            'pipe',
            'ipc'
        ]
    });
    const messageChunks = [];
    const appendMessage = (message)=>{
        messageChunks.push(message);
    };
    promise.child.on('message', appendMessage);
    const result = await promise;
    promise.child.off('message', appendMessage);
    return {
        ...result,
        message: messageChunks.join('')
    };
}

//# sourceMappingURL=SpawnIPC.js.map
