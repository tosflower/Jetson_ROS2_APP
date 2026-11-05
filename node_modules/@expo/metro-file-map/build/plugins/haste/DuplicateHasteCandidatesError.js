/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DuplicateHasteCandidatesError", {
    enumerable: true,
    get: function() {
        return DuplicateHasteCandidatesError;
    }
});
const _constants = /*#__PURE__*/ _interop_require_default(require("../../constants"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
class DuplicateHasteCandidatesError extends Error {
    hasteName;
    platform;
    supportsNativePlatform;
    duplicatesSet;
    constructor(name, platform, supportsNativePlatform, duplicatesSet){
        const platformMessage = getPlatformMessage(platform);
        super(`The name \`${name}\` was looked up in the Haste module map. It ` + 'cannot be resolved, because there exists several different ' + 'files, or packages, that provide a module for ' + `that particular name and platform. ${platformMessage} You must ` + 'delete or exclude files until there remains only one of these:\n\n' + Array.from(duplicatesSet).map(([dupFilePath, dupFileType])=>`  * \`${dupFilePath}\` (${getTypeMessage(dupFileType)})\n`).sort().join(''));
        this.hasteName = name;
        this.platform = platform;
        this.supportsNativePlatform = supportsNativePlatform;
        this.duplicatesSet = duplicatesSet;
    }
}
function getPlatformMessage(platform) {
    if (platform === _constants.default.GENERIC_PLATFORM) {
        return 'The platform is generic (no extension).';
    }
    return `The platform extension is \`${platform}\`.`;
}
function getTypeMessage(type) {
    switch(type){
        case _constants.default.MODULE:
            return 'module';
        case _constants.default.PACKAGE:
            return 'package';
    }
    return 'unknown';
}

//# sourceMappingURL=DuplicateHasteCandidatesError.js.map
