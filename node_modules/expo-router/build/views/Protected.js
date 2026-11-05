"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    Protected: null,
    isProtectedReactElement: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get Protected () {
        return Protected;
    },
    get isProtectedReactElement () {
        return isProtectedReactElement;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _primitives = require("../primitives");
const Protected = _primitives.Group;
function isProtectedReactElement(child) {
    return Boolean(/*#__PURE__*/ (0, _react().isValidElement)(child) && child.type === _primitives.Group && child.props && 'guard' in child.props);
}

//# sourceMappingURL=Protected.js.map
