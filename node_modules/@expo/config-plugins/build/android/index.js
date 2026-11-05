"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    AllowBackup: null,
    BuildProperties: null,
    CodeMod: null,
    Colors: null,
    EasBuild: null,
    GoogleMapsApiKey: null,
    GoogleServices: null,
    IntentFilters: null,
    Locales: null,
    Manifest: null,
    Name: null,
    Orientation: null,
    Package: null,
    Paths: null,
    Permissions: null,
    PredictiveBackGesture: null,
    PrimaryColor: null,
    Properties: null,
    Resources: null,
    Scheme: null,
    Strings: null,
    Styles: null,
    SystemBars: null,
    Updates: null,
    Version: null,
    WindowSoftInputMode: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get AllowBackup () {
        return _AllowBackup;
    },
    get BuildProperties () {
        return _BuildProperties;
    },
    get CodeMod () {
        return _codeMod;
    },
    get Colors () {
        return _Colors;
    },
    get EasBuild () {
        return _EasBuild;
    },
    get GoogleMapsApiKey () {
        return _GoogleMapsApiKey;
    },
    get GoogleServices () {
        return _GoogleServices;
    },
    get IntentFilters () {
        return _IntentFilters;
    },
    get Locales () {
        return _Locales;
    },
    get Manifest () {
        return _Manifest;
    },
    get Name () {
        return _Name;
    },
    get Orientation () {
        return _Orientation;
    },
    get Package () {
        return _Package;
    },
    get Paths () {
        return _Paths;
    },
    get Permissions () {
        return _Permissions;
    },
    get PredictiveBackGesture () {
        return _PredictiveBackGesture;
    },
    get PrimaryColor () {
        return _PrimaryColor;
    },
    get Properties () {
        return _Properties;
    },
    get Resources () {
        return _Resources;
    },
    get Scheme () {
        return _Scheme;
    },
    get Strings () {
        return _Strings;
    },
    get Styles () {
        return _Styles;
    },
    get SystemBars () {
        return _SystemBars;
    },
    get Updates () {
        return _Updates;
    },
    get Version () {
        return _Version;
    },
    get WindowSoftInputMode () {
        return _WindowSoftInputMode;
    }
});
const _AllowBackup = /*#__PURE__*/ _interop_require_wildcard(require("./AllowBackup"));
const _BuildProperties = /*#__PURE__*/ _interop_require_wildcard(require("./BuildProperties"));
const _Colors = /*#__PURE__*/ _interop_require_wildcard(require("./Colors"));
const _EasBuild = /*#__PURE__*/ _interop_require_wildcard(require("./EasBuild"));
const _GoogleMapsApiKey = /*#__PURE__*/ _interop_require_wildcard(require("./GoogleMapsApiKey"));
const _GoogleServices = /*#__PURE__*/ _interop_require_wildcard(require("./GoogleServices"));
const _IntentFilters = /*#__PURE__*/ _interop_require_wildcard(require("./IntentFilters"));
const _Locales = /*#__PURE__*/ _interop_require_wildcard(require("./Locales"));
const _Manifest = /*#__PURE__*/ _interop_require_wildcard(require("./Manifest"));
const _Name = /*#__PURE__*/ _interop_require_wildcard(require("./Name"));
const _Orientation = /*#__PURE__*/ _interop_require_wildcard(require("./Orientation"));
const _Package = /*#__PURE__*/ _interop_require_wildcard(require("./Package"));
const _Paths = /*#__PURE__*/ _interop_require_wildcard(require("./Paths"));
const _Permissions = /*#__PURE__*/ _interop_require_wildcard(require("./Permissions"));
const _PredictiveBackGesture = /*#__PURE__*/ _interop_require_wildcard(require("./PredictiveBackGesture"));
const _PrimaryColor = /*#__PURE__*/ _interop_require_wildcard(require("./PrimaryColor"));
const _Properties = /*#__PURE__*/ _interop_require_wildcard(require("./Properties"));
const _Resources = /*#__PURE__*/ _interop_require_wildcard(require("./Resources"));
const _Scheme = /*#__PURE__*/ _interop_require_wildcard(require("./Scheme"));
const _Strings = /*#__PURE__*/ _interop_require_wildcard(require("./Strings"));
const _Styles = /*#__PURE__*/ _interop_require_wildcard(require("./Styles"));
const _SystemBars = /*#__PURE__*/ _interop_require_wildcard(require("./SystemBars"));
const _Updates = /*#__PURE__*/ _interop_require_wildcard(require("./Updates"));
const _Version = /*#__PURE__*/ _interop_require_wildcard(require("./Version"));
const _WindowSoftInputMode = /*#__PURE__*/ _interop_require_wildcard(require("./WindowSoftInputMode"));
const _codeMod = /*#__PURE__*/ _interop_require_wildcard(require("./codeMod"));
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
