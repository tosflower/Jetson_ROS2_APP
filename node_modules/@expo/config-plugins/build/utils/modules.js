"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    directoryExistsAsync: null,
    fileExists: null,
    fileExistsAsync: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get directoryExistsAsync () {
        return directoryExistsAsync;
    },
    get fileExists () {
        return fileExists;
    },
    get fileExistsAsync () {
        return fileExistsAsync;
    }
});
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
/**
 * A non-failing version of async FS stat.
 *
 * @param file
 */ async function statAsync(file) {
    try {
        return await _fs().default.promises.stat(file);
    } catch  {
        return null;
    }
}
async function fileExistsAsync(file) {
    return (await statAsync(file))?.isFile() ?? false;
}
async function directoryExistsAsync(file) {
    return (await statAsync(file))?.isDirectory() ?? false;
}
function fileExists(file) {
    try {
        const stat = _fs().default.lstatSync(file, {
            throwIfNoEntry: false
        });
        if (!stat) {
            return false;
        } else if (stat.isFile()) {
            return true;
        } else if (stat.isSymbolicLink()) {
            return isRealpathFileSync(file);
        } else {
            return false;
        }
    } catch  {
        return false;
    }
}
function isRealpathFileSync(target) {
    try {
        const realpath = _fs().default.realpathSync(target);
        return !!_fs().default.lstatSync(realpath, {
            throwIfNoEntry: false
        })?.isFile();
    } catch  {
        return false;
    }
}

//# sourceMappingURL=modules.js.map
