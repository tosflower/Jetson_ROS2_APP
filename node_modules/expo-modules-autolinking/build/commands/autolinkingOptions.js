"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createAutolinkingOptionsLoader: null,
    filterMapSearchPaths: null,
    registerAutolinkingArguments: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get createAutolinkingOptionsLoader () {
        return createAutolinkingOptionsLoader;
    },
    get filterMapSearchPaths () {
        return filterMapSearchPaths;
    },
    get registerAutolinkingArguments () {
        return registerAutolinkingArguments;
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const isJSONObject = (x)=>x != null && typeof x === 'object';
const resolvePathMaybe = (target, basePath)=>{
    if (typeof target !== 'string') {
        return null;
    }
    let resolved = _path().default.resolve(basePath, target);
    if (_fs().default.existsSync(resolved)) {
        return resolved;
    } else if ((resolved = _path().default.resolve(target)) && _fs().default.existsSync(target)) {
        // TODO(@kitten): This is here for legacy support. However, this *will* be inconsistent
        // This relies on the current working directory, and hence, can behave differently depending
        // on where the command was invoked.
        return target;
    } else {
        return null;
    }
};
const filterMapSearchPaths = (searchPaths, basePath)=>{
    if (Array.isArray(searchPaths)) {
        return searchPaths.map((searchPath)=>resolvePathMaybe(searchPath, basePath)).filter((searchPath)=>searchPath != null);
    } else {
        return undefined;
    }
};
const parsePackageJsonOptions = (packageJson, appRoot, platform)=>{
    const expo = isJSONObject(packageJson.expo) ? packageJson.expo : null;
    const autolinkingOptions = expo && isJSONObject(expo.autolinking) ? expo.autolinking : null;
    let platformOptions = null;
    if (platform) {
        platformOptions = autolinkingOptions && isJSONObject(autolinkingOptions[platform]) ? autolinkingOptions[platform] : null;
        if (!platformOptions && platform === 'apple') {
            // NOTE: `platform: 'apple'` has a fallback on `ios`. This doesn't make much sense, since apple should
            // be the base option for other apple platforms, but changing this now is a breaking change
            platformOptions = autolinkingOptions && isJSONObject(autolinkingOptions.ios) ? autolinkingOptions.ios : null;
        }
    }
    const mergedOptions = {
        ...autolinkingOptions,
        ...platformOptions
    };
    // NOTE(@kitten): For `include`, we don't override options per platform, but merge the lists
    if (Array.isArray(autolinkingOptions?.include) && Array.isArray(platformOptions?.include)) {
        mergedOptions.include = [
            ...autolinkingOptions.include,
            ...platformOptions.include
        ];
    }
    const outputOptions = {};
    // legacy_shallowReactNativeLinking
    if (mergedOptions.legacy_shallowReactNativeLinking != null) {
        outputOptions.legacy_shallowReactNativeLinking = !!mergedOptions.legacy_shallowReactNativeLinking;
    }
    // searchPaths
    if (typeof mergedOptions.searchPaths === 'string' || Array.isArray(mergedOptions.searchPaths)) {
        const rawSearchPaths = typeof mergedOptions.searchPaths === 'string' ? [
            mergedOptions.searchPaths
        ] : mergedOptions.searchPaths;
        outputOptions.searchPaths = filterMapSearchPaths(rawSearchPaths, appRoot);
    }
    // nativeModulesDir
    if (typeof mergedOptions.nativeModulesDir === 'string') {
        outputOptions.nativeModulesDir = resolvePathMaybe(mergedOptions.nativeModulesDir, appRoot);
    }
    // exclude
    if (Array.isArray(mergedOptions.exclude)) {
        outputOptions.exclude = mergedOptions.exclude.filter((x)=>typeof x === 'string');
    }
    // include
    if (Array.isArray(mergedOptions.include)) {
        outputOptions.include = mergedOptions.include.filter((x)=>typeof x === 'string');
    }
    // buildFromSource
    if (Array.isArray(mergedOptions.buildFromSource)) {
        outputOptions.buildFromSource = mergedOptions.buildFromSource.filter((x)=>typeof x === 'string');
    }
    // flags
    if (isJSONObject(mergedOptions.flags)) {
        outputOptions.flags = {
            ...mergedOptions.flags
        };
    }
    return outputOptions;
};
function registerAutolinkingArguments(command) {
    return command.option('-e, --exclude <exclude...>', 'Package names to exclude when looking up for modules.', (value, previous)=>(previous ?? []).concat(value)).option('-p, --platform [platform]', 'The platform that the resulting modules must support. Available options: "apple", "android"', 'apple').option(// NOTE(@kitten): For backwards-compatibility, this is still called `project-root`, but it
    // really is a replacement path for the current working directory. Henceforth called `commandRoot`
    '--project-root <projectRoot>', 'The path to the root of the project. Defaults to current working directory', process.cwd());
}
const parseExtraArgumentsOptions = (args)=>{
    const cwd = process.cwd();
    const platform = args.platform || undefined;
    const commandRoot = resolvePathMaybe(args.projectRoot, cwd) || cwd;
    const extraSearchPaths = filterMapSearchPaths(args.searchPaths, commandRoot);
    const extraExclude = args.exclude?.filter((name)=>typeof name === 'string');
    return {
        platform,
        commandRoot,
        extraSearchPaths,
        extraExclude
    };
};
const findPackageJsonPathAsync = async (commandRoot)=>{
    const root = commandRoot || process.cwd();
    for(let dir = root; _path().default.dirname(dir) !== dir; dir = _path().default.dirname(dir)){
        const file = _path().default.resolve(dir, 'package.json');
        if (_fs().default.existsSync(file)) {
            return file;
        }
    }
    throw new Error(`Couldn't find "package.json" up from path "${root}"`);
};
const loadPackageJSONAsync = async (packageJsonPath)=>{
    const packageJsonText = await _fs().default.promises.readFile(packageJsonPath, 'utf8');
    return JSON.parse(packageJsonText);
};
function createAutolinkingOptionsLoader(argumentsOptions) {
    const extraArgumentsOptions = parseExtraArgumentsOptions(argumentsOptions ?? {});
    const { commandRoot } = extraArgumentsOptions;
    let _packageJsonPath$;
    const getPackageJsonPath = ()=>{
        return _packageJsonPath$ || (_packageJsonPath$ = findPackageJsonPathAsync(commandRoot));
    };
    let _packageJson$;
    const getPackageJson = async ()=>_packageJson$ || (_packageJson$ = loadPackageJSONAsync(await getPackageJsonPath()));
    const getAppRoot = async ()=>_path().default.dirname(await getPackageJsonPath());
    return {
        getCommandRoot: ()=>commandRoot,
        getAppRoot,
        async getPlatformOptions (platform = extraArgumentsOptions.platform) {
            const packageJson = await getPackageJson();
            const appRoot = await getAppRoot();
            const options = parsePackageJsonOptions(packageJson, appRoot, platform);
            if (extraArgumentsOptions.extraSearchPaths) {
                options.searchPaths = [
                    ...extraArgumentsOptions.extraSearchPaths,
                    ...options.searchPaths ?? []
                ];
            }
            if (extraArgumentsOptions.extraExclude) {
                options.exclude = [
                    ...options.exclude ?? [],
                    ...extraArgumentsOptions.extraExclude
                ];
            }
            return {
                ...normalizeAutolinkingOptions(options, appRoot),
                platform
            };
        }
    };
}
const normalizeAutolinkingOptions = (options, appRoot)=>{
    return {
        legacy_shallowReactNativeLinking: options.legacy_shallowReactNativeLinking ?? false,
        searchPaths: options.searchPaths ?? [],
        nativeModulesDir: options.nativeModulesDir ? resolvePathMaybe(options.nativeModulesDir, appRoot) ?? null : resolvePathMaybe('./modules', appRoot) ?? null,
        exclude: options.exclude ?? [],
        include: options.include ?? [],
        buildFromSource: options.buildFromSource,
        flags: options.flags
    };
};

//# sourceMappingURL=autolinkingOptions.js.map
