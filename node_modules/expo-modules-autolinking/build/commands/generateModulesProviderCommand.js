"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    findPackagesMissingScannedModules: null,
    generateModulesProviderCommand: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get findPackagesMissingScannedModules () {
        return findPackagesMissingScannedModules;
    },
    get generateModulesProviderCommand () {
        return generateModulesProviderCommand;
    }
});
function _commander() {
    const data = require("commander");
    _commander = function() {
        return data;
    };
    return data;
}
function _fs() {
    const data = /*#__PURE__*/ _interop_require_default(require("fs"));
    _fs = function() {
        return data;
    };
    return data;
}
const _findModules = require("../autolinking/findModules");
const _generatePackageList = require("../autolinking/generatePackageList");
const _resolveModules = require("../autolinking/resolveModules");
const _moduleScanner = require("../platforms/apple/moduleScanner");
const _autolinkingOptions = require("./autolinkingOptions");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function findPackagesMissingScannedModules(expectedPackageNames, resolvedModules, scanSucceeded, searchResults) {
    const modulesByName = new Map(resolvedModules.map((module1)=>[
            module1.packageName,
            module1
        ]));
    const packagesMissingModules = [];
    for (const packageName of expectedPackageNames){
        const resolvedModule = modulesByName.get(packageName);
        if (!resolvedModule) {
            console.warn(`warning: Package '${packageName}' was integrated at pod install but is missing from the current resolution. Run pod install if it should still be linked.`);
            continue;
        }
        const revision = searchResults[packageName];
        if (!scanSucceeded && !resolvedModule.modules?.length && revision && !revision.config?.declaresAppleModules() && (0, _moduleScanner.hasModuleAnnotations)(revision.path)) {
            packagesMissingModules.push(packageName);
        }
    }
    return packagesMissingModules;
}
function generateModulesProviderCommand(cli) {
    return (0, _autolinkingOptions.registerAutolinkingArguments)(cli.command('generate-modules-provider [searchPaths...]')).option('-t, --target <path>', 'Path to the target file, where the package list should be written to.').option('--target-name <name>', 'Name of the user target the package list is generated for. Used to match against the inline modules targets.').option('--entitlement <path>', 'Path to the Apple code signing entitlements file.').option('-p, --packages <packages...>', 'Names of the packages to include in the generated modules provider.').addOption(new (_commander()).Option('--target-platform <platform>', 'The concrete Apple platform the target builds for. Decides which conditionally compiled module classes are linked; without it every scanned class is linked.').choices([
        'ios',
        'macos',
        'tvos'
    ])).option('--app-root <path>', 'Path to the app root directory.').option('--podfile-properties-file-path <path>', 'Path to the Podfile properties file.').action(async (searchPaths, commandArguments)=>{
        const platform = commandArguments.platform ?? 'apple';
        const autolinkingOptionsLoader = (0, _autolinkingOptions.createAutolinkingOptionsLoader)({
            ...commandArguments,
            searchPaths
        });
        const autolinkingOptions = await autolinkingOptionsLoader.getPlatformOptions(platform);
        const appRoot = commandArguments.appRoot ?? await autolinkingOptionsLoader.getAppRoot();
        const expoModulesSearchResults = await (0, _findModules.findModulesAsync)({
            autolinkingOptions: await autolinkingOptionsLoader.getPlatformOptions(platform),
            appRoot
        });
        let scanSucceeded = false;
        const expoModulesResolveResults = await (0, _resolveModules.resolveModulesAsync)(expoModulesSearchResults, {
            ...autolinkingOptions,
            platform
        }, // Runs on every build, so a failed scan is retried by the next one.
        {
            scanNativeModules: true,
            scanPlatform: commandArguments.targetPlatform,
            onScanResult: (succeeded)=>scanSucceeded = succeeded
        });
        const includeModules = new Set(commandArguments.packages ?? []);
        const filteredModules = expoModulesResolveResults.filter((module1)=>includeModules.has(module1.packageName));
        const packagesMissingModules = findPackagesMissingScannedModules(commandArguments.packages ?? [], filteredModules, scanSucceeded, expoModulesSearchResults);
        const podfileProperties = await _fs().default.promises.readFile(commandArguments.podfilePropertiesFilePath, {
            encoding: 'utf8'
        }).then((file)=>JSON.parse(file)).catch(()=>({}));
        const watchedDirectories = JSON.parse(podfileProperties['expo.inlineModules.watchedDirectories'] ?? '[]');
        const inlineModulesTargets = JSON.parse(podfileProperties['expo.inlineModules.xcodeProjectTargets'] ?? '{"targets":[]}');
        await (0, _generatePackageList.generateModulesProviderAsync)(filteredModules, {
            platform,
            targetPath: commandArguments.target,
            targetName: commandArguments.targetName,
            entitlementPath: commandArguments.entitlement ?? null,
            watchedDirectories,
            inlineModulesTargets,
            appRoot
        });
        // Otherwise the app would fail at runtime with a missing native module.
        if (packagesMissingModules.length > 0) {
            console.error(`error: Scanning for @ExpoModule classes didn't complete (see the warnings above), so the module classes of these packages are missing from the modules provider: ${packagesMissingModules.join(', ')}. Build again to retry the scan, or declare the classes in the package's expo-module.config.json.`);
            process.exitCode = 1;
        }
    });
}

//# sourceMappingURL=generateModulesProviderCommand.js.map
