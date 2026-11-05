"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createServerLoader: null,
    createStaticLoader: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get createServerLoader () {
        return _helpers.createServerLoader;
    },
    get createStaticLoader () {
        return _helpers.createStaticLoader;
    }
});
0 && __export(require("./runtime/api"));
_export_star(require("./runtime/api"), exports);
const _helpers = require("./loaders/helpers");
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
