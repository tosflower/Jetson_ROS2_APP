/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeHasteConflicts", {
    enumerable: true,
    get: function() {
        return computeHasteConflicts;
    }
});
function _path() {
    const data = /*#__PURE__*/ _interop_require_default(require("path"));
    _path = function() {
        return data;
    };
    return data;
}
const _constants = /*#__PURE__*/ _interop_require_default(require("../../constants"));
const _sorting = require("../../lib/sorting");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function computeHasteConflicts(options) {
    const { duplicates, map, rootDir } = options;
    const conflicts = [];
    // Add duplicates reported by metro-file-map
    for (const [id, dupsByPlatform] of duplicates.entries()){
        for (const [platform, conflictingModules] of dupsByPlatform){
            conflicts.push({
                id,
                platform: platform === _constants.default.GENERIC_PLATFORM ? null : platform,
                absolutePaths: [
                    ...conflictingModules.keys()
                ].map((modulePath)=>_path().default.resolve(rootDir, modulePath))// Sort for ease of testing
                .sort(),
                type: 'duplicate'
            });
        }
    }
    // Add cases of "shadowing at a distance": a module with a platform suffix and
    // a module with a lower priority platform suffix (or no suffix), in different
    // directories.
    for (const [id, data] of map){
        const conflictPaths = new Set();
        const basePaths = [];
        for (const basePlatform of [
            _constants.default.NATIVE_PLATFORM,
            _constants.default.GENERIC_PLATFORM
        ]){
            if (data[basePlatform] == null) {
                continue;
            }
            const basePath = data[basePlatform][0];
            basePaths.push(basePath);
            const basePathDir = _path().default.dirname(basePath);
            // Find all platforms that can shadow basePlatform
            // Given that X.(specific platform).js > x.native.js > X.js
            // and basePlatform is either 'native' or generic (no platform).
            for (const platform of Object.keys(data)){
                if (platform === basePlatform || platform === _constants.default.GENERIC_PLATFORM /* lowest priority */ ) {
                    continue;
                }
                const platformPath = data[platform][0];
                if (_path().default.dirname(platformPath) !== basePathDir) {
                    conflictPaths.add(platformPath);
                }
            }
        }
        if (conflictPaths.size) {
            conflicts.push({
                id,
                platform: null,
                absolutePaths: [
                    ...new Set([
                        ...conflictPaths,
                        ...basePaths
                    ])
                ].map((modulePath)=>_path().default.resolve(rootDir, modulePath))// Sort for ease of testing
                .sort(),
                type: 'shadowing'
            });
        }
    }
    // Sort for ease of testing
    conflicts.sort((0, _sorting.chainComparators)((a, b)=>(0, _sorting.compareStrings)(a.type, b.type), (a, b)=>(0, _sorting.compareStrings)(a.id, b.id), (a, b)=>(0, _sorting.compareStrings)(a.platform, b.platform)));
    return conflicts;
}

//# sourceMappingURL=computeConflicts.js.map
