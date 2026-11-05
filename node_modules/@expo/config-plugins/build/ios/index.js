"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    Bitcode: null,
    BuildProperties: null,
    BuildScheme: null,
    BundleIdentifier: null,
    DeploymentTarget: null,
    DevServer: null,
    DevelopmentTeam: null,
    DeviceFamily: null,
    Entitlements: null,
    Google: null,
    Locales: null,
    Maps: null,
    Name: null,
    Orientation: null,
    Paths: null,
    Permissions: null,
    PrivacyInfo: null,
    ProvisioningProfile: null,
    RequiresFullScreen: null,
    Scheme: null,
    Target: null,
    Updates: null,
    UsesNonExemptEncryption: null,
    Version: null,
    XcodeProjectFile: null,
    XcodeUtils: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get Bitcode () {
        return _Bitcode;
    },
    get BuildProperties () {
        return _BuildProperties;
    },
    get BuildScheme () {
        return _BuildScheme;
    },
    get BundleIdentifier () {
        return _BundleIdentifier;
    },
    get DeploymentTarget () {
        return _DeploymentTarget;
    },
    get DevServer () {
        return _DevServer;
    },
    get DevelopmentTeam () {
        return _DevelopmentTeam;
    },
    get DeviceFamily () {
        return _DeviceFamily;
    },
    get Entitlements () {
        return _Entitlements;
    },
    get Google () {
        return _Google;
    },
    get Locales () {
        return _Locales;
    },
    get Maps () {
        return _Maps;
    },
    get Name () {
        return _Name;
    },
    get Orientation () {
        return _Orientation;
    },
    get Paths () {
        return _Paths;
    },
    get Permissions () {
        return _Permissions;
    },
    get PrivacyInfo () {
        return _PrivacyInfo;
    },
    get ProvisioningProfile () {
        return _ProvisioningProfile;
    },
    get RequiresFullScreen () {
        return _RequiresFullScreen;
    },
    get Scheme () {
        return _Scheme;
    },
    get Target () {
        return _Target;
    },
    get Updates () {
        return _Updates;
    },
    get UsesNonExemptEncryption () {
        return _UsesNonExemptEncryption;
    },
    get Version () {
        return _Version;
    },
    get XcodeProjectFile () {
        return _XcodeProjectFile;
    },
    get XcodeUtils () {
        return _Xcodeproj;
    }
});
const _Bitcode = /*#__PURE__*/ _interop_require_wildcard(require("./Bitcode"));
const _BuildProperties = /*#__PURE__*/ _interop_require_wildcard(require("./BuildProperties"));
const _BuildScheme = /*#__PURE__*/ _interop_require_wildcard(require("./BuildScheme"));
const _BundleIdentifier = /*#__PURE__*/ _interop_require_wildcard(require("./BundleIdentifier"));
const _DeploymentTarget = /*#__PURE__*/ _interop_require_wildcard(require("./DeploymentTarget"));
const _DevelopmentTeam = /*#__PURE__*/ _interop_require_wildcard(require("./DevelopmentTeam"));
const _DevServer = /*#__PURE__*/ _interop_require_wildcard(require("./DevServer"));
const _DeviceFamily = /*#__PURE__*/ _interop_require_wildcard(require("./DeviceFamily"));
const _Entitlements = /*#__PURE__*/ _interop_require_wildcard(require("./Entitlements"));
const _Google = /*#__PURE__*/ _interop_require_wildcard(require("./Google"));
const _Locales = /*#__PURE__*/ _interop_require_wildcard(require("./Locales"));
const _Maps = /*#__PURE__*/ _interop_require_wildcard(require("./Maps"));
const _Name = /*#__PURE__*/ _interop_require_wildcard(require("./Name"));
const _Orientation = /*#__PURE__*/ _interop_require_wildcard(require("./Orientation"));
const _Paths = /*#__PURE__*/ _interop_require_wildcard(require("./Paths"));
const _Permissions = /*#__PURE__*/ _interop_require_wildcard(require("./Permissions"));
const _PrivacyInfo = /*#__PURE__*/ _interop_require_wildcard(require("./PrivacyInfo"));
const _ProvisioningProfile = /*#__PURE__*/ _interop_require_wildcard(require("./ProvisioningProfile"));
const _RequiresFullScreen = /*#__PURE__*/ _interop_require_wildcard(require("./RequiresFullScreen"));
const _Scheme = /*#__PURE__*/ _interop_require_wildcard(require("./Scheme"));
const _Target = /*#__PURE__*/ _interop_require_wildcard(require("./Target"));
const _Updates = /*#__PURE__*/ _interop_require_wildcard(require("./Updates"));
const _UsesNonExemptEncryption = /*#__PURE__*/ _interop_require_wildcard(require("./UsesNonExemptEncryption"));
const _Version = /*#__PURE__*/ _interop_require_wildcard(require("./Version"));
const _XcodeProjectFile = /*#__PURE__*/ _interop_require_wildcard(require("./XcodeProjectFile"));
const _Xcodeproj = /*#__PURE__*/ _interop_require_wildcard(require("./utils/Xcodeproj"));
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

//# sourceMappingURL=index.js.map
