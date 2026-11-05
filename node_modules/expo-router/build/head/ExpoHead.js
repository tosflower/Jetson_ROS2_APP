"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    Head: null,
    default: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get Head () {
        return Head;
    },
    get default () {
        return _default;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
function _react() {
    const data = /*#__PURE__*/ _interop_require_default(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
const _lib = require("../../vendor/react-helmet-async/lib");
const _useIsFocused = require("../useIsFocused");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function FocusedHelmet({ children }) {
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_lib.Helmet, {
        children: children
    });
}
const Head = ({ children })=>{
    const isFocused = (0, _useIsFocused.useIsFocused)();
    if (!isFocused) {
        return null;
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(FocusedHelmet, {
        children: children
    });
};
Head.Provider = _lib.HelmetProvider;
const _default = Head;

//# sourceMappingURL=ExpoHead.js.map
