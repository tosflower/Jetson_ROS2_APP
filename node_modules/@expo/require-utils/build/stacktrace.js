// MIT License, Copyright (c) 2014 Evan Wallace
// Derived from: https://github.com/evanw/node-source-map-support/blob/7b5b81e/source-map-support.js
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    callSiteToString: null,
    installSourceMapStackTrace: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get callSiteToString () {
        return callSiteToString;
    },
    get installSourceMapStackTrace () {
        return installSourceMapStackTrace;
    }
});
function _nodemodule() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("node:module"));
    _nodemodule = function() {
        return data;
    };
    return data;
}
function _nodepath() {
    const data = /*#__PURE__*/ _interop_require_default(require("node:path"));
    _nodepath = function() {
        return data;
    };
    return data;
}
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
let stackTraceInstalled = false;
function installSourceMapStackTrace() {
    if (stackTraceInstalled) {
        return;
    } else {
        stackTraceInstalled = true;
    }
    Error.prepareStackTrace = (error, callSites)=>{
        const errorString = formatErrorHeader(error);
        if (callSites.length === 0) {
            return errorString;
        }
        const state = {
            nextPosition: null,
            curPosition: null
        };
        const lines = [];
        for(let i = callSites.length - 1; i >= 0; i--){
            lines.push('\n    at ' + wrapCallSite(callSites[i], state));
            state.nextPosition = state.curPosition;
        }
        lines.reverse();
        return errorString + lines.join('');
    };
}
function formatErrorHeader(error) {
    // Match V8's default `Error.prototype.toString` semantics. We can't call it directly
    // because `error` may not actually be an Error instance.
    const name = error?.name === undefined ? 'Error' : String(error.name);
    const message = error?.message === undefined ? '' : String(error.message);
    if (!name) return message;
    if (!message) return name;
    return `${name}: ${message}`;
}
function wrapCallSite(site, state) {
    if (site.isNative()) {
        state.curPosition = null;
        return String(site);
    }
    // Most call sites surface their script identity via `getFileName()`. Code passed to
    // `eval()` (or otherwise compiled with a `//# sourceURL=...` directive) only exposes
    // it via `getScriptNameOrSourceURL()` — falling through to that catches those cases.
    const scriptName = site.getFileName() ?? site.getScriptNameOrSourceURL();
    if (!scriptName) {
        state.curPosition = null;
        return String(site);
    }
    const lineNumber = site.getLineNumber();
    const columnNumber = site.getColumnNumber();
    if (lineNumber == null || columnNumber == null) {
        state.curPosition = null;
        return String(site);
    }
    const sm = findSourceMap(scriptName);
    if (!sm) {
        state.curPosition = null;
        return String(site);
    }
    const entry = sm.findEntry(lineNumber - 1, columnNumber - 1);
    if (!entry || !('originalSource' in entry) || !entry.originalSource) {
        state.curPosition = null;
        return String(site);
    }
    const originalSource = maybeFileURLToPath(entry.originalSource);
    // Node's runtime exposes a `name` field on the source map entry even though
    // `@types/node` omits it from `SourceMapping`. Read it defensively.
    const mappedName = entry.name ?? null;
    const position = {
        source: originalSource,
        line: entry.originalLine + 1,
        column: entry.originalColumn + 1,
        name: mappedName
    };
    state.curPosition = position;
    // Build a wrapped call site whose JS getters and `toString` agree on the mapped
    // position. The function-name override consults `state.nextPosition` first because
    // a source map's `name` at a position names the symbol being *called*, which lives
    // one frame outward.
    const wrapped = cloneCallSite(site);
    const originalGetFunctionName = wrapped.getFunctionName;
    wrapped.getFunctionName = function() {
        const nameFromNext = state.nextPosition?.name;
        if (nameFromNext) return nameFromNext;
        return originalGetFunctionName();
    };
    wrapped.getFileName = ()=>position.source;
    wrapped.getLineNumber = ()=>position.line;
    wrapped.getColumnNumber = ()=>position.column;
    wrapped.getScriptNameOrSourceURL = ()=>position.source;
    return String(wrapped);
}
function findSourceMap(scriptName) {
    try {
        return _nodemodule().findSourceMap(scriptName);
    } catch  {
        // Before v22.14.0 and v23.6.0, Node throws here for a module whose source map it failed
        // to load, such as an index map (with `sections`). Throwing from `prepareStackTrace`
        // replaces the error being formatted, so fall back to the unmapped frame instead.
        return undefined;
    }
}
function maybeFileURLToPath(maybeFileURL) {
    if (maybeFileURL.startsWith('file://')) {
        let pathname = maybeFileURL.slice('file://'.length);
        if (pathname[0] === '/') pathname = pathname.slice(1);
        try {
            pathname = decodeURIComponent(pathname);
        } catch  {}
        return _nodepath().default.sep !== '/' ? pathname.replaceAll('/', _nodepath().default.sep) : '/' + pathname;
    } else {
        return maybeFileURL;
    }
}
function cloneCallSite(site) {
    // We need a plain object whose JS getters mirror the original site's, but whose
    // `toString` we can replace. Subclassing or proxying the native `CallSite` doesn't
    // work: `CallSite.prototype.toString` is implemented in C++ and rejects any receiver
    // that isn't the original V8-tagged object (`Method toString called on incompatible
    // receiver`). The only working approach is to build a plain object that re-exposes
    // the `is*`/`get*` methods (bound to the original) and carries our JS toString.
    const clone = {};
    const proto = Object.getPrototypeOf(site);
    for (const name of Object.getOwnPropertyNames(proto)){
        const value = site[name];
        if (/^(?:is|get)/.test(name) && typeof value === 'function') {
            clone[name] = value.bind(site);
        } else {
            clone[name] = value;
        }
    }
    clone.toString = callSiteToString;
    return clone;
}
function callSiteToString() {
    let fileLocation = '';
    if (this.isNative()) {
        fileLocation = 'native';
    } else {
        const scriptName = this.getScriptNameOrSourceURL();
        if (!scriptName && this.isEval()) {
            fileLocation = (this.getEvalOrigin() ?? '') + ', ';
        }
        if (scriptName) {
            fileLocation += scriptName;
        } else {
            fileLocation += '<anonymous>';
        }
        const lineNumber = this.getLineNumber();
        if (lineNumber != null) {
            fileLocation += ':' + lineNumber;
            const columnNumber = this.getColumnNumber();
            if (columnNumber) {
                fileLocation += ':' + columnNumber;
            }
        }
    }
    let line = '';
    const functionName = this.getFunctionName();
    let addSuffix = true;
    const isConstructor = this.isConstructor();
    const isMethodCall = !(this.isToplevel() || isConstructor);
    if (isMethodCall) {
        let typeName = this.getTypeName();
        // Older Node versions can return `[object Object]` here; normalize to `null`.
        if (typeName === '[object Object]') {
            typeName = 'null';
        }
        const methodName = this.getMethodName();
        if (functionName) {
            if (typeName && functionName.indexOf(typeName) !== 0) {
                line += typeName + '.';
            }
            line += functionName;
            if (methodName && functionName.indexOf('.' + methodName) !== functionName.length - methodName.length - 1) {
                line += ' [as ' + methodName + ']';
            }
        } else {
            line += typeName + '.' + (methodName ?? '<anonymous>');
        }
    } else if (isConstructor) {
        line += 'new ' + (functionName ?? '<anonymous>');
    } else if (functionName) {
        line += functionName;
    } else {
        line += fileLocation;
        addSuffix = false;
    }
    if (addSuffix) {
        line += ' (' + fileLocation + ')';
    }
    return line;
}

//# sourceMappingURL=stacktrace.js.map
