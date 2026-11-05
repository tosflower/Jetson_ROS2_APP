"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useBottomAccessoryFunctionFromBottomAccessories", {
    enumerable: true,
    get: function() {
        return useBottomAccessoryFunctionFromBottomAccessories;
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
const _hooks = require("../hooks");
function useBottomAccessoryFunctionFromBottomAccessories(bottomAccessory) {
    return (0, _react().useMemo)(()=>bottomAccessory ? (environment)=>/*#__PURE__*/ (0, _jsxruntime().jsx)(_hooks.BottomAccessoryPlacementContext, {
                value: environment,
                children: bottomAccessory.props.children
            }) : undefined, [
        bottomAccessory
    ]);
}

//# sourceMappingURL=bottomAccessory.js.map
