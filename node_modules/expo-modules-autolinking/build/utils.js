"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    fastJoin: null,
    fileExistsAsync: null,
    isPathInside: null,
    listFilesInDirectories: null,
    listFilesSorted: null,
    loadPackageJson: null,
    maybeRealpath: null,
    scanFilesRecursively: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get fastJoin () {
        return fastJoin;
    },
    get fileExistsAsync () {
        return fileExistsAsync;
    },
    get isPathInside () {
        return isPathInside;
    },
    get listFilesInDirectories () {
        return listFilesInDirectories;
    },
    get listFilesSorted () {
        return listFilesSorted;
    },
    get loadPackageJson () {
        return loadPackageJson;
    },
    get maybeRealpath () {
        return maybeRealpath;
    },
    get scanFilesRecursively () {
        return scanFilesRecursively;
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
const _memoize = require("./memoize");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function listFilesSorted(targetPath, filter) {
    try {
        // `readdir` isn't guaranteed to be sorted on Windows
        return (await _fs().default.promises.readdir(targetPath, {
            withFileTypes: true
        })).filter((entry)=>entry.isFile() && filter(entry.name)).sort((a, b)=>a.name.localeCompare(b.name)).map((entry)=>_path().default.join(targetPath, entry.name));
    } catch  {
        return [];
    }
}
async function listFilesInDirectories(targetPath, filter) {
    return (await Promise.all((await _fs().default.promises.readdir(targetPath, {
        withFileTypes: true
    })).filter((entry)=>entry.isDirectory() && entry.name !== 'node_modules').sort((a, b)=>a.name.localeCompare(b.name)).map(async (directory)=>{
        const entries = await _fs().default.promises.readdir(_path().default.join(targetPath, directory.name), {
            withFileTypes: true
        });
        return entries.filter((entry)=>entry.isFile() && filter(entry.name)).sort((a, b)=>a.name.localeCompare(b.name)).map((entry)=>_path().default.join(directory.name, entry.name));
    }))).flat(1);
}
async function* scanFilesRecursively(parentPath, includeDirectory, sort = !_fs().default.opendir) {
    const queue = [
        parentPath
    ];
    let targetPath;
    while(queue.length > 0 && (targetPath = queue.shift()) != null){
        try {
            const entries = sort ? (await _fs().default.promises.readdir(targetPath, {
                withFileTypes: true
            })).sort((a, b)=>a.name.localeCompare(b.name)) : await _fs().default.promises.opendir(targetPath);
            for await (const entry of entries){
                if (entry.isDirectory() && entry.name !== 'node_modules') {
                    if (!includeDirectory || includeDirectory(targetPath, entry.name)) {
                        queue.push(_path().default.join(targetPath, entry.name));
                    }
                } else if (entry.isFile()) {
                    yield {
                        path: _path().default.join(targetPath, entry.name),
                        parentPath: targetPath,
                        name: entry.name
                    };
                }
            }
        } catch  {
            continue;
        }
    }
}
const fileExistsAsync = async (file)=>{
    const stat = await _fs().default.promises.stat(file).catch(()=>null);
    return stat?.isFile() ? file : null;
};
const fastJoin = _path().default.sep === '/' ? (from, append)=>`${from}${_path().default.sep}${append}` : (from, append)=>`${from}${_path().default.sep}${append[0] === '@' ? append.replace('/', _path().default.sep) : append}`;
const maybeRealpath = async (target)=>{
    try {
        return await _fs().default.promises.realpath(target);
    } catch  {
        return null;
    }
};
function isPathInside(child, parent) {
    const relative = _path().default.relative(parent, child);
    return !!relative && !relative.startsWith('..') && !_path().default.isAbsolute(relative);
}
const loadPackageJson = (0, _memoize.memoize)(async function loadPackageJson(jsonPath) {
    try {
        const packageJsonText = await _fs().default.promises.readFile(jsonPath, 'utf8');
        const json = JSON.parse(packageJsonText);
        if (typeof json !== 'object' || json == null) {
            return null;
        }
        return json;
    } catch  {
        return null;
    }
});

//# sourceMappingURL=utils.js.map
