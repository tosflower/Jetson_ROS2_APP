"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "profile", {
    enumerable: true,
    get: function() {
        return profile;
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
function profile(options, fn, functionName = fn.name) {
    if (!process.env['DEBUG'] || options.silent) {
        return fn;
    }
    const name = _chalk().default.dim(`⏱  [profile] ${functionName ?? 'unknown'}`);
    return (...args)=>{
        // Start the timer.
        console.time(name);
        // Invoke the method.
        const results = fn(...args);
        // If non-promise then return as-is.
        if (!(results instanceof Promise)) {
            console.timeEnd(name);
            return results;
        }
        // Otherwise await to profile after the promise resolves.
        return new Promise((resolve, reject)=>{
            results.then((results)=>{
                resolve(results);
                console.timeEnd(name);
            }, (reason)=>{
                reject(reason);
                console.timeEnd(name);
            });
        });
    };
}

//# sourceMappingURL=Profile.js.map
