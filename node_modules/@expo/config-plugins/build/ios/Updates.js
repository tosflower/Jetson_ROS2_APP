"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    Config: null,
    setUpdatesConfigAsync: null,
    setVersionsConfigAsync: null,
    withUpdates: null,
    withUpdatesNativeDebugPodfileProps: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get Config () {
        return Config;
    },
    get setUpdatesConfigAsync () {
        return setUpdatesConfigAsync;
    },
    get setVersionsConfigAsync () {
        return setVersionsConfigAsync;
    },
    get withUpdates () {
        return withUpdates;
    },
    get withUpdatesNativeDebugPodfileProps () {
        return withUpdatesNativeDebugPodfileProps;
    }
});
const _iosplugins = require("../plugins/ios-plugins");
const _withPlugins = require("../plugins/withPlugins");
const _Updates = require("../utils/Updates");
const _warnings = require("../utils/warnings");
const _BuildProperties = require("./BuildProperties");
var Config = /*#__PURE__*/ function(Config) {
    Config["ENABLED"] = "EXUpdatesEnabled";
    Config["CHECK_ON_LAUNCH"] = "EXUpdatesCheckOnLaunch";
    Config["LAUNCH_WAIT_MS"] = "EXUpdatesLaunchWaitMs";
    Config["RUNTIME_VERSION"] = "EXUpdatesRuntimeVersion";
    Config["UPDATE_URL"] = "EXUpdatesURL";
    Config["UPDATES_CONFIGURATION_REQUEST_HEADERS_KEY"] = "EXUpdatesRequestHeaders";
    Config["UPDATES_HAS_EMBEDDED_UPDATE"] = "EXUpdatesHasEmbeddedUpdate";
    Config["CODE_SIGNING_CERTIFICATE"] = "EXUpdatesCodeSigningCertificate";
    Config["CODE_SIGNING_METADATA"] = "EXUpdatesCodeSigningMetadata";
    Config["DISABLE_ANTI_BRICKING_MEASURES"] = "EXUpdatesDisableAntiBrickingMeasures";
    Config["ENABLE_BSDIFF_PATCH_SUPPORT"] = "EXUpdatesEnableBsdiffPatchSupport";
    Config["EXCLUDE_FROM_BACKUP"] = "EXUpdatesExcludeFromBackup";
    Config["MAX_UPDATES_TO_KEEP"] = "EXUpdatesMaxUpdatesToKeep";
    return Config;
}({});
const withUpdates = (config)=>{
    return (0, _withPlugins.withPlugins)(config, [
        withUpdatesPlist,
        withUpdatesNativeDebugPodfileProps
    ]);
};
const withUpdatesNativeDebugPodfileProps = (0, _BuildProperties.createBuildPodfilePropsConfigPlugin)([
    {
        propName: 'updatesNativeDebug',
        propValueGetter: (config)=>config?.updates?.useNativeDebug === true ? 'true' : undefined
    }
], 'withUpdatesNativeDebugPodfileProps');
const withUpdatesPlist = (config)=>{
    return (0, _iosplugins.withExpoPlist)(config, async (config)=>{
        const projectRoot = config.modRequest.projectRoot;
        const expoUpdatesPackageVersion = (0, _Updates.getExpoUpdatesPackageVersion)(projectRoot);
        config.modResults = await setUpdatesConfigAsync(projectRoot, config, config.modResults, expoUpdatesPackageVersion);
        return config;
    });
};
async function setUpdatesConfigAsync(projectRoot, config, expoPlist, expoUpdatesPackageVersion) {
    const checkOnLaunch = (0, _Updates.getUpdatesCheckOnLaunch)(config, expoUpdatesPackageVersion);
    const timeout = (0, _Updates.getUpdatesTimeout)(config);
    const useEmbeddedUpdate = (0, _Updates.getUpdatesUseEmbeddedUpdate)(config);
    // TODO: is there a better place for this validation?
    if (!useEmbeddedUpdate && timeout === 0 && checkOnLaunch !== 'ALWAYS') {
        (0, _warnings.addWarningIOS)('updates.useEmbeddedUpdate', `updates.checkOnLaunch should be set to "ON_LOAD" and updates.fallbackToCacheTimeout should be set to a non-zero value when updates.useEmbeddedUpdate is set to false. This is because an update must be fetched on the initial launch, when no embedded update is available.`);
    }
    const newExpoPlist = {
        ...expoPlist,
        ["EXUpdatesEnabled"]: (0, _Updates.getUpdatesEnabled)(config),
        ["EXUpdatesCheckOnLaunch"]: checkOnLaunch,
        ["EXUpdatesLaunchWaitMs"]: timeout
    };
    // The native config name is "has embedded update", but we want to expose
    // this to the user as "use embedded update", since this is more accurate.
    // The field does not disable actually building and embedding the update,
    // only whether it is actually used.
    if (useEmbeddedUpdate) {
        delete newExpoPlist["EXUpdatesHasEmbeddedUpdate"];
    } else {
        newExpoPlist["EXUpdatesHasEmbeddedUpdate"] = false;
    }
    const updateUrl = (0, _Updates.getUpdateUrl)(config);
    if (updateUrl) {
        newExpoPlist["EXUpdatesURL"] = updateUrl;
    } else {
        delete newExpoPlist["EXUpdatesURL"];
    }
    const codeSigningCertificate = (0, _Updates.getUpdatesCodeSigningCertificate)(projectRoot, config);
    if (codeSigningCertificate) {
        newExpoPlist["EXUpdatesCodeSigningCertificate"] = codeSigningCertificate;
    } else {
        delete newExpoPlist["EXUpdatesCodeSigningCertificate"];
    }
    const codeSigningMetadata = (0, _Updates.getUpdatesCodeSigningMetadata)(config);
    if (codeSigningMetadata) {
        newExpoPlist["EXUpdatesCodeSigningMetadata"] = codeSigningMetadata;
    } else {
        delete newExpoPlist["EXUpdatesCodeSigningMetadata"];
    }
    const requestHeaders = (0, _Updates.getUpdatesRequestHeaders)(config);
    if (requestHeaders) {
        newExpoPlist["EXUpdatesRequestHeaders"] = requestHeaders;
    } else {
        delete newExpoPlist["EXUpdatesRequestHeaders"];
    }
    const disableAntiBrickingMeasures = (0, _Updates.getDisableAntiBrickingMeasures)(config);
    if (disableAntiBrickingMeasures) {
        newExpoPlist["EXUpdatesDisableAntiBrickingMeasures"] = disableAntiBrickingMeasures;
    } else {
        delete newExpoPlist["EXUpdatesDisableAntiBrickingMeasures"];
    }
    const excludeFromBackup = (0, _Updates.getUpdatesExcludeFromBackup)(config);
    if (excludeFromBackup) {
        newExpoPlist["EXUpdatesExcludeFromBackup"] = true;
    } else {
        delete newExpoPlist["EXUpdatesExcludeFromBackup"];
    }
    newExpoPlist["EXUpdatesEnableBsdiffPatchSupport"] = (0, _Updates.getUpdatesBsdiffPatchSupportEnabled)(config);
    const maxUpdatesToKeep = (0, _Updates.getUpdatesMaxUpdatesToKeep)(config);
    if (maxUpdatesToKeep !== undefined) {
        newExpoPlist["EXUpdatesMaxUpdatesToKeep"] = maxUpdatesToKeep;
    } else {
        delete newExpoPlist["EXUpdatesMaxUpdatesToKeep"];
    }
    return await setVersionsConfigAsync(projectRoot, config, newExpoPlist);
}
async function setVersionsConfigAsync(projectRoot, config, expoPlist) {
    const newExpoPlist = {
        ...expoPlist
    };
    const runtimeVersion = await (0, _Updates.getRuntimeVersionNullableAsync)(projectRoot, config, 'ios');
    if (!runtimeVersion && expoPlist["EXUpdatesRuntimeVersion"]) {
        throw new Error('A runtime version is set in your Expo.plist, but is missing from your Expo app config (app.json/app.config.js). Set runtimeVersion in your Expo app config or remove EXUpdatesRuntimeVersion from your Expo.plist.');
    }
    if (runtimeVersion) {
        delete newExpoPlist['EXUpdatesSDKVersion'];
        newExpoPlist["EXUpdatesRuntimeVersion"] = runtimeVersion;
    } else {
        delete newExpoPlist['EXUpdatesSDKVersion'];
        delete newExpoPlist["EXUpdatesRuntimeVersion"];
    }
    return newExpoPlist;
}

//# sourceMappingURL=Updates.js.map
