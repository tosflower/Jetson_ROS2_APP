"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get loadRequestHandlerAsync () {
        return loadRequestHandlerAsync;
    },
    get loadWebSocketServerAsync () {
        return loadWebSocketServerAsync;
    }
});
function _requireutils() {
    const data = require("@expo/require-utils");
    _requireutils = function() {
        return data;
    };
    return data;
}
function _ws() {
    const data = require("ws");
    _ws = function() {
        return data;
    };
    return data;
}
const debug = require('debug')('expo:start:server:devtools');
function convertUpgradeRequest(request, route) {
    const proto = 'encrypted' in request.socket && !!request.socket.encrypted ? 'https' : 'http';
    const origin = `${proto}://${request.headers.host}`;
    const url = new URL(request.url ?? '/', origin);
    url.pathname = route;
    const headers = new Headers();
    const { rawHeaders } = request;
    for(let index = 0; index < rawHeaders.length; index += 2){
        const name = rawHeaders[index];
        const value = rawHeaders[index + 1];
        if (name != null && value != null) {
            headers.append(name, value);
        }
    }
    return new Request(url.href, {
        method: request.method,
        headers
    });
}
async function loadRequestHandlerAsync({ packageName, serverEntryPoint }) {
    debug('Loading DevTools plugin server module: %s', serverEntryPoint);
    const serverModule = await (0, _requireutils().loadModule)(serverEntryPoint);
    const handler = typeof serverModule === 'function' ? serverModule : serverModule == null ? void 0 : serverModule.default;
    if (typeof handler !== 'function') {
        throw new Error(`The serverEntryPoint (${serverEntryPoint}) of plugin ${packageName} ` + `must default-export a handler function that takes a Request and returns a Response. ` + `Export it as \`export default function handler(request) {}\` ` + `or \`exports.default = function handler(request) {}\`.`);
    }
    return handler;
}
async function loadWebSocketServerAsync({ packageName, serverEntryPoint }) {
    debug('Loading DevTools plugin WebSocket server module: %s', serverEntryPoint);
    const serverModule = await (0, _requireutils().loadModule)(serverEntryPoint);
    const handlers = (serverModule == null ? void 0 : serverModule.webSocketHandlers) ?? {};
    return Object.fromEntries(Object.entries(handlers).map(([route, handler])=>{
        if (typeof handler !== 'function') {
            throw new Error(`The webSocketHandlers["${route}"] export of plugin ${packageName} ` + `must be a function (socket, request, server) => void.`);
        }
        // Routes are mounted relative to the plugin endpoint, so they must be absolute.
        const normalizedRoute = route.startsWith('/') ? route : `/${route}`;
        const server = new (_ws()).WebSocketServer({
            noServer: true
        });
        server.on('connection', (socket, request)=>handler(socket, convertUpgradeRequest(request, normalizedRoute), server));
        return [
            normalizedRoute,
            server
        ];
    }));
}

//# sourceMappingURL=DevToolsPluginServerHelpers.js.map