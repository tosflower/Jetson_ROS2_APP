"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveGlobal", {
    enumerable: true,
    get: function() {
        return resolveGlobal;
    }
});
function _nodechild_process() {
    const data = require("node:child_process");
    _nodechild_process = function() {
        return data;
    };
    return data;
}
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
function _nodeos() {
    const data = /*#__PURE__*/ _interop_require_default(require("node:os"));
    _nodeos = function() {
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
const memoize = (fn)=>{
    let result;
    return (...args)=>{
        if (result === undefined) {
            result = {
                value: fn(...args)
            };
        }
        return result.value;
    };
};
const isWindows = process.platform === 'win32';
const getDelimitedPaths = (delimited)=>delimited.split(_nodepath().default.delimiter).map((target)=>{
        try {
            const normalized = _nodepath().default.normalize(target.trim());
            if (!normalized) {
                return null;
            } else if (!_nodepath().default.isAbsolute(normalized)) {
                return _nodepath().default.resolve(process.cwd(), normalized);
            } else {
                return normalized;
            }
        } catch  {
            return null;
        }
    }).filter((target)=>!!target);
const execGetPaths = (cmd, args)=>{
    const result = (0, _nodechild_process().spawnSync)(cmd, args, {
        encoding: 'utf8'
    });
    if (!result.error && result.status === 0 && result.stdout) {
        const paths = getDelimitedPaths(result.stdout.replace(/[\r\n]+/g, _nodepath().default.delimiter));
        return paths.filter((target)=>_nodefs().default.existsSync(target));
    }
    return [];
};
const getNativeNodePaths = ()=>{
    if (Array.isArray(_nodemodule().default.globalPaths)) {
        return _nodemodule().default.globalPaths;
    } else {
        return [];
    }
};
const getHomePath = memoize(()=>{
    try {
        return _nodeos().default.homedir();
    } catch  {
        return isWindows ? process.env.UserProfile ?? process.env.USERPROFILE : process.env.HOME;
    }
});
const getNpmDefaultPaths = ()=>{
    const prefix = [];
    const localAppData = process.env.LocalAppData || process.env.LOCALAPPDATA;
    if (isWindows && localAppData) {
        prefix.push(_nodepath().default.resolve(localAppData, 'npm'));
    } else if (!isWindows) {
        prefix.push('/usr/local/lib/node_modules');
    }
    return prefix.filter((target)=>_nodefs().default.existsSync(target));
};
const getNpmPrefixPaths = memoize(()=>{
    const npmPrefix = execGetPaths(isWindows ? 'npm.cmd' : 'npm', [
        'config',
        '-g',
        'get',
        'prefix'
    ]);
    return npmPrefix.map((prefix)=>_nodepath().default.resolve(prefix, 'lib'));
});
const getYarnDefaultPaths = ()=>{
    const prefix = [];
    const homePath = getHomePath();
    const localAppData = process.env.LocalAppData || process.env.LOCALAPPDATA;
    const dataHomePath = process.env.XDG_DATA_HOME || homePath && _nodepath().default.join(homePath, '.local', 'share');
    if (isWindows && localAppData) {
        prefix.push(_nodepath().default.resolve(localAppData, 'Yarn', 'global'));
    }
    if (dataHomePath) {
        prefix.push(_nodepath().default.resolve(dataHomePath, 'yarn', 'global'));
    }
    if (homePath) {
        prefix.push(_nodepath().default.resolve(homePath, '.yarn', 'global'));
    }
    return prefix.filter((target)=>_nodefs().default.existsSync(target));
};
const getYarnPrefixPaths = memoize(()=>{
    return execGetPaths(isWindows ? 'yarn.cmd' : 'yarn', [
        'global',
        'dir'
    ]);
});
const getPnpmPrefixPaths = memoize(()=>{
    return execGetPaths(isWindows ? 'pnpm.cmd' : 'pnpm', [
        'root',
        '-g'
    ]);
});
const getBunPrefixPaths = memoize(()=>{
    const prefix = [];
    const bunPath = execGetPaths(isWindows ? 'bun.cmd' : 'bun', [
        'pm',
        'bin',
        '-g'
    ])[0];
    if (!bunPath) {
        return [];
    }
    prefix.push(_nodepath().default.resolve(bunPath, 'global'));
    const moduleEntry = _nodefs().default.readdirSync(bunPath, {
        withFileTypes: true
    }).find((entry)=>{
        return entry.isSymbolicLink() && entry.name !== 'global';
    });
    if (moduleEntry) {
        try {
            const moduleTarget = _nodefs().default.realpathSync(_nodepath().default.resolve(bunPath, moduleEntry.name));
            const splitIdx = moduleTarget.indexOf(_nodepath().default.sep + 'node_modules' + _nodepath().default.sep);
            if (splitIdx > -1) {
                const modulePath = moduleTarget.slice(0, splitIdx);
                prefix.push(modulePath);
            }
        } catch  {}
    }
    return prefix.filter((target)=>_nodefs().default.existsSync(target));
});
const getPaths = ()=>[
        ...getNpmDefaultPaths(),
        ...getNpmPrefixPaths(),
        ...getYarnDefaultPaths(),
        ...getYarnPrefixPaths(),
        ...getPnpmPrefixPaths(),
        ...getBunPrefixPaths(),
        ...getNativeNodePaths(),
        process.cwd()
    ];
const resolveGlobal = (id)=>{
    return require.resolve(id, {
        paths: getPaths()
    });
};

//# sourceMappingURL=resolveGlobal.js.map
