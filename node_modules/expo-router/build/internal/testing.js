"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    inMemoryContext: null,
    requireContext: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get inMemoryContext () {
        return _contextstubs.inMemoryContext;
    },
    get requireContext () {
        return _requirecontextponyfill.default;
    }
});
const _contextstubs = require("../testing-library/context-stubs");
const _requirecontextponyfill = /*#__PURE__*/ _interop_require_default(require("../testing-library/require-context-ponyfill"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

//# sourceMappingURL=testing.js.map
