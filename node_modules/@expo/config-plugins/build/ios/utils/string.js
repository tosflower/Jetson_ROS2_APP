"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "trimQuotes", {
    enumerable: true,
    get: function() {
        return trimQuotes;
    }
});
function trimQuotes(s) {
    return s && s[0] === '"' && s[s.length - 1] === '"' ? s.slice(1, -1) : s;
}

//# sourceMappingURL=string.js.map
