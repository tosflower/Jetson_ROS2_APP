"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    annotateError: null,
    formatDiagnostic: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get annotateError () {
        return annotateError;
    },
    get formatDiagnostic () {
        return formatDiagnostic;
    }
});
function _nodeurl() {
    const data = /*#__PURE__*/ _interop_require_default(require("node:url"));
    _nodeurl = function() {
        return data;
    };
    return data;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function errorToLoc(filename, error) {
    if (typeof error.name === 'string' && typeof error.stack === 'string') {
        let stack = error.stack.slice(error.name.length + 2 /* '${name}: ' prefix */ );
        stack = stack.slice(error.message.length);
        const trace = stack.match(/at ([^\n]+):(\d+):(\d+)/m);
        if (_nodeurl().default.pathToFileURL(filename).href === trace?.[1]) {
            const line = Number(trace[2]);
            return Number.isSafeInteger(line) ? {
                line,
                column: Number(trace[3]) || undefined
            } : null;
        }
    }
    return null;
}
function formatDiagnostic(code, diagnostic) {
    if (!diagnostic) {
        return null;
    }
    const { loc, message } = diagnostic;
    if (loc && message) {
        const { codeFrameColumns } = require('@babel/code-frame');
        const codeFrame = codeFrameColumns(code, {
            start: loc
        }, {
            highlightCode: true
        });
        const annotatedError = new SyntaxError(`${message}\n${codeFrame}`);
        annotatedError.codeFrame = codeFrame;
        delete annotatedError.stack;
        return annotatedError;
    }
    return null;
}
function annotateError(code, filename, error) {
    if (typeof error !== 'object' || error == null) {
        return null;
    }
    if (code) {
        const loc = errorToLoc(filename, error);
        if (loc) {
            const { codeFrameColumns } = require('@babel/code-frame');
            const codeFrame = codeFrameColumns(code, {
                start: loc
            }, {
                highlightCode: true
            });
            const annotatedError = error;
            annotatedError.codeFrame = codeFrame;
            annotatedError.message += `\n${codeFrame}`;
            delete annotatedError.stack;
            return annotatedError;
        }
    }
    return null;
}

//# sourceMappingURL=codeframe.js.map
