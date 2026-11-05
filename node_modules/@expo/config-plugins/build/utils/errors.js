"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    PluginError: null,
    UnexpectedError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get PluginError () {
        return PluginError;
    },
    get UnexpectedError () {
        return UnexpectedError;
    }
});
class UnexpectedError extends Error {
    name = 'UnexpectedError';
    constructor(message){
        super(`${message}\nReport this issue: https://github.com/expo/expo/issues`);
    }
}
class PluginError extends Error {
    code;
    cause;
    name = 'PluginError';
    isPluginError = true;
    constructor(message, code, cause){
        super(cause ? `${message}\n└─ Cause: ${cause.name}: ${cause.message}` : message), this.code = code, this.cause = cause;
    }
}

//# sourceMappingURL=errors.js.map
