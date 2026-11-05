"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getBareAndroidSourcesAsync: null,
    getBareIosSourcesAsync: null,
    getCoreAutolinkingSourcesFromExpoAndroid: null,
    getCoreAutolinkingSourcesFromExpoIos: null,
    getCoreAutolinkingSourcesFromRncCliAsync: null,
    getGitIgnoreSourcesAsync: null,
    getPackageJsonScriptSourcesAsync: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getBareAndroidSourcesAsync () {
        return getBareAndroidSourcesAsync;
    },
    get getBareIosSourcesAsync () {
        return getBareIosSourcesAsync;
    },
    get getCoreAutolinkingSourcesFromExpoAndroid () {
        return getCoreAutolinkingSourcesFromExpoAndroid;
    },
    get getCoreAutolinkingSourcesFromExpoIos () {
        return getCoreAutolinkingSourcesFromExpoIos;
    },
    get getCoreAutolinkingSourcesFromRncCliAsync () {
        return getCoreAutolinkingSourcesFromRncCliAsync;
    },
    get getGitIgnoreSourcesAsync () {
        return getGitIgnoreSourcesAsync;
    },
    get getPackageJsonScriptSourcesAsync () {
        return getPackageJsonScriptSourcesAsync;
    }
});
function _env() {
    const data = require("@expo/env");
    _env = function() {
        return data;
    };
    return data;
}
function _spawnasync() {
    const data = /*#__PURE__*/ _interop_require_default(require("@expo/spawn-async"));
    _spawnasync = function() {
        return data;
    };
    return data;
}
function _assert() {
    const data = /*#__PURE__*/ _interop_require_default(require("assert"));
    _assert = function() {
        return data;
    };
    return data;
}
function _chalk() {
    const data = /*#__PURE__*/ _interop_require_default(require("chalk"));
    _chalk = function() {
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
function _resolvefrom() {
    const data = /*#__PURE__*/ _interop_require_default(require("resolve-from"));
    _resolvefrom = function() {
        return data;
    };
    return data;
}
const _ExpoResolver = require("../ExpoResolver");
const _Path = require("../utils/Path");
const _Profile = require("../utils/Profile");
const _AutolinkingConfig = require("./AutolinkingConfig");
const _SourceSkips = require("./SourceSkips");
const _Utils = require("./Utils");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const debug = require('debug')('expo:fingerprint:sourcer:Bare');
async function getBareAndroidSourcesAsync(projectRoot, options) {
    if (options.platforms.includes('android')) {
        const result = await (0, _Utils.getFileBasedHashSourceAsync)(projectRoot, 'android', 'bareNativeDir');
        if (result != null) {
            debug(`Adding bare native dir - ${_chalk().default.dim('android')}`);
            return [
                result
            ];
        }
    }
    return [];
}
async function getBareIosSourcesAsync(projectRoot, options) {
    if (options.platforms.includes('ios')) {
        const result = await (0, _Utils.getFileBasedHashSourceAsync)(projectRoot, 'ios', 'bareNativeDir');
        if (result != null) {
            debug(`Adding bare native dir - ${_chalk().default.dim('ios')}`);
            return [
                result
            ];
        }
    }
    return [];
}
async function getPackageJsonScriptSourcesAsync(projectRoot, options) {
    if (options.sourceSkips & _SourceSkips.SourceSkips.PackageJsonScriptsAll) {
        return [];
    }
    let packageJson;
    try {
        packageJson = require((0, _resolvefrom().default)(_path().default.resolve(projectRoot), './package.json'));
    } catch (e) {
        debug(`Unable to read package.json from ${_path().default.resolve(projectRoot)}/package.json: ` + e);
        return [];
    }
    const results = [];
    if (packageJson.scripts) {
        debug(`Adding package.json contents - ${_chalk().default.dim('scripts')}`);
        const id = 'packageJson:scripts';
        results.push({
            type: 'contents',
            id,
            contents: normalizePackageJsonScriptSources(packageJson.scripts, options),
            reasons: [
                id
            ]
        });
    }
    return results;
}
async function getGitIgnoreSourcesAsync(projectRoot, options) {
    if (options.sourceSkips & _SourceSkips.SourceSkips.GitIgnore) {
        return [];
    }
    const result = await (0, _Utils.getFileBasedHashSourceAsync)(projectRoot, '.gitignore', 'bareGitIgnore');
    if (result != null) {
        debug(`Adding file - ${_chalk().default.dim('.gitignore')}`);
        return [
            result
        ];
    }
    return [];
}
async function getCoreAutolinkingSourcesFromRncCliAsync(projectRoot, options, useRNCoreAutolinkingFromExpo) {
    if (useRNCoreAutolinkingFromExpo === true) {
        return [];
    }
    try {
        const { stdout } = await (0, _spawnasync().default)('npx', [
            'react-native',
            'config'
        ], {
            cwd: projectRoot,
            env: (0, _env().getOriginalEnv)()
        });
        const config = JSON.parse(stdout);
        const results = await parseCoreAutolinkingSourcesAsync({
            config,
            contentsId: 'rncoreAutolinkingConfig',
            reasons: [
                'rncoreAutolinking'
            ],
            options
        });
        return results;
    } catch (e) {
        debug(_chalk().default.red(`Error adding react-native core autolinking sources.\n${e}`));
        return [];
    }
}
async function getCoreAutolinkingSourcesFromExpoAndroid(projectRoot, options, useRNCoreAutolinkingFromExpo) {
    if (useRNCoreAutolinkingFromExpo === false || !options.platforms.includes('android')) {
        return [];
    }
    const args = [
        (0, _ExpoResolver.resolveExpoAutolinkingCliPath)(projectRoot),
        'react-native-config',
        '--json',
        '--platform',
        'android'
    ];
    try {
        const { stdout } = await (0, _spawnasync().default)('node', args, {
            cwd: projectRoot,
            env: (0, _env().getOriginalEnv)()
        });
        const config = JSON.parse(stdout);
        const results = await parseCoreAutolinkingSourcesAsync({
            config,
            contentsId: 'rncoreAutolinkingConfig:android',
            reasons: [
                'rncoreAutolinkingAndroid'
            ],
            options,
            platform: 'android'
        });
        return results;
    } catch (e) {
        debug(_chalk().default.red(`Error adding react-native core autolinking sources for android.\n${e}`));
        return [];
    }
}
async function getCoreAutolinkingSourcesFromExpoIos(projectRoot, options, useRNCoreAutolinkingFromExpo) {
    if (useRNCoreAutolinkingFromExpo === false || !options.platforms.includes('ios')) {
        return [];
    }
    try {
        const { stdout } = await (0, _spawnasync().default)('node', [
            (0, _ExpoResolver.resolveExpoAutolinkingCliPath)(projectRoot),
            'react-native-config',
            '--json',
            '--platform',
            'ios'
        ], {
            cwd: projectRoot,
            env: (0, _env().getOriginalEnv)()
        });
        const config = JSON.parse(stdout);
        const results = await parseCoreAutolinkingSourcesAsync({
            config,
            contentsId: 'rncoreAutolinkingConfig:ios',
            reasons: [
                'rncoreAutolinkingIos'
            ],
            options,
            platform: 'ios'
        });
        return results;
    } catch (e) {
        debug(_chalk().default.red(`Error adding react-native core autolinking sources for ios.\n${e}`));
        return [];
    }
}
async function parseCoreAutolinkingSourcesAsync({ config, reasons, contentsId, platform, options }) {
    const logTag = platform ? `react-native core autolinking dir for ${platform}` : 'react-native core autolinking dir';
    const results = [];
    const root = await (0, _Utils.maybeGetRealPathAsync)(config.root);
    const autolinkingConfig = {};
    for (const [depName, depData] of Object.entries(config.dependencies)){
        try {
            stripRncoreAutolinkingAbsolutePaths(depData, root);
            const filePath = (0, _Path.toPosixPath)(depData.root);
            debug(`Adding ${logTag} - ${_chalk().default.dim(filePath)}`);
            results.push(await (0, _Utils.createAutolinkingHashSourceAsync)(root, filePath, reasons, options.nativeModuleSourceType));
            autolinkingConfig[depName] = depData;
        } catch (e) {
            debug(_chalk().default.red(`Error adding ${logTag} - ${depName}.\n${e}`));
        }
    }
    results.push({
        type: 'contents',
        id: contentsId,
        contents: JSON.stringify((0, _Profile.profile)(options, _AutolinkingConfig.normalizeAutolinkingConfig)(autolinkingConfig, {
            stripPaths: !!(options.sourceSkips & _SourceSkips.SourceSkips.AutolinkingConfigPaths),
            roots: [
                root
            ]
        })),
        reasons
    });
    return results;
}
function stripRncoreAutolinkingAbsolutePaths(dependency, root) {
    (0, _assert().default)(dependency.root);
    const dependencyRoot = dependency.root;
    const cmakeDepRoot = _nodeprocess().default.platform === 'win32' ? dependencyRoot.replace(/\\/g, '/') : dependencyRoot;
    dependency.root = (0, _Path.toPosixPath)(_path().default.relative(root, dependencyRoot));
    for (const platformData of Object.values(dependency.platforms)){
        for (const [key, value] of Object.entries(platformData ?? {})){
            let newValue;
            if (_nodeprocess().default.platform === 'win32' && [
                'cmakeListsPath',
                'cxxModuleCMakeListsPath'
            ].includes(key)) {
                // CMake paths on Windows are serving in slashes,
                // we have to check startsWith with the same slashes.
                newValue = value?.startsWith?.(cmakeDepRoot) ? (0, _Path.toPosixPath)(_path().default.relative(root, value)) : value;
            } else {
                newValue = value?.startsWith?.(dependencyRoot) ? (0, _Path.toPosixPath)(_path().default.relative(root, value)) : value;
            }
            platformData[key] = newValue;
        }
    }
}
function normalizePackageJsonScriptSources(scripts, options) {
    if (options.sourceSkips & _SourceSkips.SourceSkips.PackageJsonAndroidAndIosScriptsIfNotContainRun) {
        // Replicate the behavior of `expo prebuild`
        if (!scripts.android?.includes('run') || scripts.android === 'expo run:android') {
            delete scripts.android;
        }
        if (!scripts.ios?.includes('run') || scripts.ios === 'expo run:ios') {
            delete scripts.ios;
        }
    }
    return JSON.stringify(scripts);
}

//# sourceMappingURL=Bare.js.map
