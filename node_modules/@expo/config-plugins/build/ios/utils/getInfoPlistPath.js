"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getInfoPlistPathFromPbxproj", {
    enumerable: true,
    get: function() {
        return getInfoPlistPathFromPbxproj;
    }
});
const _Target = require("../Target");
const _Xcodeproj = require("./Xcodeproj");
function getInfoPlistPathFromPbxproj(projectRootOrProject, { targetName, buildConfiguration = 'Release' } = {}) {
    const project = (0, _Xcodeproj.resolvePathOrProject)(projectRootOrProject);
    if (!project) {
        return null;
    }
    const xcBuildConfiguration = (0, _Target.getXCBuildConfigurationFromPbxproj)(project, {
        targetName,
        buildConfiguration
    });
    if (!xcBuildConfiguration) {
        return null;
    }
    // The `INFOPLIST_FILE` is relative to the project folder, ex: app/Info.plist.
    return sanitizeInfoPlistBuildProperty(xcBuildConfiguration.buildSettings.INFOPLIST_FILE);
}
function sanitizeInfoPlistBuildProperty(infoPlist) {
    return infoPlist?.replace(/"/g, '').replace('$(SRCROOT)', '') ?? null;
}

//# sourceMappingURL=getInfoPlistPath.js.map
