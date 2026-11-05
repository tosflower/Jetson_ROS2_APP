"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getInitialURL: null,
    getPathFromState: null,
    getRootURL: null,
    getStateFromPath: null,
    subscribe: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getInitialURL () {
        return getInitialURL;
    },
    get getPathFromState () {
        return _getPathFromState.getPathFromState;
    },
    get getRootURL () {
        return getRootURL;
    },
    get getStateFromPath () {
        return _getStateFromPath.getStateFromPath;
    },
    get subscribe () {
        return subscribe;
    }
});
function _expolinking() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("expo-linking"));
    _expolinking = function() {
        return data;
    };
    return data;
}
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
const _extractPathFromURL = require("../fork/extractPathFromURL");
const _getInitialURLWithTimeout = require("../fork/getInitialURLWithTimeout");
const _getPathFromState = require("../fork/getPathFromState");
const _getStateFromPath = require("../fork/getStateFromPath");
const _getRoutesRedirects = require("../getRoutesRedirects");
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
const isExpoGo = typeof expo !== 'undefined' && globalThis.expo?.modules?.ExpoGo;
function getInitialURL() {
    if (typeof window === 'undefined') {
        return '';
    }
    if (_reactnative().Platform.OS === 'web' && window.location?.href) {
        return window.location.href;
    }
    if (_reactnative().Platform.OS === 'ios') {
        // Use the new Expo API for iOS. This has better support for App Clips and handoff.
        const url = _expolinking().getLinkingURL();
        return parseExpoGoUrlFromListener(url) ?? // The path will be nullish in bare apps when the app is launched from the home screen.
        // TODO(EvanBacon): define some policy around notifications.
        getRootURL();
    }
    // TODO: Figure out if expo-linking on Android has full interop with the React Native implementation.
    return Promise.resolve((0, _getInitialURLWithTimeout.getInitialURLWithTimeout)()).then((url)=>parseExpoGoUrlFromListener(url) ?? // The path will be nullish in bare apps when the app is launched from the home screen.
        // TODO(EvanBacon): define some policy around notifications.
        getRootURL());
}
let _rootURL;
function getRootURL() {
    if (_rootURL === undefined) {
        try {
            _rootURL = _expolinking().createURL('/');
        } catch  {
            // `createURL` throws in production when the app has no `scheme`.
            // The root URL only seeds the initial route, so the root path is enough.
            _rootURL = '/';
            return _rootURL;
        }
        if (isExpoGo) {
            _rootURL = (0, _extractPathFromURL.parsePathFromExpoGoLink)(_rootURL);
        }
    }
    return _rootURL;
}
// Expo Go is weird and requires the root path to be `/--/`
function parseExpoGoUrlFromListener(url) {
    if (!url || !isExpoGo) {
        return url;
    }
    const { pathname, queryString } = (0, _extractPathFromURL.parsePathAndParamsFromExpoGoLink)(url);
    // If the URL is defined (default in Expo Go dev apps) and the URL has no path:
    // `exp://192.168.87.39:19000/` then use the default `exp://192.168.87.39:19000/--/`
    if (!pathname || pathname === '/') {
        return getRootURL() + queryString;
    }
    return url;
}
function subscribe(nativeLinking, redirects) {
    return (listener)=>{
        let callback;
        const legacySubscription = nativeLinking?.legacy_subscribe?.(listener);
        if (isExpoGo) {
            // This extra work is only done in the Expo Go app.
            callback = async ({ url })=>{
                let href = parseExpoGoUrlFromListener(url);
                href = (0, _getRoutesRedirects.applyRedirects)(href, redirects);
                if (href && nativeLinking?.redirectSystemPath) {
                    href = await nativeLinking.redirectSystemPath({
                        path: href,
                        initial: false
                    });
                }
                if (href) {
                    listener(href);
                }
            };
        } else {
            callback = async ({ url })=>{
                let href = (0, _getRoutesRedirects.applyRedirects)(url, redirects);
                if (href && nativeLinking?.redirectSystemPath) {
                    href = await nativeLinking.redirectSystemPath({
                        path: href,
                        initial: false
                    });
                }
                if (href) {
                    listener(href);
                }
            };
        }
        const subscription = _expolinking().addEventListener('url', callback);
        return ()=>{
            // https://github.com/facebook/react-native/commit/6d1aca806cee86ad76de771ed3a1cc62982ebcd7
            subscription?.remove?.();
            legacySubscription?.();
        };
    };
}

//# sourceMappingURL=linking.js.map
