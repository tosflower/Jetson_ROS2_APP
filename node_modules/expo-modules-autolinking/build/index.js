"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _commander() {
    const data = /*#__PURE__*/ _interop_require_default(require("commander"));
    _commander = function() {
        return data;
    };
    return data;
}
const _generateModulesProviderCommand = require("./commands/generateModulesProviderCommand");
const _mirrorKotlinInlineModulesCommand = require("./commands/mirrorKotlinInlineModulesCommand");
const _prebuiltMetadataCommand = require("./commands/prebuiltMetadataCommand");
const _reactNativeConfigCommand = require("./commands/reactNativeConfigCommand");
const _resolveCommand = require("./commands/resolveCommand");
const _searchCommand = require("./commands/searchCommand");
const _verifyCommand = require("./commands/verifyCommand");
const _memoize = require("./memoize");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function main(args) {
    const cli = _commander().default.version(require('expo-modules-autolinking/package.json').version).description('CLI command that searches for native modules to autolink them.');
    (0, _verifyCommand.verifyCommand)(cli);
    (0, _searchCommand.searchCommand)(cli);
    (0, _resolveCommand.resolveCommand)(cli);
    (0, _prebuiltMetadataCommand.prebuiltMetadataCommand)(cli);
    (0, _mirrorKotlinInlineModulesCommand.mirrorKotlinInlineModulesCommand)(cli);
    (0, _generateModulesProviderCommand.generateModulesProviderCommand)(cli);
    (0, _reactNativeConfigCommand.reactNativeConfigCommand)(cli);
    await (0, _memoize.createMemoizer)().withMemoizer(async ()=>{
        await cli.parseAsync(args, {
            from: 'user'
        });
    });
}
module.exports = main;

//# sourceMappingURL=index.js.map
