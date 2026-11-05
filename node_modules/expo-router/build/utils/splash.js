"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    _internal_maybeHideAsync: null,
    _internal_preventAutoHideAsync: null,
    cancelSplashScreenAnimationFrame: null,
    hide: null,
    hideAsync: null,
    maybeHideSplashScreen: null,
    preventAutoHideAsync: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get _internal_maybeHideAsync () {
        return _internal_maybeHideAsync;
    },
    get _internal_preventAutoHideAsync () {
        return _internal_preventAutoHideAsync;
    },
    get cancelSplashScreenAnimationFrame () {
        return cancelSplashScreenAnimationFrame;
    },
    get hide () {
        return hide;
    },
    get hideAsync () {
        return hideAsync;
    },
    get maybeHideSplashScreen () {
        return maybeHideSplashScreen;
    },
    get preventAutoHideAsync () {
        return preventAutoHideAsync;
    }
});
function _expo() {
    const data = require("expo");
    _expo = function() {
        return data;
    };
    return data;
}
const SplashModule = (0, _expo().requireOptionalNativeModule)('ExpoSplashScreen');
let _initializedErrorHandler = false;
let splashScreenAnimationFrame;
let hasAttemptedToHideSplash = false;
function maybeHideSplashScreen() {
    if (!hasAttemptedToHideSplash) {
        hasAttemptedToHideSplash = true;
        splashScreenAnimationFrame = requestAnimationFrame(()=>{
            _internal_maybeHideAsync();
        });
    }
}
function cancelSplashScreenAnimationFrame() {
    if (splashScreenAnimationFrame !== undefined) {
        cancelAnimationFrame(splashScreenAnimationFrame);
        splashScreenAnimationFrame = undefined;
    }
}
function hide() {
    if (!SplashModule) {
        return;
    }
    SplashModule.hide();
}
async function hideAsync() {
    hide();
}
async function preventAutoHideAsync() {
    if (!SplashModule) {
        return;
    }
    return SplashModule.preventAutoHideAsync();
}
async function _internal_preventAutoHideAsync() {
    // The internal function might be missing if an app is using an older version of the SplashModule
    if (!SplashModule || !SplashModule.internalPreventAutoHideAsync) {
        return false;
    }
    if (!_initializedErrorHandler) {
        // Append error handling to ensure any uncaught exceptions result in the splash screen being hidden.
        // This prevents the splash screen from floating over error screens.
        if (ErrorUtils?.getGlobalHandler) {
            const originalHandler = ErrorUtils.getGlobalHandler();
            ErrorUtils.setGlobalHandler((error, isFatal)=>{
                hide();
                originalHandler(error, isFatal);
            });
        }
        _initializedErrorHandler = true;
    }
    return SplashModule.internalPreventAutoHideAsync();
}
async function _internal_maybeHideAsync() {
    // The internal function might be missing if an app is using an older version of the SplashModule
    if (!SplashModule || !SplashModule.internalMaybeHideAsync) {
        return false;
    }
    return SplashModule.internalMaybeHideAsync();
}

//# sourceMappingURL=splash.js.map
