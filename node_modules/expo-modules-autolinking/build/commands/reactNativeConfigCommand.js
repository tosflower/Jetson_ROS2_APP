"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "reactNativeConfigCommand", {
    enumerable: true,
    get: function() {
        return reactNativeConfigCommand;
    }
});
function _platforms() {
    const data = require("@expo/platforms");
    _platforms = function() {
        return data;
    };
    return data;
}
const _reactNativeConfig = require("../reactNativeConfig");
const _autolinkingOptions = require("./autolinkingOptions");
function reactNativeConfigCommand(cli) {
    return (0, _autolinkingOptions.registerAutolinkingArguments)(cli.command('react-native-config [searchPaths...]')).option('-p, --platform [platform]', 'The platform that the resulting modules must support. Available options: "android", "ios"', 'ios').option('--source-dir <sourceDir>', 'The path to the native source directory').option('-j, --json', 'Output results in the plain JSON format.', ()=>true, false).action(async (searchPaths, commandArguments)=>{
        // TODO(@kitten): Do we need to restrict this?
        const platform = commandArguments.platform ?? 'ios';
        if (platform !== 'android' && !(0, _platforms().isAppleTargetPlatform)(platform)) {
            throw new Error(`Unsupported platform: ${platform}`);
        }
        const autolinkingOptionsLoader = (0, _autolinkingOptions.createAutolinkingOptionsLoader)({
            ...commandArguments,
            searchPaths
        });
        const reactNativeConfig = await (0, _reactNativeConfig.createReactNativeConfigAsync)({
            autolinkingOptions: await autolinkingOptionsLoader.getPlatformOptions(platform),
            appRoot: await autolinkingOptionsLoader.getAppRoot(),
            // NOTE(@kitten): This is currently not validated, and assumed to be validated later
            sourceDir: commandArguments.sourceDir ?? undefined
        });
        if (commandArguments.json) {
            console.log(JSON.stringify(reactNativeConfig));
        } else {
            console.log(require('util').inspect(reactNativeConfig, false, null, true));
        }
    });
}

//# sourceMappingURL=reactNativeConfigCommand.js.map
