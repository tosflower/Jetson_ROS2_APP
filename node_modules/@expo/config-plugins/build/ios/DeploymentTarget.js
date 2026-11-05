"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getDeploymentTarget: null,
    setDeploymentTargetForBuildConfiguration: null,
    updateDeploymentTargetForPbxproj: null,
    withDeploymentTarget: null,
    withDeploymentTargetPodfileProps: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getDeploymentTarget () {
        return getDeploymentTarget;
    },
    get setDeploymentTargetForBuildConfiguration () {
        return setDeploymentTargetForBuildConfiguration;
    },
    get updateDeploymentTargetForPbxproj () {
        return updateDeploymentTargetForPbxproj;
    },
    get withDeploymentTarget () {
        return withDeploymentTarget;
    },
    get withDeploymentTargetPodfileProps () {
        return withDeploymentTargetPodfileProps;
    }
});
const _iosplugins = require("../plugins/ios-plugins");
const _BuildProperties = require("./BuildProperties");
const _Target = require("./Target");
const _Xcodeproj = require("./utils/Xcodeproj");
const withDeploymentTarget = (config)=>{
    return (0, _iosplugins.withXcodeProject)(config, (config)=>{
        const deploymentTarget = getDeploymentTarget(config);
        if (deploymentTarget) {
            config.modResults = updateDeploymentTargetForPbxproj(config.modResults, deploymentTarget);
        }
        return config;
    });
};
const withDeploymentTargetPodfileProps = (0, _BuildProperties.createBuildPodfilePropsConfigPlugin)([
    {
        propName: 'ios.deploymentTarget',
        propValueGetter: (config)=>config.ios?.deploymentTarget ?? null
    }
], 'withDeploymentTargetPodfileProps');
function getDeploymentTarget(config) {
    return config.ios?.deploymentTarget ?? null;
}
function setDeploymentTargetForBuildConfiguration(xcBuildConfiguration, deploymentTarget) {
    if (deploymentTarget) {
        xcBuildConfiguration.buildSettings.IPHONEOS_DEPLOYMENT_TARGET = deploymentTarget;
    }
}
function updateDeploymentTargetForPbxproj(project, deploymentTarget) {
    const [, mainTarget] = (0, _Target.findFirstNativeTarget)(project);
    (0, _Xcodeproj.getBuildConfigurationsForListId)(project, mainTarget.buildConfigurationList).forEach(([, buildConfig])=>setDeploymentTargetForBuildConfiguration(buildConfig, deploymentTarget));
    return project;
}

//# sourceMappingURL=DeploymentTarget.js.map
