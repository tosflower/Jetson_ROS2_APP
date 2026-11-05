"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
function _chalk() {
    const data = /*#__PURE__*/ _interop_require_default(require("chalk"));
    _chalk = function() {
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function resolveBuildCacheAsync({ projectRoot, platform, fingerprintHash, runOptions }, options = {}) {
    const cacheDir = resolveCacheDir(projectRoot, options);
    if (!_fs().default.existsSync(cacheDir)) {
        console.debug('Local build cache directory does not exist, skipping check');
        return null;
    }
    const files = await _fs().default.promises.readdir(cacheDir);
    const expectedFile = `${platform}-${fingerprintHash}-${getBuildVariant(runOptions)}`;
    const file = files.find((file)=>file.includes(expectedFile));
    if (!file) {
        console.debug('No matching builds found in local cache, starting build process');
        return null;
    }
    return _path().default.join(cacheDir, file);
}
async function uploadBuildCacheAsync({ projectRoot, platform, fingerprintHash, buildPath, runOptions }, options = {}) {
    const cacheDir = resolveCacheDir(projectRoot, options);
    if (!_fs().default.existsSync(cacheDir)) {
        console.debug('Build cache directory does not exist, creating build cache folder at:', cacheDir);
        await _fs().default.promises.mkdir(cacheDir, {
            recursive: true
        });
    }
    try {
        console.log((0, _chalk().default)`{whiteBright \u203A} {bold Copying build to local cache}`);
        const destFile = `${platform}-${fingerprintHash}-${getBuildVariant(runOptions)}${_path().default.extname(buildPath)}`;
        const destPath = _path().default.join(cacheDir, destFile);
        // Remove existing cache entry if it exists.
        if (_fs().default.existsSync(destPath)) {
            await _fs().default.promises.rm(destPath, {
                recursive: true,
                force: true
            });
        }
        const stats = await _fs().default.promises.stat(buildPath);
        // iOS builds are usually directories, Android builds are usually files.
        if (stats.isDirectory()) {
            await _fs().default.promises.cp(buildPath, destPath, {
                recursive: true
            });
        } else if (stats.isFile()) {
            await _fs().default.promises.copyFile(buildPath, destPath);
        } else {
            console.debug('Unsupported build artifact type for caching:', buildPath);
            return null;
        }
        return destPath;
    } catch (error) {
        console.debug(' error:', error);
    }
    return null;
}
function resolveCacheDir(projectRoot, options) {
    return options?.cacheDir ?? _path().default.join(projectRoot, '.expo', 'build-cache');
}
function getBuildVariant(runOptions) {
    if ('variant' in runOptions && runOptions.variant !== undefined) {
        return runOptions.variant;
    }
    if ('configuration' in runOptions && runOptions.configuration !== undefined) {
        return runOptions.configuration;
    }
    return 'unknown';
}
const LocalBuildCacheProvider = {
    resolveBuildCache: resolveBuildCacheAsync,
    uploadBuildCache: uploadBuildCacheAsync
};
const _default = LocalBuildCacheProvider;

//# sourceMappingURL=index.js.map
