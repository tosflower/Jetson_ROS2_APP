// isEligibleForPrediction
// https://developer.apple.com/documentation/foundation/nsuseractivity/2980674-iseligibleforprediction
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ExpoHead", {
    enumerable: true,
    get: function() {
        return ExpoHead;
    }
});
let ExpoHead = null;
// If running in Expo Go.
if (typeof expo !== 'undefined' && !globalThis.expo?.modules?.ExpoGo) {
    ExpoHead = globalThis.expo?.modules?.ExpoHead;
}

//# sourceMappingURL=ExpoHeadModule.js.map
