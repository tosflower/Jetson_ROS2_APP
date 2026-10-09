"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DevToolsPlugin", {
    enumerable: true,
    get: function() {
        return DevToolsPlugin;
    }
});
const _DevToolsPluginschema = require("./DevToolsPlugin.schema");
const _DevToolsPluginCliExtensionExecutor = require("./DevToolsPluginCliExtensionExecutor");
const _DevToolsPluginManager = require("./DevToolsPluginManager");
const _DevToolsPluginServerHelpers = require("./DevToolsPluginServerHelpers");
const _dir = require("../../utils/dir");
class DevToolsPlugin {
    constructor(plugin, projectRoot){
        this.plugin = plugin;
        this.projectRoot = projectRoot;
        this._executor = undefined;
        this._requestHandler = undefined;
        this._webSocketServers = undefined;
        const result = _DevToolsPluginschema.PluginSchema.safeParse(plugin);
        if (!result.success) {
            throw new Error(`Invalid plugin configuration: ${result.error.message}`, {
                cause: result.error
            });
        }
        if (plugin.webpageRoot != null) {
            const webpageRoot = (0, _dir.maybeRealpathSync)(plugin.webpageRoot) ?? plugin.webpageRoot;
            if (!(0, _dir.isPathInside)(webpageRoot, plugin.packageRoot)) {
                throw new Error(`webpageRoot (${plugin.webpageRoot}) is not inside packageRoot (${plugin.packageRoot}).`);
            }
        }
        if (plugin.serverEntryPoint != null) {
            const serverEntryPoint = (0, _dir.maybeRealpathSync)(plugin.serverEntryPoint) ?? plugin.serverEntryPoint;
            if (!(0, _dir.isPathInside)(serverEntryPoint, plugin.packageRoot)) {
                throw new Error(`serverEntryPoint (${plugin.serverEntryPoint}) is not inside packageRoot (${plugin.packageRoot}).`);
            }
        }
    }
    get packageName() {
        return this.plugin.packageName;
    }
    get packageRoot() {
        return this.plugin.packageRoot;
    }
    get webpageEndpoint() {
        var _this_plugin, _this_plugin1, _this_plugin2;
        return ((_this_plugin = this.plugin) == null ? void 0 : _this_plugin.webpageRoot) || ((_this_plugin1 = this.plugin) == null ? void 0 : _this_plugin1.serverEntryPoint) ? `${_DevToolsPluginManager.DevToolsPluginEndpoint}/${(_this_plugin2 = this.plugin) == null ? void 0 : _this_plugin2.packageName}` : undefined;
    }
    get webpageRoot() {
        var _this_plugin;
        return (_this_plugin = this.plugin) == null ? void 0 : _this_plugin.webpageRoot;
    }
    get serverEntryPoint() {
        var _this_plugin;
        return (_this_plugin = this.plugin) == null ? void 0 : _this_plugin.serverEntryPoint;
    }
    /**
   * Lazily loads the request handler from the plugin's `serverEntryPoint`.
   * The entry point must default-export a handler function
   * (`export default function handler(request) {}` or `module.exports = function handler(request) {}`).
   */ async getRequestHandlerAsync() {
        if (!this.plugin.serverEntryPoint) {
            return undefined;
        }
        if (!this._requestHandler) {
            this._requestHandler = await (0, _DevToolsPluginServerHelpers.loadRequestHandlerAsync)({
                packageName: this.plugin.packageName,
                serverEntryPoint: this.plugin.serverEntryPoint
            });
        }
        return this._requestHandler;
    }
    /**
   * Lazily builds the WebSocket servers contributed by the plugin's `serverEntryPoint`. The entry
   * point exports a `webSocketHandlers` map of route (e.g. `/ws`) to a connection handler; each
   * route becomes a `ws` `WebSocketServer` (in `noServer` mode) that the dev server mounts under
   * `/_expo/plugins/<name>/<route>`. The fetch API based `requestHandler` cannot serve WebSocket
   * upgrades, so this is how a plugin opts into them. Returns an empty object when the plugin
   * exports no handlers.
   */ async getWebSocketServersAsync() {
        if (!this.plugin.serverEntryPoint) {
            return {};
        }
        if (!this._webSocketServers) {
            this._webSocketServers = await (0, _DevToolsPluginServerHelpers.loadWebSocketServerAsync)({
                packageName: this.plugin.packageName,
                serverEntryPoint: this.plugin.serverEntryPoint
            });
        }
        return this._webSocketServers;
    }
    get cliBanner() {
        return this.plugin.bannerTitle !== undefined && this.plugin.bannerTitle !== false;
    }
    get bannerTitle() {
        return typeof this.plugin.bannerTitle === 'string' && this.plugin.bannerTitle ? this.plugin.bannerTitle : this.plugin.packageName;
    }
    get description() {
        var _this_plugin_cliExtensions;
        return ((_this_plugin_cliExtensions = this.plugin.cliExtensions) == null ? void 0 : _this_plugin_cliExtensions.description) ?? '';
    }
    get cliExtensions() {
        return this.plugin.cliExtensions;
    }
    get executor() {
        var _this_plugin_cliExtensions;
        if (!((_this_plugin_cliExtensions = this.plugin.cliExtensions) == null ? void 0 : _this_plugin_cliExtensions.entryPoint)) {
            return undefined;
        }
        if (!this._executor) {
            this._executor = new _DevToolsPluginCliExtensionExecutor.DevToolsPluginCliExtensionExecutor(this.plugin, this.projectRoot);
        }
        return this._executor;
    }
}

//# sourceMappingURL=DevToolsPlugin.js.map