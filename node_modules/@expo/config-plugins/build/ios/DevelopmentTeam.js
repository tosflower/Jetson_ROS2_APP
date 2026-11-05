"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getDevelopmentTeam: null,
    setDevelopmentTeamForBuildConfiguration: null,
    setDevelopmentTeamForPbxproj: null,
    updateDevelopmentTeamForPbxproj: null,
    withDevelopmentTeam: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getDevelopmentTeam () {
        return getDevelopmentTeam;
    },
    get setDevelopmentTeamForBuildConfiguration () {
        return setDevelopmentTeamForBuildConfiguration;
    },
    get setDevelopmentTeamForPbxproj () {
        return setDevelopmentTeamForPbxproj;
    },
    get updateDevelopmentTeamForPbxproj () {
        return updateDevelopmentTeamForPbxproj;
    },
    get withDevelopmentTeam () {
        return withDevelopmentTeam;
    }
});
function _nodefs() {
    const data = /*#__PURE__*/ _interop_require_default(require("node:fs"));
    _nodefs = function() {
        return data;
    };
    return data;
}
function _xcode() {
    const data = /*#__PURE__*/ _interop_require_default(require("xcode"));
    _xcode = function() {
        return data;
    };
    return data;
}
const _iosplugins = require("../plugins/ios-plugins");
const _Paths = require("./Paths");
const _Target = require("./Target");
const _Xcodeproj = require("./utils/Xcodeproj");
const _string = require("./utils/string");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const withDevelopmentTeam = (config, { appleTeamId } = {})=>{
    return (0, _iosplugins.withXcodeProject)(config, (config)=>{
        const teamId = appleTeamId ?? getDevelopmentTeam(config);
        if (teamId) {
            config.modResults = updateDevelopmentTeamForPbxproj(config.modResults, teamId);
        }
        return config;
    });
};
function getDevelopmentTeam(config) {
    return config.ios?.appleTeamId ?? null;
}
function setDevelopmentTeamForBuildConfiguration(xcBuildConfiguration, developmentTeam) {
    if (developmentTeam) {
        xcBuildConfiguration.buildSettings.DEVELOPMENT_TEAM = (0, _string.trimQuotes)(developmentTeam);
    } else {
        delete xcBuildConfiguration.buildSettings.DEVELOPMENT_TEAM;
    }
}
function updateDevelopmentTeamForPbxproj(project, appleTeamId) {
    const nativeTargets = (0, _Target.getNativeTargets)(project);
    nativeTargets.forEach(([, nativeTarget])=>{
        (0, _Xcodeproj.getBuildConfigurationsForListId)(project, nativeTarget.buildConfigurationList).forEach(([, buildConfig])=>setDevelopmentTeamForBuildConfiguration(buildConfig, appleTeamId));
    });
    return project;
}
function setDevelopmentTeamForPbxproj(projectRoot, appleTeamId) {
    // Get all pbx projects in the ${projectRoot}/ios directory
    const pbxprojPaths = (0, _Paths.getAllPBXProjectPaths)(projectRoot);
    for (const pbxprojPath of pbxprojPaths){
        let project = _xcode().default.project(pbxprojPath);
        project.parseSync();
        project = updateDevelopmentTeamForPbxproj(project, appleTeamId);
        _nodefs().default.writeFileSync(pbxprojPath, project.writeSync());
    }
}

//# sourceMappingURL=DevelopmentTeam.js.map
