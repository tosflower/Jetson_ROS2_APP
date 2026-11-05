"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "scanDependenciesFromRNProjectConfig", {
    enumerable: true,
    get: function() {
        return scanDependenciesFromRNProjectConfig;
    }
});
function _path() {
    const data = /*#__PURE__*/ _interop_require_default(require("path"));
    _path = function() {
        return data;
    };
    return data;
}
const _concurrency = require("../concurrency");
const _utils = require("../utils");
const _types = require("./types");
const _utils1 = require("./utils");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function scanDependenciesFromRNProjectConfig(rawPath, projectConfig, { shouldIncludeDependency = _utils1.defaultShouldIncludeDependency } = {}) {
    const rootPath = await (0, _utils.maybeRealpath)(rawPath);
    const searchResults = Object.create(null);
    if (!rootPath || !projectConfig || !projectConfig.dependencies) {
        return searchResults;
    }
    await (0, _concurrency.taskAll)(Object.keys(projectConfig.dependencies).filter((dependencyName)=>shouldIncludeDependency(dependencyName)), async (dependencyName)=>{
        const dependencyConfig = projectConfig.dependencies[dependencyName];
        if (dependencyConfig && dependencyConfig.root && typeof dependencyConfig.root === 'string') {
            const originPath = _path().default.resolve(rootPath, dependencyConfig.root);
            const realPath = await (0, _utils.maybeRealpath)(originPath);
            if (realPath) {
                searchResults[dependencyName] = {
                    source: _types.DependencyResolutionSource.RN_CLI_LOCAL,
                    name: dependencyName,
                    version: '',
                    path: realPath,
                    originPath,
                    duplicates: null,
                    depth: 0
                };
            }
        }
    });
    return searchResults;
}

//# sourceMappingURL=rncliLocal.js.map
