"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && __export(require("./reactNativeConfig")) && __export(require("./reactNativeConfig.types"));
_export_star(require("./reactNativeConfig"), exports);
_export_star(require("./reactNativeConfig.types"), exports);
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
