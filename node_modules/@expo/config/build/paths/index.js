"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && __export(require("./paths")) && __export(require("./extensions"));
_export_star(require("./paths"), exports);
_export_star(require("./extensions"), exports);
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
