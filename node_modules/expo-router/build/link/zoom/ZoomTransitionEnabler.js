"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ZoomTransitionEnabler: null,
    disableZoomTransition: null,
    isZoomTransitionEnabled: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ZoomTransitionEnabler () {
        return ZoomTransitionEnabler;
    },
    get disableZoomTransition () {
        return disableZoomTransition;
    },
    get isZoomTransitionEnabled () {
        return isZoomTransitionEnabled;
    }
});
function disableZoomTransition() {}
function isZoomTransitionEnabled() {
    return false;
}
function ZoomTransitionEnabler(props) {
    return null;
}

//# sourceMappingURL=ZoomTransitionEnabler.js.map
