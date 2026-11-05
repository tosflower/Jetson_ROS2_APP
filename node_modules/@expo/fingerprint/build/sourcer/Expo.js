"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createHashSourceExternalFileAsync: null,
    getConfigPluginProps: null,
    getEasBuildSourcesAsync: null,
    getExpoAutolinkingAndroidSourcesAsync: null,
    getExpoAutolinkingIosSourcesAsync: null,
    getExpoCNGPatchSourcesAsync: null,
    getExpoConfigSourcesAsync: null,
    sortExpoAutolinkingAndroidConfig: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get createHashSourceExternalFileAsync () {
        return createHashSourceExternalFileAsync;
    },
    get getConfigPluginProps () {
        return getConfigPluginProps;
    },
    get getEasBuildSourcesAsync () {
        return getEasBuildSourcesAsync;
    },
    get getExpoAutolinkingAndroidSourcesAsync () {
        return getExpoAutolinkingAndroidSourcesAsync;
    },
    get getExpoAutolinkingIosSourcesAsync () {
        return getExpoAutolinkingIosSourcesAsync;
    },
    get getExpoCNGPatchSourcesAsync () {
        return getExpoCNGPatchSourcesAsync;
    },
    get getExpoConfigSourcesAsync () {
        return getExpoConfigSourcesAsync;
    },
    get sortExpoAutolinkingAndroidConfig () {
        return sortExpoAutolinkingAndroidConfig;
    }
});
function _env() {
    const data = require("@expo/env");
    _env = function() {
        return data;
    };
    return data;
}
function _spawnasync() {
    const data = /*#__PURE__*/ _interop_require_default(require("@expo/spawn-async"));
    _spawnasync = function() {
        return data;
    };
    return data;
}
function _chalk() {
    const data = /*#__PURE__*/ _interop_require_default(require("chalk"));
    _chalk = function() {
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
function _semver() {
    const data = /*#__PURE__*/ _interop_require_default(require("semver"));
    _semver = function() {
        return data;
    };
    return data;
}
const _ExpoResolver = require("../ExpoResolver");
const _Path = require("../utils/Path");
const _Profile = require("../utils/Profile");
const _AutolinkingConfig = require("./AutolinkingConfig");
const _SourceSkips = require("./SourceSkips");
const _Utils = require("./Utils");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const debug = require('debug')('expo:fingerprint:sourcer:Expo');
async function getExpoConfigSourcesAsync(projectRoot, config, loadedModules, options) {
    if (options.sourceSkips & _SourceSkips.SourceSkips.ExpoConfigAll) {
        return [];
    }
    if (config == null) {
        return [];
    }
    const results = [];
    let expoConfig = normalizeExpoConfig(config.exp, projectRoot, options);
    // external files in config
    const isAndroid = options.platforms.includes('android');
    const isIos = options.platforms.includes('ios');
    const splashScreenPluginProps = getConfigPluginProps(expoConfig, 'expo-splash-screen');
    const fontPluginProps = getConfigPluginProps(expoConfig, 'expo-font');
    const externalFiles = [
        // expo-font files
        ...fontPluginProps?.fonts ?? [],
        ...isIos ? fontPluginProps?.ios?.fonts ?? [] : [],
        ...isAndroid ? (fontPluginProps?.android?.fonts ?? []).flatMap((f)=>typeof f === 'string' ? [
                f
            ] : // a family may name the file path once instead of each definition repeating it
            (f.fontDefinitions ?? []).map((d)=>d.path ?? f.path)) : [],
        // icons
        expoConfig.icon,
        isAndroid ? expoConfig.android?.icon : undefined,
        ...isIos ? collectIosIcons(expoConfig.ios?.icon) : [],
        isAndroid ? expoConfig.android?.adaptiveIcon?.foregroundImage : undefined,
        isAndroid ? expoConfig.android?.adaptiveIcon?.backgroundImage : undefined,
        // expo-splash-screen images
        splashScreenPluginProps?.image,
        splashScreenPluginProps?.dark?.image,
        isAndroid ? splashScreenPluginProps?.android?.image : undefined,
        isAndroid ? splashScreenPluginProps?.android?.mdpi : undefined,
        isAndroid ? splashScreenPluginProps?.android?.hdpi : undefined,
        isAndroid ? splashScreenPluginProps?.android?.xhdpi : undefined,
        isAndroid ? splashScreenPluginProps?.android?.xxhdpi : undefined,
        isAndroid ? splashScreenPluginProps?.android?.xxxhdpi : undefined,
        isAndroid ? splashScreenPluginProps?.android?.dark?.image : undefined,
        isAndroid ? splashScreenPluginProps?.android?.dark?.mdpi : undefined,
        isAndroid ? splashScreenPluginProps?.android?.dark?.hdpi : undefined,
        isAndroid ? splashScreenPluginProps?.android?.dark?.xhdpi : undefined,
        isAndroid ? splashScreenPluginProps?.android?.dark?.xxhdpi : undefined,
        isAndroid ? splashScreenPluginProps?.android?.dark?.xxxhdpi : undefined,
        isIos ? splashScreenPluginProps?.ios?.image : undefined,
        isIos ? splashScreenPluginProps?.ios?.tabletImage : undefined,
        isIos ? splashScreenPluginProps?.ios?.dark?.image : undefined,
        isIos ? splashScreenPluginProps?.ios?.dark?.tabletImage : undefined,
        // google service files
        isAndroid ? expoConfig.android?.googleServicesFile : undefined,
        isIos ? expoConfig.ios?.googleServicesFile : undefined
    ].filter((file)=>Boolean(file)).map((filePath)=>ensureRelativePath(projectRoot, filePath));
    const externalFileSources = (await Promise.all(externalFiles.map((file)=>createHashSourceExternalFileAsync({
            projectRoot,
            file,
            reason: 'expoConfigExternalFile'
        })))).filter(Boolean);
    results.push(...externalFileSources);
    expoConfig = postUpdateExpoConfig(expoConfig, projectRoot);
    results.push({
        type: 'contents',
        id: 'expoConfig',
        contents: (0, _Utils.stringifyJsonSorted)(expoConfig),
        reasons: [
            'expoConfig'
        ]
    });
    // config plugins
    // With `configPluginSourceType: 'package'`, node_modules plugin files collapse to their package
    // name+version; in-repo files and virtual modules are hashed directly.
    const configPluginModules = await Promise.all((loadedModules ?? []).map(async (loadedModule)=>{
        if (loadedModule.type === 'contents') {
            return {
                type: 'contents',
                id: loadedModule.id,
                contents: loadedModule.contents,
                reasons: [
                    'expoConfigPlugins'
                ]
            };
        }
        if (options.configPluginSourceType === 'package') {
            const packageJsonPath = (0, _Path.getNodeModulesPackageJsonPath)(loadedModule.path);
            if (packageJsonPath) {
                const identity = await (0, _Utils.readPackageIdentityAsync)(_path().default.join(projectRoot, packageJsonPath));
                if (identity) {
                    return {
                        type: 'package',
                        ...identity,
                        filePath: packageJsonPath,
                        reasons: [
                            'expoConfigPlugins'
                        ]
                    };
                }
            }
        }
        return {
            type: 'file',
            filePath: loadedModule.path,
            reasons: [
                'expoConfigPlugins'
            ]
        };
    }));
    results.push(...configPluginModules);
    return results;
}
function normalizeExpoConfig(config, projectRoot, options) {
    // Deep clone by JSON.parse/stringify that assumes the config is serializable.
    const normalizedConfig = JSON.parse(JSON.stringify(config));
    const { sourceSkips } = options;
    delete normalizedConfig._internal;
    if (sourceSkips & _SourceSkips.SourceSkips.ExpoConfigVersions) {
        delete normalizedConfig.version;
        delete normalizedConfig.android?.versionCode;
        delete normalizedConfig.android?.version;
        delete normalizedConfig.ios?.buildNumber;
        delete normalizedConfig.ios?.version;
    }
    if (sourceSkips & _SourceSkips.SourceSkips.ExpoConfigRuntimeVersionIfString) {
        if (typeof normalizedConfig.runtimeVersion === 'string') {
            delete normalizedConfig.runtimeVersion;
        }
        if (typeof normalizedConfig.android?.runtimeVersion === 'string') {
            delete normalizedConfig.android.runtimeVersion;
        }
        if (typeof normalizedConfig.ios?.runtimeVersion === 'string') {
            delete normalizedConfig.ios.runtimeVersion;
        }
        if (typeof normalizedConfig.web?.runtimeVersion === 'string') {
            delete normalizedConfig.web.runtimeVersion;
        }
    }
    if (sourceSkips & _SourceSkips.SourceSkips.ExpoConfigNames) {
        normalizedConfig.name = '';
        delete normalizedConfig.description;
        delete normalizedConfig.web?.name;
        delete normalizedConfig.web?.shortName;
        delete normalizedConfig.web?.description;
    }
    if (sourceSkips & _SourceSkips.SourceSkips.ExpoConfigAndroidPackage) {
        delete normalizedConfig.android?.package;
    }
    if (sourceSkips & _SourceSkips.SourceSkips.ExpoConfigIosBundleIdentifier) {
        delete normalizedConfig.ios?.bundleIdentifier;
    }
    if (sourceSkips & _SourceSkips.SourceSkips.ExpoConfigSchemes) {
        delete normalizedConfig.scheme;
        normalizedConfig.slug = '';
    }
    if (sourceSkips & _SourceSkips.SourceSkips.ExpoConfigEASProject) {
        delete normalizedConfig.owner;
        delete normalizedConfig?.extra?.eas;
        delete normalizedConfig?.updates?.url;
    }
    if (sourceSkips & _SourceSkips.SourceSkips.ExpoConfigAssets) {
        delete normalizedConfig.icon;
        delete normalizedConfig.android?.adaptiveIcon;
        delete normalizedConfig.android?.icon;
        delete normalizedConfig.ios?.icon;
        delete normalizedConfig.web?.favicon;
        delete normalizedConfig.web?.splash;
    }
    if (sourceSkips & _SourceSkips.SourceSkips.ExpoConfigExtraSection) {
        delete normalizedConfig.extra;
    }
    return (0, _Utils.relativizeJsonPaths)(normalizedConfig, projectRoot);
}
/**
 * Gives the last chance to modify the ExpoConfig.
 * For example, we can remove some fields that are already included in the fingerprint.
 */ function postUpdateExpoConfig(config, projectRoot) {
    // The config is already a clone, so we can modify it in place for performance.
    // googleServicesFile may contain absolute paths on EAS with file-based secrets.
    // Given we include googleServicesFile as external files already, we can remove it from the config.
    delete config.android?.googleServicesFile;
    delete config.ios?.googleServicesFile;
    return config;
}
/**
 * Collect iOS icon to flattened file paths.
 */ function collectIosIcons(icon) {
    if (icon == null) {
        return [];
    }
    if (typeof icon === 'string') {
        return [
            icon
        ];
    }
    return [
        icon.light,
        icon.dark,
        icon.tinted
    ].filter((file)=>Boolean(file));
}
/**
 * The filePath in config could be relative (`./assets/icon.png`, `assets/icon.png`) or even absolute.
 * We need to normalize the path and return as relative path without `./` prefix.
 */ function ensureRelativePath(projectRoot, filePath) {
    const absolutePath = _path().default.resolve(projectRoot, filePath);
    return _path().default.relative(projectRoot, absolutePath);
}
async function createHashSourceExternalFileAsync({ projectRoot, file, reason }) {
    const hashSource = await (0, _Utils.getFileBasedHashSourceAsync)(projectRoot, file, reason);
    if (hashSource) {
        debug(`Adding config external file - ${_chalk().default.dim(file)}`);
        if (hashSource.type === 'file' || hashSource.type === 'dir') {
            // We include the expo config contents in the fingerprint,
            // the `filePath` hashing for the external files is not necessary.
            // Especially people using EAS environment variables for the google service files,
            // the `filePath` will be different between local and remote builds.
            // We use a fixed override hash key and basically ignore the `filePath` hashing.
            hashSource.overrideHashKey = 'expoConfigExternalFile:contentsOnly';
        }
    }
    return hashSource;
}
async function getEasBuildSourcesAsync(projectRoot, options) {
    const files = [
        ...options.sourceSkips & _SourceSkips.SourceSkips.EasJson ? [] : [
            'eas.json'
        ],
        ...options.sourceSkips & _SourceSkips.SourceSkips.Easignore ? [] : [
            '.easignore'
        ]
    ];
    const results = (await Promise.all(files.map(async (file)=>{
        const result = await (0, _Utils.getFileBasedHashSourceAsync)(projectRoot, file, 'easBuild');
        if (result != null) {
            debug(`Adding eas file - ${_chalk().default.dim(file)}`);
        }
        return result;
    }))).filter(Boolean);
    return results;
}
async function getExpoAutolinkingAndroidSourcesAsync(projectRoot, options, expoAutolinkingVersion) {
    if (!options.platforms.includes('android')) {
        return [];
    }
    try {
        const reasons = [
            'expoAutolinkingAndroid'
        ];
        const results = [];
        const realProjectRoot = await (0, _Utils.maybeGetRealPathAsync)(projectRoot);
        const { stdout } = await (0, _spawnasync().default)('node', [
            (0, _ExpoResolver.resolveExpoAutolinkingCliPath)(projectRoot),
            'resolve',
            '-p',
            'android',
            '--json'
        ], {
            cwd: projectRoot,
            env: (0, _env().getOriginalEnv)()
        });
        const config = sortExpoAutolinkingAndroidConfig(JSON.parse(stdout));
        for (const module1 of config.modules){
            for (const project of module1.projects){
                const filePath = (0, _Path.toPosixPath)(_path().default.relative(realProjectRoot, project.sourceDir));
                project.sourceDir = filePath; // use relative path for the dir
                debug(`Adding expo-modules-autolinking android dir - ${_chalk().default.dim(filePath)}`);
                results.push(await (0, _Utils.createAutolinkingHashSourceAsync)(realProjectRoot, filePath, reasons, options.nativeModuleSourceType));
                // `aarProjects` is present in project starting from SDK 53+.
                if (project.aarProjects) {
                    for (const aarProject of project.aarProjects){
                        // use relative path for aarProject fields
                        aarProject.aarFilePath = (0, _Path.toPosixPath)(_path().default.relative(realProjectRoot, aarProject.aarFilePath));
                        aarProject.projectDir = (0, _Path.toPosixPath)(_path().default.relative(realProjectRoot, aarProject.projectDir));
                    }
                }
                if (typeof project.shouldUsePublicationScriptPath === 'string') {
                    project.shouldUsePublicationScriptPath = (0, _Path.toPosixPath)(_path().default.relative(realProjectRoot, project.shouldUsePublicationScriptPath));
                }
            }
            if (module1.plugins) {
                for (const plugin of module1.plugins){
                    // A plugin resolved from Maven by `id` and `version` has no local files to hash.
                    // Its `id` and `version` stay in the `expoAutolinkingConfig:android` contents source.
                    if (plugin.sourceDir == null) {
                        continue;
                    }
                    const filePath = (0, _Path.toPosixPath)(_path().default.relative(realProjectRoot, plugin.sourceDir));
                    plugin.sourceDir = filePath; // use relative path for the dir
                    debug(`Adding expo-modules-autolinking android dir - ${_chalk().default.dim(filePath)}`);
                    results.push(await (0, _Utils.createAutolinkingHashSourceAsync)(realProjectRoot, filePath, reasons, options.nativeModuleSourceType));
                }
            }
            // Backward compatibility for SDK versions earlier than 53
            if (module1.aarProjects) {
                for (const aarProject of module1.aarProjects){
                    // use relative path for aarProject fields
                    aarProject.aarFilePath = (0, _Path.toPosixPath)(_path().default.relative(realProjectRoot, aarProject.aarFilePath));
                    aarProject.projectDir = (0, _Path.toPosixPath)(_path().default.relative(realProjectRoot, aarProject.projectDir));
                }
            }
        }
        results.push({
            type: 'contents',
            id: 'expoAutolinkingConfig:android',
            contents: JSON.stringify((0, _Profile.profile)(options, _AutolinkingConfig.normalizeAutolinkingConfig)(config, {
                stripPaths: !!(options.sourceSkips & _SourceSkips.SourceSkips.AutolinkingConfigPaths),
                roots: [
                    realProjectRoot
                ]
            })),
            reasons
        });
        return results;
    } catch  {
        return [];
    }
}
async function getExpoCNGPatchSourcesAsync(projectRoot, options) {
    const result = await (0, _Utils.getFileBasedHashSourceAsync)(projectRoot, 'cng-patches', 'expoCNGPatches');
    if (result != null) {
        debug(`Adding dir - ${_chalk().default.dim('cng-patches')}`);
        return [
            result
        ];
    }
    return [];
}
async function getExpoAutolinkingIosSourcesAsync(projectRoot, options, expoAutolinkingVersion) {
    if (!options.platforms.includes('ios')) {
        return [];
    }
    // expo-modules-autolinking 1.10.0 added support for apple platform
    const platform = _semver().default.lt(expoAutolinkingVersion, '1.10.0') ? 'ios' : 'apple';
    try {
        const reasons = [
            'expoAutolinkingIos'
        ];
        const results = [];
        const realProjectRoot = await (0, _Utils.maybeGetRealPathAsync)(projectRoot);
        const { stdout } = await (0, _spawnasync().default)('node', [
            (0, _ExpoResolver.resolveExpoAutolinkingCliPath)(projectRoot),
            'resolve',
            '-p',
            platform,
            '--json'
        ], {
            cwd: projectRoot,
            env: (0, _env().getOriginalEnv)()
        });
        const config = JSON.parse(stdout);
        for (const module1 of config.modules){
            for (const pod of module1.pods){
                const filePath = (0, _Path.toPosixPath)(_path().default.relative(realProjectRoot, pod.podspecDir));
                pod.podspecDir = filePath; // use relative path for the dir
                debug(`Adding expo-modules-autolinking ios dir - ${_chalk().default.dim(filePath)}`);
                results.push(await (0, _Utils.createAutolinkingHashSourceAsync)(realProjectRoot, filePath, reasons, options.nativeModuleSourceType));
            }
        }
        results.push({
            type: 'contents',
            id: 'expoAutolinkingConfig:ios',
            contents: JSON.stringify((0, _Profile.profile)(options, _AutolinkingConfig.normalizeAutolinkingConfig)(config, {
                stripPaths: !!(options.sourceSkips & _SourceSkips.SourceSkips.AutolinkingConfigPaths),
                roots: [
                    realProjectRoot
                ]
            })),
            reasons
        });
        return results;
    } catch  {
        return [];
    }
}
function sortExpoAutolinkingAndroidConfig(config) {
    for (const module1 of config.modules){
        // Sort the projects by project.name
        module1.projects.sort((a, b)=>a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
    }
    return config;
}
function getConfigPluginProps(config, pluginName) {
    const plugin = (config.plugins ?? []).find((plugin)=>{
        if (Array.isArray(plugin)) {
            return plugin[0] === pluginName;
        }
        return plugin === pluginName;
    });
    if (Array.isArray(plugin)) {
        return plugin[1] ?? null;
    }
    return null;
}

//# sourceMappingURL=Expo.js.map
