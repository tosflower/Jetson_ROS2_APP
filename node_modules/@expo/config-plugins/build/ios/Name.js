"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getName: null,
    setDisplayName: null,
    setName: null,
    setProductName: null,
    withDisplayName: null,
    withName: null,
    withProductName: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getName () {
        return getName;
    },
    get setDisplayName () {
        return setDisplayName;
    },
    get setName () {
        return setName;
    },
    get setProductName () {
        return setProductName;
    },
    get withDisplayName () {
        return withDisplayName;
    },
    get withName () {
        return withName;
    },
    get withProductName () {
        return withProductName;
    }
});
const _iosplugins = require("../plugins/ios-plugins");
const _Target = require("./Target");
const _Xcodeproj = require("./utils/Xcodeproj");
const withDisplayName = (0, _iosplugins.createInfoPlistPluginWithPropertyGuard)(setDisplayName, {
    infoPlistProperty: 'CFBundleDisplayName',
    expoConfigProperty: 'name'
}, 'withDisplayName');
const withName = (0, _iosplugins.createInfoPlistPluginWithPropertyGuard)(setName, {
    infoPlistProperty: 'CFBundleName',
    expoConfigProperty: 'name'
}, 'withName');
const withProductName = (config)=>{
    return (0, _iosplugins.withXcodeProject)(config, (config)=>{
        config.modResults = setProductName(config, config.modResults);
        return config;
    });
};
function getName(config) {
    return typeof config.name === 'string' ? config.name : null;
}
function setDisplayName(configOrName, { CFBundleDisplayName, ...infoPlist }) {
    let name = null;
    if (typeof configOrName === 'string') {
        name = configOrName;
    } else {
        name = getName(configOrName);
    }
    if (!name) {
        return infoPlist;
    }
    return {
        ...infoPlist,
        CFBundleDisplayName: name
    };
}
function setName(config, { CFBundleName, ...infoPlist }) {
    const name = getName(config);
    if (!name) {
        return infoPlist;
    }
    return {
        ...infoPlist,
        CFBundleName: name
    };
}
function setProductName(config, project) {
    const name = (0, _Xcodeproj.sanitizedName)(getName(config) ?? '');
    if (!name) {
        return project;
    }
    const quotedName = ensureQuotes(name);
    const [, nativeTarget] = (0, _Target.findFirstNativeTarget)(project);
    (0, _Xcodeproj.getBuildConfigurationsForListId)(project, nativeTarget.buildConfigurationList).forEach(([, item])=>{
        item.buildSettings.PRODUCT_NAME = quotedName;
    });
    return project;
}
const ensureQuotes = (value)=>{
    if (!value.match(/^['"]/)) {
        return `"${value}"`;
    }
    return value;
};

//# sourceMappingURL=Name.js.map
