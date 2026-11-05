"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    convertFontWeightToComposeFontWeight: null,
    convertTextStyleToRNTextStyle: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get convertFontWeightToComposeFontWeight () {
        return convertFontWeightToComposeFontWeight;
    },
    get convertTextStyleToRNTextStyle () {
        return convertTextStyleToRNTextStyle;
    }
});
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
function convertTextStyleToRNTextStyle(style) {
    const flattenedStyle = _reactnative().StyleSheet.flatten(style);
    if (!flattenedStyle) {
        return undefined;
    }
    if ('fontWeight' in flattenedStyle) {
        return {
            ...flattenedStyle,
            fontWeight: typeof flattenedStyle.fontWeight === 'number' ? String(flattenedStyle.fontWeight) : flattenedStyle.fontWeight
        };
    }
    return flattenedStyle;
}
const SUPPORTED_FONT_WEIGHTS = new Set([
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
    'normal',
    'bold'
]);
function convertFontWeightToComposeFontWeight(fontWeight) {
    if (fontWeight == null) {
        return undefined;
    }
    const value = String(fontWeight);
    if (!SUPPORTED_FONT_WEIGHTS.has(value)) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn(`Unsupported fontWeight "${value}". Supported values are 100–900, "normal", and "bold".`);
        }
        return undefined;
    }
    return value;
}

//# sourceMappingURL=font.js.map
