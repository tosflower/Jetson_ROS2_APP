'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    BottomAccessoryPlacementContext: null,
    usePlacement: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get BottomAccessoryPlacementContext () {
        return BottomAccessoryPlacementContext;
    },
    get usePlacement () {
        return usePlacement;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const BottomAccessoryPlacementContext = (0, _react().createContext)(undefined);
const usePlacement = ()=>{
    const value = (0, _react().use)(BottomAccessoryPlacementContext);
    if (!value) {
        throw new Error('usePlacement can only be used within a <NativeTabs.BottomAccessory> component.');
    }
    return value;
};

//# sourceMappingURL=hooks.js.map
