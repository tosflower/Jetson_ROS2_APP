"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getPrebuildConfigAsync", {
    enumerable: true,
    get: function() {
        return _getPrebuildConfig.getPrebuildConfigAsync;
    }
});
0 && __export(require("./plugins/withDefaultPlugins"));
const _getPrebuildConfig = require("./getPrebuildConfig");
_export_star(require("./plugins/withDefaultPlugins"), exports);
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
