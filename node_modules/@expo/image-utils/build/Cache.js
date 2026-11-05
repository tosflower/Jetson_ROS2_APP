"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    cacheImageAsync: null,
    clearUnusedCachesAsync: null,
    createCacheKey: null,
    createCacheKeyWithDirectoryAsync: null,
    ensureCacheDirectory: null,
    getImageFromCacheAsync: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get cacheImageAsync () {
        return cacheImageAsync;
    },
    get clearUnusedCachesAsync () {
        return clearUnusedCachesAsync;
    },
    get createCacheKey () {
        return createCacheKey;
    },
    get createCacheKeyWithDirectoryAsync () {
        return createCacheKeyWithDirectoryAsync;
    },
    get ensureCacheDirectory () {
        return ensureCacheDirectory;
    },
    get getImageFromCacheAsync () {
        return getImageFromCacheAsync;
    }
});
function _crypto() {
    const data = /*#__PURE__*/ _interop_require_default(require("crypto"));
    _crypto = function() {
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
    const data = require("path");
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
const CACHE_LOCATION = '.expo/web/cache/production/images';
const cacheKeys = {};
// Calculate SHA256 Checksum value of a file based on its contents
function calculateHash(filePath) {
    const contents = filePath.startsWith('http') ? filePath : _fs().default.readFileSync(filePath);
    return _crypto().default.createHash('sha256').update(contents).digest('hex');
}
function createCacheKey(fileSource, properties) {
    const hash = calculateHash(fileSource);
    return [
        hash
    ].concat(properties).filter(Boolean).join('-');
}
async function createCacheKeyWithDirectoryAsync(projectRoot, type, icon) {
    const iconProperties = [
        icon.resizeMode
    ];
    if (icon.backgroundColor) {
        iconProperties.push(icon.backgroundColor);
    }
    const cacheKey = `${type}-${createCacheKey(icon.src, iconProperties)}`;
    if (!(cacheKey in cacheKeys)) {
        cacheKeys[cacheKey] = await ensureCacheDirectory(projectRoot, type, cacheKey);
    }
    return cacheKey;
}
async function ensureCacheDirectory(projectRoot, type, cacheKey) {
    const cacheFolder = (0, _path().join)(projectRoot, CACHE_LOCATION, type, cacheKey);
    await _fs().default.promises.mkdir(cacheFolder, {
        recursive: true
    });
    return cacheFolder;
}
async function getImageFromCacheAsync(fileName, cacheKey) {
    try {
        const cachedKey = cacheKeys[cacheKey];
        return await _fs().default.promises.readFile(cachedKey != null ? (0, _path().resolve)(cachedKey, fileName) : (0, _path().resolve)(fileName));
    } catch  {
        return null;
    }
}
async function cacheImageAsync(fileName, buffer, cacheKey) {
    try {
        const cachedKey = cacheKeys[cacheKey];
        await _fs().default.promises.writeFile(cachedKey != null ? (0, _path().resolve)(cachedKey, fileName) : (0, _path().resolve)(fileName), buffer);
    } catch (error) {
        console.warn(`Error caching image: "${fileName}". ${error.message}`);
    }
}
async function clearUnusedCachesAsync(projectRoot, type) {
    // Clean up any old caches
    const cacheFolder = (0, _path().join)(projectRoot, CACHE_LOCATION, type);
    await _fs().default.promises.mkdir(cacheFolder, {
        recursive: true
    });
    const currentCaches = await _fs().default.promises.readdir(cacheFolder);
    if (!Array.isArray(currentCaches)) {
        console.warn('Failed to read the icon cache');
        return;
    }
    const deleteCachePromises = [];
    for (const cache of currentCaches){
        // skip hidden folders
        if (cache.startsWith('.')) {
            continue;
        }
        // delete
        if (!(cache in cacheKeys)) {
            deleteCachePromises.push(_fs().default.promises.rm((0, _path().join)(cacheFolder, cache), {
                force: true,
                recursive: true
            }));
        }
    }
    await Promise.all(deleteCachePromises);
}

//# sourceMappingURL=Cache.js.map
