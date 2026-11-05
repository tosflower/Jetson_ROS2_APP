"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    evalConfig: null,
    resolveConfigExport: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get evalConfig () {
        return evalConfig;
    },
    get resolveConfigExport () {
        return resolveConfigExport;
    }
});
function _requireutils() {
    const data = require("@expo/require-utils");
    _requireutils = function() {
        return data;
    };
    return data;
}
const _Errors = require("./Errors");
const _Serialize = require("./Serialize");
const _environment = require("./environment");
function evalConfig(configFile, request) {
    const mod = (0, _requireutils().loadModuleSync)(configFile);
    return resolveConfigExport(mod, configFile, request);
}
function resolveConfigExport(result, configFile, request) {
    // add key to static config that we'll check for after the dynamic is evaluated
    // to see if the static config was used in determining the dynamic
    const hasBaseStaticConfig = _environment.NON_STANDARD_SYMBOL;
    if (request?.config) {
        // @ts-ignore
        request.config[hasBaseStaticConfig] = true;
    }
    if (result.default != null) {
        result = result.default;
    }
    const exportedObjectType = typeof result;
    if (typeof result === 'function') {
        result = result(request);
    }
    if (result instanceof Promise) {
        throw new _Errors.ConfigError(`Config file ${configFile} cannot return a Promise.`, 'INVALID_CONFIG');
    }
    // If the key is not added, it suggests that the static config was not used as the base for the dynamic.
    // note(Keith): This is the most common way to use static and dynamic config together, but not the only way.
    // Hence, this is only output from getConfig() for informational purposes for use by tools like Expo Doctor
    // to suggest that there *may* be a problem.
    const mayHaveUnusedStaticConfig = // @ts-ignore
    request?.config?.[hasBaseStaticConfig] && !result?.[hasBaseStaticConfig];
    if (result) {
        delete result._hasBaseStaticConfig;
    }
    // If the expo object exists, ignore all other values.
    if (result?.expo) {
        result = (0, _Serialize.serializeSkippingMods)(result.expo);
    } else {
        result = (0, _Serialize.serializeSkippingMods)(result);
    }
    return {
        config: result,
        exportedObjectType,
        mayHaveUnusedStaticConfig
    };
}

//# sourceMappingURL=evalConfig.js.map
