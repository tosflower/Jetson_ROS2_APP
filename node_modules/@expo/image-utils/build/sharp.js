"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    findSharpInstanceAsync: null,
    isAvailableAsync: null,
    resizeBufferAsync: null,
    sharpAsync: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get findSharpInstanceAsync () {
        return findSharpInstanceAsync;
    },
    get isAvailableAsync () {
        return isAvailableAsync;
    },
    get resizeBufferAsync () {
        return resizeBufferAsync;
    },
    get sharpAsync () {
        return sharpAsync;
    }
});
function _requireutils() {
    const data = require("@expo/require-utils");
    _requireutils = function() {
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
function _path() {
    const data = /*#__PURE__*/ _interop_require_default(require("path"));
    _path = function() {
        return data;
    };
    return data;
}
function _semver() {
    const data = /*#__PURE__*/ _interop_require_default(require("semver"));
    _semver = function() {
        return data;
    };
    return data;
}
const _env = require("./env");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const SHARP_HELP_PATTERN = /\n\nSpecify --help for available options/g;
const SHARP_REQUIRED_VERSION = '^5.2.0';
async function resizeBufferAsync(buffer, sizes) {
    const sharp = await findSharpInstanceAsync();
    (0, _assert().default)(sharp, 'Sharp is being used while its not initialized');
    const metadata = await sharp(buffer).metadata();
    // Create buffer for each size
    const resizedBuffers = await Promise.all(sizes.map((dimension)=>{
        const density = metadata.density != null ? dimension / Math.max(metadata.width, metadata.height) * metadata.density : null;
        return sharp(buffer, {
            density: density == null ? undefined : Math.ceil(density)
        }).resize(dimension, dimension, {
            fit: 'contain',
            background: 'transparent'
        }).toBuffer();
    }));
    return resizedBuffers;
}
async function isAvailableAsync() {
    if (_env.env.EXPO_IMAGE_UTILS_NO_SHARP) {
        return false;
    }
    try {
        // Attempt to find Sharp
        await findSharpInstanceAsync();
        // Only mark as available when both CLI and module are found
        return !!_sharpBin && !!_sharpInstance;
    } catch  {
        return false;
    }
}
async function sharpAsync(options, commands = []) {
    const bin = await findSharpBinAsync();
    try {
        const { stdout } = await (0, _spawnasync().default)(bin, [
            ...getOptions(options),
            ...getCommandOptions(commands)
        ]);
        const outputFilePaths = stdout.trim().split('\n');
        return outputFilePaths;
    } catch (error) {
        if (error.stderr) {
            throw new Error('\nProcessing images using sharp-cli failed: ' + error.message + '\nOutput: ' + error.stderr.replace(SHARP_HELP_PATTERN, ''));
        } else {
            throw error;
        }
    }
}
function getOptions(options) {
    const args = [];
    for (const [key, value] of Object.entries(options)){
        if (value != null && value !== false) {
            if (typeof value === 'boolean') {
                args.push(`--${key}`);
            } else if (typeof value === 'number') {
                args.push(`--${key}`, value.toFixed());
            } else {
                args.push(`--${key}`, value);
            }
        }
    }
    return args;
}
function getCommandOptions(commands) {
    const args = [];
    for (const command of commands){
        if (command.operation === 'resize') {
            const { operation, width, ...namedOptions } = command;
            args.push(operation, width.toFixed(), ...getOptions(namedOptions));
        } else {
            const { operation, ...namedOptions } = command;
            args.push(operation, ...getOptions(namedOptions));
        }
        args.push('--');
    }
    return args;
}
let _sharpBin = null;
let _sharpInstance = null;
async function findSharpBinAsync() {
    if (_sharpBin) return _sharpBin;
    try {
        let sharpCliPackagePath;
        try {
            sharpCliPackagePath = (0, _requireutils().resolveGlobal)('sharp-cli/package.json');
        } catch  {
            sharpCliPackagePath = require.resolve('sharp-cli/package.json');
        }
        let sharpPath = null;
        if (sharpCliPackagePath) {
            sharpPath = (0, _requireutils().resolveFrom)(sharpCliPackagePath, 'sharp');
            if (!sharpPath) {
                throw Object.assign(new Error(`"sharp" not found, while resolving from "${sharpCliPackagePath}"`), {
                    code: 'MODULE_NOT_FOUND'
                });
            }
        }
        const sharpCliPackage = require(sharpCliPackagePath);
        const sharpInstance = sharpPath ? require(sharpPath) : null;
        if (sharpCliPackagePath && _semver().default.satisfies(sharpCliPackage.version, SHARP_REQUIRED_VERSION) && typeof sharpCliPackage.bin.sharp === 'string' && typeof _sharpInstance?.versions?.vips === 'string') {
            _sharpBin = _path().default.join(_path().default.dirname(sharpCliPackagePath), sharpCliPackage.bin.sharp);
            _sharpInstance = sharpInstance;
            return _sharpBin;
        }
    } catch (error) {
        _sharpBin = null;
        _sharpInstance = null;
        // `sharp-cli` and/or `sharp` modules could not be found, falling back to global binary only
        if (_env.env.EXPO_IMAGE_UTILS_DEBUG) {
            console.warn('Sharp could not be loaded, reason:', error);
        }
    }
    let installedCliVersion;
    try {
        installedCliVersion = (await (0, _spawnasync().default)('sharp', [
            '--version'
        ])).stdout.toString().trim();
    } catch  {
        return '';
    }
    if (!_semver().default.satisfies(installedCliVersion, SHARP_REQUIRED_VERSION)) {
        showVersionMismatchWarning(SHARP_REQUIRED_VERSION, installedCliVersion);
        return '';
    }
    // Use the `sharp-cli` reference from PATH
    _sharpBin = 'sharp';
    return _sharpBin;
}
async function findSharpInstanceAsync() {
    if (_env.env.EXPO_IMAGE_UTILS_NO_SHARP) {
        throw new Error('Global instance of sharp-cli cannot be retrieved because sharp-cli has been disabled with the environment variable `EXPO_IMAGE_UTILS_NO_SHARP`');
    }
    // Return the cached instance
    if (_sharpInstance) return _sharpInstance;
    // Resolve `sharp-cli` and `sharp`, this also loads the sharp module if it can be found
    await findSharpBinAsync();
    if (!_sharpInstance) {
        throw new Error(`Failed to find the instance of sharp used by the global sharp-cli package.`);
    }
    return _sharpInstance;
}
let versionMismatchWarningShown = false;
function showVersionMismatchWarning(requiredCliVersion, installedCliVersion) {
    if (versionMismatchWarningShown) {
        return;
    }
    console.warn([
        _chalk().default.yellow(`Expo supports version "${requiredCliVersion}" of \`sharp-cli\`, current version: "${installedCliVersion}".`),
        _chalk().default.yellow.dim(`If you can remove or upgrade using \`npm (un)install -g sharp-cli@${requiredCliVersion}\`.`),
        _chalk().default.yellow.dim(`Or disable \`sharp-cli\` with \`EXPO_IMAGE_UTILS_NO_SHARP=1\`.`)
    ].join('\n'));
    versionMismatchWarningShown = true;
}

//# sourceMappingURL=sharp.js.map
