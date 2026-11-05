'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && __export(require("../utils/splash"));
_export_star(require("../utils/splash"), exports);
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

//# sourceMappingURL=Splash.js.map
