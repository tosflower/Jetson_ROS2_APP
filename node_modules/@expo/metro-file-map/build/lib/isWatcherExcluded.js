"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return isWatcherExcluded;
    }
});
const EXCLUDED_DIR_SEGMENT = /(?:^|[/\\])\.(?:git|hg|cxx)[/\\]/;
function isWatcherExcluded(filePath) {
    return EXCLUDED_DIR_SEGMENT.test(filePath);
}

//# sourceMappingURL=isWatcherExcluded.js.map
