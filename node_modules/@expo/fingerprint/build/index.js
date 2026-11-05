"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    DEFAULT_IGNORE_PATHS: null,
    DEFAULT_SOURCE_SKIPS: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get DEFAULT_IGNORE_PATHS () {
        return _Options.DEFAULT_IGNORE_PATHS;
    },
    get DEFAULT_SOURCE_SKIPS () {
        return _Options.DEFAULT_SOURCE_SKIPS;
    }
});
0 && __export(require("./Fingerprint")) && __export(require("./Fingerprint.types")) && __export(require("./sourcer/SourceSkips"));
_export_star(require("./Fingerprint"), exports);
_export_star(require("./Fingerprint.types"), exports);
_export_star(require("./sourcer/SourceSkips"), exports);
const _Options = require("./Options");
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
