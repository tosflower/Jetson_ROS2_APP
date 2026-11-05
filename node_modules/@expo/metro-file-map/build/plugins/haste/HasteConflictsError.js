/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HasteConflictsError", {
    enumerable: true,
    get: function() {
        return HasteConflictsError;
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
class HasteConflictsError extends Error {
    #conflicts;
    constructor(conflicts){
        super(`Found ${conflicts.length} Haste conflict(s). Haste module IDs must be globally unique in the codebase.`);
        this.#conflicts = conflicts;
    }
    getDetailedMessage(pathsRelativeToRoot) {
        const messages = [];
        const conflicts = this.#conflicts;
        if (conflicts.some((conflict)=>conflict.type === 'duplicate')) {
            messages.push('Advice: Resolve conflicts of type "duplicate" by renaming one or both of the conflicting modules, or by excluding conflicting paths from Haste.');
        }
        if (conflicts.some((conflict)=>conflict.type === 'shadowing')) {
            messages.push('Advice: Resolve conflicts of type "shadowing" by moving the modules to the same folder, or by excluding conflicting paths from Haste.');
        }
        let index = 0;
        for (const conflict of conflicts){
            const itemHeader = index + 1 + '. ';
            const indent = ' '.repeat(itemHeader.length + 2);
            messages.push('\n' + itemHeader + conflict.id + (conflict.platform != null ? `.${conflict.platform}` : '') + ` (${conflict.type})`);
            for (const modulePath of conflict.absolutePaths){
                messages.push(indent + (pathsRelativeToRoot != null ? _path().default.relative(pathsRelativeToRoot, modulePath) : modulePath));
            }
            ++index;
        }
        return messages.join('\n');
    }
}

//# sourceMappingURL=HasteConflictsError.js.map
