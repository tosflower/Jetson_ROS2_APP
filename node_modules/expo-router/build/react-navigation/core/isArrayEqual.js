/**
 * Compare two arrays with primitive values as the content.
 * We need to make sure that both values and order match.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isArrayEqual", {
    enumerable: true,
    get: function() {
        return isArrayEqual;
    }
});
function isArrayEqual(a, b) {
    if (a === b) {
        return true;
    }
    if (a.length !== b.length) {
        return false;
    }
    return a.every((it, index)=>Object.is(it, b[index]));
}

//# sourceMappingURL=isArrayEqual.js.map
