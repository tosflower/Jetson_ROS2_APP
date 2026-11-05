'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ToolbarColorContext: null,
    ToolbarPlacementContext: null,
    useToolbarColors: null,
    useToolbarPlacement: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ToolbarColorContext () {
        return ToolbarColorContext;
    },
    get ToolbarPlacementContext () {
        return ToolbarPlacementContext;
    },
    get useToolbarColors () {
        return useToolbarColors;
    },
    get useToolbarPlacement () {
        return useToolbarPlacement;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const ToolbarPlacementContext = /*#__PURE__*/ (0, _react().createContext)(null);
function useToolbarPlacement() {
    return (0, _react().useContext)(ToolbarPlacementContext);
}
const ToolbarColorContext = /*#__PURE__*/ (0, _react().createContext)({});
function useToolbarColors() {
    return (0, _react().useContext)(ToolbarColorContext);
}

//# sourceMappingURL=context.js.map
