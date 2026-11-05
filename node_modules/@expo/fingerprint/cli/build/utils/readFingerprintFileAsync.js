"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return readFingerprintFileAsync;
    }
});
function _promises() {
    const data = /*#__PURE__*/ _interop_require_default(require("fs/promises"));
    _promises = function() {
        return data;
    };
    return data;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function readFingerprintFileAsync(path) {
    try {
        return JSON.parse(await _promises().default.readFile(path, 'utf-8'));
    } catch (e) {
        throw new Error(`Unable to read fingerprint file ${path}: ${e.message}`);
    }
}

//# sourceMappingURL=readFingerprintFileAsync.js.map
