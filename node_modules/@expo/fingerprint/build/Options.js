"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    DEFAULT_IGNORE_PATHS: null,
    DEFAULT_SOURCE_SKIPS: null,
    FINGERPRINT_IGNORE_FILENAME: null,
    normalizeOptionsAsync: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get DEFAULT_IGNORE_PATHS () {
        return DEFAULT_IGNORE_PATHS;
    },
    get DEFAULT_SOURCE_SKIPS () {
        return DEFAULT_SOURCE_SKIPS;
    },
    get FINGERPRINT_IGNORE_FILENAME () {
        return FINGERPRINT_IGNORE_FILENAME;
    },
    get normalizeOptionsAsync () {
        return normalizeOptionsAsync;
    }
});
function _promises() {
    const data = /*#__PURE__*/ _interop_require_default(require("fs/promises"));
    _promises = function() {
        return data;
    };
    return data;
}
function _os() {
    const data = /*#__PURE__*/ _interop_require_default(require("os"));
    _os = function() {
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
const _Config = require("./Config");
const _ExpoResolver = require("./ExpoResolver");
const _Presets = require("./Presets");
const _ProjectWorkflow = require("./ProjectWorkflow");
const _Path = require("./utils/Path");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const FINGERPRINT_IGNORE_FILENAME = '.fingerprintignore';
const DEFAULT_IGNORE_PATHS = [
    FINGERPRINT_IGNORE_FILENAME,
    // Android
    '**/android/build/**/*',
    '**/android/.cxx/**/*',
    '**/android/.gradle/**/*',
    '**/android/app/build/**/*',
    '**/android/app/.cxx/**/*',
    '**/android/app/.gradle/**/*',
    '**/android-annotation/build/**/*',
    '**/android-annotation/.cxx/**/*',
    '**/android-annotation/.gradle/**/*',
    '**/android-annotation-processor/build/**/*',
    '**/android-annotation-processor/.cxx/**/*',
    '**/android-annotation-processor/.gradle/**/*',
    // Often has different line endings, thus we have to ignore it
    '**/android/gradlew.bat',
    // Android gradle plugins
    '**/*-gradle-plugin/build/**/*',
    '**/*-gradle-plugin/.cxx/**/*',
    '**/*-gradle-plugin/.gradle/**/*',
    // iOS
    '**/ios/Pods/**/*',
    '**/ios/build/**/*',
    '**/ios/.xcode.env.local',
    '**/ios/**/project.xcworkspace',
    '**/ios/*.xcworkspace/xcuserdata/**/*',
    '**/.swiftpm/**/*',
    // System files that differ from machine to machine
    '**/.DS_Store',
    // Ignore all expo configs because we will read expo config in a HashSourceContents already
    'app.config.ts',
    'app.config.js',
    'app.config.json',
    'app.json',
    // Ignore CocoaPods generated files
    // https://github.com/expo/expo/blob/d0e39858ead9a194d90990f89903e773b9d33582/packages/expo-sqlite/ios/ExpoSQLite.podspec#L25-L36
    // https://github.com/expo/expo/blob/d0e39858ead9a194d90990f89903e773b9d33582/packages/expo-updates/ios/EXUpdates.podspec#L51-L58
    '**/node_modules/expo-sqlite/ios/sqlite3.[ch]',
    '**/node_modules/expo-updates/ios/EXUpdates/BSPatch/bspatch.c',
    // expo-modules-jsi has build artifacts
    '**/node_modules/expo-modules-jsi/apple/{Products,.build,.DerivedData,.generated}/**/*',
    // Ignore node binaries that might be platform dependent
    '**/node_modules/**/*.node',
    '**/node_modules/@img/sharp-*/**/*',
    '**/node_modules/sharp/{build,vendor}/**/*',
    // Precompiled autolinking patches for external packages
    '**/node_modules/**/*.podspec.json',
    // Ignore known 3rd party binaries artifacts
    // It happens mostly on iOS because the autolinking root is the whole package root as its podspec
    '**/node_modules/@shopify/react-native-skia/libs/**/*'
];
const DEFAULT_SOURCE_SKIPS = (0, _Presets.resolvePreset)(_Presets.DEFAULT_PRESET).sourceSkips;
async function normalizeOptionsAsync(projectRoot, options) {
    const config = await (0, _Config.loadConfigAsync)(projectRoot, options?.silent ?? false);
    const preset = (0, _Presets.resolvePreset)(options?.preset ?? config?.preset ?? _Presets.DEFAULT_PRESET);
    const ignorePathMatchObjects = await collectIgnorePathsAsync(projectRoot, config?.ignorePaths, options);
    const useCNGForPlatforms = await resolveUseCNGAsync(projectRoot, options, ignorePathMatchObjects);
    if (useCNGForPlatforms.android) {
        (0, _Path.appendIgnorePath)(ignorePathMatchObjects, 'android/**/*');
    }
    if (useCNGForPlatforms.ios) {
        (0, _Path.appendIgnorePath)(ignorePathMatchObjects, 'ios/**/*');
    }
    return {
        // Defaults, derived from the resolved preset
        platforms: [
            'android',
            'ios'
        ],
        concurrentIoLimit: _os().default.cpus().length,
        hashAlgorithm: 'sha1',
        sourceSkips: preset.sourceSkips,
        nativeModuleSourceType: preset.nativeModuleSourceType,
        configPluginSourceType: preset.configPluginSourceType,
        // Options from config
        ...config,
        // Explicit options (any explicitly provided value replaces the preset default)
        ...Object.fromEntries(Object.entries(options ?? {}).filter(([_, v])=>v != null)),
        // These options are computed by both default and explicit options, so we put them last.
        enableReactImportsPatcher: options?.enableReactImportsPatcher ?? config?.enableReactImportsPatcher ?? (0, _ExpoResolver.satisfyExpoVersion)(projectRoot, '<52.0.0') ?? false,
        ignorePathMatchObjects,
        ignoreDirMatchObjects: (0, _Path.buildDirMatchObjects)(ignorePathMatchObjects),
        useCNGForPlatforms
    };
}
async function collectIgnorePathsAsync(projectRoot, pathsFromConfig, options) {
    const ignorePaths = [
        ...DEFAULT_IGNORE_PATHS,
        ...pathsFromConfig ?? [],
        ...options?.ignorePaths ?? [],
        ...options?.dirExcludes?.map((dirExclude)=>`${dirExclude}/**/*`) ?? []
    ];
    const fingerprintIgnorePath = _path().default.join(projectRoot, FINGERPRINT_IGNORE_FILENAME);
    try {
        const fingerprintIgnore = await _promises().default.readFile(fingerprintIgnorePath, 'utf8');
        const fingerprintIgnoreLines = fingerprintIgnore.split('\n');
        for (const line of fingerprintIgnoreLines){
            const trimmedLine = line.trim();
            if (trimmedLine) {
                ignorePaths.push(trimmedLine);
            }
        }
    } catch  {}
    return (0, _Path.buildPathMatchObjects)(ignorePaths);
}
async function resolveUseCNGAsync(projectRoot, options, ignorePathMatchObjects) {
    const results = {
        android: false,
        ios: false
    };
    const platforms = options?.platforms ?? [
        'android',
        'ios'
    ];
    for (const platform of platforms){
        const projectWorkflow = await (0, _ProjectWorkflow.resolveProjectWorkflowAsync)(projectRoot, platform, ignorePathMatchObjects);
        results[platform] = projectWorkflow === 'managed';
    }
    return results;
}

//# sourceMappingURL=Options.js.map
