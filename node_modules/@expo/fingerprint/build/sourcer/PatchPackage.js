"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getPatchPackageSourcesAsync", {
    enumerable: true,
    get: function() {
        return getPatchPackageSourcesAsync;
    }
});
function _chalk() {
    const data = /*#__PURE__*/ _interop_require_default(require("chalk"));
    _chalk = function() {
        return data;
    };
    return data;
}
const _Path = require("../utils/Path");
const _Utils = require("./Utils");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const debug = require('debug')('expo:fingerprint:sourcer:PatchPackage');
async function getPatchPackageSourcesAsync(projectRoot, options) {
    if ((0, _Path.isIgnoredPathWithMatchObjects)('patches', options.ignoreDirMatchObjects)) {
        debug(`Skipping dir - ${_chalk().default.dim('patches')} (ignored by ignoreDirMatchObjects)`);
        return [];
    }
    const result = await (0, _Utils.getFileBasedHashSourceAsync)(projectRoot, 'patches', 'patchPackage');
    if (result != null) {
        debug(`Adding dir - ${_chalk().default.dim('patches')}`);
        return [
            result
        ];
    }
    return [];
}

//# sourceMappingURL=PatchPackage.js.map
