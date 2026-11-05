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
        return convertRequest;
    },
    get createRequestHandler () {
        return createRequestHandler;
    },
    get respond () {
        return respond;
    }
});
function _nodeasync_hooks() {
    const data = require("node:async_hooks");
    _nodeasync_hooks = function() {
        return data;
    };
    return data;
}
function _nodestream() {
    const data = require("node:stream");
    _nodestream = function() {
        return data;
    };
    return data;
}
const _abstract = require("./abstract");
const _node = require("./environment/node");
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
            const request = convertRequest(req, res);
            const response = await requestHandler(request);
            await respond(res, response, {
                signal: request.signal
            });
        } catch (error) {
            // http doesn't support async functions, so we have to pass along the
            // error manually using next().
            next(error);
        }
    };
}
function convertRawHeaders(requestHeaders) {
    const headers = new Headers();
    for(let index = 0; index < requestHeaders.length; index += 2){
        const name = requestHeaders[index];
        const value = requestHeaders[index + 1];
        if (name != null && value != null) {
            headers.append(name, value);
        }
    }
    return headers;
}
function convertRequest(req, res) {
    const proto = 'encrypted' in req.socket && !!req.socket.encrypted ? 'https' : 'http';
    const url = new URL(req.url, `${proto}://${req.headers.host}`);
    // Abort action/loaders once we can no longer write a response or request aborts
    const controller = new AbortController();
    res.once('close', ()=>{
        if (!res.writableEnded) {
            if (!controller.signal.aborted) {
                controller.abort();
            }
            if (!req.destroyed) {
                req.destroy();
            }
        }
    });
    res.once('error', (err)=>{
        if (err.name !== 'AbortError' && !controller.signal.aborted) {
            controller.abort(err);
        }
    });
    req.once('error', (err)=>{
        if (err.name !== 'AbortError' && !controller.signal.aborted) {
            controller.abort(err);
        }
    });
    const init = {
        method: req.method,
        headers: convertRawHeaders(req.rawHeaders),
        signal: controller.signal
    };
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        init.body = _nodestream().Readable.toWeb(req);
        // NOTE(@kitten): Depending on if `@types/node` is used this may not be defined
        init.duplex = 'half';
    }
    return new Request(url.href, init);
}
/** Assign Headers to a Node.js OutgoingMessage (request) */ const assignOutgoingMessageHeaders = (outgoing, headers)=>{
    // Preassemble array headers, mostly only for Set-Cookie
    // We're avoiding `getSetCookie` since support is unclear in Node 18
    const collection = {};
    for (const [key, value] of headers){
        if (Array.isArray(collection[key])) {
            collection[key].push(value);
        } else if (collection[key] != null) {
            collection[key] = [
                collection[key],
                value
            ];
        } else {
            collection[key] = value;
        }
    }
    // We don't use `setHeaders` due to a Bun bug (Fix: https://github.com/oven-sh/bun/pull/27050)
    for(const key in collection){
        if (collection[key] != null) {
            outgoing.setHeader(key, collection[key]);
        }
    }
};
async function respond(nodeResponse, webResponse, options) {
    if (nodeResponse.writableEnded || nodeResponse.destroyed) {
        return;
    }
    let _cancelled = false;
    nodeResponse.statusMessage = webResponse.statusText;
    nodeResponse.statusCode = webResponse.status;
    assignOutgoingMessageHeaders(nodeResponse, webResponse.headers);
    if (!webResponse.body || options?.signal?.aborted) {
        nodeResponse.end();
        return;
    } else if (nodeResponse.destroyed) {
        return;
    }
    const reader = webResponse.body.getReader();
    const cancelBody = (reason)=>{
        if (!_cancelled) {
            _cancelled = true;
            void reader.cancel(reason).catch(()=>{});
        }
    };
    const onAbort = ()=>{
        const reason = options?.signal?.reason;
        cancelBody(reason);
        if (!nodeResponse.destroyed) {
            nodeResponse.destroy(reason instanceof Error ? reason : undefined);
        }
    };
    const onClose = ()=>cancelBody();
    try {
        nodeResponse.once('close', onClose);
        options?.signal?.addEventListener('abort', onAbort, {
            once: true
        });
        while(!_cancelled){
            const result = await reader.read();
            if (result.done) {
                break;
            } else if (!nodeResponse.write(result.value)) {
                await advanceResponse(nodeResponse);
            }
        }
    } catch (error) {
        if (nodeResponse.headersSent && !nodeResponse.destroyed) {
            nodeResponse.destroy(error instanceof Error ? error : undefined);
        }
        throw error;
    } finally{
        nodeResponse.off('close', onClose);
        options?.signal?.removeEventListener('abort', onAbort);
        reader.releaseLock();
    }
    if (!_cancelled && !nodeResponse.destroyed) {
        nodeResponse.end();
    }
}
function advanceResponse(response) {
    if (!response.destroyed) {
        return new Promise((resolve)=>{
            function done() {
                response.off('close', done);
                response.off('drain', done);
                resolve();
            }
            response.once('close', done);
            response.once('drain', done);
        });
    }
}

//# sourceMappingURL=http.js.map
