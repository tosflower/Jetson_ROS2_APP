"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    MATCH_INIT: null,
    addGoogleMapsAppDelegateImport: null,
    addGoogleMapsAppDelegateInit: null,
    addMapsCocoaPods: null,
    getGoogleMapsApiKey: null,
    removeGoogleMapsAppDelegateImport: null,
    removeGoogleMapsAppDelegateInit: null,
    removeMapsCocoaPods: null,
    setGoogleMapsApiKey: null,
    withMaps: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get MATCH_INIT () {
        return MATCH_INIT;
    },
    get addGoogleMapsAppDelegateImport () {
        return addGoogleMapsAppDelegateImport;
    },
    get addGoogleMapsAppDelegateInit () {
        return addGoogleMapsAppDelegateInit;
    },
    get addMapsCocoaPods () {
        return addMapsCocoaPods;
    },
    get getGoogleMapsApiKey () {
        return getGoogleMapsApiKey;
    },
    get removeGoogleMapsAppDelegateImport () {
        return removeGoogleMapsAppDelegateImport;
    },
    get removeGoogleMapsAppDelegateInit () {
        return removeGoogleMapsAppDelegateInit;
    },
    get removeMapsCocoaPods () {
        return removeMapsCocoaPods;
    },
    get setGoogleMapsApiKey () {
        return setGoogleMapsApiKey;
    },
    get withMaps () {
        return withMaps;
    }
});
function _requireutils() {
    const data = require("@expo/require-utils");
    _requireutils = function() {
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
const _iosplugins = require("../plugins/ios-plugins");
const _generateCode = require("../utils/generateCode");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const debug = require('debug')('expo:config-plugins:ios:maps');
const MATCH_INIT = /\bsuper\.application\(\w+?, didFinishLaunchingWithOptions: \w+?\)/g;
const withGoogleMapsKey = (0, _iosplugins.createInfoPlistPlugin)(setGoogleMapsApiKey, 'withGoogleMapsKey');
const withMaps = (config)=>{
    config = withGoogleMapsKey(config);
    const apiKey = getGoogleMapsApiKey(config);
    // Technically adds react-native-maps (Apple maps) and google maps.
    debug('Google Maps API Key:', apiKey);
    config = withMapsCocoaPods(config, {
        useGoogleMaps: !!apiKey
    });
    // Adds/Removes AppDelegate setup for Google Maps API on iOS
    config = withGoogleMapsAppDelegate(config, {
        apiKey
    });
    return config;
};
function getGoogleMapsApiKey(config) {
    return config.ios?.config?.googleMapsApiKey ?? null;
}
function setGoogleMapsApiKey(config, { GMSApiKey, ...infoPlist }) {
    const apiKey = getGoogleMapsApiKey(config);
    if (apiKey === null) {
        return infoPlist;
    }
    return {
        ...infoPlist,
        GMSApiKey: apiKey
    };
}
function addGoogleMapsAppDelegateImport(src) {
    const newSrc = [
        '#if canImport(GoogleMaps)',
        'import GoogleMaps',
        '#endif'
    ];
    return (0, _generateCode.mergeContents)({
        tag: 'react-native-maps-import',
        src,
        newSrc: newSrc.join('\n'),
        anchor: /(@main|@UIApplicationMain)/,
        offset: 0,
        comment: '//'
    });
}
function removeGoogleMapsAppDelegateImport(src) {
    return (0, _generateCode.removeContents)({
        tag: 'react-native-maps-import',
        src
    });
}
function addGoogleMapsAppDelegateInit(src, apiKey) {
    const newSrc = [
        '#if canImport(GoogleMaps)',
        `GMSServices.provideAPIKey("${apiKey}")`,
        '#endif'
    ];
    return (0, _generateCode.mergeContents)({
        tag: 'react-native-maps-init',
        src,
        newSrc: newSrc.join('\n'),
        anchor: MATCH_INIT,
        offset: 0,
        comment: '//'
    });
}
function removeGoogleMapsAppDelegateInit(src) {
    return (0, _generateCode.removeContents)({
        tag: 'react-native-maps-init',
        src
    });
}
function addMapsCocoaPods(src) {
    return (0, _generateCode.mergeContents)({
        tag: 'react-native-maps',
        src,
        newSrc: `  pod 'react-native-google-maps', path: File.dirname(\`node --print "require.resolve('react-native-maps/package.json')"\`)`,
        anchor: /use_native_modules/,
        offset: 0,
        comment: '#'
    });
}
function removeMapsCocoaPods(src) {
    return (0, _generateCode.removeContents)({
        tag: 'react-native-maps',
        src
    });
}
function isReactNativeMapsInstalled(projectRoot) {
    const resolved = (0, _requireutils().resolveFrom)(projectRoot, 'react-native-maps/package.json');
    return resolved ? _path().default.dirname(resolved) : null;
}
function isReactNativeMapsAutolinked(config) {
    // Only add the native code changes if we know that the package is going to be linked natively.
    // This is specifically for monorepo support where one app might have react-native-maps (adding it to the node_modules)
    // but another app will not have it installed in the package.json, causing it to not be linked natively.
    // This workaround only exists because react-native-maps doesn't have a config plugin vendored in the package.
    // TODO: `react-native-maps` doesn't use Expo autolinking so we cannot safely disable the module.
    return true;
// return (
//   !config._internal?.autolinkedModules ||
//   config._internal.autolinkedModules.includes('react-native-maps')
// );
}
const withMapsCocoaPods = (config, { useGoogleMaps })=>{
    return (0, _iosplugins.withPodfile)(config, async (config)=>{
        // Only add the block if react-native-maps is installed in the project (best effort).
        // Generally prebuild runs after a yarn install so this should always work as expected.
        const googleMapsPath = isReactNativeMapsInstalled(config.modRequest.projectRoot);
        const isLinked = isReactNativeMapsAutolinked(config);
        debug('Is Expo Autolinked:', isLinked);
        debug('react-native-maps path:', googleMapsPath);
        let results;
        if (isLinked && googleMapsPath && useGoogleMaps) {
            try {
                results = addMapsCocoaPods(config.modResults.contents);
            } catch (error) {
                if (error.code === 'ERR_NO_MATCH') {
                    throw new Error(`Cannot add react-native-maps to the project's ios/Podfile because it's malformed. Report this with a copy of your project Podfile: https://github.com/expo/expo/issues`);
                }
                throw error;
            }
        } else {
            // If the package is no longer installed, then remove the block.
            results = removeMapsCocoaPods(config.modResults.contents);
        }
        if (results.didMerge || results.didClear) {
            config.modResults.contents = results.contents;
        }
        return config;
    });
};
const withGoogleMapsAppDelegate = (config, { apiKey })=>{
    return (0, _iosplugins.withAppDelegate)(config, (config)=>{
        if (!apiKey || !isReactNativeMapsAutolinked(config) || !isReactNativeMapsInstalled(config.modRequest.projectRoot)) {
            config.modResults.contents = removeGoogleMapsAppDelegateImport(config.modResults.contents).contents;
            config.modResults.contents = removeGoogleMapsAppDelegateInit(config.modResults.contents).contents;
            return config;
        }
        if (config.modResults.language !== 'swift') {
            throw new Error(`Cannot setup Google Maps because the project AppDelegate is not a supported language: ${config.modResults.language}`);
        }
        try {
            config.modResults.contents = addGoogleMapsAppDelegateImport(config.modResults.contents).contents;
            config.modResults.contents = addGoogleMapsAppDelegateInit(config.modResults.contents, apiKey).contents;
        } catch (error) {
            if (error.code === 'ERR_NO_MATCH') {
                throw new Error(`Cannot add Google Maps to the project's AppDelegate because it's malformed. Report this with a copy of your project AppDelegate: https://github.com/expo/expo/issues`);
            }
            throw error;
        }
        return config;
    });
};

//# sourceMappingURL=Maps.js.map
