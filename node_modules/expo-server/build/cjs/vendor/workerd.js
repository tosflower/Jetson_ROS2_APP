"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ExpoError: null,
    createRequestHandler: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ExpoError () {
        return _abstract.ExpoError;
    },
    get createRequestHandler () {
        return createRequestHandler;
    }
});
function _nodeasync_hooks() {
    const data = require("node:async_hooks");
    _nodeasync_hooks = function() {
        return data;
    };
    return data;
}
const _abstract = require("./abstract");
const _workerd = require("./environment/workerd");
const STORE = new (_nodeasync_hooks()).AsyncLocalStorage();
function createRequestHandler(params, setup) {
    const run = (0, _workerd.createWorkerdRequestScope)(STORE, params);
    const common = (0, _workerd.createWorkerdEnv)(params);
    const onRequest = (0, _abstract.createRequestHandler)({
        ...common,
        ...setup
    });
    function handler(request, env, ctx) {
        return run(onRequest, request, env, ctx);
    }
    handler.preload = common.preload;
    return handler;
}

//# sourceMappingURL=workerd.js.map
