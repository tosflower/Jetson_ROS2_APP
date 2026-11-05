"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "updateXcodeProject", {
    enumerable: true,
    get: function() {
        return updateXcodeProject;
    }
});
function _configplugins() {
    const data = require("@expo/config-plugins");
    _configplugins = function() {
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
function _path() {
    const data = /*#__PURE__*/ _interop_require_default(require("path"));
    _path = function() {
        return data;
    };
    return data;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function escapeXMLCharacters(original) {
    const noAmps = original.replace('&', '&amp;');
    const noLt = noAmps.replace('<', '&lt;');
    const noGt = noLt.replace('>', '&gt;');
    const noApos = noGt.replace('"', '\\"');
    return noApos.replace("'", "\\'");
}
// Note that this main target name is based on how `@expo/cli/src/prebuild/renameTemplateAppNameAsync.ts` preprocesses the ios project template.
// It is necessary to match the target name in the path to ExpoModulesProvider.swift for the main target as is used when generating it.
function getMainTargetName(config) {
    const name = config.name;
    const safeName = escapeXMLCharacters(name);
    return _configplugins().IOSConfig.XcodeUtils.sanitizedName(safeName);
}
function getNativeTargetSynchronizedGroupsMap(pbxProject) {
    const objects = pbxProject.hash.project.objects;
    const nativeTargetSynchronizedGroups = new Map();
    for (const target of pbxProject.getFirstProject().firstProject.targets){
        const nativeTargetGroup = objects.PBXNativeTarget[target.value];
        const synchronizedGroups = new Set();
        if (nativeTargetGroup?.fileSystemSynchronizedGroups) {
            for (const synchronizedGroup of nativeTargetGroup.fileSystemSynchronizedGroups){
                synchronizedGroups.add(synchronizedGroup.value);
            }
        }
        nativeTargetSynchronizedGroups.set(target.value, synchronizedGroups);
    }
    return nativeTargetSynchronizedGroups;
}
function prepareSynchronizedRootGroups(pbxProject) {
    const objects = pbxProject.hash.project.objects;
    const fsSynchronizedRootGroups = new Map();
    if (objects.PBXFileSystemSynchronizedRootGroup) {
        for (const key of Object.keys(objects.PBXFileSystemSynchronizedRootGroup)){
            if (key.endsWith('_comment')) {
                continue;
            }
            const groupObject = objects.PBXFileSystemSynchronizedRootGroup[key];
            fsSynchronizedRootGroups.set(groupObject.path, key);
        }
    } else {
        objects.PBXFileSystemSynchronizedRootGroup = {};
    }
    return {
        fsSynchronizedRootGroups
    };
}
async function updateXcodeProject(projectRoot, inlineModulesXcodeParams) {
    const swiftWatchedDirectories = inlineModulesXcodeParams.watchedDirectories;
    const xcodeProjectTargets = inlineModulesXcodeParams.xcodeProjectTargets ? new Set(inlineModulesXcodeParams.xcodeProjectTargets) : undefined;
    // Only perform changes to pbxproj if necessary
    if (swiftWatchedDirectories.length === 0) {
        return;
    }
    const pbxProject = _configplugins().IOSConfig.XcodeUtils.getPbxproj(projectRoot);
    const mainGroupUUID = pbxProject.getFirstProject().firstProject.mainGroup;
    const objects = pbxProject.hash.project.objects;
    const projectRootRelativeToIos = '..';
    const pbxNativeTarget = pbxProject.hash.project.objects.PBXNativeTarget;
    const nativeTargetSynchronizedGroups = getNativeTargetSynchronizedGroupsMap(pbxProject);
    const addWatchedDirectoryToTarget = (targetUUID, nativeTargetGroup, dir, dirUUID)=>{
        if (!nativeTargetSynchronizedGroups.has(targetUUID)) {
            nativeTargetSynchronizedGroups.set(targetUUID, new Set());
        }
        const targetSynchronizedGroups = nativeTargetSynchronizedGroups.get(targetUUID);
        if (targetSynchronizedGroups.has(dirUUID)) {
            return;
        }
        if (!nativeTargetGroup.fileSystemSynchronizedGroups) {
            nativeTargetGroup.fileSystemSynchronizedGroups = [];
        }
        nativeTargetGroup.fileSystemSynchronizedGroups.push({
            value: dirUUID,
            comment: dir
        });
        targetSynchronizedGroups.add(dirUUID);
    };
    const { fsSynchronizedRootGroups } = prepareSynchronizedRootGroups(pbxProject);
    const getOrCreateWatchedDirectoryUUID = (dir)=>{
        const dirRelativeToIos = _path().default.join(projectRootRelativeToIos, dir);
        const existingUUID = fsSynchronizedRootGroups.get(dirRelativeToIos);
        if (existingUUID !== undefined) {
            return existingUUID;
        }
        const newUUID = pbxProject.generateUuid();
        objects.PBXGroup[mainGroupUUID].children.push({
            value: newUUID,
            comment: dir
        });
        objects.PBXFileSystemSynchronizedRootGroup[newUUID] = {
            isa: 'PBXFileSystemSynchronizedRootGroup',
            explicitFileTypes: {},
            explicitFolders: [],
            name: dir,
            path: dirRelativeToIos,
            sourceTree: 'SOURCE_ROOT'
        };
        return newUUID;
    };
    const targetsToUpdate = pbxProject.getFirstProject().firstProject.targets.filter((target)=>{
        const targetUuid = target.value;
        const targetName = pbxNativeTarget[targetUuid]?.name;
        if (targetName === undefined) {
            return false;
        }
        if (!xcodeProjectTargets) {
            // If the xcodeProjectTargets are not provided, default to the main target
            return targetName === getMainTargetName(inlineModulesXcodeParams);
        }
        return xcodeProjectTargets.has(targetName);
    });
    for (const watchedDirectory of swiftWatchedDirectories){
        const dirUUID = getOrCreateWatchedDirectoryUUID(watchedDirectory);
        for (const target of targetsToUpdate){
            const nativeTargetGroup = objects.PBXNativeTarget[target.value];
            addWatchedDirectoryToTarget(target.value, nativeTargetGroup, watchedDirectory, dirUUID);
        }
    }
    await _fs().default.promises.writeFile(pbxProject.filepath, pbxProject.writeSync());
}

//# sourceMappingURL=xcodeProjectUpdates.js.map
