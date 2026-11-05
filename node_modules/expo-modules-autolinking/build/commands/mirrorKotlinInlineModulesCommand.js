"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "mirrorKotlinInlineModulesCommand", {
    enumerable: true,
    get: function() {
        return mirrorKotlinInlineModulesCommand;
    }
});
function _fs() {
    const data = /*#__PURE__*/ _interop_require_default(require("fs"));
    _fs = function() {
        return data;
    };
    return data;
}
function _path() {
    const data = /*#__PURE__*/ _interop_require_default(require("path"));
    _path = function() {
        return data;
    };
    return data;
}
const _androidInlineModules = require("../inlineModules/androidInlineModules");
const _inlineModules = require("../inlineModules/inlineModules");
const _autolinkingOptions = require("./autolinkingOptions");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function mirrorKotlinInlineModulesCommand(cli) {
    return (0, _autolinkingOptions.registerAutolinkingArguments)(cli.command('mirror-kotlin-inline-modules')).requiredOption('--kotlin-files-mirror-directory <path>', 'Directory in which to create mirrors of watched directories').requiredOption('--inline-modules-list-directory <path>', 'Path to the directory in which to generate the inlineModulesList file.').requiredOption('--watched-directories-serialized <watchedDirectories>', 'JSON serialized watched directories array').action(async (commandArguments)=>{
        const { kotlinFilesMirrorDirectory, inlineModulesListDirectory, watchedDirectoriesSerialized } = commandArguments;
        const autolinkingOptionsLoader = (0, _autolinkingOptions.createAutolinkingOptionsLoader)({
            ...commandArguments
        });
        const appRoot = await autolinkingOptionsLoader.getAppRoot();
        const watchedDirectories = JSON.parse(watchedDirectoriesSerialized);
        if (!/.android./.test(kotlinFilesMirrorDirectory) || !/.android./.test(inlineModulesListDirectory)) {
            throw new Error('Generation path is not inside any android directory!');
        }
        if (!_path().default.isAbsolute(kotlinFilesMirrorDirectory) || !_path().default.isAbsolute(inlineModulesListDirectory)) {
            throw new Error('Need to provide the absolute path to both the kotlin files mirror and inline modules list directories!');
        }
        const inlineModulesMirror = await (0, _inlineModules.getMirrorStateObject)({
            watchedDirectories,
            appRoot
        });
        const createMirrorStructurePromise = _fs().default.promises.rm(kotlinFilesMirrorDirectory, {
            recursive: true,
            force: true
        }).then(()=>(0, _androidInlineModules.createSymlinksToKotlinFiles)(kotlinFilesMirrorDirectory, inlineModulesMirror));
        const generateInlineModulesListPromise = (0, _androidInlineModules.generateInlineModulesListFile)(inlineModulesListDirectory, inlineModulesMirror);
        await Promise.all([
            createMirrorStructurePromise,
            generateInlineModulesListPromise
        ]);
    });
}

//# sourceMappingURL=mirrorKotlinInlineModulesCommand.js.map
