"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    useIsPreview: null,
    usePreventZoomTransitionDismissal: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get useIsPreview () {
        return _PreviewRouteContext.useIsPreview;
    },
    get usePreventZoomTransitionDismissal () {
        return _usePreventZoomTransitionDismissal.usePreventZoomTransitionDismissal;
    }
});
0 && __export(require("./Link"));
_export_star(require("./Link"), exports);
const _usePreventZoomTransitionDismissal = require("./zoom/usePreventZoomTransitionDismissal");
const _PreviewRouteContext = require("./preview/PreviewRouteContext");
function _export_star(from, to) {
    Object.keys(from).forEach(function(k) {
        if (k !== "default" && !Object.prototype.hasOwnProperty.call(to, k)) {
            Object.defineProperty(to, k, {
                enumerable: true,
                get: function() {
                    return from[k];
                }
            });
        }
    });
    return from;
}

//# sourceMappingURL=index.js.map
