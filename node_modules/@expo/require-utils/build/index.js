"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && __export(require("./load")) && __export(require("./resolve")) && __export(require("./resolveGlobal"));
_export_star(require("./load"), exports);
_export_star(require("./resolve"), exports);
_export_star(require("./resolveGlobal"), exports);
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
