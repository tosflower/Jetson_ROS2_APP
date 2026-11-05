"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "convertLabelStylePropToObject", {
    enumerable: true,
    get: function() {
        return convertLabelStylePropToObject;
    }
});
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
function convertLabelStylePropToObject(labelStyle) {
    if (labelStyle) {
        if (typeof labelStyle === 'object' && ('default' in labelStyle || 'selected' in labelStyle)) {
            return {
                default: labelStyle.default ? _reactnative().StyleSheet.flatten(labelStyle.default) : undefined,
                selected: labelStyle.selected ? _reactnative().StyleSheet.flatten(labelStyle.selected) : undefined
            };
        }
        return {
            default: _reactnative().StyleSheet.flatten(labelStyle)
        };
    }
    return {};
}

//# sourceMappingURL=label.js.map
