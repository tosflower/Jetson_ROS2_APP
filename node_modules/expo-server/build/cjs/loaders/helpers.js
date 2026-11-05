"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createServerLoader: null,
    createStaticLoader: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get createServerLoader () {
        return createServerLoader;
    },
    get createStaticLoader () {
        return createStaticLoader;
    }
});
function createStaticLoader(fn) {
    return (_request, params)=>fn(params);
}
function createServerLoader(fn) {
    return (request, params)=>{
        if (!request) {
            throw new Error('Server loader was called without a request. Server loaders require SSR and cannot be ' + 'used during static site generation (SSG). To create a loader that works with SSG, use ' + 'createStaticLoader instead.');
        }
        return fn(request, params);
    };
}

//# sourceMappingURL=helpers.js.map
