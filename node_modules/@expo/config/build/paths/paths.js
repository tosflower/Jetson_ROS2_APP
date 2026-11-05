"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    convertEntryPointToRelative: null,
    ensureSlash: null,
    getFileWithExtensions: null,
    getMetroServerRoot: null,
    getMetroWorkspaceGlobs: null,
    getPossibleProjectRoot: null,
    resolveEntryPoint: null,
    resolveRelativeEntryPoint: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get convertEntryPointToRelative () {
        return convertEntryPointToRelative;
    },
    get ensureSlash () {
        return ensureSlash;
    },
    get getFileWithExtensions () {
        return getFileWithExtensions;
    },
    get getMetroServerRoot () {
        return getMetroServerRoot;
    },
    get getMetroWorkspaceGlobs () {
        return getMetroWorkspaceGlobs;
    },
    get getPossibleProjectRoot () {
        return getPossibleProjectRoot;
    },
    get resolveEntryPoint () {
        return resolveEntryPoint;
    },
    get resolveRelativeEntryPoint () {
        return resolveRelativeEntryPoint;
    }
});
function _requireutils() {
    const data = require("@expo/require-utils");
    _requireutils = function() {
        return data;
    };
    return data;
}
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
function _resolveworkspaceroot() {
    const data = require("resolve-workspace-root");
    _resolveworkspaceroot = function() {
        return data;
    };
    return data;
}
const _Config = require("../Config");
const _Errors = require("../Errors");
const _env = require("./env");
const _extensions = require("./extensions");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function ensureSlash(inputPath, needsSlash) {
    const hasSlash = inputPath.endsWith('/');
    if (hasSlash && !needsSlash) {
        return inputPath.substring(0, inputPath.length - 1);
    } else if (!hasSlash && needsSlash) {
        return `${inputPath}/`;
    } else {
        return inputPath;
    }
}
function getPossibleProjectRoot() {
    return _fs().default.realpathSync(process.cwd());
}
const nativePlatforms = [
    'ios',
    'android'
];
function resolveEntryPoint(projectRoot, { platform, pkg = (0, _Config.getPackageJson)(projectRoot) } = {}) {
    const platforms = !platform ? [] : nativePlatforms.includes(platform) ? [
        platform,
        'native'
    ] : [
        platform
    ];
    const extensions = (0, _extensions.getBareExtensions)(platforms);
    // If the config doesn't define a custom entry then we want to look at the `package.json`s `main` field, and try again.
    const { main } = pkg;
    if (main && typeof main === 'string') {
        // Allow for paths like: `{ "main": "expo/AppEntry" }`
        const entry = (0, _requireutils().resolveFrom)(projectRoot, main, {
            extensions
        });
        if (!entry) {
            throw new _Errors.ConfigError(`Cannot resolve entry file: The \`main\` field defined in your \`package.json\` points to an unresolvable or non-existent path.`, 'ENTRY_NOT_FOUND');
        }
        return entry;
    }
    // Check for a root index.* file in the project root.
    let entry = (0, _requireutils().resolveFrom)(projectRoot, './index', {
        extensions
    });
    if (entry) {
        return entry;
    }
    // If none of the default files exist then we will attempt to use the main Expo entry point.
    // This requires `expo` to be installed in the project to work as it will use `node_module/expo/AppEntry.js`
    // Doing this enables us to create a bare minimum Expo project.
    // TODO(Bacon): We may want to do a check against `./App` and `expo` in the `package.json` `dependencies` as we can more accurately ensure that the project is expo-min without needing the modules installed.
    entry = (0, _requireutils().resolveFrom)(projectRoot, 'expo/AppEntry', {
        extensions
    });
    if (!entry) {
        throw new _Errors.ConfigError(`The project entry file could not be resolved. Define it in the \`main\` field of the \`package.json\`, create an \`index.js\`, or install the \`expo\` package.`, 'ENTRY_NOT_FOUND');
    }
    return entry;
}
function getFileWithExtensions(fromDirectory, moduleId, extensions) {
    const modulePath = _path().default.join(fromDirectory, moduleId);
    if (_fs().default.existsSync(modulePath)) {
        return modulePath;
    }
    for (const extension of extensions){
        const modulePath = _path().default.join(fromDirectory, `${moduleId}.${extension}`);
        if (_fs().default.existsSync(modulePath)) {
            return modulePath;
        }
    }
    return null;
}
const _metroServerRootCache = new Map();
function getMetroServerRoot(projectRoot) {
    if (_env.env.EXPO_NO_METRO_WORKSPACE_ROOT) {
        return projectRoot;
    }
    projectRoot = _path().default.resolve(projectRoot);
    let serverRoot = _metroServerRootCache.get(projectRoot);
    if (serverRoot != null) {
        return serverRoot;
    }
    serverRoot = (0, _resolveworkspaceroot().resolveWorkspaceRoot)(projectRoot);
    if (serverRoot != null) {
        serverRoot = _path().default.resolve(serverRoot);
        _metroServerRootCache.set(projectRoot, serverRoot);
    }
    return serverRoot ?? projectRoot;
}
function getMetroWorkspaceGlobs(monorepoRoot) {
    return (0, _resolveworkspaceroot().getWorkspaceGlobs)(monorepoRoot);
}
function toPosixPath(filePath) {
    return filePath.replace(/\\/g, '/');
}
function convertEntryPointToRelative(projectRoot, absolutePath, extname = '.js') {
    if (!_path().default.isAbsolute(absolutePath)) {
        absolutePath = _path().default.resolve(process.cwd(), projectRoot, absolutePath);
    }
    // The project root could be using a different root on MacOS (`/var` vs `/private/var`)
    // We need to make sure to get the non-symlinked path to the server or project root.
    let serverRoot = getMetroServerRoot(projectRoot);
    try {
        const realServerRoot = _fs().default.realpathSync(serverRoot);
        // If the absolute path already starts with the resolved server root, use it directly
        if (absolutePath.startsWith(realServerRoot + _path().default.sep)) {
            serverRoot = realServerRoot;
        } else if (absolutePath.startsWith(serverRoot + _path().default.sep)) {
        // If the absolute path starts with the (possibly symlinked) server root, preserve it as-is
        } else {
            // Otherwise, resolve the absolute path to check if it matches the real server root.
            // This is only needed when absolutePath doesn't match either root representation,
            // and absolutePath may not be valid (e.g. non-existent file)
            try {
                const realAbsolutePath = _fs().default.realpathSync(absolutePath);
                if (realAbsolutePath.startsWith(realServerRoot + _path().default.sep)) {
                    serverRoot = realServerRoot;
                    absolutePath = realAbsolutePath;
                } else if (realServerRoot !== serverRoot || realAbsolutePath !== absolutePath) {
                    // Last resort: fall back to the legacy behavior of using the realpath for both,
                    // without knowing if the resulting relative path will be valid
                    serverRoot = realServerRoot;
                    absolutePath = realAbsolutePath;
                }
            } catch  {}
        }
    } catch  {
    // NOTE: `fs.realpathSync` can fail if `projectRoot` doesn't exist (e.g. mocked folder)
    }
    let entry = toPosixPath(_path().default.relative(serverRoot, absolutePath));
    // Strip extname, if it's set and trivially resolvable by Metro
    if (extname != null) {
        if (extname[0] !== '.') {
            extname = `.${extname}`;
        }
        if (entry.endsWith(extname)) {
            entry = entry.slice(0, -extname.length);
        }
    }
    return entry;
}
const resolveRelativeEntryPoint = (projectRoot, options)=>{
    return convertEntryPointToRelative(projectRoot, resolveEntryPoint(projectRoot, options));
};

//# sourceMappingURL=paths.js.map
