"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ImmutableRequest: null,
    getRscMiddleware: null,
    mergeHeaderInputs: null,
    normalizeCssAssets: null,
    resolveLoaderContextKey: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ImmutableRequest () {
        return _ImmutableRequest.ImmutableRequest;
    },
    get getRscMiddleware () {
        return _rsc.getRscMiddleware;
    },
    get mergeHeaderInputs () {
        return _headers.mergeHeaderInputs;
    },
    get normalizeCssAssets () {
        return _manifest.normalizeCssAssets;
    },
    get resolveLoaderContextKey () {
        return _matchers.resolveLoaderContextKey;
    }
});
const _ImmutableRequest = require("./ImmutableRequest");
const _rsc = require("./middleware/rsc");
const _matchers = require("./utils/matchers");
const _headers = require("./utils/headers");
const _manifest = require("./manifest");

//# sourceMappingURL=private.js.map
