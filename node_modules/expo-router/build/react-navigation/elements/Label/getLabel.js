"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getLabel", {
    enumerable: true,
    get: function() {
        return getLabel;
    }
});
function getLabel(options, fallback) {
    return options.label !== undefined ? options.label : options.title !== undefined ? options.title : fallback;
}

//# sourceMappingURL=getLabel.js.map
