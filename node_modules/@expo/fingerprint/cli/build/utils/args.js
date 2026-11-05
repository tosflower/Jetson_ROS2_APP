// Common utilities for interacting with `args` library.
// These functions should be used by every command.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    assertArgs: null,
    getFileArgumentAtIndex: null,
    getProjectRoot: null,
    requireArg: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get assertArgs () {
        return assertArgs;
    },
    get getFileArgumentAtIndex () {
        return getFileArgumentAtIndex;
    },
    get getProjectRoot () {
        return getProjectRoot;
    },
    get requireArg () {
        return requireArg;
    }
});
function _arg() {
    const data = /*#__PURE__*/ _interop_require_default(require("arg"));
    _arg = function() {
        return data;
    };
    return data;
}
function _fs() {
    const data = require("fs");
    _fs = function() {
        return data;
    };
    return data;
}
function _path() {
    const data = require("path");
    _path = function() {
        return data;
    };
    return data;
}
const _log = /*#__PURE__*/ _interop_require_wildcard(require("./log"));
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
function getProjectRoot(args) {
    const projectRoot = (0, _path().resolve)(args._[0] || '.');
    if (!(0, _fs().existsSync)(projectRoot)) {
        _log.exit(`Invalid project root: ${projectRoot}`);
    }
    return projectRoot;
}
function getFileArgumentAtIndex(args, index) {
    if (args._[index] == null) {
        _log.exit(`Argument at index ${index} is not set`);
    }
    const path = (0, _path().resolve)(args._[index]);
    if (!(0, _fs().existsSync)(path)) {
        _log.exit(`Invalid file: ${path}`);
    }
    return path;
}
function assertArgs(schema, argv) {
    try {
        return (0, _arg().default)(schema, {
            argv
        });
    } catch (error) {
        // Ensure unknown options are handled the same way.
        if (error.code === 'ARG_UNKNOWN_OPTION') {
            _log.exit(error.message, 1);
        }
        // Otherwise rethrow the error.
        throw error;
    }
}
function requireArg(args, name) {
    const value = args[name];
    if (value === undefined || value === null) {
        _log.exit(`${name} must be provided`, 1);
    }
    return value;
}

//# sourceMappingURL=args.js.map
