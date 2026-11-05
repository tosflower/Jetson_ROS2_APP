"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "convertFontWeightToStringFontWeight", {
    enumerable: true,
    get: function() {
        return convertFontWeightToStringFontWeight;
    }
});
function convertFontWeightToStringFontWeight(fontWeight) {
    if (typeof fontWeight === 'number') {
        return String(fontWeight);
    }
    return fontWeight;
}

//# sourceMappingURL=style.js.map
