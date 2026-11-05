/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Originally vendored from
 * https://github.com/amasad/sane/blob/64ff3a870c42e84f744086884bf55a4f9c22d376/src/common.js
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ALL_EVENT: null,
    DELETE_EVENT: null,
    RECRAWL_EVENT: null,
    TOUCH_EVENT: null,
    isIncluded: null,
    posixPathMatchesPattern: null,
    typeFromStat: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ALL_EVENT () {
        return ALL_EVENT;
    },
    get DELETE_EVENT () {
        return DELETE_EVENT;
    },
    get RECRAWL_EVENT () {
        return RECRAWL_EVENT;
    },
    get TOUCH_EVENT () {
        return TOUCH_EVENT;
    },
    get isIncluded () {
        return isIncluded;
    },
    get posixPathMatchesPattern () {
        return posixPathMatchesPattern;
    },
    get typeFromStat () {
        return typeFromStat;
    }
});
function _path() {
    const data = /*#__PURE__*/ _interop_require_default(require("path"));
    _path = function() {
        return data;
    };
    return data;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const DELETE_EVENT = 'delete';
const TOUCH_EVENT = 'touch';
const RECRAWL_EVENT = 'recrawl';
const ALL_EVENT = 'all';
function isIncluded(type, included, relativePath) {
    if (included == null || type !== 'f') {
        return true;
    }
    const basename = _path().default.basename(relativePath);
    return hasIncludedExtension(included.extensions, basename) || included.basenames.has(basename) || included.basenamePrefixes.some((prefix)=>basename.startsWith(prefix));
}
function hasIncludedExtension(extensions, basename) {
    for(let i = basename.indexOf('.'); i !== -1; i = basename.indexOf('.', i + 1)){
        if (extensions.has(basename.slice(i + 1))) {
            return true;
        }
    }
    return false;
}
const posixPathMatchesPattern = _path().default.sep === '/' ? (pattern, filePath)=>pattern.test(filePath) : (pattern, filePath)=>pattern.test(filePath.replaceAll(_path().default.sep, '/'));
function typeFromStat(stat) {
    // Note: These tests are not mutually exclusive - a symlink passes isFile
    if (stat.isSymbolicLink()) {
        return 'l';
    }
    if (stat.isDirectory()) {
        return 'd';
    }
    if (stat.isFile()) {
        return 'f'; // "Regular" file
    }
    return null;
}

//# sourceMappingURL=common.js.map
