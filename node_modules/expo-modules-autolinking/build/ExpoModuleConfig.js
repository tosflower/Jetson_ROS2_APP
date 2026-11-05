"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ExpoAndroidModuleConfig: null,
    ExpoAndroidProjectConfig: null,
    ExpoModuleConfig: null,
    discoverExpoModuleConfigAsync: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ExpoAndroidModuleConfig () {
        return ExpoAndroidModuleConfig;
    },
    get ExpoAndroidProjectConfig () {
        return ExpoAndroidProjectConfig;
    },
    get ExpoModuleConfig () {
        return ExpoModuleConfig;
    },
    get discoverExpoModuleConfigAsync () {
        return discoverExpoModuleConfigAsync;
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
const _memoize = require("./memoize");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function arrayize(value) {
    if (Array.isArray(value)) {
        return value;
    }
    return value != null ? [
        value
    ] : [];
}
class ExpoAndroidModuleConfig {
    classifier;
    name;
    constructor(classifier, name){
        this.classifier = classifier;
        this.name = name;
    }
}
class ExpoAndroidProjectConfig {
    name;
    path;
    modules;
    services;
    publication;
    gradleAarProjects;
    shouldUsePublicationScriptPath;
    isDefault;
    constructor(name, path, modules, services, publication, gradleAarProjects, shouldUsePublicationScriptPath, /**
     * Whether this project is the root one.
     */ isDefault = false){
        this.name = name;
        this.path = path;
        this.modules = modules;
        this.services = services;
        this.publication = publication;
        this.gradleAarProjects = gradleAarProjects;
        this.shouldUsePublicationScriptPath = shouldUsePublicationScriptPath;
        this.isDefault = isDefault;
    }
}
class ExpoModuleConfig {
    rawConfig;
    constructor(rawConfig){
        this.rawConfig = rawConfig;
    }
    /**
   * Whether the module supports given platform.
   */ supportsPlatform(platform) {
        const supportedPlatforms = this.rawConfig.platforms ?? [];
        if (platform === 'web') {
            // Web platform is implicitly supported for autolinking resolution but has no special behavior
            return true;
        } else if (platform === 'apple') {
            // Apple platform is supported when any of iOS, macOS and tvOS is supported.
            return supportedPlatforms.some((supportedPlatform)=>{
                return supportedPlatform === 'apple' || (0, _platforms().isAppleTargetPlatform)(supportedPlatform);
            });
        }
        if ((0, _platforms().isAppleTargetPlatform)(platform)) {
            // ios|macos|tvos are supported when the module supports "apple" as a platform in general
            return supportedPlatforms.includes(platform) || supportedPlatforms.includes('apple');
        }
        return supportedPlatforms.includes(platform);
    }
    /**
   * Returns the generic config for all Apple platforms with a fallback to the legacy iOS config.
   */ getAppleConfig() {
        return this.rawConfig.apple ?? this.rawConfig.ios ?? null;
    }
    /**
   * Returns a list of names of Swift native modules classes to put to the generated modules provider file.
   */ appleModules() {
        const appleConfig = this.getAppleConfig();
        return appleConfig?.modules ?? [];
    }
    /** Whether the config declares the Apple modules list. Even an empty list disables scanning. */ declaresAppleModules() {
        return this.getAppleConfig()?.modules != null;
    }
    /**
   * Returns a list of names of Swift classes that receives AppDelegate life-cycle events.
   */ appleAppDelegateSubscribers() {
        return this.getAppleConfig()?.appDelegateSubscribers ?? [];
    }
    /**
   * Returns a list of names of Swift classes that implement `ExpoReactDelegateHandler`.
   */ appleReactDelegateHandlers() {
        return this.getAppleConfig()?.reactDelegateHandlers ?? [];
    }
    /**
   * Returns podspec paths defined by the module author.
   */ applePodspecPaths() {
        return arrayize(this.getAppleConfig()?.podspecPath);
    }
    /**
   * Returns the product module names, if defined by the module author.
   */ appleSwiftModuleNames() {
        return arrayize(this.getAppleConfig()?.swiftModuleName);
    }
    /**
   * Returns whether this module will be added only to the debug configuration
   */ appleDebugOnly() {
        return this.getAppleConfig()?.debugOnly ?? false;
    }
    /**
   * Returns information about Android projects defined by the module author.
   */ androidProjects(defaultProjectName) {
        const androidProjects = [];
        // Adding the "root" Android project - it might not be valid.
        androidProjects.push(new ExpoAndroidProjectConfig(this.rawConfig.android?.name ?? defaultProjectName, this.rawConfig.android?.path ?? 'android', this.rawConfig.android?.modules?.map((module1)=>typeof module1 === 'string' ? new ExpoAndroidModuleConfig(module1, null) : new ExpoAndroidModuleConfig(module1.class, module1.name)), this.rawConfig.android?.services, this.rawConfig.android?.publication, this.rawConfig.android?.gradleAarProjects, this.rawConfig.android?.shouldUsePublicationScriptPath, !this.rawConfig.android?.path // it's default project because path is not defined
        ));
        this.rawConfig.android?.projects?.forEach((project)=>{
            androidProjects.push(new ExpoAndroidProjectConfig(project.name, project.path, project.modules?.map((module1)=>typeof module1 === 'string' ? new ExpoAndroidModuleConfig(module1, null) : new ExpoAndroidModuleConfig(module1.class, module1.name)), project.services, project.publication, project.gradleAarProjects, project.shouldUsePublicationScriptPath));
        });
        return androidProjects;
    }
    /**
   * Returns gradle plugins descriptors defined by the module author.
   */ androidGradlePlugins() {
        return arrayize(this.rawConfig.android?.gradlePlugins ?? []);
    }
    /**
   * Returns gradle projects containing AAR files defined by the module author.
   */ androidGradleAarProjects() {
        return arrayize(this.rawConfig.android?.gradleAarProjects ?? []);
    }
    /**
   * Returns the publication config for Android.
   */ androidPublication() {
        return this.rawConfig.android?.publication;
    }
    /**
   * Returns core features required by the module author.
   */ coreFeatures() {
        return arrayize(this.rawConfig.coreFeatures ?? []);
    }
    /**
   * Returns serializable raw config.
   */ toJSON() {
        return this.rawConfig;
    }
}
/** Names of Expo Module config files (highest to lowest priority) */ const EXPO_MODULE_CONFIG_FILENAMES = [
    'expo-module.config.json',
    'unimodule.json'
];
const discoverExpoModuleConfigAsync = (0, _memoize.memoize)(async function discoverExpoModuleConfigAsync(directoryPath) {
    for(let idx = 0; idx < EXPO_MODULE_CONFIG_FILENAMES.length; idx++){
        // TODO: Validate the raw config against a schema.
        // TODO: Support for `*.js` files, not only static `*.json`.
        const targetPath = _path().default.join(directoryPath, EXPO_MODULE_CONFIG_FILENAMES[idx] ?? '');
        let text;
        try {
            text = await _fs().default.promises.readFile(targetPath, 'utf8');
        } catch  {
            continue;
        }
        return new ExpoModuleConfig(JSON.parse(text));
    }
    return null;
});

//# sourceMappingURL=ExpoModuleConfig.js.map
