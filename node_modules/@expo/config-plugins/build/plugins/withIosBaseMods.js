"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getIosModFileProviders: null,
    withIosBaseMods: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getIosModFileProviders () {
        return getIosModFileProviders;
    },
    get withIosBaseMods () {
        return withIosBaseMods;
    }
});
function _jsonfile() {
    const data = /*#__PURE__*/ _interop_require_default(require("@expo/json-file"));
    _jsonfile = function() {
        return data;
    };
    return data;
}
function _plist() {
    const data = /*#__PURE__*/ _interop_require_default(require("@expo/plist"));
    _plist = function() {
        return data;
    };
    return data;
}
function _assert() {
    const data = /*#__PURE__*/ _interop_require_default(require("assert"));
    _assert = function() {
        return data;
    };
    return data;
}
function _fs() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("fs"));
    _fs = function() {
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
function _xcode() {
    const data = /*#__PURE__*/ _interop_require_default(require("xcode"));
    _xcode = function() {
        return data;
    };
    return data;
}
const _ios = require("../ios");
const _Entitlements = require("../ios/Entitlements");
const _Xcodeproj = require("../ios/utils/Xcodeproj");
const _getInfoPlistPath = require("../ios/utils/getInfoPlistPath");
const _modules = require("../utils/modules");
const _sortObject = require("../utils/sortObject");
const _warnings = require("../utils/warnings");
const _createBaseMod = require("./createBaseMod");
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
const { readFile, writeFile } = _fs().promises;
function getEntitlementsPlistTemplate() {
    // TODO: Fetch the versioned template file if possible
    return {};
}
function getInfoPlistTemplate() {
    // TODO: Fetch the versioned template file if possible
    return {
        CFBundleDevelopmentRegion: '$(DEVELOPMENT_LANGUAGE)',
        CFBundleExecutable: '$(EXECUTABLE_NAME)',
        CFBundleIdentifier: '$(PRODUCT_BUNDLE_IDENTIFIER)',
        CFBundleName: '$(PRODUCT_NAME)',
        CFBundlePackageType: '$(PRODUCT_BUNDLE_PACKAGE_TYPE)',
        CFBundleInfoDictionaryVersion: '6.0',
        CFBundleSignature: '????',
        LSMinimumSystemVersion: '12.0',
        LSRequiresIPhoneOS: true,
        NSAppTransportSecurity: {
            NSAllowsArbitraryLoads: true,
            NSExceptionDomains: {
                localhost: {
                    NSExceptionAllowsInsecureHTTPLoads: true
                }
            }
        },
        UILaunchStoryboardName: 'SplashScreen',
        UIRequiredDeviceCapabilities: [
            'armv7'
        ],
        UIViewControllerBasedStatusBarAppearance: false,
        UIStatusBarStyle: 'UIStatusBarStyleDefault',
        CADisableMinimumFrameDurationOnPhone: true
    };
}
const defaultProviders = {
    dangerous: (0, _createBaseMod.provider)({
        getFilePath () {
            return '';
        },
        async read () {
            return {};
        },
        async write () {}
    }),
    finalized: (0, _createBaseMod.provider)({
        getFilePath () {
            return '';
        },
        async read () {
            return {};
        },
        async write () {}
    }),
    // Append a rule to supply AppDelegate data to mods on `mods.ios.appDelegate`
    appDelegate: (0, _createBaseMod.provider)({
        getFilePath ({ modRequest: { projectRoot } }) {
            // TODO: Get application AppDelegate file from pbxproj.
            return _ios.Paths.getAppDelegateFilePath(projectRoot);
        },
        async read (filePath) {
            return _ios.Paths.getFileInfo(filePath);
        },
        async write (filePath, { modResults: { contents } }) {
            await writeFile(filePath, contents);
        }
    }),
    // Append a rule to supply Expo.plist data to mods on `mods.ios.expoPlist`
    expoPlist: (0, _createBaseMod.provider)({
        isIntrospective: true,
        getFilePath ({ modRequest: { platformProjectRoot, projectName } }) {
            const supportingDirectory = _path().default.join(platformProjectRoot, projectName, 'Supporting');
            return _path().default.resolve(supportingDirectory, 'Expo.plist');
        },
        async read (filePath, { modRequest: { introspect } }) {
            try {
                return _plist().default.parse(await readFile(filePath, 'utf8'));
            } catch (error) {
                if (introspect) {
                    return {};
                }
                throw error;
            }
        },
        async write (filePath, { modResults, modRequest: { introspect } }) {
            if (introspect) {
                return;
            }
            await writeFile(filePath, _plist().default.build((0, _sortObject.sortObject)(modResults)));
        }
    }),
    // Append a rule to supply .xcodeproj data to mods on `mods.ios.xcodeproj`
    xcodeproj: (0, _createBaseMod.provider)({
        getFilePath ({ modRequest: { projectRoot } }) {
            return _ios.Paths.getPBXProjectPath(projectRoot);
        },
        async read (filePath) {
            const project = _xcode().default.project(filePath);
            project.parseSync();
            return project;
        },
        async write (filePath, { modResults }) {
            await writeFile(filePath, modResults.writeSync());
        }
    }),
    // Append a rule to supply Info.plist data to mods on `mods.ios.infoPlist`
    infoPlist: (0, _createBaseMod.provider)({
        isIntrospective: true,
        async getFilePath (config) {
            let project = null;
            try {
                project = (0, _Xcodeproj.getPbxproj)(config.modRequest.projectRoot);
            } catch  {
            // noop
            }
            // Only check / warn if a project actually exists, this'll provide
            // more accurate warning messages for users in managed projects.
            if (project) {
                const infoPlistBuildProperty = (0, _getInfoPlistPath.getInfoPlistPathFromPbxproj)(project);
                if (infoPlistBuildProperty) {
                    //: [root]/myapp/ios/MyApp/Info.plist
                    const infoPlistPath = _path().default.join(//: myapp/ios
                    config.modRequest.platformProjectRoot, //: MyApp/Info.plist
                    infoPlistBuildProperty);
                    if ((0, _modules.fileExists)(infoPlistPath)) {
                        return infoPlistPath;
                    }
                    (0, _warnings.addWarningIOS)('mods.ios.infoPlist', `Info.plist file linked to Xcode project does not exist: ${infoPlistPath}`);
                } else {
                    (0, _warnings.addWarningIOS)('mods.ios.infoPlist', 'Failed to find Info.plist linked to Xcode project.');
                }
            }
            try {
                // Fallback on glob...
                return await _ios.Paths.getInfoPlistPath(config.modRequest.projectRoot);
            } catch (error) {
                if (config.modRequest.introspect) {
                    // fallback to an empty string in introspection mode.
                    return '';
                }
                throw error;
            }
        },
        async read (filePath, config) {
            // Apply all of the Info.plist values to the expo.ios.infoPlist object
            // TODO: Remove this in favor of just overwriting the Info.plist with the Expo object. This will enable people to actually remove values.
            if (!config.ios) config.ios = {};
            if (!config.ios.infoPlist) config.ios.infoPlist = {};
            let modResults;
            try {
                const contents = await readFile(filePath, 'utf8');
                (0, _assert().default)(contents, 'Info.plist is empty');
                modResults = _plist().default.parse(contents);
            } catch (error) {
                // Throw errors in introspection mode.
                if (!config.modRequest.introspect) {
                    throw error;
                }
                // Fallback to using the infoPlist object from the Expo config.
                modResults = getInfoPlistTemplate();
            }
            config.ios.infoPlist = {
                ...modResults || {},
                ...config.ios.infoPlist
            };
            return config.ios.infoPlist;
        },
        async write (filePath, config) {
            // Update the contents of the static infoPlist object
            if (!config.ios) {
                config.ios = {};
            }
            config.ios.infoPlist = config.modResults;
            // Return early without writing, in introspection mode.
            if (config.modRequest.introspect) {
                return;
            }
            await writeFile(filePath, _plist().default.build((0, _sortObject.sortObject)(config.modResults)));
        }
    }),
    // Append a rule to supply .entitlements data to mods on `mods.ios.entitlements`
    entitlements: (0, _createBaseMod.provider)({
        isIntrospective: true,
        async getFilePath (config) {
            try {
                (0, _Entitlements.ensureApplicationTargetEntitlementsFileConfigured)(config.modRequest.projectRoot);
                return _ios.Entitlements.getEntitlementsPath(config.modRequest.projectRoot) ?? '';
            } catch (error) {
                if (config.modRequest.introspect) {
                    // fallback to an empty string in introspection mode.
                    return '';
                }
                throw error;
            }
        },
        async read (filePath, config) {
            let modResults;
            try {
                if (!config.modRequest.ignoreExistingNativeFiles && _fs().default.existsSync(filePath)) {
                    const contents = await readFile(filePath, 'utf8');
                    (0, _assert().default)(contents, 'Entitlements plist is empty');
                    modResults = _plist().default.parse(contents);
                } else {
                    modResults = getEntitlementsPlistTemplate();
                }
            } catch (error) {
                // Throw errors in introspection mode.
                if (!config.modRequest.introspect) {
                    throw error;
                }
                // Fallback to using the template file.
                modResults = getEntitlementsPlistTemplate();
            }
            // Apply all of the .entitlements values to the expo.ios.entitlements object
            // TODO: Remove this in favor of just overwriting the .entitlements with the Expo object. This will enable people to actually remove values.
            if (!config.ios) config.ios = {};
            if (!config.ios.entitlements) config.ios.entitlements = {};
            config.ios.entitlements = {
                ...modResults || {},
                ...config.ios.entitlements
            };
            return config.ios.entitlements;
        },
        async write (filePath, config) {
            // Update the contents of the static entitlements object
            if (!config.ios) {
                config.ios = {};
            }
            config.ios.entitlements = config.modResults;
            // Return early without writing, in introspection mode.
            if (config.modRequest.introspect) {
                return;
            }
            await writeFile(filePath, _plist().default.build((0, _sortObject.sortObject)(config.modResults)));
        }
    }),
    podfile: (0, _createBaseMod.provider)({
        getFilePath ({ modRequest: { projectRoot } }) {
            return _ios.Paths.getPodfilePath(projectRoot);
        },
        // @ts-expect-error
        async read (filePath) {
            // Note(cedric): this file is ruby, which is a 1-value subset of AppleLanguage and fails the type check
            return _ios.Paths.getFileInfo(filePath);
        },
        async write (filePath, { modResults: { contents } }) {
            await writeFile(filePath, contents);
        }
    }),
    // Append a rule to supply Podfile.properties.json data to mods on `mods.ios.podfileProperties`
    podfileProperties: (0, _createBaseMod.provider)({
        isIntrospective: true,
        getFilePath ({ modRequest: { platformProjectRoot } }) {
            return _path().default.resolve(platformProjectRoot, 'Podfile.properties.json');
        },
        async read (filePath) {
            let results = {};
            try {
                results = await _jsonfile().default.readAsync(filePath);
            } catch  {}
            return results;
        },
        async write (filePath, { modResults, modRequest: { introspect } }) {
            if (introspect) {
                return;
            }
            await _jsonfile().default.writeAsync(filePath, modResults);
        }
    })
};
function withIosBaseMods(config, { providers, ...props } = {}) {
    return (0, _createBaseMod.withGeneratedBaseMods)(config, {
        ...props,
        platform: 'ios',
        providers: providers ?? getIosModFileProviders()
    });
}
function getIosModFileProviders() {
    return defaultProviders;
}

//# sourceMappingURL=withIosBaseMods.js.map
