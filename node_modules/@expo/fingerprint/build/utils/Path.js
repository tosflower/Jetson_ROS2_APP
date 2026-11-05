"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    appendIgnorePath: null,
    buildDirMatchObjects: null,
    buildPathMatchObjects: null,
    getNodeModulesPackageJsonPath: null,
    isIgnoredPath: null,
    isIgnoredPathWithMatchObjects: null,
    normalizeFilePath: null,
    pathExistsAsync: null,
    toPosixPath: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get appendIgnorePath () {
        return appendIgnorePath;
    },
    get buildDirMatchObjects () {
        return buildDirMatchObjects;
    },
    get buildPathMatchObjects () {
        return buildPathMatchObjects;
    },
    get getNodeModulesPackageJsonPath () {
        return getNodeModulesPackageJsonPath;
    },
    get isIgnoredPath () {
        return isIgnoredPath;
    },
    get isIgnoredPathWithMatchObjects () {
        return isIgnoredPathWithMatchObjects;
    },
    get normalizeFilePath () {
        return normalizeFilePath;
    },
    get pathExistsAsync () {
        return pathExistsAsync;
    },
    get toPosixPath () {
        return toPosixPath;
    }
});
function _promises() {
    const data = /*#__PURE__*/ _interop_require_default(require("fs/promises"));
    _promises = function() {
        return data;
    };
    return data;
}
function _minimatch() {
    const data = require("minimatch");
    _minimatch = function() {
        return data;
    };
    return data;
}
function _nodeprocess() {
    const data = /*#__PURE__*/ _interop_require_default(require("node:process"));
    _nodeprocess = function() {
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
function isIgnoredPath(filePath, ignorePaths, minimatchOptions = {
    dot: true
}) {
    const matchObjects = buildPathMatchObjects(ignorePaths, minimatchOptions);
    return isIgnoredPathWithMatchObjects(filePath, matchObjects);
}
function buildPathMatchObjects(paths, minimatchOptions = {
    dot: true
}) {
    return paths.map((filePath)=>new (_minimatch()).Minimatch(filePath, minimatchOptions));
}
function appendIgnorePath(matchObjects, path, minimatchOptions = {
    dot: true
}) {
    matchObjects.push(new (_minimatch()).Minimatch(path, minimatchOptions));
}
function buildDirMatchObjects(ignorePathMatchObjects, minimatchOptions = {
    dot: true
}) {
    const dirIgnorePatterns = [];
    const ignorePaths = ignorePathMatchObjects.filter((obj)=>!obj.negate).map((obj)=>obj.pattern);
    const negatedIgnorePaths = ignorePathMatchObjects.filter((obj)=>obj.negate).map((obj)=>obj.pattern);
    // [0] Add positive patterns to dirIgnorePatterns
    for (const pattern of ignorePaths){
        if (pattern.endsWith('/**/*')) {
            // `/**/*` matches
            dirIgnorePatterns.push(pattern.slice(0, -5));
        } else if (pattern.endsWith('/**')) {
            // `/**` by default matches directories
            dirIgnorePatterns.push(pattern.slice(0, -3));
        } else if (pattern.endsWith('/')) {
            // `/` suffix matches directories
            dirIgnorePatterns.push(pattern.slice(0, -1));
        }
    }
    // [1] If there is a negate pattern in the same directory, we should remove the existing directory.
    for (const pattern of negatedIgnorePaths){
        for(let i = 0; i < dirIgnorePatterns.length; ++i){
            const existingPattern = dirIgnorePatterns[i];
            if (existingPattern != null && isSubDirectory(existingPattern, pattern)) {
                dirIgnorePatterns.splice(i, 1);
            }
        }
    }
    return dirIgnorePatterns.map((pattern)=>new (_minimatch()).Minimatch(pattern, minimatchOptions));
}
function isIgnoredPathWithMatchObjects(filePath, matchObjects) {
    let result = false;
    for (const minimatchObj of matchObjects){
        const stripParentPrefix = minimatchObj.pattern.startsWith('**/');
        const normalizedFilePath = normalizeFilePath(filePath, {
            stripParentPrefix
        });
        const currMatch = minimatchObj.match(normalizedFilePath);
        if (minimatchObj.negate && result && !currMatch) {
            // Special handler for negate (!pattern).
            // As long as previous match result is true and not matched from the current negate pattern, we should early return.
            return false;
        }
        if (!minimatchObj.negate) {
            result ||= currMatch;
        }
    }
    return result;
}
/**
 * Returns true if `parent` is a parent directory of `child`.
 */ function isSubDirectory(parent, child) {
    const relative = _path().default.relative(parent, child);
    return !relative.startsWith('..') && !_path().default.isAbsolute(relative);
}
const STRIP_PARENT_PREFIX_REGEX = /^(\.\.\/)+/g;
function normalizeFilePath(filePath, options) {
    if (options.stripParentPrefix) {
        return filePath.replace(STRIP_PARENT_PREFIX_REGEX, '');
    }
    return filePath;
}
const REGEXP_REPLACE_SLASHES = /\\/g;
function toPosixPath(filePath) {
    return _nodeprocess().default.platform === 'win32' ? filePath.replace(REGEXP_REPLACE_SLASHES, '/') : filePath;
}
async function pathExistsAsync(filePath) {
    try {
        const stat = await _promises().default.stat(filePath);
        return stat.isFile() || stat.isDirectory();
    } catch  {
        return false;
    }
}
function getNodeModulesPackageJsonPath(relativePosixPath) {
    const marker = 'node_modules/';
    const markerIndex = relativePosixPath.lastIndexOf(marker);
    if (markerIndex === -1) {
        return null;
    }
    const prefix = relativePosixPath.slice(0, markerIndex + marker.length);
    const segments = relativePosixPath.slice(markerIndex + marker.length).split('/');
    if (!segments[0]) {
        return null;
    }
    let packageDir;
    if (segments[0].startsWith('@')) {
        if (!segments[1]) {
            return null;
        }
        packageDir = `${prefix}${segments[0]}/${segments[1]}`;
    } else {
        packageDir = `${prefix}${segments[0]}`;
    }
    return `${packageDir}/package.json`;
}

//# sourceMappingURL=Path.js.map
