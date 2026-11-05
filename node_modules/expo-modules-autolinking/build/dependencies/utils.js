"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    defaultShouldIncludeDependency: null,
    filterMapResolutionResult: null,
    mergeResolutionResults: null,
    mergeWithDuplicate: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get defaultShouldIncludeDependency () {
        return defaultShouldIncludeDependency;
    },
    get filterMapResolutionResult () {
        return filterMapResolutionResult;
    },
    get mergeResolutionResults () {
        return mergeResolutionResults;
    },
    get mergeWithDuplicate () {
        return mergeWithDuplicate;
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
const _types = require("./types");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const NODE_MODULES_PATTERN = `${_path().default.sep}node_modules${_path().default.sep}`;
function defaultShouldIncludeDependency(dependencyName) {
    const scopeName = dependencyName[0] === '@' ? dependencyName.slice(1, dependencyName.indexOf('/')) : null;
    if (scopeName === 'babel' || scopeName === 'types' || scopeName === 'eslint' || scopeName === 'typescript-eslint' || scopeName === 'testing-library' || scopeName === 'aws-crypto' || scopeName === 'aws-sdk') {
        return false;
    }
    switch(dependencyName){
        case '@expo/cli':
        case '@expo/config':
        case '@expo/metro-config':
        case '@expo/package-manager':
        case '@expo/prebuild-config':
        case '@expo/webpack-config':
        case '@expo/env':
        case '@react-native/codegen':
        case '@react-native/community-cli-plugin':
        case 'eslint':
        case 'eslint-config-expo':
        case 'eslint-plugin-expo':
        case 'eslint-plugin-import':
        case 'jest-expo':
        case 'jest':
        case 'metro':
        case 'ts-node':
        case 'typescript':
        case 'webpack':
            return false;
        default:
            return true;
    }
}
function mergeWithDuplicate(a, b) {
    let target;
    let duplicate;
    if (a.depth < b.depth) {
        target = a;
        duplicate = b;
    } else if (b.depth < a.depth) {
        target = b;
        duplicate = a;
    } else {
        // If both are equal, then the shallowest path wins
        const pathDepthA = a.originPath.split(NODE_MODULES_PATTERN).length;
        const pathDepthB = b.originPath.split(NODE_MODULES_PATTERN).length;
        if (pathDepthA < pathDepthB) {
            target = a;
            duplicate = b;
        } else if (pathDepthB < pathDepthA) {
            target = b;
            duplicate = a;
        } else if (b.source < a.source) {
            target = b;
            duplicate = a;
        } else if (b.originPath < a.originPath) {
            target = b;
            duplicate = a;
        } else {
            target = a;
            duplicate = b;
        }
    }
    const duplicates = target.duplicates || (target.duplicates = []);
    if (target.path !== duplicate.path) {
        if (duplicates.every((parent)=>parent.path !== duplicate.path)) {
            duplicates.push({
                name: duplicate.name,
                version: duplicate.version,
                path: duplicate.path,
                originPath: duplicate.originPath
            });
        }
    } else if (!target.version && duplicate.version) {
        target.version = duplicate.version;
    }
    for (const child of duplicate.duplicates ?? []){
        if (child.path === target.path || duplicates.some((existing)=>existing.path === child.path)) {
            continue;
        }
        duplicates.push(child);
    }
    return target;
}
async function filterMapResolutionResult(results, filterMap) {
    const resolutions = await (0, _concurrency.taskAll)(Object.keys(results), async (key)=>{
        const resolution = results[key];
        const result = resolution ? await filterMap(resolution) : null;
        // If we failed to find a matching resolution from `searchPaths`, also try the other duplicates
        // to see if the `searchPaths` result is not a module but another is
        if (resolution?.source === _types.DependencyResolutionSource.SEARCH_PATH && !result) {
            for(let idx = 0; resolution.duplicates && idx < resolution.duplicates.length; idx++){
                const duplicate = resolution.duplicates[idx];
                const duplicateResult = await filterMap({
                    ...resolution,
                    ...duplicate
                });
                if (duplicateResult != null) {
                    return duplicateResult;
                }
            }
        }
        return result;
    });
    const output = Object.create(null);
    for(let idx = 0; idx < resolutions.length; idx++){
        const resolution = resolutions[idx];
        if (resolution != null) {
            output[resolution.name] = resolution;
        }
    }
    return output;
}
function mergeResolutionResults(results, base) {
    if (base == null && results.length === 1 && results[0] != null) {
        return results[0];
    }
    const output = base == null ? Object.create(null) : base;
    for(let idx = 0; idx < results.length; idx++){
        for(const key in results[idx]){
            const resolution = results[idx][key];
            const prevResolution = output[key];
            if (prevResolution != null) {
                output[key] = mergeWithDuplicate(prevResolution, resolution);
            } else {
                output[key] = resolution;
            }
        }
    }
    return output;
}

//# sourceMappingURL=utils.js.map
