"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConfigError", {
    enumerable: true,
    get: function() {
        return ConfigError;
    }
});
class ConfigError extends Error {
    code;
    cause;
    name = 'ConfigError';
    isConfigError = true;
    constructor(message, code, cause){
        super(cause ? `${message}\n└─ Cause: ${cause.name}: ${cause.message}` : message), this.code = code, this.cause = cause;
    }
}

//# sourceMappingURL=Errors.js.map
