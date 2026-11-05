"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getShadowStyle", {
    enumerable: true,
    get: function() {
        return getShadowStyle;
    }
});
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
const _color = require("../../../utils/color");
function getShadowStyle({ offset, radius, opacity, color = '#000' }) {
    const result = _reactnative().Platform.select({
        web: {
            boxShadow: `${offset.width}px ${offset.height}px ${radius}px ${(0, _color.alpha)(color, opacity) ?? ''}`
        },
        default: {
            shadowOffset: offset,
            shadowRadius: radius,
            shadowColor: color,
            shadowOpacity: opacity
        }
    });
    return result;
}

//# sourceMappingURL=getShadowStyle.js.map
