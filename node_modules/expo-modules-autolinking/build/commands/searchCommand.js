"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "searchCommand", {
    enumerable: true,
    get: function() {
        return searchCommand;
    }
});
const _findModules = require("../autolinking/findModules");
const _autolinkingOptions = require("./autolinkingOptions");
function searchCommand(cli) {
    return (0, _autolinkingOptions.registerAutolinkingArguments)(cli.command('search [searchPaths...]')).option('-j, --json', 'Output results in the plain JSON format.', ()=>true, false).action(async (searchPaths, commandArguments)=>{
        const platform = commandArguments.platform ?? 'apple';
        const autolinkingOptionsLoader = (0, _autolinkingOptions.createAutolinkingOptionsLoader)({
            ...commandArguments,
            searchPaths
        });
        const expoModulesSearchResults = await (0, _findModules.findModulesAsync)({
            autolinkingOptions: await autolinkingOptionsLoader.getPlatformOptions(platform),
            appRoot: await autolinkingOptionsLoader.getAppRoot()
        });
        if (commandArguments.json) {
            console.log(JSON.stringify(expoModulesSearchResults));
        } else {
            console.log(require('util').inspect(expoModulesSearchResults, false, null, true));
        }
    });
}

//# sourceMappingURL=searchCommand.js.map
