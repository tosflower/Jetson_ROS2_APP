"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    appendScheme: null,
    getScheme: null,
    getSchemesFromPlist: null,
    hasScheme: null,
    removeScheme: null,
    setScheme: null,
    withScheme: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get appendScheme () {
        return appendScheme;
    },
    get getScheme () {
        return getScheme;
    },
    get getSchemesFromPlist () {
        return getSchemesFromPlist;
    },
    get hasScheme () {
        return hasScheme;
    },
    get removeScheme () {
        return removeScheme;
    },
    get setScheme () {
        return setScheme;
    },
    get withScheme () {
        return withScheme;
    }
});
const _iosplugins = require("../plugins/ios-plugins");
const withScheme = (0, _iosplugins.createInfoPlistPluginWithPropertyGuard)(setScheme, {
    infoPlistProperty: 'CFBundleURLTypes',
    expoConfigProperty: 'scheme'
}, 'withScheme');
function getScheme(config) {
    if (Array.isArray(config.scheme)) {
        const validate = (value)=>{
            return typeof value === 'string';
        };
        return config.scheme.filter(validate);
    } else if (typeof config.scheme === 'string') {
        return [
            config.scheme
        ];
    }
    return [];
}
function setScheme(config, infoPlist) {
    const scheme = [
        ...getScheme(config),
        ...getScheme(config.ios ?? {})
    ];
    // Add the bundle identifier to the list of schemes for easier Google auth and parity with Turtle v1.
    if (config.ios?.bundleIdentifier) {
        scheme.push(config.ios.bundleIdentifier);
    }
    if (scheme.length === 0) {
        return infoPlist;
    }
    return {
        ...infoPlist,
        CFBundleURLTypes: [
            {
                CFBundleURLSchemes: scheme
            }
        ]
    };
}
function appendScheme(scheme, infoPlist) {
    if (!scheme) {
        return infoPlist;
    }
    const existingSchemes = infoPlist.CFBundleURLTypes ?? [];
    if (existingSchemes?.some(({ CFBundleURLSchemes })=>CFBundleURLSchemes.includes(scheme))) {
        return infoPlist;
    }
    return {
        ...infoPlist,
        CFBundleURLTypes: [
            ...existingSchemes,
            {
                CFBundleURLSchemes: [
                    scheme
                ]
            }
        ]
    };
}
function removeScheme(scheme, infoPlist) {
    if (!scheme) {
        return infoPlist;
    }
    // No need to remove if we don't have any
    if (!infoPlist.CFBundleURLTypes) {
        return infoPlist;
    }
    infoPlist.CFBundleURLTypes = infoPlist.CFBundleURLTypes.map((bundleUrlType)=>{
        const index = bundleUrlType.CFBundleURLSchemes.indexOf(scheme);
        if (index > -1) {
            bundleUrlType.CFBundleURLSchemes.splice(index, 1);
            if (bundleUrlType.CFBundleURLSchemes.length === 0) {
                return undefined;
            }
        }
        return bundleUrlType;
    }).filter(Boolean);
    return infoPlist;
}
function hasScheme(scheme, infoPlist) {
    const existingSchemes = infoPlist.CFBundleURLTypes;
    if (!Array.isArray(existingSchemes)) return false;
    return existingSchemes?.some(({ CFBundleURLSchemes: schemes })=>Array.isArray(schemes) ? schemes.includes(scheme) : false);
}
function getSchemesFromPlist(infoPlist) {
    if (Array.isArray(infoPlist.CFBundleURLTypes)) {
        return infoPlist.CFBundleURLTypes.reduce((schemes, { CFBundleURLSchemes })=>{
            if (Array.isArray(CFBundleURLSchemes)) {
                return [
                    ...schemes,
                    ...CFBundleURLSchemes
                ];
            }
            return schemes;
        }, []);
    }
    return [];
}

//# sourceMappingURL=Scheme.js.map
