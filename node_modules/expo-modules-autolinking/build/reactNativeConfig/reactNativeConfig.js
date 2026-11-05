"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createReactNativeConfigAsync: null,
    resolveAppProjectConfigAsync: null,
    resolveReactNativeModule: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get createReactNativeConfigAsync () {
        return createReactNativeConfigAsync;
    },
    get resolveAppProjectConfigAsync () {
        return resolveAppProjectConfigAsync;
    },
    get resolveReactNativeModule () {
        return resolveReactNativeModule;
    }
});
function _platforms() {
    const data = require("@expo/platforms");
    _platforms = function() {
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
const _ExpoModuleConfig = require("../ExpoModuleConfig");
const _dependencies = require("../dependencies");
const _platforms1 = require("../platforms");
const _androidResolver = require("./androidResolver");
const _config = require("./config");
const _iosResolver = require("./iosResolver");
const _webResolver = require("./webResolver");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const deepObjectMerge = (target, source)=>{
    if (source !== undefined && source !== null && typeof target === 'object' && target != null && !Array.isArray(target) && (!target.constructor || target.constructor === Object) && typeof source === 'object' && !Array.isArray(source)) {
        target = {
            ...target
        };
        for(const key in source){
            target[key] = deepObjectMerge(target[key], source[key]);
        }
        return target;
    }
    return source !== undefined ? source : target;
};
const isMissingFBReactNativeSpecCodegenOutput = async (reactNativePath)=>{
    const generatedDir = _path().default.resolve(reactNativePath, 'React/FBReactNativeSpec');
    try {
        const stat = await _fs().default.promises.lstat(generatedDir);
        return !stat.isDirectory();
    } catch  {
        return true;
    }
};
async function resolveReactNativeModule(resolution, projectConfig, platform, excludeNames) {
    // The platform's support package is the react-native host (e.g. react-native-macos for macos,
    // react-native-tvos for tvos), not a linkable module — filter it out alongside react-native.
    // This is null for platforms without a host (web, apple), so only react-native is filtered.
    const supportPackage = (0, _platforms1.getSupportPackageForPlatform)(platform);
    if (excludeNames.has(resolution.name)) {
        return null;
    } else if (resolution.name === 'react-native' || resolution.name === supportPackage) {
        // Starting from version 0.76, the `react-native` package only defines platforms
        // when @react-native-community/cli-platform-android/ios is installed.
        // Therefore, we need to manually filter it (and the platform's support package) out.
        // NOTE(@kitten): `loadConfigAsync` is skipped too, because react-native's config is too slow
        return null;
    }
    // Workaround for Android Gradle/Prefab issue with special characters in paths.
    // pnpm creates virtual store paths with '=' characters (e.g., _patch_hash=abc123),
    // which cause build failures on Android due to Prefab not properly escaping them.
    // See: https://github.com/google/prefab/issues/187
    const shouldUseOriginPath = platform === 'android' && resolution.path.includes('=') && resolution.path.includes('.pnpm');
    const modulePath = shouldUseOriginPath ? resolution.originPath : resolution.path;
    const libraryConfig = await (0, _config.loadConfigAsync)(modulePath);
    if (Object.keys(libraryConfig?.platforms ?? {}).length > 0) {
        // Package defines platforms would be a platform host package.
        // The rnc-cli will skip this package.
        return null;
    }
    let reactNativeConfig = libraryConfig?.dependency ?? {};
    const projectDependencyOverride = projectConfig?.dependencies?.[resolution.name];
    if (projectDependencyOverride != null) {
        reactNativeConfig = deepObjectMerge(reactNativeConfig, projectDependencyOverride);
    }
    let maybeExpoModuleConfig;
    if (!libraryConfig) {
        // NOTE(@kitten): If we don't have an explicit react-native.config.{js,ts} file,
        // we should pass the Expo Module config (if it exists) to the resolvers below,
        // which can then decide if the React Native inferred config and Expo Module
        // configs conflict
        try {
            maybeExpoModuleConfig = await (0, _ExpoModuleConfig.discoverExpoModuleConfigAsync)(resolution.path);
        } catch  {
        // We ignore invalid Expo Modules for the purpose of auto-linking and
        // pretend the config doesn't exist, if it isn't valid JSON
        }
    }
    let platformData = null;
    if (platform === 'android') {
        platformData = await (0, _androidResolver.resolveDependencyConfigImplAndroidAsync)(modulePath, reactNativeConfig.platforms?.android, maybeExpoModuleConfig);
    } else if (platform === 'ios') {
        platformData = await (0, _iosResolver.resolveDependencyConfigImplIosAsync)(resolution, reactNativeConfig.platforms?.ios, maybeExpoModuleConfig);
    } else if ((0, _platforms().isOutOfTreePlatform)(platform)) {
        // tvos/macos build through the Apple toolchain, so they reuse the iOS autolinking resolver.
        // Use the platform-specific `react-native.config` entry when it's set — including an explicit
        // `null`, which disables autolinking for that platform — and only fall back to `platforms.ios`
        // when it's unset (`undefined`). Results are reported under the platform's own key.
        // When the config says nothing about the platform, the podspec decides: a library whose
        // podspec does not declare it is skipped, so codegen and Metro do not see native code that
        // the Podfile is going to filter out anyway.
        const platformConfig = reactNativeConfig.platforms?.[platform];
        const appleConfig = platformConfig !== undefined ? platformConfig : reactNativeConfig.platforms?.ios;
        platformData = await (0, _iosResolver.resolveDependencyConfigImplIosAsync)(resolution, appleConfig, maybeExpoModuleConfig, platformConfig === undefined ? {
            platform: platform
        } : undefined);
    } else if (platform === 'web') {
        platformData = await (0, _webResolver.checkDependencyWebAsync)(resolution, reactNativeConfig, maybeExpoModuleConfig);
    }
    return platformData && {
        root: modulePath,
        name: resolution.name,
        platforms: {
            [platform]: platformData
        }
    };
}
async function createReactNativeConfigAsync({ appRoot, sourceDir, autolinkingOptions }) {
    const excludeNames = new Set(autolinkingOptions.exclude);
    const projectConfig = await (0, _config.loadConfigAsync)(appRoot);
    // custom native modules should be resolved first so that they can override other modules
    const searchPaths = autolinkingOptions.nativeModulesDir ? [
        autolinkingOptions.nativeModulesDir,
        ...autolinkingOptions.searchPaths
    ] : autolinkingOptions.searchPaths;
    const limitDepth = autolinkingOptions.legacy_shallowReactNativeLinking ? 1 : undefined;
    const resolutions = (0, _dependencies.mergeResolutionResults)(await Promise.all([
        (0, _dependencies.scanDependenciesFromRNProjectConfig)(appRoot, projectConfig),
        ...searchPaths.map((searchPath)=>(0, _dependencies.scanDependenciesInSearchPath)(searchPath)),
        (0, _dependencies.scanDependenciesRecursively)(appRoot, {
            limitDepth
        })
    ]));
    const dependencies = await (0, _dependencies.filterMapResolutionResult)(resolutions, (resolution)=>resolveReactNativeModule(resolution, projectConfig, autolinkingOptions.platform, excludeNames));
    // The support package is the platform's react-native host (react-native for ios/android,
    // react-native-tvos / react-native-macos for the out-of-tree platforms). This replaces the
    // npm-alias approach where the support package was installed under the `react-native` name.
    // Native platforms always resolve a host package; fall back to react-native for safety.
    const supportPackage = (0, _platforms1.getSupportPackageForPlatform)(autolinkingOptions.platform) ?? 'react-native';
    // See: https://github.com/facebook/react-native/pull/53690
    // When we're building react-native from source without these generated files, we need to force them to be generated
    // Every published react-native version (or out-of-tree version) should have these files, but building from the raw repo won't (e.g. Expo Go)
    const reactNativeResolution = resolutions[supportPackage];
    if (reactNativeResolution && autolinkingOptions.platform === 'ios' && await isMissingFBReactNativeSpecCodegenOutput(reactNativeResolution.path)) {
        dependencies['react-native'] = {
            root: reactNativeResolution.path,
            name: 'react-native',
            platforms: {
                ios: {
                    // This will trigger a warning in list_native_modules but will trigger the artifacts
                    // codegen codepath as expected
                    podspecPath: '',
                    version: reactNativeResolution.version,
                    configurations: [],
                    scriptPhases: []
                }
            }
        };
    }
    const reactNativePath = resolutions[supportPackage]?.path;
    return {
        root: appRoot,
        reactNativePath,
        dependencies: sortDependenciesByName(dependencies),
        project: await resolveAppProjectConfigAsync(appRoot, autolinkingOptions.platform, sourceDir)
    };
}
function sortDependenciesByName(dependencies) {
    const sortedDependencies = {};
    for (const name of Object.keys(dependencies).sort()){
        sortedDependencies[name] = dependencies[name];
    }
    return sortedDependencies;
}
function resolveAppleProjectSourceDir(projectRoot, platform) {
    const platformDir = _path().default.join(projectRoot, platform);
    if (_fs().default.existsSync(_path().default.join(platformDir, 'Podfile'))) {
        return platformDir;
    }
    return _path().default.join(projectRoot, 'ios');
}
async function resolveAppProjectConfigAsync(projectRoot, platform, sourceDir) {
    // TODO(@kitten): use the commandRoot here to find these files in non <projectRoot>/<platform> folders
    if (platform === 'android') {
        const androidDir = sourceDir ?? _path().default.join(projectRoot, 'android');
        const { gradle, manifest } = await (0, _androidResolver.findGradleAndManifestAsync)({
            androidDir,
            isLibrary: false
        });
        if (gradle == null || manifest == null) {
            return {};
        }
        const packageName = await (0, _androidResolver.parsePackageNameAsync)(manifest, gradle);
        return {
            android: {
                packageName: packageName ?? '',
                sourceDir: sourceDir ?? _path().default.join(projectRoot, 'android')
            }
        };
    }
    if ((0, _platforms().isAppleTargetPlatform)(platform)) {
        // tvos/macos may reuse the iOS (Apple) toolchain but are reported under their own platform key
        return {
            [platform]: {
                sourceDir: sourceDir ?? resolveAppleProjectSourceDir(projectRoot, platform)
            }
        };
    }
    return {};
}

//# sourceMappingURL=reactNativeConfig.js.map
