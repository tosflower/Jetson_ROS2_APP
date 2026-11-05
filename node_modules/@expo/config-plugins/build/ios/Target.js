"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    TargetType: null,
    findApplicationTargetWithDependenciesAsync: null,
    findFirstNativeTarget: null,
    findNativeTargetByName: null,
    findSignableTargets: null,
    getNativeTargets: null,
    getXCBuildConfigurationFromPbxproj: null,
    isTargetOfType: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get TargetType () {
        return TargetType;
    },
    get findApplicationTargetWithDependenciesAsync () {
        return findApplicationTargetWithDependenciesAsync;
    },
    get findFirstNativeTarget () {
        return findFirstNativeTarget;
    },
    get findNativeTargetByName () {
        return findNativeTargetByName;
    },
    get findSignableTargets () {
        return findSignableTargets;
    },
    get getNativeTargets () {
        return getNativeTargets;
    },
    get getXCBuildConfigurationFromPbxproj () {
        return getXCBuildConfigurationFromPbxproj;
    },
    get isTargetOfType () {
        return isTargetOfType;
    }
});
const _BuildScheme = require("./BuildScheme");
const _Xcodeproj = require("./utils/Xcodeproj");
const _string = require("./utils/string");
var TargetType = /*#__PURE__*/ function(TargetType) {
    TargetType["APPLICATION"] = "com.apple.product-type.application";
    TargetType["EXTENSION"] = "com.apple.product-type.app-extension";
    TargetType["WATCH"] = "com.apple.product-type.application.watchapp";
    TargetType["APP_CLIP"] = "com.apple.product-type.application.on-demand-install-capable";
    TargetType["STICKER_PACK_EXTENSION"] = "com.apple.product-type.app-extension.messages-sticker-pack";
    TargetType["FRAMEWORK"] = "com.apple.product-type.framework";
    TargetType["OTHER"] = "other";
    return TargetType;
}({});
function getXCBuildConfigurationFromPbxproj(project, { targetName, buildConfiguration = 'Release' } = {}) {
    const [, nativeTarget] = targetName ? findNativeTargetByName(project, targetName) : findFirstNativeTarget(project);
    const [, xcBuildConfiguration] = (0, _Xcodeproj.getBuildConfigurationForListIdAndName)(project, {
        configurationListId: nativeTarget.buildConfigurationList,
        buildConfiguration
    });
    return xcBuildConfiguration ?? null;
}
async function findApplicationTargetWithDependenciesAsync(projectRoot, scheme) {
    const applicationTargetName = await (0, _BuildScheme.getApplicationTargetNameForSchemeAsync)(projectRoot, scheme);
    const project = (0, _Xcodeproj.getPbxproj)(projectRoot);
    const [, applicationTarget] = findNativeTargetByName(project, applicationTargetName);
    const dependencies = getTargetDependencies(project, applicationTarget);
    return {
        name: (0, _string.trimQuotes)(applicationTarget.name),
        type: "com.apple.product-type.application",
        signable: true,
        dependencies
    };
}
function getTargetDependencies(project, parentTarget) {
    if (!parentTarget.dependencies || parentTarget.dependencies.length === 0) {
        return undefined;
    }
    const nonSignableTargetTypes = [
        "com.apple.product-type.framework"
    ];
    return parentTarget.dependencies.map(({ value })=>{
        const { target: targetId } = project.getPBXGroupByKeyAndType(value, 'PBXTargetDependency');
        const [, target] = findNativeTargetById(project, targetId);
        const type = isTargetOfType(target, "com.apple.product-type.app-extension") ? "com.apple.product-type.app-extension" : "other";
        return {
            name: (0, _string.trimQuotes)(target.name),
            type,
            signable: !nonSignableTargetTypes.some((signableTargetType)=>isTargetOfType(target, signableTargetType)),
            dependencies: getTargetDependencies(project, target)
        };
    });
}
function isTargetOfType(target, targetType) {
    return (0, _string.trimQuotes)(target.productType) === targetType;
}
function getNativeTargets(project) {
    const section = project.pbxNativeTargetSection();
    return Object.entries(section).filter(_Xcodeproj.isNotComment);
}
function findSignableTargets(project) {
    const targets = getNativeTargets(project);
    const signableTargetTypes = [
        "com.apple.product-type.application",
        "com.apple.product-type.application.on-demand-install-capable",
        "com.apple.product-type.app-extension",
        "com.apple.product-type.application.watchapp",
        "com.apple.product-type.app-extension.messages-sticker-pack"
    ];
    const applicationTargets = targets.filter(([, target])=>{
        for (const targetType of signableTargetTypes){
            if (isTargetOfType(target, targetType)) {
                return true;
            }
        }
        return false;
    });
    if (applicationTargets.length === 0) {
        throw new Error(`Could not find any signable targets in project.pbxproj`);
    }
    return applicationTargets;
}
function findFirstNativeTarget(project) {
    const targets = getNativeTargets(project);
    const applicationTargets = targets.filter(([, target])=>isTargetOfType(target, "com.apple.product-type.application"));
    if (applicationTargets[0] == null) {
        throw new Error(`Could not find any application target in project.pbxproj`);
    }
    return applicationTargets[0];
}
function findNativeTargetByName(project, targetName) {
    const nativeTargets = getNativeTargets(project);
    const nativeTargetEntry = nativeTargets.find(([, i])=>(0, _string.trimQuotes)(i.name) === targetName);
    if (!nativeTargetEntry) {
        throw new Error(`Could not find target '${targetName}' in project.pbxproj`);
    }
    return nativeTargetEntry;
}
function findNativeTargetById(project, targetId) {
    const nativeTargets = getNativeTargets(project);
    const nativeTargetEntry = nativeTargets.find(([key])=>key === targetId);
    if (!nativeTargetEntry) {
        throw new Error(`Could not find target with id '${targetId}' in project.pbxproj`);
    }
    return nativeTargetEntry;
}

//# sourceMappingURL=Target.js.map
