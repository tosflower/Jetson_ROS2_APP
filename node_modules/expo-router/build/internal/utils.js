"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    disableZoomTransition: null,
    shouldLinkExternally: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get disableZoomTransition () {
        return _ZoomTransitionEnabler.disableZoomTransition;
    },
    get shouldLinkExternally () {
        return _url.shouldLinkExternally;
    }
});
const _url = require("../utils/url");
const _ZoomTransitionEnabler = require("../link/zoom/ZoomTransitionEnabler");

//# sourceMappingURL=utils.js.map
