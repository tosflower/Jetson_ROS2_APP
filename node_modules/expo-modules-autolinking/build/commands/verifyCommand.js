"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    verifyCommand: null,
    verifySearchResults: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get verifyCommand () {
        return verifyCommand;
    },
    get verifySearchResults () {
        return verifySearchResults;
    }
});
function _chalk() {
    const data = /*#__PURE__*/ _interop_require_default(require("chalk"));
    _chalk = function() {
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
const _dependencies = require("../dependencies");
const _autolinkingOptions = require("./autolinkingOptions");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// NOTE(@kitten): These are excluded explicitly, but we want to include them for the verify command explicitly
const INCLUDE_PACKAGES = [
    'react-native',
    'react-native-tvos'
];
const AUTOLINKING_PLATFORMS = [
    'android',
    'ios',
    'web'
];
function verifyCommand(cli) {
    return (0, _autolinkingOptions.registerAutolinkingArguments)(cli.command('verify')).option('-v, --verbose', 'Output all results instead of just warnings.', ()=>true, false).option('-j, --json', 'Output results in the plain JSON format.', ()=>true, false).option('-p, --platform [platform]', `The platform to validate native modules for. Available options: ${[
        ...AUTOLINKING_PLATFORMS,
        'native',
        'all'
    ].map((x)=>`"${x}"`).join(', ')}`, 'all').action(async (commandArguments)=>{
        let platforms;
        // NOTE(@kitten): Preserve `both` for backwards-compatibility
        if (commandArguments.platform === 'both' || commandArguments.platform === 'native') {
            platforms = [
                'android',
                'ios'
            ];
        } else if (commandArguments.platform === 'all') {
            platforms = AUTOLINKING_PLATFORMS;
        } else {
            platforms = [
                commandArguments.platform
            ];
        }
        const autolinkingOptionsLoader = (0, _autolinkingOptions.createAutolinkingOptionsLoader)(commandArguments);
        const appRoot = await autolinkingOptionsLoader.getAppRoot();
        const linker = (0, _dependencies.makeCachedDependenciesLinker)({
            projectRoot: appRoot
        });
        const results = (0, _dependencies.mergeResolutionResults)(await Promise.all(platforms.map((platform)=>(0, _dependencies.scanDependencyResolutionsForPlatform)(linker, platform, INCLUDE_PACKAGES))));
        await verifySearchResults(results, {
            appRoot,
            verbose: !!commandArguments.verbose,
            json: !!commandArguments.json
        });
    });
}
async function verifySearchResults(results, options) {
    const { appRoot } = options;
    async function getHumanReadableDependency(dependency) {
        let version = dependency.version || null;
        if (!version) {
            try {
                const pkgContents = await _fs().default.promises.readFile(_path().default.join(dependency.path, 'package.json'), 'utf8');
                const pkg = JSON.parse(pkgContents);
                if (pkg && typeof pkg === 'object' && 'version' in pkg && typeof pkg.version === 'string') {
                    version = pkg.version;
                }
            } catch (error) {
                version = null;
            }
        }
        const relative = _path().default.relative(appRoot, dependency.originPath);
        return version ? `${dependency.name}@${version} (at: ${relative})` : `${dependency.name} at: ${relative}`;
    }
    const groups = {
        reactNativeProjectConfig: [],
        searchPaths: [],
        dependencies: [],
        duplicates: []
    };
    for(const moduleName in results){
        const revision = results[moduleName];
        if (!revision) {
            continue;
        } else if (revision.duplicates?.length) {
            groups.duplicates.push(revision);
        } else {
            switch(revision.source){
                case _dependencies.DependencyResolutionSource.RN_CLI_LOCAL:
                    groups.reactNativeProjectConfig.push(revision);
                    break;
                case _dependencies.DependencyResolutionSource.SEARCH_PATH:
                    groups.searchPaths.push(revision);
                    break;
                case _dependencies.DependencyResolutionSource.RECURSIVE_RESOLUTION:
                    groups.dependencies.push(revision);
                    break;
            }
        }
    }
    if (options.json) {
        console.log(JSON.stringify(groups));
        return;
    }
    if (options.verbose) {
        const sortResolutions = (resolutions)=>[
                ...resolutions
            ].sort((a, b)=>a.name.localeCompare(b.name));
        if (groups.reactNativeProjectConfig.length) {
            console.log(`🔎  Found ${groups.reactNativeProjectConfig.length} modules from React Native project config`);
            for (const revision of sortResolutions(groups.reactNativeProjectConfig)){
                console.log(` - ${await getHumanReadableDependency(revision)}`);
            }
        }
        if (groups.searchPaths.length) {
            console.log(`🔎  Found ${groups.searchPaths.length} modules in search paths`);
            for (const revision of sortResolutions(groups.searchPaths)){
                console.log(` - ${await getHumanReadableDependency(revision)}`);
            }
        }
        console.log(`🔎  Found ${groups.dependencies.length} modules in dependencies`);
        for (const revision of sortResolutions(groups.dependencies)){
            console.log(` - ${await getHumanReadableDependency(revision)}`);
        }
    }
    if (groups.duplicates.length) {
        for (const revision of groups.duplicates){
            console.warn(`⚠️  Found duplicate installations for ${_chalk().default.green(revision.name)}`);
            const revisions = [
                revision,
                ...revision.duplicates ?? []
            ];
            for(let idx = 0; idx < revisions.length; idx++){
                const prefix = idx !== revisions.length - 1 ? '├─' : '└─';
                const duplicate = revisions[idx];
                console.log(`  ${prefix} ${await getHumanReadableDependency(duplicate)}`);
            }
        }
        console.warn('⚠️  Multiple versions of the same module may introduce some side effects or compatibility issues.\n' + `Resolve your dependency issues and deduplicate your dependencies. Learn more: https://expo.fyi/resolving-dependency-issues`);
    } else {
        console.log('✅ Everything is fine!');
    }
}

//# sourceMappingURL=verifyCommand.js.map
