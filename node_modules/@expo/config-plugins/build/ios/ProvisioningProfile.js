"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "setProvisioningProfileForPbxproj", {
    enumerable: true,
    get: function() {
        return setProvisioningProfileForPbxproj;
    }
});
function _fs() {
    const data = /*#__PURE__*/ _interop_require_default(require("fs"));
    _fs = function() {
        return data;
    };
    return data;
}
const _Target = require("./Target");
const _Xcodeproj = require("./utils/Xcodeproj");
const _string = require("./utils/string");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function setProvisioningProfileForPbxproj(projectRoot, { targetName, profileName, appleTeamId, buildConfiguration = 'Release', codeSignIdentity = 'iPhone Distribution' }) {
    const project = (0, _Xcodeproj.getPbxproj)(projectRoot);
    const nativeTargetEntry = targetName ? (0, _Target.findNativeTargetByName)(project, targetName) : (0, _Target.findFirstNativeTarget)(project);
    const [nativeTargetId, nativeTarget] = nativeTargetEntry;
    const quotedAppleTeamId = ensureQuotes(appleTeamId);
    (0, _Xcodeproj.getBuildConfigurationsForListId)(project, nativeTarget.buildConfigurationList).filter(([, item])=>(0, _string.trimQuotes)(item.name) === buildConfiguration).forEach(([, item])=>{
        item.buildSettings.PROVISIONING_PROFILE_SPECIFIER = `"${profileName}"`;
        item.buildSettings.DEVELOPMENT_TEAM = quotedAppleTeamId;
        item.buildSettings.CODE_SIGN_IDENTITY = `"${codeSignIdentity}"`;
        item.buildSettings.CODE_SIGN_STYLE = 'Manual';
    });
    Object.entries((0, _Xcodeproj.getProjectSection)(project)).filter(_Xcodeproj.isNotComment).forEach(([, item])=>{
        if (!item.attributes.TargetAttributes[nativeTargetId]) {
            item.attributes.TargetAttributes[nativeTargetId] = {};
        }
        item.attributes.TargetAttributes[nativeTargetId].DevelopmentTeam = quotedAppleTeamId;
        item.attributes.TargetAttributes[nativeTargetId].ProvisioningStyle = 'Manual';
    });
    _fs().default.writeFileSync(project.filepath, project.writeSync());
}
const ensureQuotes = (value)=>{
    if (!value.match(/^['"]/)) {
        return `"${value}"`;
    }
    return value;
};

//# sourceMappingURL=ProvisioningProfile.js.map
