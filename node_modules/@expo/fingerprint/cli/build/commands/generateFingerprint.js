"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "generateFingerprintAsync", {
    enumerable: true,
    get: function() {
        return generateFingerprintAsync;
    }
});
function _chalk() {
    const data = /*#__PURE__*/ _interop_require_default(require("chalk"));
    _chalk = function() {
        return data;
    };
    return data;
}
function _getenv() {
    const data = require("getenv");
    _getenv = function() {
        return data;
    };
    return data;
}
const _index = require("../../../build/index");
const _args = require("../utils/args");
const _errors = require("../utils/errors");
const _log = /*#__PURE__*/ _interop_require_wildcard(require("../utils/log"));
const _withConsoleDisabledAsync = require("../utils/withConsoleDisabledAsync");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const generateFingerprintAsync = async (argv)=>{
    const args = (0, _args.assertArgs)({
        // Types
        '--help': Boolean,
        '--preset': String,
        '--platform': [
            String
        ],
        '--concurrent-io-limit': Number,
        '--hash-algorithm': String,
        '--ignore-path': [
            String
        ],
        '--source-skips': Number,
        '--debug': Boolean,
        // Aliases
        '-h': '--help'
    }, argv ?? []);
    if (args['--help']) {
        _log.exit((0, _chalk().default)`
{bold Description}
Generate fingerprint for a project

{bold Usage}
  {dim $} npx @expo/fingerprint fingerprint:generate

  Options
  --preset <string>                    Preset to derive defaults from: 'strict', 'balanced' (default), or 'relaxed'. An explicit --source-skips overrides the preset.
  --platform <string[]>                Limit native files to those for specified platforms. Default is ['android', 'ios'].
  --concurrent-io-limit <number>       I/O concurrent limit. Default is the number of CPU cores.
  --hash-algorithm <string>            The algorithm to use for crypto.createHash(). Default is 'sha1'.
  --ignore-path <string[]>             Ignore files and directories from hashing. The supported pattern is the same as glob().
  --source-skips <number>              Skips some sources from fingerprint. Value is the result of bitwise-OR'ing desired values of SourceSkips. Overrides the preset's source skips.
  --debug                              Whether to include verbose debug information in output
  -h, --help                           Output usage information
    `, 0);
    }
    const platforms = args['--platform'];
    if (platforms) {
        if (!Array.isArray(platforms)) {
            throw new _errors.CommandError(`Invalid value for --platform`);
        }
        if (!platforms.every((elem)=>[
                'ios',
                'android'
            ].includes(elem))) {
            throw new _errors.CommandError(`Invalid value for --platform: ${platforms}`);
        }
    }
    const concurrentIoLimit = args['--concurrent-io-limit'];
    if (concurrentIoLimit && !Number.isInteger(concurrentIoLimit)) {
        throw new _errors.CommandError(`Invalid value for --concurrent-io-limit argument: ${concurrentIoLimit}`);
    }
    const hashAlgorithm = args['--hash-algorithm'];
    if (hashAlgorithm && typeof hashAlgorithm !== 'string') {
        throw new _errors.CommandError(`Invalid value for --hash-algorithm: ${hashAlgorithm}`);
    }
    const ignorePaths = args['--ignore-path'];
    if (ignorePaths) {
        if (!Array.isArray(ignorePaths)) {
            throw new _errors.CommandError(`Invalid value for --ignore-path`);
        }
        if (!ignorePaths.every((elem)=>typeof elem === 'string')) {
            throw new _errors.CommandError(`Invalid value for --ignore-path: ${ignorePaths}`);
        }
    }
    const sourceSkips = args['--source-skips'];
    if (sourceSkips && !Number.isInteger(sourceSkips)) {
        throw new _errors.CommandError(`Invalid value for --source-skips argument: ${sourceSkips}`);
    }
    const preset = args['--preset'];
    if (preset && ![
        'strict',
        'balanced',
        'relaxed'
    ].includes(preset)) {
        throw new _errors.CommandError(`Invalid value for --preset argument: ${preset}. Supported presets are 'strict', 'balanced', and 'relaxed'.`);
    }
    const options = {
        debug: !!process.env.DEBUG || args['--debug'],
        silent: true,
        useRNCoreAutolinkingFromExpo: process.env['USE_RNCORE_AUTOLINKING_FROM_EXPO'] ? (0, _getenv().boolish)('USE_RNCORE_AUTOLINKING_FROM_EXPO') : undefined,
        ...preset ? {
            preset
        } : null,
        ...platforms ? {
            platforms
        } : null,
        ...concurrentIoLimit ? {
            concurrentIoLimit
        } : null,
        ...hashAlgorithm ? {
            hashAlgorithm
        } : null,
        ...ignorePaths ? {
            ignorePaths
        } : null,
        ...sourceSkips ? {
            sourceSkips
        } : null
    };
    const projectRoot = (0, _args.getProjectRoot)(args);
    const result = await (0, _withConsoleDisabledAsync.withConsoleDisabledAsync)(async ()=>{
        try {
            return await (0, _index.createFingerprintAsync)(projectRoot, options);
        } catch (e) {
            throw new _errors.CommandError(e.message);
        }
    });
    console.log(JSON.stringify(result));
};

//# sourceMappingURL=generateFingerprint.js.map
