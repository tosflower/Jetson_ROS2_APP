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
    get DevToolsPluginEndpoint () {
        return _DevToolsPluginManager.DevToolsPluginEndpoint;
    },
    get DevToolsPluginMiddleware () {
        return DevToolsPluginMiddleware;
    }
});
function _assert() {
    const data = /*#__PURE__*/ _interop_require_default(require("assert"));
    _assert = function() {
        return data;
    };
    return data;
}
function _http() {
    const data = require("expo-server/adapter/http");
    _http = function() {
        return data;
    };
    return data;
}
function _send() {
    const data = /*#__PURE__*/ _interop_require_default(require("send"));
    _send = function() {
        return data;
    };
    return data;
}
const _ExpoMiddleware = require("./ExpoMiddleware");
const _DevToolsPluginManager = require("../DevToolsPluginManager");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const debug = require('debug')('expo:start:server:middleware:devToolsPlugin');
class DevToolsPluginMiddleware extends _ExpoMiddleware.ExpoMiddleware {
    constructor(projectRoot, pluginManager){
        super(projectRoot, [
            _DevToolsPluginManager.DevToolsPluginEndpoint
        ]), this.pluginManager = pluginManager;
    }
    shouldHandleRequest(req) {
        var _req_url;
        if (!((_req_url = req.url) == null ? void 0 : _req_url.startsWith(_DevToolsPluginManager.DevToolsPluginEndpoint))) {
            return false;
        }
        return true;
    }
    async handleRequestAsync(req, res) {
        (0, _assert().default)(req.headers.host, 'Request headers must include host');
        const { pathname, search } = new URL(req.url ?? '/', `http://${req.headers.host}`);
        const pluginName = this.queryPossiblePluginName(pathname.substring(_DevToolsPluginManager.DevToolsPluginEndpoint.length + 1));
        const plugin = await this.pluginManager.queryPluginAsync(pluginName);
        if (!plugin) {
            res.statusCode = 404;
            res.end();
            return;
        }
        const pathInPluginRoot = pathname.substring(_DevToolsPluginManager.DevToolsPluginEndpoint.length + pluginName.length + 1) || '/';
        if (plugin.serverEntryPoint != null) {
            const handled = await this.handleWithPluginServerAsync(plugin, req, res, `${pathInPluginRoot}${search}`);
            if (handled) {
                return;
            }
        }
        if (plugin.webpageRoot != null) {
            (0, _send().default)(req, pathInPluginRoot, {
                root: plugin.webpageRoot
            }).pipe(res);
            return;
        }
        res.statusCode = 404;
        res.end();
    }
    /**
   * Passes the request to the plugin's `serverEntryPoint` fetch handler with the plugin
   * endpoint prefix stripped from the URL. Returns false when the handler returns no
   * response, so the request falls through to static `webpageRoot` serving.
   */ async handleWithPluginServerAsync(plugin, req, res, urlInPluginRoot) {
        const originalUrl = req.url;
        let request;
        try {
            req.url = urlInPluginRoot;
            request = (0, _http().convertRequest)(req, res);
            const handler = await plugin.getRequestHandlerAsync();
            const response = await (handler == null ? void 0 : handler(request));
            if (response == null) {
                return false;
            }
            await (0, _http().respond)(res, response, {
                signal: request.signal
            });
            return true;
        } catch (error) {
            debug('DevTools plugin server request failed: %O', error);
            if (res.headersSent || res.writableEnded || res.destroyed || (request == null ? void 0 : request.signal.aborted)) {
                return true;
            }
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain');
            res.end(`The DevTools plugin "${plugin.packageName}" failed to handle the request to "${urlInPluginRoot}": ` + `${(error == null ? void 0 : error.message) ?? error}. This is likely a bug in the plugin's server entry point ` + `(${plugin.serverEntryPoint}); report it to the plugin author.`);
            return true;
        } finally{
            req.url = originalUrl;
        }
    }
    queryPossiblePluginName(pathname) {
        const parts = pathname.split('/');
        if (parts[0][0] === '@' && parts.length > 1) {
            // Scoped package name
            return `${parts[0]}/${parts[1]}`;
        }
        return parts[0];
    }
}

//# sourceMappingURL=DevToolsPluginMiddleware.js.map