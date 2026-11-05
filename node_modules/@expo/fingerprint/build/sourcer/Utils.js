"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createAutolinkingHashSourceAsync: null,
    getFileBasedHashSourceAsync: null,
    maybeGetRealPathAsync: null,
    readPackageIdentityAsync: null,
    relativizeJsonPaths: null,
    stringifyJsonSorted: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get createAutolinkingHashSourceAsync () {
        return createAutolinkingHashSourceAsync;
    },
    get getFileBasedHashSourceAsync () {
        return getFileBasedHashSourceAsync;
    },
    get maybeGetRealPathAsync () {
        return maybeGetRealPathAsync;
    },
    get readPackageIdentityAsync () {
        return readPackageIdentityAsync;
    },
    get relativizeJsonPaths () {
        return relativizeJsonPaths;
    },
    get stringifyJsonSorted () {
        return stringifyJsonSorted;
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
const _Path = require("../utils/Path");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function createAutolinkingHashSourceAsync(projectRoot, dirRelativePath, reasons, nativeModuleSourceType) {
    if (nativeModuleSourceType === 'package') {
        const packageJsonPath = (0, _Path.getNodeModulesPackageJsonPath)(dirRelativePath);
        if (packageJsonPath) {
            const identity = await readPackageIdentityAsync(_path().default.join(projectRoot, packageJsonPath));
            if (identity) {
                return {
                    type: 'package',
                    ...identity,
                    filePath: packageJsonPath,
                    reasons
                };
            }
        }
    }
    return {
        type: 'dir',
        filePath: dirRelativePath,
        reasons
    };
}
async function readPackageIdentityAsync(packageJsonPath) {
    let packageJson;
    try {
        packageJson = JSON.parse(await _promises().default.readFile(packageJsonPath, 'utf8'));
    } catch (error) {
        if (error.code === 'ENOENT') {
            return null;
        }
        throw error;
    }
    return {
        name: packageJson.name ?? '',
        version: packageJson.version ?? ''
    };
}
async function getFileBasedHashSourceAsync(projectRoot, filePath, reason) {
    let result = null;
    try {
        const stat = await _promises().default.stat(_path().default.join(projectRoot, filePath));
        result = {
            type: stat.isDirectory() ? 'dir' : 'file',
            filePath: (0, _Path.toPosixPath)(filePath),
            reasons: [
                reason
            ]
        };
    } catch  {
        result = null;
    }
    return result;
}
async function maybeGetRealPathAsync(filePath) {
    try {
        return await _promises().default.realpath(filePath);
    } catch  {
        return filePath;
    }
}
function stringifyJsonSorted(target, space) {
    return JSON.stringify(target, (_, value)=>sortJson(value), space);
}
function relativizeJsonPaths(value, projectRoot) {
    if (typeof value === 'string' && value.startsWith(projectRoot)) {
        return (0, _Path.toPosixPath)(_path().default.relative(projectRoot, value));
    }
    if (Array.isArray(value)) {
        return value.map((item)=>relativizeJsonPaths(item, projectRoot));
    }
    if (value && typeof value === 'object') {
        return Object.fromEntries(Object.entries(value).map(([key, val])=>[
                key,
                relativizeJsonPaths(val, projectRoot)
            ]));
    }
    return value;
}
function sortJson(json) {
    if (Array.isArray(json)) {
        return json.sort((a, b)=>{
            // Sort array items by their stringified value.
            // We don't need the array to be sorted in meaningful way, just to be sorted in deterministic.
            // E.g. `[{ b: '2' }, {}, { a: '3' }, null]` -> `[null, { a : '3' }, { b: '2' }, {}]`
            // This result is not a perfect solution, but it's good enough for our use case.
            const stringifiedA = stringifyJsonSorted(a);
            const stringifiedB = stringifyJsonSorted(b);
            if (stringifiedA < stringifiedB) {
                return -1;
            } else if (stringifiedA > stringifiedB) {
                return 1;
            }
            return 0;
        });
    }
    if (json != null && typeof json === 'object') {
        // Sort object items by keys
        return Object.keys(json).sort().reduce((acc, key)=>{
            acc[key] = json[key];
            return acc;
        }, {});
    }
    // Return primitives
    return json;
}

//# sourceMappingURL=Utils.js.map
