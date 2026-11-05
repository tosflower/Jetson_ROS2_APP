"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ExpoError: null,
    convertRequest: null,
    createRequestHandler: null,
    respond: null
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
    get convertRequest () {
        return _http.convertRequest;
    },
    get createRequestHandler () {
        return createRequestHandler;
    },
    get respond () {
        return _http.respond;
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
const _node = require("./environment/node");
const _http = require("./http");
const STORE = new (_nodeasync_hooks()).AsyncLocalStorage();
function createRequestHandler(params, setup) {
    const run = (0, _node.createNodeRequestScope)(STORE, params);
    const onRequest = (0, _abstract.createRequestHandler)({
        ...(0, _node.createNodeEnv)(params),
        ...setup
    });
    async function requestHandler(request) {
        try {
            return await run(onRequest, request);
        } catch (error) {
            const handleRouteError = setup?.handleRouteError;
            if (handleRouteError && error != null && typeof error === 'object') {
                try {
                    return await handleRouteError(error);
                } catch  {
                // Rethrow original error below
                }
            }
            throw error;
        }
    }
    return async (req, res, next)=>{
        if (!req?.url || !req.method) {
            return next();
        }
        try {
            const request = (0, _http.convertRequest)(req, res);
            const response = await requestHandler(request);
            await (0, _http.respond)(res, response);
        } catch (error) {
            // Express doesn't support async functions, so we have to pass along the
            // error manually using next().
            next(error);
        }
    };
}

//# sourceMappingURL=express.js.map
