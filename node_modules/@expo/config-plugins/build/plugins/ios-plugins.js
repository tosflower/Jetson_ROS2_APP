"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createEntitlementsPlugin: null,
    createInfoPlistPlugin: null,
    createInfoPlistPluginWithPropertyGuard: null,
    withAppDelegate: null,
    withEntitlementsPlist: null,
    withExpoPlist: null,
    withInfoPlist: null,
    withPodfile: null,
    withPodfileProperties: null,
    withXcodeProject: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get createEntitlementsPlugin () {
        return createEntitlementsPlugin;
    },
    get createInfoPlistPlugin () {
        return createInfoPlistPlugin;
    },
    get createInfoPlistPluginWithPropertyGuard () {
        return createInfoPlistPluginWithPropertyGuard;
    },
    get withAppDelegate () {
        return withAppDelegate;
    },
    get withEntitlementsPlist () {
        return withEntitlementsPlist;
    },
    get withExpoPlist () {
        return withExpoPlist;
    },
    get withInfoPlist () {
        return withInfoPlist;
    },
    get withPodfile () {
        return withPodfile;
    },
    get withPodfileProperties () {
        return withPodfileProperties;
    },
    get withXcodeProject () {
        return withXcodeProject;
    }
});
const _obj = require("../utils/obj");
const _warnings = require("../utils/warnings");
const _withMod = require("./withMod");
function createInfoPlistPlugin(action, name) {
    const withUnknown = (config)=>withInfoPlist(config, async (config)=>{
            config.modResults = await action(config, config.modResults);
            return config;
        });
    if (name) {
        Object.defineProperty(withUnknown, 'name', {
            value: name
        });
    }
    return withUnknown;
}
function createInfoPlistPluginWithPropertyGuard(action, settings, name) {
    const withUnknown = (config)=>withInfoPlist(config, async (config)=>{
            const existingProperty = settings.expoPropertyGetter ? settings.expoPropertyGetter(config) : (0, _obj.get)(config, settings.expoConfigProperty);
            // If the user explicitly sets a value in the infoPlist, we should respect that.
            if (config.modRawConfig.ios?.infoPlist?.[settings.infoPlistProperty] === undefined) {
                config.modResults = await action(config, config.modResults);
            } else if (existingProperty !== undefined) {
                // Only warn if there is a conflict.
                (0, _warnings.addWarningIOS)(settings.expoConfigProperty, `"ios.infoPlist.${settings.infoPlistProperty}" is set in the config. Ignoring abstract property "${settings.expoConfigProperty}": ${existingProperty}`);
            }
            return config;
        });
    if (name) {
        Object.defineProperty(withUnknown, 'name', {
            value: name
        });
    }
    return withUnknown;
}
function createEntitlementsPlugin(action, name) {
    const withUnknown = (config)=>withEntitlementsPlist(config, async (config)=>{
            config.modResults = await action(config, config.modResults);
            return config;
        });
    if (name) {
        Object.defineProperty(withUnknown, 'name', {
            value: name
        });
    }
    return withUnknown;
}
const withAppDelegate = (config, action)=>{
    return (0, _withMod.withMod)(config, {
        platform: 'ios',
        mod: 'appDelegate',
        action
    });
};
const withInfoPlist = (config, action)=>{
    return (0, _withMod.withMod)(config, {
        platform: 'ios',
        mod: 'infoPlist',
        async action (config) {
            config = await action(config);
            if (!config.ios) {
                config.ios = {};
            }
            config.ios.infoPlist = config.modResults;
            return config;
        }
    });
};
const withEntitlementsPlist = (config, action)=>{
    return (0, _withMod.withMod)(config, {
        platform: 'ios',
        mod: 'entitlements',
        async action (config) {
            config = await action(config);
            if (!config.ios) {
                config.ios = {};
            }
            config.ios.entitlements = config.modResults;
            return config;
        }
    });
};
const withExpoPlist = (config, action)=>{
    return (0, _withMod.withMod)(config, {
        platform: 'ios',
        mod: 'expoPlist',
        action
    });
};
const withXcodeProject = (config, action)=>{
    return (0, _withMod.withMod)(config, {
        platform: 'ios',
        mod: 'xcodeproj',
        action
    });
};
const withPodfile = (config, action)=>{
    return (0, _withMod.withMod)(config, {
        platform: 'ios',
        mod: 'podfile',
        action
    });
};
const withPodfileProperties = (config, action)=>{
    return (0, _withMod.withMod)(config, {
        platform: 'ios',
        mod: 'podfileProperties',
        action
    });
};

//# sourceMappingURL=ios-plugins.js.map
