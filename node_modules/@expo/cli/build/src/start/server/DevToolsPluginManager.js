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
        return DevToolsPluginEndpoint;
    },
    get default () {
        return DevToolsPluginManager;
    },
    get event () {
        return event;
    }
});
const _DevToolsPlugin = require("./DevToolsPlugin");
const _events = require("../../events");
const _log = require("../../log");
const debug = require('debug')('expo:start:server:devtools');
const DevToolsPluginEndpoint = '/_expo/plugins';
const event = (0, _events.events)('expo', (t)=>[
        t.event()
    ]);
class DevToolsPluginManager {
    constructor(projectRoot){
        this.projectRoot = projectRoot;
        this.plugins = null;
    }
    async queryPluginsAsync() {
        if (!this.plugins) {
            this.plugins = await this.queryAutolinkedPluginsAsync(this.projectRoot);
            event('dev-tools-plugin:load', {
                plugins: this.plugins.map((plugin)=>({
                        packageName: plugin.packageName,
                        bannerTitle: plugin.bannerTitle,
                        cliBanner: plugin.cliBanner,
                        webpageEndpoint: plugin.webpageEndpoint
                    }))
            });
        }
        return this.plugins;
    }
    async queryPluginAsync(pluginName) {
        const plugins = await this.queryPluginsAsync();
        return plugins.find((p)=>p.packageName === pluginName) ?? null;
    }
    async queryAutolinkedPluginsAsync(projectRoot) {
        const autolinking = require('expo/internal/unstable-autolinking-exports');
        const linker = autolinking.makeCachedDependenciesLinker({
            projectRoot
        });
        const revisions = await autolinking.scanExpoModuleResolutionsForPlatform(linker, 'devtools');
        const { resolveModuleAsync } = autolinking.getLinkingImplementationForPlatform('devtools');
        const plugins = (await Promise.all(Object.values(revisions).map((revision)=>resolveModuleAsync(revision.name, revision)))).filter((maybePlugin)=>maybePlugin != null);
        debug('Found autolinked plugins', plugins);
        return plugins.map((pluginInfo)=>{
            try {
                return new _DevToolsPlugin.DevToolsPlugin(pluginInfo, this.projectRoot);
            } catch (error) {
                _log.Log.warn(`Skipping plugin "${pluginInfo.packageName}": ${error.message ?? 'invalid configuration'}`);
                debug('Plugin validation error for %s: %O', pluginInfo.packageName, error);
                return null;
            }
        }).filter((p)=>p != null);
    }
}

//# sourceMappingURL=DevToolsPluginManager.js.map