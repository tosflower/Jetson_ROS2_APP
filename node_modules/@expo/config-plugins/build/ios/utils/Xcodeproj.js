/**
 * Copyright © 2023-present 650 Industries, Inc. (aka Expo)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    addBuildSourceFileToGroup: null,
    addFileToGroupAndLink: null,
    addFramework: null,
    addResourceFileToGroup: null,
    ensureGroupRecursively: null,
    getApplicationNativeTarget: null,
    getBuildConfigurationForListIdAndName: null,
    getBuildConfigurationsForListId: null,
    getHackyProjectName: null,
    getPbxproj: null,
    getProductName: null,
    getProjectName: null,
    getProjectSection: null,
    getXCConfigurationListEntries: null,
    isBuildConfig: null,
    isNotComment: null,
    isNotTestHost: null,
    resolvePathOrProject: null,
    resolveXcodeBuildSetting: null,
    sanitizedName: null,
    unquote: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get addBuildSourceFileToGroup () {
        return addBuildSourceFileToGroup;
    },
    get addFileToGroupAndLink () {
        return addFileToGroupAndLink;
    },
    get addFramework () {
        return addFramework;
    },
    get addResourceFileToGroup () {
        return addResourceFileToGroup;
    },
    get ensureGroupRecursively () {
        return ensureGroupRecursively;
    },
    get getApplicationNativeTarget () {
        return getApplicationNativeTarget;
    },
    get getBuildConfigurationForListIdAndName () {
        return getBuildConfigurationForListIdAndName;
    },
    get getBuildConfigurationsForListId () {
        return getBuildConfigurationsForListId;
    },
    get getHackyProjectName () {
        return getHackyProjectName;
    },
    get getPbxproj () {
        return getPbxproj;
    },
    get getProductName () {
        return getProductName;
    },
    get getProjectName () {
        return getProjectName;
    },
    get getProjectSection () {
        return getProjectSection;
    },
    get getXCConfigurationListEntries () {
        return getXCConfigurationListEntries;
    },
    get isBuildConfig () {
        return isBuildConfig;
    },
    get isNotComment () {
        return isNotComment;
    },
    get isNotTestHost () {
        return isNotTestHost;
    },
    get resolvePathOrProject () {
        return resolvePathOrProject;
    },
    get resolveXcodeBuildSetting () {
        return resolveXcodeBuildSetting;
    },
    get sanitizedName () {
        return sanitizedName;
    },
    get unquote () {
        return unquote;
    }
});
function _assert() {
    const data = /*#__PURE__*/ _interop_require_default(require("assert"));
    _assert = function() {
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
function _slugify() {
    const data = /*#__PURE__*/ _interop_require_default(require("slugify"));
    _slugify = function() {
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
function _pbxFile() {
    const data = /*#__PURE__*/ _interop_require_default(require("xcode/lib/pbxFile"));
    _pbxFile = function() {
        return data;
    };
    return data;
}
const _warnings = require("../../utils/warnings");
const _Paths = /*#__PURE__*/ _interop_require_wildcard(require("../Paths"));
const _string = require("./string");
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
function getProjectName(projectRoot) {
    const sourceRoot = _Paths.getSourceRoot(projectRoot);
    return _path().default.basename(sourceRoot);
}
function resolvePathOrProject(projectRootOrProject) {
    if (typeof projectRootOrProject === 'string') {
        try {
            return getPbxproj(projectRootOrProject);
        } catch  {
            return null;
        }
    }
    return projectRootOrProject;
}
const NEITHER_LETTER_NOR_NUMBER = /[^\p{L}\p{N}]+/gu;
const COMBINING_MARKS = /\p{M}+/gu;
const NOT_ASCII_ALPHANUMERIC = /[\W_]+/g;
function sanitizedName(name) {
    // NFKD before slugify, or letters are lost: 'Ċ' decomposes to 'C' + a combining mark
    // that the next line drops, while slugify deletes it outright.
    const lettersAndNumbers = name.replace(NEITHER_LETTER_NOR_NUMBER, '').normalize('NFKD').replace(COMBINING_MARKS, '');
    return toAsciiIdentifier((0, _slugify().default)(lettersAndNumbers)) || toAsciiIdentifier((0, _slugify().default)(name)) || 'app';
}
function toAsciiIdentifier(name) {
    return name.replace(NOT_ASCII_ALPHANUMERIC, '');
}
function getHackyProjectName(projectRoot, config) {
    // Attempt to get the current ios folder name (apply).
    try {
        return getProjectName(projectRoot);
    } catch  {
        // If no iOS project exists then create a new one (eject).
        const projectName = config.name;
        (0, _assert().default)(projectName, 'Your project needs a name in app.json/app.config.js.');
        return sanitizedName(projectName);
    }
}
function createProjectFileForGroup({ filepath, group }) {
    const file = new (_pbxFile()).default(filepath);
    const conflictingFile = group.children.find((child)=>child.comment === file.basename);
    if (conflictingFile) {
        // This can happen when a file like the GoogleService-Info.plist needs to be added and the eject command is run twice.
        // Not much we can do here since it might be a conflicting file.
        return null;
    }
    return file;
}
function addResourceFileToGroup({ filepath, groupName, // Should add to `PBXBuildFile Section`
isBuildFile, project, verbose, targetUuid }) {
    return addFileToGroupAndLink({
        filepath,
        groupName,
        project,
        verbose,
        targetUuid,
        addFileToProject ({ project, file }) {
            project.addToPbxFileReferenceSection(file);
            if (isBuildFile) {
                project.addToPbxBuildFileSection(file);
            }
            project.addToPbxResourcesBuildPhase(file);
        }
    });
}
function addBuildSourceFileToGroup({ filepath, groupName, project, verbose, targetUuid }) {
    return addFileToGroupAndLink({
        filepath,
        groupName,
        project,
        verbose,
        targetUuid,
        addFileToProject ({ project, file }) {
            project.addToPbxFileReferenceSection(file);
            project.addToPbxBuildFileSection(file);
            project.addToPbxSourcesBuildPhase(file);
        }
    });
}
function addFileToGroupAndLink({ filepath, groupName, project, verbose, addFileToProject, targetUuid }) {
    const group = pbxGroupByPathOrAssert(project, groupName);
    const file = createProjectFileForGroup({
        filepath,
        group
    });
    if (!file) {
        if (verbose) {
            // This can happen when a file like the GoogleService-Info.plist needs to be added and the eject command is run twice.
            // Not much we can do here since it might be a conflicting file.
            (0, _warnings.addWarningIOS)('ios-xcode-project', `Skipped adding duplicate file "${filepath}" to PBXGroup named "${groupName}"`);
        }
        return project;
    }
    if (targetUuid != null) {
        file.target = targetUuid;
    } else {
        const applicationNativeTarget = project.getTarget('com.apple.product-type.application');
        file.target = applicationNativeTarget?.uuid;
    }
    file.uuid = project.generateUuid();
    file.fileRef = project.generateUuid();
    addFileToProject({
        project,
        file
    });
    group.children.push({
        value: file.fileRef,
        comment: file.basename
    });
    return project;
}
function getApplicationNativeTarget({ project, projectName }) {
    const applicationNativeTarget = project.getTarget('com.apple.product-type.application');
    (0, _assert().default)(applicationNativeTarget, `Couldn't locate application PBXNativeTarget in '.xcodeproj' file.`);
    (0, _assert().default)(String(applicationNativeTarget.target.name) === projectName, `Application native target name mismatch. Expected ${projectName}, but found ${applicationNativeTarget.target.name}.`);
    return applicationNativeTarget;
}
function addFramework({ project, projectName, framework }) {
    const target = getApplicationNativeTarget({
        project,
        projectName
    });
    return project.addFramework(framework, {
        target: target.uuid
    });
}
function splitPath(path) {
    // TODO: Should we account for other platforms that may not use `/`
    return path.split('/');
}
const findGroup = (group, name)=>{
    if (!group) {
        return undefined;
    }
    return group.children.find((group)=>group.comment === name);
};
function findGroupInsideGroup(project, group, name) {
    const foundGroup = findGroup(group, name);
    if (foundGroup) {
        return project.getPBXGroupByKey(foundGroup.value) ?? null;
    }
    return null;
}
function pbxGroupByPathOrAssert(project, path) {
    const { firstProject } = project.getFirstProject();
    let group = project.getPBXGroupByKey(firstProject.mainGroup);
    const components = splitPath(path);
    for (const name of components){
        const nextGroup = findGroupInsideGroup(project, group, name);
        if (nextGroup) {
            group = nextGroup;
        } else {
            break;
        }
    }
    if (!group) {
        throw Error(`Xcode PBXGroup with name "${path}" could not be found in the Xcode project.`);
    }
    return group;
}
function ensureGroupRecursively(project, filepath) {
    const components = splitPath(filepath);
    const hasChild = (group, name)=>group.children.find(({ comment })=>comment === name);
    const { firstProject } = project.getFirstProject();
    let topMostGroup = project.getPBXGroupByKey(firstProject.mainGroup);
    for (const pathComponent of components){
        if (topMostGroup && !hasChild(topMostGroup, pathComponent)) {
            topMostGroup.children.push({
                comment: pathComponent,
                value: project.pbxCreateGroup(pathComponent, '""')
            });
        }
        topMostGroup = project.pbxGroupByName(pathComponent);
    }
    return topMostGroup ?? null;
}
function getPbxproj(projectRoot) {
    const projectPath = _Paths.getPBXProjectPath(projectRoot);
    const project = _xcode().default.project(projectPath);
    project.parseSync();
    return project;
}
function getProductName(project) {
    let productName = '$(TARGET_NAME)';
    try {
        // If the product name is numeric, this will fail (it's a getter).
        // If the bundle identifier' final component is only numeric values, then the PRODUCT_NAME
        // will be a numeric value, this results in a bug where the product name isn't useful,
        // i.e. `com.bacon.001` -> `1` -- in this case, use the first target name.
        productName = project.productName;
    } catch  {}
    if (productName === '$(TARGET_NAME)') {
        const targetName = project.getFirstTarget()?.firstTarget?.productName;
        productName = targetName ?? productName;
    }
    return productName;
}
function getProjectSection(project) {
    return project.pbxProjectSection();
}
function getXCConfigurationListEntries(project) {
    const lists = project.pbxXCConfigurationList();
    return Object.entries(lists).filter(isNotComment);
}
function getBuildConfigurationsForListId(project, configurationListId) {
    const configurationListEntries = getXCConfigurationListEntries(project);
    const [, configurationList] = configurationListEntries.find(([key])=>key === configurationListId);
    const buildConfigurations = configurationList.buildConfigurations.map((i)=>i.value);
    return Object.entries(project.pbxXCBuildConfigurationSection()).filter(isNotComment).filter(isBuildConfig).filter(([key])=>buildConfigurations.includes(key));
}
function getBuildConfigurationForListIdAndName(project, { configurationListId, buildConfiguration }) {
    const xcBuildConfigurationEntry = getBuildConfigurationsForListId(project, configurationListId).find((i)=>(0, _string.trimQuotes)(i[1].name) === buildConfiguration);
    if (!xcBuildConfigurationEntry) {
        throw new Error(`Build configuration '${buildConfiguration}' does not exist in list with id '${configurationListId}'`);
    }
    return xcBuildConfigurationEntry;
}
function isBuildConfig([, sectionItem]) {
    return sectionItem.isa === 'XCBuildConfiguration';
}
function isNotTestHost([, sectionItem]) {
    return !sectionItem.buildSettings.TEST_HOST;
}
function isNotComment([key]) {
    return !key.endsWith(`_comment`);
}
function unquote(value) {
    // projects with numeric names will fail due to a bug in the xcode package.
    if (typeof value === 'number') {
        value = String(value);
    }
    return value.match(/^"(.*)"$/)?.[1] ?? value;
}
function resolveXcodeBuildSetting(value, lookup) {
    const parsedValue = value?.replace(/\$\(([^()]*|\([^)]*\))\)/g, (match)=>{
        // Remove the `$(` and `)`, then split modifier(s) from the variable name.
        const [variable = '', ...transformations] = match.slice(2, -1).split(':');
        // Resolve the variable recursively.
        let lookedUp = lookup(variable);
        if (lookedUp) {
            lookedUp = resolveXcodeBuildSetting(lookedUp, lookup);
        }
        let resolved = lookedUp;
        // Ref: http://codeworkshop.net/posts/xcode-build-setting-transformations
        transformations.forEach((modifier)=>{
            switch(modifier){
                case 'lower':
                    // A lowercase representation.
                    resolved = resolved?.toLowerCase();
                    break;
                case 'upper':
                    // An uppercase representation.
                    resolved = resolved?.toUpperCase();
                    break;
                case 'suffix':
                    if (resolved) {
                        // The extension of a path including the '.' divider.
                        resolved = _path().default.extname(resolved);
                    }
                    break;
                case 'file':
                    if (resolved) {
                        // The file portion of a path.
                        resolved = _path().default.basename(resolved);
                    }
                    break;
                case 'dir':
                    if (resolved) {
                        // The directory portion of a path.
                        resolved = _path().default.dirname(resolved);
                    }
                    break;
                case 'base':
                    if (resolved) {
                        // The base name of a path - the last path component with any extension removed.
                        const b = _path().default.basename(resolved);
                        const extensionIndex = b.lastIndexOf('.');
                        resolved = extensionIndex === -1 ? b : b.slice(0, extensionIndex);
                    }
                    break;
                case 'rfc1034identifier':
                    // A representation suitable for use in a DNS name.
                    // TODO: Check the spec if there is one, this is just what we had before.
                    resolved = resolved?.replace(/[^a-zA-Z0-9]/g, '-');
                    break;
                case 'c99extidentifier':
                    // Like identifier, but with support for extended characters allowed by C99. Added in Xcode 6.
                    // TODO: Check the spec if there is one.
                    resolved = resolved?.replace(/[-\s]/g, '_');
                    break;
                case 'standardizepath':
                    if (resolved) {
                        // The equivalent of calling stringByStandardizingPath on the string.
                        // https://developer.apple.com/documentation/foundation/nsstring/1407194-standardizingpath
                        resolved = _path().default.resolve(resolved);
                    }
                    break;
                default:
                    resolved ||= modifier.match(/default=(.*)/)?.[1];
                    break;
            }
        });
        return resolveXcodeBuildSetting(resolved ?? '', lookup);
    });
    if (parsedValue !== value) {
        return resolveXcodeBuildSetting(parsedValue, lookup);
    }
    return value;
}

//# sourceMappingURL=Xcodeproj.js.map
