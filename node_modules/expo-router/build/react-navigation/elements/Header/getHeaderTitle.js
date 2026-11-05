"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getHeaderTitle", {
    enumerable: true,
    get: function() {
        return getHeaderTitle;
    }
});
function getHeaderTitle(options, fallback) {
    return typeof options.headerTitle === 'string' ? options.headerTitle : options.title !== undefined ? options.title : fallback;
}

//# sourceMappingURL=getHeaderTitle.js.map
