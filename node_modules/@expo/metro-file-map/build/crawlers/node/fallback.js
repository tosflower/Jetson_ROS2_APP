"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    isFallbackDir: null,
    shouldFallbackCrawlDir: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get /**
 * Create a FallbackFilesystem that synchronously queries the real filesystem.
 *
 * - `lookup` uses lstatSync to check a single path (for traversal).
 * - `readdir` uses readdirSync to list directory contents (for enumeration).
 *
 * Both methods apply the same filtering as the node crawler: ignore patterns,
 * extension filtering, and symlink inclusion.
 */ default () {
        return createFallbackFilesystem;
    },
    get isFallbackDir () {
        return isFallbackDir;
    },
    get shouldFallbackCrawlDir () {
        return shouldFallbackCrawlDir;
    }
});
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
const _normalizePathSeparatorsToPosix = /*#__PURE__*/ _interop_require_default(require("../../lib/normalizePathSeparatorsToPosix"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const FALLBACK_DIR = Symbol.for('fallbackDir');
function markDir(dirNode, flag) {
    dirNode[FALLBACK_DIR] = flag;
}
function getDirFlag(dirNode) {
    return dirNode[FALLBACK_DIR];
}
function isFallbackDir(dirNode) {
    return dirNode[FALLBACK_DIR] != null;
}
function isDirectory(node) {
    return node instanceof Map;
}
function createFallbackFilesystem(opts) {
    const { rootPathUtils, extensions, ignore, includeSymlinks } = opts;
    const exts = extensions.reduce((acc, ext)=>{
        acc[ext] = true;
        return acc;
    }, {});
    function readdir(_normalPath, absolutePath, dirNode) {
        if (dirNode != null && getDirFlag(dirNode) === 1) {
            return dirNode;
        }
        let dirEntries;
        try {
            dirEntries = _fs().default.readdirSync(absolutePath, {
                withFileTypes: true
            });
        } catch  {
            return null;
        }
        const result = dirNode ?? new Map();
        for (const entry of dirEntries){
            const name = entry.name.toString();
            const childAbsolutePath = absolutePath + _path().default.sep + name;
            if (ignore(childAbsolutePath)) {
                continue;
            }
            if (entry.isDirectory()) {
                // NOTE(@kitten): ".git" and ".hg" check replace the VCS_DIRECTORIES ignore pattern
                // NOTE(@kitten): `.cxx` is ephemeral and should always be safe to ignore
                if (!result.has(name) && name !== '.git' && name !== '.hg' && name !== '.cxx') {
                    const childDir = new Map();
                    markDir(childDir, 0);
                    result.set(name, childDir);
                }
            } else if (entry.isSymbolicLink()) {
                // We can skip reading the symlink target here, since it'll be read lazily
                if (includeSymlinks && !result.has(name)) {
                    result.set(name, [
                        null,
                        0,
                        0,
                        null,
                        1,
                        null
                    ]);
                }
            } else if (entry.isFile()) {
                const ext = _path().default.extname(name).slice(1);
                if (exts[ext] && !result.has(name)) {
                    result.set(name, [
                        null,
                        0,
                        0,
                        null,
                        0,
                        null
                    ]);
                }
            }
        }
        markDir(result, 1);
        return result;
    }
    return {
        readdir,
        lookup (normalPath, absolutePath, prevNode) {
            if (ignore(absolutePath)) {
                return null;
            }
            let stat;
            try {
                stat = _fs().default.lstatSync(absolutePath);
            } catch  {
                return null;
            }
            if (stat.isDirectory()) {
                const dirNode = isDirectory(prevNode) ? prevNode : null;
                if (shouldFallbackCrawlDir(absolutePath)) {
                    return readdir(normalPath, absolutePath, dirNode);
                }
                if (dirNode != null) {
                    return dirNode;
                }
                const newDir = new Map();
                markDir(newDir, 0);
                return newDir;
            } else if (stat.isSymbolicLink()) {
                if (!includeSymlinks) {
                    return null;
                }
                try {
                    // We might as well read the symlink target here and assume it'll be used
                    const symlinkTarget = _fs().default.readlinkSync(absolutePath);
                    // Cached value should be in posix format
                    const target = (0, _normalizePathSeparatorsToPosix.default)(rootPathUtils.resolveSymlinkToNormal(normalPath, symlinkTarget));
                    return [
                        stat.mtime.getTime(),
                        stat.size,
                        0,
                        null,
                        target,
                        null
                    ];
                } catch  {
                    return null;
                }
            } else if (stat.isFile()) {
                // Check extension — symlinks bypass this check (same as node crawler)
                const ext = _path().default.extname(absolutePath).slice(1);
                if (!exts[ext]) {
                    return null;
                } else {
                    return [
                        stat.mtime.getTime(),
                        stat.size,
                        0,
                        null,
                        0,
                        null
                    ];
                }
            } else {
                return null;
            }
        }
    };
}
function shouldFallbackCrawlDir(canonicalPath) {
    const lastSepIdx = canonicalPath.lastIndexOf(_path().default.sep);
    const baseStart = lastSepIdx + 1;
    const baseLen = canonicalPath.length - baseStart;
    if (baseLen === 2 && canonicalPath.charCodeAt(baseStart) === 46 /*'.'*/  && canonicalPath.charCodeAt(baseStart + 1) === 46 /*'.'*/ ) {
        // '..' is the parent-of-rootDir indirection, not a hidden directory.
        return true;
    } else if (canonicalPath.charCodeAt(baseStart) === 46 /*'.'*/ ) {
        // starts with '.'
        return false;
    } else if (baseLen === 12 && canonicalPath.startsWith('node_modules', baseStart)) {
        return false;
    } else {
        return true;
    }
}

//# sourceMappingURL=fallback.js.map
