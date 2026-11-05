"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    applyPermissions: null,
    createPermissionsPlugin: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get applyPermissions () {
        return applyPermissions;
    },
    get createPermissionsPlugin () {
        return createPermissionsPlugin;
    }
});
function _debug() {
    const data = /*#__PURE__*/ _interop_require_default(require("debug"));
    _debug = function() {
        return data;
    };
    return data;
}
const _iosplugins = require("../plugins/ios-plugins");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const debug = (0, _debug().default)('expo:config-plugins:ios:permissions');
function applyPermissions(defaults, permissions, infoPlist) {
    const entries = Object.entries(defaults);
    if (entries.length === 0) {
        debug(`No defaults provided: ${JSON.stringify(permissions)}`);
    }
    for (const [permission, description] of entries){
        if (permissions[permission] === false) {
            debug(`Deleting "${permission}"`);
            delete infoPlist[permission];
        } else {
            infoPlist[permission] = permissions[permission] || infoPlist[permission] || description;
            debug(`Setting "${permission}" to "${infoPlist[permission]}"`);
        }
    }
    return infoPlist;
}
function createPermissionsPlugin(defaults, name) {
    const withIosPermissions = (config, permissions)=>(0, _iosplugins.withInfoPlist)(config, async (config)=>{
            config.modResults = applyPermissions(defaults, permissions, config.modResults);
            return config;
        });
    if (name) {
        Object.defineProperty(withIosPermissions, 'name', {
            value: name
        });
    }
    return withIosPermissions;
}

//# sourceMappingURL=Permissions.js.map
