"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    clear: null,
    error: null,
    exception: null,
    exit: null,
    log: null,
    time: null,
    timeEnd: null,
    warn: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get clear () {
        return clear;
    },
    get error () {
        return error;
    },
    get exception () {
        return exception;
    },
    get exit () {
        return exit;
    },
    get log () {
        return log;
    },
    get time () {
        return time;
    },
    get timeEnd () {
        return timeEnd;
    },
    get warn () {
        return warn;
    }
});
function _chalk() {
    const data = /*#__PURE__*/ _interop_require_default(require("chalk"));
    _chalk = function() {
        return data;
    };
    return data;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function time(label) {
    console.time(label);
}
function timeEnd(label) {
    console.timeEnd(label);
}
function error(...message) {
    console.error(...message);
}
function exception(e) {
    error(_chalk().default.red(e.toString()) + (process.env.EXPO_DEBUG ? '\n' + _chalk().default.gray(e.stack) : ''));
}
function warn(...message) {
    console.warn(...message.map((value)=>_chalk().default.yellow(value)));
}
function log(...message) {
    console.log(...message);
}
function clear() {
    process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
}
function exit(message, code = 1) {
    if (message instanceof Error) {
        exception(message);
        process.exit(code);
    }
    if (message) {
        if (code === 0) {
            log(message);
        } else {
            error(message);
        }
    }
    process.exit(code);
}

//# sourceMappingURL=log.js.map
