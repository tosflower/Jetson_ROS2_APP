"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    resolveProjectWorkflowAsync: null,
    resolveProjectWorkflowPerPlatformAsync: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get resolveProjectWorkflowAsync () {
        return resolveProjectWorkflowAsync;
    },
    get resolveProjectWorkflowPerPlatformAsync () {
        return resolveProjectWorkflowPerPlatformAsync;
    }
});
function _spawnasync() {
    const data = /*#__PURE__*/ _interop_require_default(require("@expo/spawn-async"));
    _spawnasync = function() {
        return data;
    };
    return data;
}
function _promises() {
    const data = /*#__PURE__*/ _interop_require_default(require("fs/promises"));
    _promises = function() {
        return data;
    };
    return data;
}
function _glob() {
    const data = require("glob");
    _glob = function() {
        return data;
    };
    return data;
}
function _ignore() {
    const data = /*#__PURE__*/ _interop_require_default(require("ignore"));
    _ignore = function() {
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
const _ExpoResolver = require("./ExpoResolver");
const _Path = require("./utils/Path");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function resolveProjectWorkflowAsync(projectRoot, platform, fingerprintIgnorePaths) {
    const configPluginsPackageRoot = (0, _ExpoResolver.resolveExpoConfigPluginsPackagePath)(projectRoot);
    if (configPluginsPackageRoot == null) {
        return 'unknown';
    }
    const { AndroidConfig, IOSConfig } = require(configPluginsPackageRoot);
    let platformWorkflowMarkers;
    try {
        platformWorkflowMarkers = platform === 'android' ? [
            _path().default.join(projectRoot, 'android/app/build.gradle'),
            await AndroidConfig.Paths.getAndroidManifestAsync(projectRoot)
        ] : [
            IOSConfig.Paths.getPBXProjectPath(projectRoot)
        ];
    } catch  {
        return 'managed';
    }
    const vcsClient = await getVCSClientAsync(projectRoot);
    const vcsRoot = _path().default.normalize(await vcsClient.getRootPathAsync());
    for (const marker of platformWorkflowMarkers){
        const relativeMarker = (0, _Path.toPosixPath)(_path().default.relative(vcsRoot, marker));
        if (await (0, _Path.pathExistsAsync)(marker) && !(0, _Path.isIgnoredPathWithMatchObjects)(relativeMarker, fingerprintIgnorePaths) && !await vcsClient.isFileIgnoredAsync(relativeMarker)) {
            return 'generic';
        }
    }
    return 'managed';
}
async function resolveProjectWorkflowPerPlatformAsync(projectRoot, fingerprintIgnorePaths) {
    const [android, ios] = await Promise.all([
        resolveProjectWorkflowAsync(projectRoot, 'android', fingerprintIgnorePaths),
        resolveProjectWorkflowAsync(projectRoot, 'ios', fingerprintIgnorePaths)
    ]);
    return {
        android,
        ios
    };
}
async function getVCSClientAsync(projectRoot) {
    if (await isGitInstalledAndConfiguredAsync(projectRoot)) {
        return new GitClient(projectRoot);
    } else {
        return new NoVCSClient(projectRoot);
    }
}
class GitClient {
    projectRoot;
    constructor(projectRoot){
        this.projectRoot = projectRoot;
    }
    async getRootPathAsync() {
        return (await (0, _spawnasync().default)('git', [
            'rev-parse',
            '--show-toplevel'
        ], {
            cwd: this.projectRoot
        })).stdout.trim();
    }
    async isFileIgnoredAsync(filePath) {
        try {
            await (0, _spawnasync().default)('git', [
                'check-ignore',
                '-q',
                filePath
            ], {
                cwd: _path().default.normalize(await this.getRootPathAsync())
            });
            return true;
        } catch  {
            return false;
        }
    }
}
class NoVCSClient {
    projectRoot;
    constructor(projectRoot){
        this.projectRoot = projectRoot;
    }
    async getRootPathAsync() {
        return this.projectRoot;
    }
    async isFileIgnoredAsync(filePath) {
        const ignore = new Ignore(this.projectRoot);
        await ignore.initIgnoreAsync();
        return ignore.ignores(filePath);
    }
}
async function isGitInstalledAndConfiguredAsync(projectRoot) {
    try {
        await (0, _spawnasync().default)('git', [
            '--help'
        ]);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return false;
        }
        throw error;
    }
    try {
        await (0, _spawnasync().default)('git', [
            'rev-parse',
            '--show-toplevel'
        ], {
            cwd: projectRoot
        });
    } catch  {
        return false;
    }
    return true;
}
const GITIGNORE_FILENAME = '.gitignore';
const DEFAULT_IGNORE = `
.git
node_modules
`;
/**
 * Ignore wraps the 'ignore' package to support multiple .gitignore files
 * in subdirectories.
 *
 * Inconsistencies with git behavior:
 * - if parent .gitignore has ignore rule and child has exception to that rule,
 *   file will still be ignored,
 * - node_modules is always ignored
 *
 * Differs from the eas-cli Ignore class by not using `.easignore`. Otherwise this is copied. May try
 * to merge the implementations soon.
 */ class Ignore {
    rootDir;
    ignoreMapping = [];
    constructor(rootDir){
        this.rootDir = rootDir;
    }
    async initIgnoreAsync() {
        const ignoreFilePaths = (await (0, _glob().glob)(`**/${GITIGNORE_FILENAME}`, {
            cwd: this.rootDir,
            ignore: [
                'node_modules'
            ],
            follow: false
        }))// ensure that parent dir is before child directories
        .sort((a, b)=>a.length - b.length && a.localeCompare(b));
        const ignoreMapping = await Promise.all(ignoreFilePaths.map(async (filePath)=>{
            return [
                filePath.slice(0, filePath.length - GITIGNORE_FILENAME.length),
                (0, _ignore().default)().add(await _promises().default.readFile(_path().default.join(this.rootDir, filePath), 'utf-8'))
            ];
        }));
        this.ignoreMapping = [
            [
                '',
                (0, _ignore().default)().add(DEFAULT_IGNORE)
            ],
            ...ignoreMapping
        ];
    }
    ignores(relativePath) {
        for (const [prefix, ignore] of this.ignoreMapping){
            if (relativePath.startsWith(prefix) && ignore.ignores(relativePath.slice(prefix.length))) {
                return true;
            }
        }
        return false;
    }
} //#endregion - a copy of vcs client and ignore handler from expo-updates

//# sourceMappingURL=ProjectWorkflow.js.map
