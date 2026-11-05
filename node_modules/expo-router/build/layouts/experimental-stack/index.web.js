'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ExperimentalStack: null,
    default: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ExperimentalStack () {
        return ExperimentalStack;
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
const _Stack = /*#__PURE__*/ _interop_require_default(require("../Stack"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const ExperimentalStack = Object.assign((props)=>/*#__PURE__*/ (0, _jsxruntime().jsx)(_Stack.default, {
        ...props
    }), {
    Screen: _Stack.default.Screen,
    Protected: _Stack.default.Protected
});
const _default = ExperimentalStack;

//# sourceMappingURL=index.web.js.map
