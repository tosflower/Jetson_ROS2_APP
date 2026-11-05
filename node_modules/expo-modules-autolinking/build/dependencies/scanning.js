"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    mockDependencyAtPath: null,
    scanDependenciesInSearchPath: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get mockDependencyAtPath () {
        return mockDependencyAtPath;
    },
    get scanDependenciesInSearchPath () {
        return scanDependenciesInSearchPath;
    }
});
function _fs() {
    const data = /*#__PURE__*/ _interop_require_default(require("fs"));
    _fs = function() {
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
async function resolveDependency(basePath, dependencyName, shouldIncludeDependency) {
    if (dependencyName && !shouldIncludeDependency(dependencyName)) {
        return null;
    }
    const originPath = dependencyName ? (0, _utils.fastJoin)(basePath, dependencyName) : basePath;
    const realPath = await (0, _utils.maybeRealpath)(originPath);
    const packageJson = await (0, _utils.loadPackageJson)((0, _utils.fastJoin)(realPath || originPath, 'package.json'));
    if (packageJson) {
        return {
            source: _types.DependencyResolutionSource.SEARCH_PATH,
            name: packageJson.name || '',
            version: packageJson.version || '',
            path: realPath || originPath,
            originPath,
            duplicates: null,
            depth: 0
        };
    } else if (dependencyName && realPath) {
        return {
            source: _types.DependencyResolutionSource.SEARCH_PATH,
            name: dependencyName.toLowerCase(),
            version: '',
            path: realPath,
            originPath,
            duplicates: null,
            depth: 0
        };
    } else {
        return null;
    }
}
async function mockDependencyAtPath(originPath) {
    const realPath = await (0, _utils.maybeRealpath)(originPath);
    const packageJson = await (0, _utils.loadPackageJson)((0, _utils.fastJoin)(realPath || originPath, 'package.json'));
    return {
        source: _types.DependencyResolutionSource.SEARCH_PATH,
        name: packageJson?.name || 'local-module',
        version: packageJson?.version ?? '',
        path: realPath ?? originPath,
        originPath,
        duplicates: null,
        depth: 0
    };
}
async function scanDependenciesInSearchPath(rawPath, { shouldIncludeDependency = _utils1.defaultShouldIncludeDependency } = {}) {
    const rootPath = await (0, _utils.maybeRealpath)(rawPath);
    const searchResults = Object.create(null);
    if (!rootPath) {
        return searchResults;
    }
    const resolvedDependencies = [];
    const localModuleTarget = await (0, _utils.maybeRealpath)((0, _utils.fastJoin)(rootPath, 'package.json'));
    if (localModuleTarget) {
        // If we have a `package.json` file in the search path, we're already dealing with a node module
        // and can skip the rest. This is a special case created by create-expo-module's `nativeModulesDir: ../`
        const resolution = await resolveDependency(rootPath, null, shouldIncludeDependency);
        if (resolution) resolvedDependencies.push(resolution);
    } else {
        const dirents = await _fs().default.promises.readdir(rootPath, {
            withFileTypes: true
        });
        await (0, _concurrency.taskAll)(dirents, async (entry)=>{
            if (entry.isSymbolicLink()) {
                const resolution = await resolveDependency(rootPath, entry.name, shouldIncludeDependency);
                if (resolution) resolvedDependencies.push(resolution);
            } else if (entry.isDirectory()) {
                if (entry.name === 'node_modules') {
                // Ignore nested node_modules folder
                }
                if (entry.name[0] === '.') {
                // Ignore hidden folders
                } else if (entry.name[0] === '@') {
                    // NOTE: We don't expect @-scope folders to be symlinks
                    const entryPath = (0, _utils.fastJoin)(rootPath, entry.name);
                    const childEntries = await _fs().default.promises.readdir(entryPath, {
                        withFileTypes: true
                    });
                    await Promise.all(childEntries.map(async (child)=>{
                        const dependencyName = `${entry.name}/${child.name}`;
                        if (child.isDirectory() || child.isSymbolicLink()) {
                            const resolution = await resolveDependency(rootPath, dependencyName, shouldIncludeDependency);
                            if (resolution) resolvedDependencies.push(resolution);
                        }
                    }));
                } else {
                    const resolution = await resolveDependency(rootPath, entry.name, shouldIncludeDependency);
                    if (resolution) resolvedDependencies.push(resolution);
                }
            }
        });
    }
    for (const resolution of resolvedDependencies){
        const prevEntry = searchResults[resolution.name];
        if (prevEntry != null && resolution.path !== prevEntry.path) {
            (prevEntry.duplicates ?? (prevEntry.duplicates = [])).push({
                name: resolution.name,
                version: resolution.version,
                path: resolution.path,
                originPath: resolution.originPath
            });
        } else if (prevEntry == null) {
            searchResults[resolution.name] = resolution;
        }
    }
    return searchResults;
}

//# sourceMappingURL=scanning.js.map
