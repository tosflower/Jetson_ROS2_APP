"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "initScreensFeatureFlags", {
    enumerable: true,
    get: function() {
        return initScreensFeatureFlags;
    }
});
function _expoconstants() {
    const data = /*#__PURE__*/ _interop_require_default(require("expo-constants"));
    _expoconstants = function() {
        return data;
    };
    return data;
}
function _reactnativescreens() {
    const data = require("react-native-screens");
    _reactnativescreens = function() {
        return data;
    };
    return data;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const areSynchronousUpdatesDisabled = !!_expoconstants().default.expoConfig?.extra?.router?.disableSynchronousScreensUpdates;
let hasInitialized = false;
function initScreensFeatureFlags() {
    if (!hasInitialized) {
        hasInitialized = true;
        _reactnativescreens().featureFlags.experiment.synchronousScreenUpdatesEnabled = !areSynchronousUpdatesDisabled;
        _reactnativescreens().featureFlags.experiment.synchronousHeaderConfigUpdatesEnabled = !areSynchronousUpdatesDisabled;
        _reactnativescreens().featureFlags.experiment.synchronousHeaderSubviewUpdatesEnabled = !areSynchronousUpdatesDisabled;
    }
}
// Solves iOS bugs related to quick dismissal of several screens in a row
// Will become opt-out in the future versions of screens
// TODO(@ubax): Remove this flag when it becomes default behavior in react-native-screens
_reactnativescreens().featureFlags.experiment.iosPreventReattachmentOfDismissedScreens = true;

//# sourceMappingURL=screensFeatureFlags.js.map
