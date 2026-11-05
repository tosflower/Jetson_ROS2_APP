"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Label", {
    enumerable: true,
    get: function() {
        return Label;
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
const _Text = require("../Text");
function Label({ tintColor, style, ...rest }) {
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_Text.Text, {
        numberOfLines: 1,
        ...rest,
        style: [
            styles.label,
            tintColor != null && {
                color: tintColor
            },
            style
        ]
    });
}
const styles = _reactnative().StyleSheet.create({
    label: {
        textAlign: 'center',
        backgroundColor: 'transparent'
    }
});

//# sourceMappingURL=Label.js.map
