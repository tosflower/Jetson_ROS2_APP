"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getIosInlineModulesClassNames: null,
    isTargetInInlineModulesTargets: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getIosInlineModulesClassNames () {
        return getIosInlineModulesClassNames;
    },
    get isTargetInInlineModulesTargets () {
        return isTargetInInlineModulesTargets;
    }
});
const _inlineModules = require("./inlineModules");
async function getIosInlineModulesClassNames(options) {
    const stateObject = await (0, _inlineModules.getMirrorStateObject)(options);
    return stateObject.swiftModuleClassNames.map((className)=>{
        return {
            class: className,
            name: null
        };
    });
}
function extractTargetNameFromPath(targetPath) {
    const targetRegex = /\/Pods-(.+?)\/ExpoModulesProvider\.swift$/;
    return targetPath.match(targetRegex)?.[1];
}
function isTargetInInlineModulesTargets({ targetName, targetPath, inlineModulesTargets }) {
    const resolvedTargetName = targetName ?? extractTargetNameFromPath(targetPath);
    if (resolvedTargetName === undefined) {
        return false;
    }
    if (inlineModulesTargets.mainTarget) {
        return resolvedTargetName === inlineModulesTargets.mainTarget;
    }
    return inlineModulesTargets.targets.includes(resolvedTargetName);
}

//# sourceMappingURL=iosInlineModules.js.map
