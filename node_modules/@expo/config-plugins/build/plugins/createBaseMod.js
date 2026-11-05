"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    assertModResults: null,
    createBaseMod: null,
    createPlatformBaseMod: null,
    provider: null,
    withGeneratedBaseMods: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get assertModResults () {
        return assertModResults;
    },
    get createBaseMod () {
        return createBaseMod;
    },
    get createPlatformBaseMod () {
        return createPlatformBaseMod;
    },
    get provider () {
        return provider;
    },
    get withGeneratedBaseMods () {
        return withGeneratedBaseMods;
    }
});
function _debug() {
    const data = /*#__PURE__*/ _interop_require_default(require("debug"));
    _debug = function() {
        return data;
    };
    return data;
}
const _withMod = require("./withMod");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const debug = (0, _debug().default)('expo:config-plugins:base-mods');
function createBaseMod({ methodName, platform, modName, getFilePath, read, write, isIntrospective }) {
    const withUnknown = (config, _props)=>{
        const props = _props || {};
        return (0, _withMod.withBaseMod)(config, {
            platform,
            mod: modName,
            skipEmptyMod: props.skipEmptyMod ?? true,
            saveToInternal: props.saveToInternal ?? false,
            isProvider: true,
            isIntrospective,
            async action ({ modRequest: { nextMod, ...modRequest }, ...config }) {
                try {
                    let results = {
                        ...config,
                        modRequest
                    };
                    const filePath = await getFilePath(results, props);
                    debug(`mods.${platform}.${modName}: file path: ${filePath || '[skipped]'}`);
                    const modResults = await read(filePath, results, props);
                    results = await nextMod({
                        ...results,
                        modResults,
                        modRequest
                    });
                    assertModResults(results, modRequest.platform, modRequest.modName);
                    await write(filePath, results, props);
                    return results;
                } catch (error) {
                    error.message = `[${platform}.${modName}]: ${methodName}: ${error.message}`;
                    throw error;
                }
            }
        });
    };
    if (methodName) {
        Object.defineProperty(withUnknown, 'name', {
            value: methodName
        });
    }
    return withUnknown;
}
function assertModResults(results, platformName, modName) {
    // If the results came from a mod, they'd be in the form of [config, data].
    // Ensure the results are an array and omit the data since it should've been written by a data provider plugin.
    const ensuredResults = results;
    // Sanity check to help locate non compliant mods.
    if (!ensuredResults || typeof ensuredResults !== 'object' || !ensuredResults?.mods) {
        throw new Error(`Mod \`mods.${platformName}.${modName}\` evaluated to an object that is not a valid project config. Instead got: ${JSON.stringify(ensuredResults)}`);
    }
    return ensuredResults;
}
function upperFirst(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}
function createPlatformBaseMod({ modName, ...props }) {
    // Generate the function name to ensure it's uniform and also to improve stack traces.
    const methodName = `with${upperFirst(props.platform)}${upperFirst(modName)}BaseMod`;
    return createBaseMod({
        methodName,
        modName,
        ...props
    });
}
function provider(props) {
    return props;
}
function withGeneratedBaseMods(config, { platform, providers, ...props }) {
    return Object.entries(providers).reduce((config, [modName, value])=>{
        const baseMod = createPlatformBaseMod({
            platform,
            modName,
            ...value
        });
        return baseMod(config, props);
    }, config);
}

//# sourceMappingURL=createBaseMod.js.map
