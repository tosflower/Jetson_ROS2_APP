"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    nativeResolveFrom: null,
    resolveFrom: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get nativeResolveFrom () {
        return nativeResolveFrom;
    },
    get resolveFrom () {
        return resolveFrom;
    }
});
function _nodefs() {
    const data = /*#__PURE__*/ _interop_require_default(require("node:fs"));
    _nodefs = function() {
        return data;
    };
    return data;
}
function _nodemodule() {
    const data = /*#__PURE__*/ _interop_require_default(require("node:module"));
    _nodemodule = function() {
        return data;
    };
    return data;
}
function _nodepath() {
    const data = /*#__PURE__*/ _interop_require_default(require("node:path"));
    _nodepath = function() {
        return data;
    };
    return data;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function resolveFrom(fromDirectory, moduleId, params) {
    // We exclude extension resolution, if we're resolving a plain JSON file
    const isJSON = moduleId.endsWith('.json');
    const exts = !isJSON ? params?.extensions ?? Object.keys(_nodemodule().default._extensions) : [];
    const skipNodePath = !!params?.skipNodePath;
    const followSymlinks = params?.followSymlinks ?? skipNodePath;
    let resolved = _nodepath().default.resolve(fromDirectory, moduleId);
    // (1) check direct path / exact match
    const resolveType = resolveTypeSync(resolved);
    if (resolveType === 1) {
        return resolved;
    }
    // (2) check against direct path matches with extensions
    for (let ext of exts){
        ext = ext[0] !== '.' ? `.${ext}` : ext;
        const withExt = resolved + ext;
        if (resolveTypeSync(withExt) === 1) {
            return withExt;
        }
    }
    const isFileSpecifier = /^\.\.?(?:$|[/\\])/.test(moduleId) || _nodepath().default.isAbsolute(moduleId);
    // (2.2) check against `/index` paths if we've disabled Node resolution or if we're resolving a relative path directly
    if ((isFileSpecifier || skipNodePath) && !isJSON && resolveType === 2) {
        resolved = _nodepath().default.join(resolved, 'index');
        for (let ext of exts){
            ext = ext[0] !== '.' ? `.${ext}` : ext;
            const withExt = resolved + ext;
            if (resolveTypeSync(withExt) === 1) {
                // NOTE(@kitten): Like above, we don't resolve symlinks when we're not in a node_modules resolution path
                return withExt;
            }
        }
    }
    // We won't need to continue with Node resolution if we're only resolving paths
    if (isFileSpecifier) {
        return null;
    }
    // (3) if we're not following symlinks, we try to resolve against `node_modules` folders unresolved
    if (!followSymlinks || skipNodePath) {
        const resolvedDir = _nodepath().default.resolve(fromDirectory);
        const moduleDirs = _nodemodule().default._nodeModulePaths(resolvedDir);
        for (const modulesDir of moduleDirs){
            let candidate = _nodepath().default.join(modulesDir, moduleId);
            const resolveType = resolveTypeSync(candidate);
            // (3.1) direct match
            if (resolveType === 1) {
                return followSymlinks ? maybeResolve(candidate) : candidate;
            } else if (resolveType === 0) {
                // Optimization: If the directory itself doesn't exist, there's no point in us continuing
                // to check for more files in this directory
                const dirname = _nodepath().default.dirname(candidate);
                if (dirname !== modulesDir && !_nodefs().default.existsSync(dirname)) {
                    continue;
                }
            }
            // (3.2) check against match with extensions
            for (let ext of exts){
                ext = ext[0] !== '.' ? `.${ext}` : ext;
                const candidateWithExt = candidate + ext;
                if (resolveTypeSync(candidateWithExt) === 1) {
                    return followSymlinks ? maybeResolve(candidateWithExt) : candidateWithExt;
                }
            }
            // (3.3) check against `/index` paths
            if (!isJSON && resolveType === 2) {
                candidate = _nodepath().default.join(candidate, 'index');
                for (let ext of exts){
                    ext = ext[0] !== '.' ? `.${ext}` : ext;
                    const candidateWithExt = candidate + ext;
                    if (resolveTypeSync(candidateWithExt) === 1) {
                        return followSymlinks ? maybeResolve(candidateWithExt) : candidateWithExt;
                    }
                }
            }
        }
    }
    // (4): Fallback to native Node resolution, if `skipNodePath` is disabled
    return !skipNodePath ? nativeResolveFrom(fromDirectory, moduleId) : null;
}
function nativeResolveFrom(fromDirectory, moduleId) {
    try {
        const resolvedDir = maybeResolve(fromDirectory);
        const fromFile = _nodepath().default.join(resolvedDir, 'index.js');
        return _nodemodule().default._resolveFilename(moduleId, {
            id: fromFile,
            filename: fromFile,
            paths: [
                ..._nodemodule().default._nodeModulePaths(resolvedDir)
            ]
        });
    } catch  {
        return null;
    }
}
function isRealpathFileSync(target) {
    try {
        const realpath = _nodefs().default.realpathSync(target);
        return !!_nodefs().default.lstatSync(realpath, {
            throwIfNoEntry: false
        })?.isFile();
    } catch  {
        return false;
    }
}
function resolveTypeSync(target) {
    try {
        const stat = _nodefs().default.lstatSync(target, {
            throwIfNoEntry: false
        });
        if (stat) {
            if (stat.isSymbolicLink()) {
                return isRealpathFileSync(target) ? 1 : 0;
            } else if (stat.isFile()) {
                return 1;
            } else if (stat.isDirectory()) {
                // NOTE(@kitten): We don't support symlinked directories for resolution
                // Realistically, when we disable Node resolution, symlinked directory resolution
                // for `/index` is rare, and can be used to exploit symlinks
                return 2;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    } catch  {
        return 0;
    }
}
function maybeResolve(target) {
    target = _nodepath().default.resolve(process.cwd(), target);
    try {
        return _nodefs().default.realpathSync(target);
    } catch  {
        return target;
    }
}

//# sourceMappingURL=resolve.js.map
