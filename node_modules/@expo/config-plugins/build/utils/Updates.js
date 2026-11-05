"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    FINGERPRINT_RUNTIME_VERSION_SENTINEL: null,
    getAppVersion: null,
    getDisableAntiBrickingMeasures: null,
    getExpoUpdatesPackageVersion: null,
    getNativeVersion: null,
    getRuntimeVersionAsync: null,
    getRuntimeVersionNullableAsync: null,
    getSDKVersion: null,
    getUpdateUrl: null,
    getUpdatesBsdiffPatchSupportEnabled: null,
    getUpdatesCheckOnLaunch: null,
    getUpdatesCodeSigningCertificate: null,
    getUpdatesCodeSigningMetadata: null,
    getUpdatesCodeSigningMetadataStringified: null,
    getUpdatesEnabled: null,
    getUpdatesExcludeFromBackup: null,
    getUpdatesMaxUpdatesToKeep: null,
    getUpdatesRequestHeaders: null,
    getUpdatesRequestHeadersStringified: null,
    getUpdatesTimeout: null,
    getUpdatesUseEmbeddedUpdate: null,
    resolveRuntimeVersionPolicyAsync: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get FINGERPRINT_RUNTIME_VERSION_SENTINEL () {
        return FINGERPRINT_RUNTIME_VERSION_SENTINEL;
    },
    get getAppVersion () {
        return getAppVersion;
    },
    get getDisableAntiBrickingMeasures () {
        return getDisableAntiBrickingMeasures;
    },
    get getExpoUpdatesPackageVersion () {
        return getExpoUpdatesPackageVersion;
    },
    get getNativeVersion () {
        return getNativeVersion;
    },
    get getRuntimeVersionAsync () {
        return getRuntimeVersionAsync;
    },
    get getRuntimeVersionNullableAsync () {
        return getRuntimeVersionNullableAsync;
    },
    get getSDKVersion () {
        return getSDKVersion;
    },
    get getUpdateUrl () {
        return getUpdateUrl;
    },
    get getUpdatesBsdiffPatchSupportEnabled () {
        return getUpdatesBsdiffPatchSupportEnabled;
    },
    get getUpdatesCheckOnLaunch () {
        return getUpdatesCheckOnLaunch;
    },
    get getUpdatesCodeSigningCertificate () {
        return getUpdatesCodeSigningCertificate;
    },
    get getUpdatesCodeSigningMetadata () {
        return getUpdatesCodeSigningMetadata;
    },
    get getUpdatesCodeSigningMetadataStringified () {
        return getUpdatesCodeSigningMetadataStringified;
    },
    get getUpdatesEnabled () {
        return getUpdatesEnabled;
    },
    get getUpdatesExcludeFromBackup () {
        return getUpdatesExcludeFromBackup;
    },
    get getUpdatesMaxUpdatesToKeep () {
        return getUpdatesMaxUpdatesToKeep;
    },
    get getUpdatesRequestHeaders () {
        return getUpdatesRequestHeaders;
    },
    get getUpdatesRequestHeadersStringified () {
        return getUpdatesRequestHeadersStringified;
    },
    get getUpdatesTimeout () {
        return getUpdatesTimeout;
    },
    get getUpdatesUseEmbeddedUpdate () {
        return getUpdatesUseEmbeddedUpdate;
    },
    get resolveRuntimeVersionPolicyAsync () {
        return resolveRuntimeVersionPolicyAsync;
    }
});
function _requireutils() {
    const data = require("@expo/require-utils");
    _requireutils = function() {
        return data;
    };
    return data;
}
function _sdkruntimeversions() {
    const data = require("@expo/sdk-runtime-versions");
    _sdkruntimeversions = function() {
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
function _getenv() {
    const data = require("getenv");
    _getenv = function() {
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
const _Version = /*#__PURE__*/ _interop_require_wildcard(require("../android/Version"));
const _Version1 = /*#__PURE__*/ _interop_require_wildcard(require("../ios/Version"));
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
const FINGERPRINT_RUNTIME_VERSION_SENTINEL = 'file:fingerprint';
function getExpoUpdatesPackageVersion(projectRoot) {
    const expoUpdatesPackageJsonPath = (0, _requireutils().resolveFrom)(projectRoot, 'expo-updates/package.json');
    if (!expoUpdatesPackageJsonPath) {
        return null;
    }
    const packageJson = JSON.parse(_fs().default.readFileSync(expoUpdatesPackageJsonPath, 'utf8'));
    return packageJson.version;
}
function getUpdateUrl(config) {
    return config.updates?.url ?? null;
}
function getAppVersion(config, platform) {
    if (platform === 'ios' && config.ios?.version) {
        return config.ios.version;
    }
    if (platform === 'android' && config.android?.version) {
        return config.android.version;
    }
    return config.version ?? '1.0.0';
}
function getNativeVersion(config, platform) {
    switch(platform){
        case 'ios':
            {
                const version = _Version1.getVersion(config);
                const buildNumber = _Version1.getBuildNumber(config);
                return `${version}(${buildNumber})`;
            }
        case 'android':
            {
                const version = _Version.getVersionName(config) ?? '1.0.0';
                const versionCode = _Version.getVersionCode(config);
                return `${version}(${versionCode})`;
            }
        default:
            {
                throw new Error(`"${platform}" is not a supported platform. Choose either "ios" or "android".`);
            }
    }
}
async function getRuntimeVersionNullableAsync(...[projectRoot, config, platform]) {
    try {
        return await getRuntimeVersionAsync(projectRoot, config, platform);
    } catch (e) {
        if ((0, _getenv().boolish)('EXPO_DEBUG', false)) {
            console.log(e);
        }
        return null;
    }
}
async function getRuntimeVersionAsync(projectRoot, config, platform) {
    const runtimeVersion = config[platform]?.runtimeVersion ?? config.runtimeVersion;
    if (!runtimeVersion) {
        return null;
    }
    if (typeof runtimeVersion === 'string') {
        if (runtimeVersion === FINGERPRINT_RUNTIME_VERSION_SENTINEL) {
            throw new Error(`${FINGERPRINT_RUNTIME_VERSION_SENTINEL} is a reserved value for runtime version. To use a fingerprint runtime version, use the "fingerprint" runtime version policy.`);
        }
        return runtimeVersion;
    } else if (!runtimeVersion.policy) {
        throw new Error(`"${runtimeVersion}" is not a valid runtime version. Only a string or a runtime version policy is supported.`);
    } else if (runtimeVersion.policy === 'fingerprint') {
        return FINGERPRINT_RUNTIME_VERSION_SENTINEL;
    } else {
        return await resolveRuntimeVersionPolicyAsync(runtimeVersion.policy, config, platform);
    }
}
async function resolveRuntimeVersionPolicyAsync(policy, config, platform) {
    if (policy === 'appVersion') {
        return getAppVersion(config, platform);
    } else if (policy === 'nativeVersion') {
        return getNativeVersion(config, platform);
    } else if (policy === 'sdkVersion') {
        if (!config.sdkVersion) {
            throw new Error("An SDK version must be defined when using the 'sdkVersion' runtime policy.");
        }
        return (0, _sdkruntimeversions().getRuntimeVersionForSDKVersion)(config.sdkVersion);
    } else {
        // fingerprint is resolvable only at build time (not in config plugin).
        throw new Error(`"${policy}" is not a valid runtime version policy type.`);
    }
}
function getSDKVersion(config) {
    return typeof config.sdkVersion === 'string' ? config.sdkVersion : null;
}
function getUpdatesEnabled(config) {
    // allow override of enabled property
    if (config.updates?.enabled !== undefined) {
        return config.updates.enabled;
    }
    return getUpdateUrl(config) !== null;
}
function getUpdatesUseEmbeddedUpdate(config) {
    if (config.updates?.useEmbeddedUpdate !== undefined) {
        return config.updates.useEmbeddedUpdate;
    }
    return true;
}
function getUpdatesBsdiffPatchSupportEnabled(config) {
    if (config.updates?.enableBsdiffPatchSupport !== undefined) {
        return config.updates.enableBsdiffPatchSupport;
    }
    return true;
}
function getUpdatesTimeout(config) {
    return config.updates?.fallbackToCacheTimeout ?? 0;
}
function getUpdatesMaxUpdatesToKeep(config) {
    const value = config.updates?.maxUpdatesToKeep;
    // Android manifest integer metadata is limited to signed 32-bit values.
    if (value !== undefined && (!Number.isInteger(value) || value < 2 || value > 2147483647)) {
        throw new Error('updates.maxUpdatesToKeep must be an integer between 2 and 2147483647.');
    }
    return value;
}
function getUpdatesCheckOnLaunch(config, expoUpdatesPackageVersion) {
    if (config.updates?.checkAutomatically === 'ON_ERROR_RECOVERY') {
        // native 'ERROR_RECOVERY_ONLY' option was only introduced in 0.11.x
        if (expoUpdatesPackageVersion && _semver().default.gte(expoUpdatesPackageVersion, '0.11.0')) {
            return 'ERROR_RECOVERY_ONLY';
        }
        return 'NEVER';
    } else if (config.updates?.checkAutomatically === 'ON_LOAD') {
        return 'ALWAYS';
    } else if (config.updates?.checkAutomatically === 'WIFI_ONLY') {
        return 'WIFI_ONLY';
    } else if (config.updates?.checkAutomatically === 'NEVER') {
        return 'NEVER';
    }
    return 'ALWAYS';
}
function getUpdatesCodeSigningCertificate(projectRoot, config) {
    const codeSigningCertificatePath = config.updates?.codeSigningCertificate;
    if (!codeSigningCertificatePath) {
        return undefined;
    }
    const finalPath = _path().default.join(projectRoot, codeSigningCertificatePath);
    if (!_fs().default.existsSync(finalPath)) {
        throw new Error(`File not found at \`updates.codeSigningCertificate\` path: ${finalPath}`);
    }
    return _fs().default.readFileSync(finalPath, 'utf8');
}
function getUpdatesCodeSigningMetadata(config) {
    return config.updates?.codeSigningMetadata;
}
function getUpdatesCodeSigningMetadataStringified(config) {
    const metadata = getUpdatesCodeSigningMetadata(config);
    if (!metadata) {
        return undefined;
    }
    return JSON.stringify(metadata);
}
function getUpdatesRequestHeaders(config) {
    return config.updates?.requestHeaders;
}
function getUpdatesRequestHeadersStringified(config) {
    const metadata = getUpdatesRequestHeaders(config);
    if (!metadata) {
        return undefined;
    }
    return JSON.stringify(metadata);
}
function getDisableAntiBrickingMeasures(config) {
    return config.updates?.disableAntiBrickingMeasures;
}
function getUpdatesExcludeFromBackup(config) {
    return config.updates?.excludeFromBackup ?? false;
}

//# sourceMappingURL=Updates.js.map
