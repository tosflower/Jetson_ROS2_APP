"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    formatArrayOfReactDelegateHandler: null,
    generateModulesProviderAsync: null,
    getConfiguration: null,
    getSwiftModuleNames: null,
    resolveExtraBuildDependenciesAsync: null,
    resolveModuleAsync: null,
    scanNativeModulesAsync: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get formatArrayOfReactDelegateHandler () {
        return formatArrayOfReactDelegateHandler;
    },
    get generateModulesProviderAsync () {
        return generateModulesProviderAsync;
    },
    get getConfiguration () {
        return getConfiguration;
    },
    get getSwiftModuleNames () {
        return getSwiftModuleNames;
    },
    get resolveExtraBuildDependenciesAsync () {
        return resolveExtraBuildDependenciesAsync;
    },
    get resolveModuleAsync () {
        return resolveModuleAsync;
    },
    get scanNativeModulesAsync () {
        return scanNativeModulesAsync;
    }
});
function _spawnasync() {
    const data = /*#__PURE__*/ _interop_require_default(require("@expo/spawn-async"));
    _spawnasync = function() {
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
function _path() {
    const data = /*#__PURE__*/ _interop_require_default(require("path"));
    _path = function() {
        return data;
    };
    return data;
}
const _iosInlineModules = require("../../inlineModules/iosInlineModules");
const _utils = require("../../utils");
const _moduleScanner = require("./moduleScanner");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const APPLE_PROPERTIES_FILE = 'Podfile.properties.json';
const APPLE_EXTRA_BUILD_DEPS_KEY = 'apple.extraPods';
function getConfiguration(options) {
    return options.buildFromSource ? {
        buildFromSource: options.buildFromSource
    } : undefined;
}
const indent = '  ';
/** Find all *.podspec files in top-level directories */ async function findPodspecFiles(revision) {
    const configPodspecPaths = revision.config?.applePodspecPaths();
    if (configPodspecPaths && configPodspecPaths.length) {
        return configPodspecPaths;
    } else {
        return await (0, _utils.listFilesInDirectories)(revision.path, (basename)=>basename.endsWith('.podspec'));
    }
}
function getSwiftModuleNames(pods, swiftModuleNames) {
    if (swiftModuleNames && swiftModuleNames.length) {
        return swiftModuleNames;
    }
    // by default, non-alphanumeric characters in the pod name are replaced by _ in the module name
    return pods.map((pod)=>pod.podName.replace(/[^a-zA-Z0-9]/g, '_'));
}
async function scanNativeModulesAsync(searchResults, platform) {
    // The scanner is a macOS binary.
    if (process.platform !== 'darwin') {
        return null;
    }
    // Without expo-modules-core nothing can use the macro.
    const coreRevision = searchResults['expo-modules-core'];
    if (!coreRevision) {
        return null;
    }
    const scanner = (0, _moduleScanner.loadModulesScanner)(coreRevision.path);
    if (!scanner) {
        console.warn(`warning: Couldn't load expo-modules-macros from ${coreRevision.path}, so only modules declared in expo-module.config.json will be linked. Reinstall your JavaScript dependencies to restore it.`);
        return null;
    }
    const packageRoots = (0, _moduleScanner.collectPackageRoots)(searchResults);
    const output = await (0, _moduleScanner.scanExpoModulesAsync)(scanner, packageRoots);
    return output ? (0, _moduleScanner.groupScannedModules)(output, packageRoots, platform) : null;
}
/**
 * The declared modules when the config declares the list (even an empty one), otherwise the scanned
 * classes sorted by code unit.
 */ function pickModules(declaredModules, scannedModules) {
    if (declaredModules) {
        return declaredModules;
    }
    return [
        ...scannedModules
    ].sort((a, b)=>a.class < b.class ? -1 : a.class > b.class ? 1 : 0);
}
async function resolveModuleAsync(packageName, revision, extraOutput) {
    const podspecFiles = await findPodspecFiles(revision);
    if (!podspecFiles.length) {
        return null;
    }
    const pods = podspecFiles.map((podspecFile)=>({
            podName: _path().default.basename(podspecFile, _path().default.extname(podspecFile)),
            podspecDir: _path().default.dirname(_path().default.join(revision.path, podspecFile))
        }));
    const swiftModuleNames = getSwiftModuleNames(pods, revision.config?.appleSwiftModuleNames());
    const coreFeatures = revision.config?.coreFeatures() ?? [];
    const configModules = revision.config?.appleModules().map((module1)=>typeof module1 === 'string' ? {
            name: null,
            class: module1
        } : module1) ?? [];
    return {
        packageName,
        pods,
        swiftModuleNames,
        flags: extraOutput.flags,
        modules: pickModules(revision.config?.declaresAppleModules() ? configModules : null, extraOutput.scannedModules?.[packageName] ?? []),
        appDelegateSubscribers: revision.config?.appleAppDelegateSubscribers() ?? [],
        reactDelegateHandlers: revision.config?.appleReactDelegateHandlers() ?? [],
        debugOnly: revision.config?.appleDebugOnly() ?? false,
        ...coreFeatures.length > 0 ? {
            coreFeatures
        } : {}
    };
}
async function resolveExtraBuildDependenciesAsync(projectNativeRoot) {
    const propsFile = _path().default.join(projectNativeRoot, APPLE_PROPERTIES_FILE);
    try {
        const contents = await _fs().default.promises.readFile(propsFile, 'utf8');
        const podfileJson = JSON.parse(contents);
        if (podfileJson[APPLE_EXTRA_BUILD_DEPS_KEY]) {
            // expo-build-properties would serialize the extraPods as JSON string, we should parse it again.
            const extraPods = JSON.parse(podfileJson[APPLE_EXTRA_BUILD_DEPS_KEY]);
            return extraPods;
        }
    } catch  {}
    return null;
}
async function generateModulesProviderAsync(modules, targetPath, entitlementPath, params) {
    const className = _path().default.basename(targetPath, _path().default.extname(targetPath));
    const entitlements = await parseEntitlementsAsync(entitlementPath);
    const generatedFileContent = await generatePackageListFileContentAsync(modules, className, entitlements, params);
    const parentPath = _path().default.dirname(targetPath);
    // Avoid writing the file if the content hasn't changed to prevent unnecessary recompilation.
    try {
        const existingContent = await _fs().default.promises.readFile(targetPath, 'utf8');
        if (existingContent === generatedFileContent) {
            return;
        }
    } catch  {}
    await _fs().default.promises.mkdir(parentPath, {
        recursive: true
    });
    await _fs().default.promises.writeFile(targetPath, generatedFileContent, 'utf8');
}
/**
 * Generates the string to put into the generated package list.
 */ async function generatePackageListFileContentAsync(modules, className, entitlements, params) {
    const iosModules = modules.filter((module1)=>module1.modules.length || module1.appDelegateSubscribers.length || module1.reactDelegateHandlers.length);
    const modulesToImport = iosModules.filter((module1)=>!module1.debugOnly);
    const debugOnlyModules = iosModules.filter((module1)=>module1.debugOnly);
    const swiftModules = [].concat(...modulesToImport.map((module1)=>module1.swiftModuleNames)).filter(Boolean);
    const debugOnlySwiftModules = [].concat(...debugOnlyModules.map((module1)=>module1.swiftModuleNames)).filter(Boolean);
    let modulesClassNames = [].concat(...modulesToImport.map((module1)=>module1.modules)).filter(Boolean);
    if ((0, _iosInlineModules.isTargetInInlineModulesTargets)(params)) {
        modulesClassNames = modulesClassNames.concat(await (0, _iosInlineModules.getIosInlineModulesClassNames)(params));
    }
    const debugOnlyModulesClassNames = [].concat(...debugOnlyModules.map((module1)=>module1.modules)).filter(Boolean);
    const appDelegateSubscribers = [].concat(...modulesToImport.map((module1)=>module1.appDelegateSubscribers));
    const debugOnlyAppDelegateSubscribers = [].concat(...debugOnlyModules.map((module1)=>module1.appDelegateSubscribers));
    const reactDelegateHandlerModules = modulesToImport.filter((module1)=>!!module1.reactDelegateHandlers.length);
    const debugOnlyReactDelegateHandlerModules = debugOnlyModules.filter((module1)=>!!module1.reactDelegateHandlers.length);
    return `/**
 * Automatically generated by expo-modules-autolinking.
 *
 * This autogenerated class provides a list of classes of native Expo modules,
 * but only these that are written in Swift and use the new API for creating Expo modules.
 */

internal import ExpoModulesCore
${generateCommonImportList(swiftModules)}
${generateDebugOnlyImportList(debugOnlySwiftModules)}
@objc(${className})
internal class ${className}: ModulesProvider {
  public override func getModuleClasses() -> [ExpoModuleTupleType] {
${generateModuleClasses(modulesClassNames, debugOnlyModulesClassNames)}
  }

  public override func getAppDelegateSubscribers() -> [ExpoAppDelegateSubscriber.Type] {
${generateClasses(appDelegateSubscribers, debugOnlyAppDelegateSubscribers)}
  }

  public override func getReactDelegateHandlers() -> [ExpoReactDelegateHandlerTupleType] {
${generateReactDelegateHandlers(reactDelegateHandlerModules, debugOnlyReactDelegateHandlerModules)}
  }

  public override func getAppCodeSignEntitlements() -> AppCodeSignEntitlements {
    return AppCodeSignEntitlements.from(json: #"${JSON.stringify(entitlements)}"#)
  }
}
`;
}
function generateCommonImportList(swiftModules) {
    return swiftModules.map((moduleName)=>`internal import ${moduleName}`).join('\n');
}
function generateDebugOnlyImportList(swiftModules) {
    if (!swiftModules.length) {
        return '';
    }
    return wrapInDebugConfigurationCheck(0, swiftModules.map((moduleName)=>`internal import ${moduleName}`).join('\n')) + '\n';
}
function generateModuleClasses(modules, debugOnlyModules) {
    const commonClassNames = formatArrayOfModuleTuples(modules);
    if (debugOnlyModules.length > 0) {
        return wrapInDebugConfigurationCheck(2, `return ${formatArrayOfModuleTuples(modules.concat(debugOnlyModules))}`, `return ${commonClassNames}`);
    } else {
        return `${indent.repeat(2)}return ${commonClassNames}`;
    }
}
/**
 * Formats an array of modules config to Swift's array of module tuples.
 */ function formatArrayOfModuleTuples(modules) {
    return `[${modules.map((module1)=>`\n${indent.repeat(3)}(module: ${module1.class}.self, name: ${module1.name ? `"${module1.name}"` : 'nil'})`).join(',')}
${indent.repeat(2)}]`;
}
function generateClasses(classNames, debugOnlyClassName) {
    const commonClassNames = formatArrayOfClassNames(classNames);
    if (debugOnlyClassName.length > 0) {
        return wrapInDebugConfigurationCheck(2, `return ${formatArrayOfClassNames(classNames.concat(debugOnlyClassName))}`, `return ${commonClassNames}`);
    } else {
        return `${indent.repeat(2)}return ${commonClassNames}`;
    }
}
/**
 * Formats an array of class names to Swift's array containing these classes.
 */ function formatArrayOfClassNames(classNames) {
    return `[${classNames.map((className)=>`\n${indent.repeat(3)}${className}.self`).join(',')}
${indent.repeat(2)}]`;
}
function generateReactDelegateHandlers(module1, debugOnlyModules) {
    const commonModules = formatArrayOfReactDelegateHandler(module1);
    if (debugOnlyModules.length > 0) {
        return wrapInDebugConfigurationCheck(2, `return ${formatArrayOfReactDelegateHandler(module1.concat(debugOnlyModules))}`, `return ${commonModules}`);
    } else {
        return `${indent.repeat(2)}return ${commonModules}`;
    }
}
function formatArrayOfReactDelegateHandler(modules) {
    const values = [];
    for (const module1 of modules){
        for (const handler of module1.reactDelegateHandlers){
            values.push(`(packageName: "${module1.packageName}", handler: ${handler}.self)`);
        }
    }
    return `[${values.map((value)=>`\n${indent.repeat(3)}${value}`).join(',')}
${indent.repeat(2)}]`;
}
function wrapInDebugConfigurationCheck(indentationLevel, debugBlock, releaseBlock = null) {
    if (releaseBlock) {
        return `${indent.repeat(indentationLevel)}#if EXPO_CONFIGURATION_DEBUG\n${indent.repeat(indentationLevel)}${debugBlock}\n${indent.repeat(indentationLevel)}#else\n${indent.repeat(indentationLevel)}${releaseBlock}\n${indent.repeat(indentationLevel)}#endif`;
    }
    return `${indent.repeat(indentationLevel)}#if EXPO_CONFIGURATION_DEBUG\n${indent.repeat(indentationLevel)}${debugBlock}\n${indent.repeat(indentationLevel)}#endif`;
}
async function parseEntitlementsAsync(entitlementPath) {
    if (!entitlementPath || !await (0, _utils.fileExistsAsync)(entitlementPath)) {
        return {};
    }
    const { stdout } = await (0, _spawnasync().default)('plutil', [
        '-convert',
        'json',
        '-o',
        '-',
        entitlementPath
    ]);
    const entitlementsJson = JSON.parse(stdout);
    return {
        appGroups: entitlementsJson['com.apple.security.application-groups'] || undefined
    };
}

//# sourceMappingURL=apple.js.map
