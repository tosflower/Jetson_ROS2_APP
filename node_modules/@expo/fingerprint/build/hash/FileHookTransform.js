"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FileHookTransform", {
    enumerable: true,
    get: function() {
        return FileHookTransform;
    }
});
function _stream() {
    const data = require("stream");
    _stream = function() {
        return data;
    };
    return data;
}
class FileHookTransform extends _stream().Transform {
    source;
    transformFn;
    debug;
    _isTransformed = undefined;
    constructor(source, transformFn, debug){
        super(), this.source = source, this.transformFn = transformFn, this.debug = debug;
    }
    /**
   * Indicates whether the file content has been transformed.
   * @returns boolean value if `debug` is true, otherwise the value would be undefined.
   */ get isTransformed() {
        return this._isTransformed;
    }
    //#region - Transform implementations
    _transform(chunk, encoding, callback) {
        const result = this.transformFn(this.source, chunk, false, encoding);
        if (this.debug) {
            this._isTransformed ||= chunk !== result;
        }
        if (result) {
            this.push(result);
        }
        callback();
    }
    _flush(callback) {
        const result = this.transformFn(this.source, null, true, 'utf8');
        if (result) {
            this.push(result);
        }
        callback();
    }
}

//# sourceMappingURL=FileHookTransform.js.map
