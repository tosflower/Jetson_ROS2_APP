"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    CommandError: null,
    logCmdError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get CommandError () {
        return CommandError;
    },
    get logCmdError () {
        return logCmdError;
    }
});
function _assert() {
    const data = require("assert");
    _assert = function() {
        return data;
    };
    return data;
}
function _chalk() {
    const data = /*#__PURE__*/ _interop_require_default(require("chalk"));
    _chalk = function() {
        return data;
    };
    return data;
}
const _log = require("./log");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const ERROR_PREFIX = 'Error: ';
class CommandError extends Error {
    code;
    name = 'CommandError';
    isCommandError = true;
    constructor(code, message = ''){
        super(''), this.code = code;
        // If e.toString() was called to get `message` we don't want it to look
        // like "Error: Error:".
        if (message.startsWith(ERROR_PREFIX)) {
            message = message.substring(ERROR_PREFIX.length);
        }
        this.message = message || code;
    }
}
function logCmdError(error) {
    if (!(error instanceof Error)) {
        throw error;
    }
    if (error instanceof CommandError || error instanceof _assert().AssertionError) {
        // Print the stack trace in debug mode only.
        (0, _log.exit)(error);
    }
    const errorDetails = error.stack ? '\n' + _chalk().default.gray(error.stack) : '';
    (0, _log.exit)(_chalk().default.red(error.toString()) + errorDetails);
}

//# sourceMappingURL=errors.js.map
