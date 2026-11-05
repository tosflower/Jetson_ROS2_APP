"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    copyFilePathToPathAsync: null,
    removeFile: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get copyFilePathToPathAsync () {
        return copyFilePathToPathAsync;
    },
    get removeFile () {
        return removeFile;
    }
});
function _fs() {
    const data = /*#__PURE__*/ _interop_require_default(require("fs"));
    _fs = function() {
        return data;
    };
    return data;
}
function _path() {
    const data = /*#__PURE__*/ _interop_require_default(require("path"));
    _path = function() {
        return data;
    };
    return data;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function copyFilePathToPathAsync(src, dest) {
    const srcFile = await _fs().default.promises.readFile(src);
    await _fs().default.promises.mkdir(_path().default.dirname(dest), {
        recursive: true
    });
    await _fs().default.promises.writeFile(dest, srcFile);
}
function removeFile(filePath) {
    try {
        _fs().default.unlinkSync(filePath);
        return true;
    } catch (error) {
        // Skip if the remove did nothing.
        if (error.code === 'ENOENT') {
            return false;
        }
        throw error;
    }
}

//# sourceMappingURL=fs.js.map
