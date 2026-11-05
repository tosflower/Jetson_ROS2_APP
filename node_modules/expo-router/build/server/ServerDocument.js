"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ServerDocument: null,
    useServerDocumentContext: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ServerDocument () {
        return ServerDocument;
    },
    get useServerDocumentContext () {
        return useServerDocumentContext;
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
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const ServerDocumentContext = /*#__PURE__*/ (0, _react().createContext)(null);
function useServerDocumentContext() {
    return (0, _react().useContext)(ServerDocumentContext) ?? {};
}
function ServerDocument({ children, data }) {
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(ServerDocumentContext.Provider, {
        value: data,
        children: children
    });
}

//# sourceMappingURL=ServerDocument.js.map
