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
        return DependencyPlugin;
    }
});
const _workerExclusionList = /*#__PURE__*/ _interop_require_default(require("../workerExclusionList"));
const _FileDataPlugin = /*#__PURE__*/ _interop_require_default(require("./FileDataPlugin"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
class DependencyPlugin extends _FileDataPlugin.default {
    constructor(options){
        const { dependencyExtractor, computeDependencies } = options;
        let cacheKey;
        if (dependencyExtractor != null) {
            const mod = require(dependencyExtractor);
            const getCacheKey = mod?.getCacheKey ?? (mod.__esModule === true && 'default' in mod ? mod.default : mod).getCacheKey;
            cacheKey = getCacheKey?.() ?? dependencyExtractor;
        } else {
            cacheKey = 'default-dependency-extractor';
        }
        super({
            name: 'dependencies',
            cacheKey,
            worker: {
                modulePath: require.resolve('./dependencies/worker'),
                setupArgs: {
                    dependencyExtractor: dependencyExtractor ?? null
                }
            },
            filter: ({ normalPath, isNodeModules })=>{
                if (!computeDependencies) {
                    return false;
                }
                if (isNodeModules) {
                    return false;
                }
                const ext = normalPath.substr(normalPath.lastIndexOf('.'));
                return !_workerExclusionList.default.has(ext);
            }
        });
    }
    /**
   * Get the list of dependencies for a given file.
   * @param mixedPath Absolute or project-relative path to the file
   * @returns Array of dependency module names, or null if the file doesn't exist
   */ getDependencies(mixedPath) {
        const result = this.getFileSystem().lookup(mixedPath);
        if (result.exists && result.type === 'f') {
            return result.pluginData ?? [];
        }
        return null;
    }
}

//# sourceMappingURL=DependencyPlugin.js.map
