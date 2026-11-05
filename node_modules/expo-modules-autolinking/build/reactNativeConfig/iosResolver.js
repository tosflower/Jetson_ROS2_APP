"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    readPodspecPlatformsAsync: null,
    resolveDependencyConfigImplIosAsync: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get readPodspecPlatformsAsync () {
        return readPodspecPlatformsAsync;
    },
    get resolveDependencyConfigImplIosAsync () {
        return resolveDependencyConfigImplIosAsync;
    }
});
function _promises() {
    const data = /*#__PURE__*/ _interop_require_default(require("fs/promises"));
    _promises = function() {
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
const _utils = require("../utils");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/** Find first *.podspec file in target directory */ const findPodspecFile = async (targetPath)=>{
    const podspecFiles = await (0, _utils.listFilesSorted)(targetPath, (basename)=>{
        return basename.endsWith('.podspec');
    });
    // NOTE(@kitten): Compare case-insensitively against basename of derived name
    const mainBasename = _path().default.basename(targetPath).toLowerCase();
    const mainPodspecFile = podspecFiles.find((podspecFile)=>_path().default.basename(podspecFile, '.podspec').toLowerCase() === mainBasename);
    return mainPodspecFile ?? podspecFiles[0] ?? null;
};
/** The CocoaPods platform name of each Apple platform that autolinking reports. */ const PODSPEC_PLATFORM_NAMES = {
    ios: 'ios',
    tvos: 'tvos',
    macos: 'osx'
};
async function readPodspecPlatformsAsync(podspecPath) {
    let contents;
    try {
        contents = await _promises().default.readFile(podspecPath, 'utf8');
    } catch  {
        return null;
    }
    const code = contents.replace(/^\s*#.*$/gm, '');
    const platforms = new Set();
    const names = 'ios|osx|tvos|visionos|watchos';
    for (const re of [
        new RegExp(`:(${names})\\b`, 'g'),
        new RegExp(`(?<![\\w:.])(${names}):(?!:)`, 'g'),
        new RegExp(`\\.(${names})\\.(?:deployment_target|exclude_files|source_files|frameworks|dependency|resource_bundles|resources|vendored_frameworks|pod_target_xcconfig)\\b`, 'g')
    ]){
        for (const match of code.matchAll(re)){
            platforms.add(match[1]);
        }
    }
    return platforms.size > 0 ? platforms : null;
}
async function resolveDependencyConfigImplIosAsync(resolution, reactNativeConfig, expoModuleConfig, options) {
    if (reactNativeConfig === null) {
        // Skip autolinking for this package.
        return null;
    }
    const podspecPath = await findPodspecFile(resolution.path);
    if (!podspecPath) {
        return null;
    }
    const platform = options?.platform;
    if (platform && platform !== 'ios') {
        const declaredPlatforms = await readPodspecPlatformsAsync(podspecPath);
        if (declaredPlatforms && !declaredPlatforms.has(PODSPEC_PLATFORM_NAMES[platform])) {
            return null;
        }
    }
    if (reactNativeConfig === undefined && expoModuleConfig?.supportsPlatform('apple')) {
        // Check if Expo podspec files contain the React Native podspec file
        const overlappingPodspecPath = expoModuleConfig.applePodspecPaths().find((targetFile)=>{
            const expoPodspecPath = _path().default.normalize(_path().default.join(resolution.path, targetFile));
            return expoPodspecPath === _path().default.normalize(podspecPath);
        });
        // NOTE(@kitten): If we don't have a react-native.config.{js,ts} file and the
        // package is also an Expo module, we only link it as a React Native module
        // if both don't point at the same podspec file
        if (overlappingPodspecPath != null) {
            return null;
        }
    }
    return {
        podspecPath,
        version: resolution.version,
        configurations: reactNativeConfig?.configurations || [],
        scriptPhases: reactNativeConfig?.scriptPhases || []
    };
}

//# sourceMappingURL=iosResolver.js.map
