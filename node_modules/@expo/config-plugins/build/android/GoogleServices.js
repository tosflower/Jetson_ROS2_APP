"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    applyPlugin: null,
    getGoogleServicesFilePath: null,
    setClassPath: null,
    setGoogleServicesFile: null,
    withApplyPlugin: null,
    withClassPath: null,
    withGoogleServicesFile: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get applyPlugin () {
        return applyPlugin;
    },
    get getGoogleServicesFilePath () {
        return getGoogleServicesFilePath;
    },
    get setClassPath () {
        return setClassPath;
    },
    get setGoogleServicesFile () {
        return setGoogleServicesFile;
    },
    get withApplyPlugin () {
        return withApplyPlugin;
    },
    get withClassPath () {
        return withClassPath;
    },
    get withGoogleServicesFile () {
        return withGoogleServicesFile;
    }
});
function _path() {
    const data = /*#__PURE__*/ _interop_require_default(require("path"));
    _path = function() {
        return data;
    };
    return data;
}
const _androidplugins = require("../plugins/android-plugins");
const _withDangerousMod = require("../plugins/withDangerousMod");
const _fs = require("../utils/fs");
const _warnings = require("../utils/warnings");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const DEFAULT_TARGET_PATH = './android/app/google-services.json';
const googleServicesClassPath = 'com.google.gms:google-services';
const googleServicesPlugin = 'com.google.gms.google-services';
// NOTE(brentvatne): This may be annoying to keep up to date...
const googleServicesVersion = '4.4.4';
const withClassPath = (config)=>{
    return (0, _androidplugins.withProjectBuildGradle)(config, (config)=>{
        if (config.modResults.language === 'groovy') {
            config.modResults.contents = setClassPath(config, config.modResults.contents);
        } else {
            (0, _warnings.addWarningAndroid)('android.googleServicesFile', `Cannot automatically configure project build.gradle if it's not groovy`);
        }
        return config;
    });
};
const withApplyPlugin = (config)=>{
    return (0, _androidplugins.withAppBuildGradle)(config, (config)=>{
        if (config.modResults.language === 'groovy') {
            config.modResults.contents = applyPlugin(config, config.modResults.contents);
        } else {
            (0, _warnings.addWarningAndroid)('android.googleServicesFile', `Cannot automatically configure app build.gradle if it's not groovy`);
        }
        return config;
    });
};
const withGoogleServicesFile = (config)=>{
    return (0, _withDangerousMod.withDangerousMod)(config, [
        'android',
        async (config)=>{
            await setGoogleServicesFile(config, config.modRequest.projectRoot);
            return config;
        }
    ]);
};
function getGoogleServicesFilePath(config) {
    return config.android?.googleServicesFile ?? null;
}
async function setGoogleServicesFile(config, projectRoot, targetPath = DEFAULT_TARGET_PATH) {
    const partialSourcePath = getGoogleServicesFilePath(config);
    if (!partialSourcePath) {
        return false;
    }
    const completeSourcePath = _path().default.resolve(projectRoot, partialSourcePath);
    const destinationPath = _path().default.resolve(projectRoot, targetPath);
    try {
        await (0, _fs.copyFilePathToPathAsync)(completeSourcePath, destinationPath);
    } catch (e) {
        console.log(e);
        throw new Error(`Cannot copy google-services.json from ${completeSourcePath} to ${destinationPath}. Ensure the source and destination paths exist.`);
    }
    return true;
}
function setClassPath(config, buildGradle) {
    const googleServicesFile = getGoogleServicesFilePath(config);
    if (!googleServicesFile) {
        return buildGradle;
    }
    if (buildGradle.includes(googleServicesClassPath)) {
        return buildGradle;
    }
    //
    return buildGradle.replace(/dependencies\s?{/, `dependencies {
        classpath '${googleServicesClassPath}:${googleServicesVersion}'`);
}
function applyPlugin(config, appBuildGradle) {
    const googleServicesFile = getGoogleServicesFilePath(config);
    if (!googleServicesFile) {
        return appBuildGradle;
    }
    // Make sure the project does not have the plugin already
    const pattern = new RegExp(`apply\\s+plugin:\\s+['"]${googleServicesPlugin}['"]`);
    if (appBuildGradle.match(pattern)) {
        return appBuildGradle;
    }
    // Add it to the end of the file
    return appBuildGradle + `\napply plugin: '${googleServicesPlugin}'`;
}

//# sourceMappingURL=GoogleServices.js.map
