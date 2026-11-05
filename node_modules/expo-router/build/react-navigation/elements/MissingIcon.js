"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MissingIcon", {
    enumerable: true,
    get: function() {
        return MissingIcon;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
const _Text = require("./Text");
function MissingIcon({ color, size, style }) {
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_Text.Text, {
        style: [
            styles.icon,
            {
                color,
                fontSize: size
            },
            style
        ],
        children: "⏷"
    });
}
const styles = _reactnative().StyleSheet.create({
    icon: {
        backgroundColor: 'transparent'
    }
});

//# sourceMappingURL=MissingIcon.js.map
