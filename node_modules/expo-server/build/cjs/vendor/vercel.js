// NOTE: VercelRequest/VercelResponse wrap http primitives in Node
// plus some helper inputs and outputs, which we don't need to define
// our interface types
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ExpoError: null,
    convertHeaders: null,
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
    get convertHeaders () {
        return convertHeaders;
    },
    get convertRequest () {
        return convertRequest;
    },
    get createRequestHandler () {
        return createRequestHandler;
    },
    get respond () {
        return _http.respond;
    }
});
const _http = require("./http");
const _abstract = require("./abstract");
const _runtime = require("../runtime");
const _node = require("./environment/node");
const _createReadableStreamFromReadable = require("../utils/createReadableStreamFromReadable");
const scopeSymbol = Symbol.for('expoServerScope');
const SYMBOL_FOR_REQ_CONTEXT = Symbol.for('@vercel/request-context');
/** @see https://github.com/vercel/vercel/blob/b189b39/packages/functions/src/get-context.ts */ function getContext() {
    const fromSymbol = globalThis;
    return fromSymbol[SYMBOL_FOR_REQ_CONTEXT]?.get?.() ?? {};
}
// Vercel already has an async-scoped context in VercelContext, so we can attach
// our scope context to this object
const STORE = {
    getStore: ()=>getContext()[scopeSymbol],
    run (scope, runner, ...args) {
        getContext()[scopeSymbol] = scope;
        return runner(...args);
    }
};
function createRequestHandler(params) {
    const makeRequestAPISetup = (request)=>{
        const host = request.headers.get('host');
        const proto = request.headers.get('x-forwarded-proto') || 'https';
        return {
            origin: host ? `${proto}://${host}` : null,
            // See: https://github.com/vercel/vercel/blob/b189b39/packages/functions/src/get-env.ts#L25C3-L25C13
            environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
            waitUntil: getContext().waitUntil
        };
    };
    const run = (0, _runtime.createRequestScope)(STORE, makeRequestAPISetup);
    const onRequest = (0, _abstract.createRequestHandler)((0, _node.createNodeEnv)(params));
    return async (req, res)=>{
        return (0, _http.respond)(res, await run(onRequest, convertRequest(req, res)));
    };
}
function convertHeaders(requestHeaders) {
    const headers = new Headers();
    for (const [key, values] of Object.entries(requestHeaders)){
        if (values) {
            if (Array.isArray(values)) {
                for (const value of values){
                    headers.append(key, value);
                }
            } else {
                headers.set(key, values);
            }
        }
    }
    return headers;
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
    const host = req.headers['x-forwarded-host'] || req.headers['host'];
    // doesn't seem to be available on their req object!
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const url = new URL(`${protocol}://${host}${req.url}`);
    // Abort action/loaders once we can no longer write a response
    const controller = new AbortController();
    res.on('close', ()=>controller.abort());
    const init = {
        method: req.method,
        headers: convertRawHeaders(req.rawHeaders),
        // Cast until reason/throwIfAborted added
        // https://github.com/mysticatea/abort-controller/issues/36
        signal: controller.signal
    };
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        // NOTE(@krystofwoldrich) Readable.toWeb breaks the stream in Vercel Functions, unknown why.
        // No error is thrown, but reading the stream like `await req.json()` never resolves.
        init.body = (0, _createReadableStreamFromReadable.createReadableStreamFromReadable)(req);
        init.duplex = 'half';
    }
    return new Request(url.href, init);
}

//# sourceMappingURL=vercel.js.map
