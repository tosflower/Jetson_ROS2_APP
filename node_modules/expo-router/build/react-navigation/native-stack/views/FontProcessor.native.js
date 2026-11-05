// @ts-expect-error importing private module
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "processFonts", {
    enumerable: true,
    get: function() {
        return processFonts;
    }
});
function _ReactNativeStyleAttributes() {
    const data = /*#__PURE__*/ _interop_require_default(require("react-native/Libraries/Components/View/ReactNativeStyleAttributes"));
    _ReactNativeStyleAttributes = function() {
        return data;
    };
    return data;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function processFonts(fontFamilies) {
    const fontFamilyProcessor = _ReactNativeStyleAttributes().default.fontFamily?.process;
    if (typeof fontFamilyProcessor === 'function') {
        return fontFamilies.map(fontFamilyProcessor);
    }
    return fontFamilies;
}

//# sourceMappingURL=FontProcessor.native.js.map
