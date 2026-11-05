"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getBitcode: null,
    setBitcode: null,
    setBitcodeWithConfig: null,
    withBitcode: null,
    withCustomBitcode: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getBitcode () {
        return getBitcode;
    },
    get setBitcode () {
        return setBitcode;
    },
    get setBitcodeWithConfig () {
        return setBitcodeWithConfig;
    },
    get withBitcode () {
        return withBitcode;
    },
    get withCustomBitcode () {
        return withCustomBitcode;
    }
});
const _iosplugins = require("../plugins/ios-plugins");
const _warnings = require("../utils/warnings");
const _Xcodeproj = require("./utils/Xcodeproj");
const withBitcode = (config)=>{
    return (0, _iosplugins.withXcodeProject)(config, async (config)=>{
        config.modResults = await setBitcodeWithConfig(config, {
            project: config.modResults
        });
        return config;
    });
};
const withCustomBitcode = (config, bitcode)=>{
    return (0, _iosplugins.withXcodeProject)(config, async (config)=>{
        config.modResults = await setBitcode(bitcode, {
            project: config.modResults
        });
        return config;
    });
};
function getBitcode(config) {
    return config.ios?.bitcode;
}
function setBitcodeWithConfig(config, { project }) {
    const bitcode = getBitcode(config);
    return setBitcode(bitcode, {
        project
    });
}
function setBitcode(bitcode, { project }) {
    const isDefaultBehavior = bitcode == null;
    // If the value is undefined, then do nothing.
    if (isDefaultBehavior) {
        return project;
    }
    const targetName = typeof bitcode === 'string' ? bitcode : undefined;
    const isBitcodeEnabled = !!bitcode;
    if (targetName) {
        // Assert if missing
        const configs = Object.entries(project.pbxXCBuildConfigurationSection()).filter(_Xcodeproj.isNotComment);
        const hasConfiguration = configs.find(([, configuration])=>configuration.name === targetName);
        if (hasConfiguration) {
            // If targetName is defined then disable bitcode everywhere.
            project.addBuildProperty('ENABLE_BITCODE', 'NO');
        } else {
            const names = [
                // Remove duplicates, wrap in double quotes, and sort alphabetically.
                ...new Set(configs.map(([, configuration])=>`"${configuration.name}"`))
            ].sort();
            (0, _warnings.addWarningIOS)('ios.bitcode', `No configuration named "${targetName}". Expected one of: ${names.join(', ')}.`);
        }
    }
    project.addBuildProperty('ENABLE_BITCODE', isBitcodeEnabled ? 'YES' : 'NO', targetName);
    return project;
}

//# sourceMappingURL=Bitcode.js.map
