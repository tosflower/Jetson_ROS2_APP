"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveCommand", {
    enumerable: true,
    get: function() {
        return resolveCommand;
    }
});
const _findModules = require("../autolinking/findModules");
const _getConfiguration = require("../autolinking/getConfiguration");
const _resolveModules = require("../autolinking/resolveModules");
const _autolinkingOptions = require("./autolinkingOptions");
function hasCoreFeatures(module) {
    return module.coreFeatures !== undefined;
}
function resolveCommand(cli) {
    return (0, _autolinkingOptions.registerAutolinkingArguments)(cli.command('resolve [searchPaths...]')).option('-j, --json', 'Output results in the plain JSON format.', ()=>true, false).action(async (searchPaths, commandArguments)=>{
        const platform = commandArguments.platform ?? 'apple';
        const autolinkingOptionsLoader = (0, _autolinkingOptions.createAutolinkingOptionsLoader)({
            ...commandArguments,
            searchPaths
        });
        const autolinkingOptions = await autolinkingOptionsLoader.getPlatformOptions(platform);
        const appRoot = await autolinkingOptionsLoader.getAppRoot();
        const expoModulesSearchResults = await (0, _findModules.findModulesAsync)({
            autolinkingOptions,
            appRoot
        });
        const expoModulesResolveResults = await (0, _resolveModules.resolveModulesAsync)(expoModulesSearchResults, autolinkingOptions);
        const extraDependencies = await (0, _resolveModules.resolveExtraBuildDependenciesAsync)({
            commandRoot: autolinkingOptionsLoader.getCommandRoot(),
            platform
        });
        const configuration = (0, _getConfiguration.getConfiguration)({
            autolinkingOptions
        });
        const coreFeatures = [
            ...expoModulesResolveResults.reduce((acc, module)=>{
                if (hasCoreFeatures(module)) {
                    const features = module.coreFeatures ?? [];
                    for (const feature of features){
                        acc.add(feature);
                    }
                    return acc;
                }
                return acc;
            }, new Set())
        ];
        if (commandArguments.json) {
            console.log(JSON.stringify({
                extraDependencies,
                coreFeatures,
                modules: expoModulesResolveResults,
                ...configuration ? {
                    configuration
                } : {}
            }));
        } else {
            console.log(require('util').inspect({
                extraDependencies,
                coreFeatures,
                modules: expoModulesResolveResults,
                ...configuration ? {
                    configuration
                } : {}
            }, false, null, true));
        }
    });
}

//# sourceMappingURL=resolveCommand.js.map
