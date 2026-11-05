/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return rootRelativeCacheKeys;
    }
});
function _crypto() {
    const data = require("crypto");
    _crypto = function() {
        return data;
    };
    return data;
}
const _RootPathUtils = require("./RootPathUtils");
const _normalizePathSeparatorsToPosix = /*#__PURE__*/ _interop_require_default(require("./normalizePathSeparatorsToPosix"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function rootRelativeCacheKeys(buildParameters) {
    const { rootDir, plugins, ...otherParameters } = buildParameters;
    const rootDirHash = (0, _crypto().createHash)('md5').update((0, _normalizePathSeparatorsToPosix.default)(rootDir)).digest('hex');
    const pathUtils = new _RootPathUtils.RootPathUtils(rootDir);
    const cacheComponents = Object.keys(otherParameters).sort().map((key)=>{
        switch(key){
            case 'roots':
                return buildParameters[key].map((root)=>(0, _normalizePathSeparatorsToPosix.default)(pathUtils.absoluteToNormal(root)));
            case 'cacheBreaker':
            case 'extensions':
            case 'computeSha1':
            case 'enableSymlinks':
            case 'retainAllFiles':
                return buildParameters[key] ?? null;
            case 'ignorePattern':
                return buildParameters[key]?.toString() ?? null;
            default:
                key;
                throw new Error('Unrecognised key in build parameters: ' + key);
        }
    });
    for (const plugin of plugins){
        cacheComponents.push(plugin.getCacheKey());
    }
    // JSON.stringify is stable here because we only deal in (nested) arrays of
    // primitives. Use a different approach if this is expanded to include
    // objects/Sets/Maps, etc.
    const relativeConfigHash = (0, _crypto().createHash)('md5').update(JSON.stringify(cacheComponents)).digest('hex');
    return {
        rootDirHash,
        relativeConfigHash
    };
}

//# sourceMappingURL=rootRelativeCacheKeys.js.map
