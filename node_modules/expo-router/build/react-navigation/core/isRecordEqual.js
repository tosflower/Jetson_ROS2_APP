/**
 * Compare two records with primitive values as the content.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isRecordEqual", {
    enumerable: true,
    get: function() {
        return isRecordEqual;
    }
});
function isRecordEqual(a, b) {
    if (a === b) {
        return true;
    }
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) {
        return false;
    }
    return aKeys.every((key)=>Object.is(a[key], b[key]));
}

//# sourceMappingURL=isRecordEqual.js.map
