// We need this file to re-export the navigator
// Otherwise rsc would fail
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NativeTabs", {
    enumerable: true,
    get: function() {
        return NativeTabs;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
const _NativeBottomTabsNavigator = require("./NativeBottomTabsNavigator");
const _NativeTabTrigger = require("./NativeTabTrigger");
const _elements = require("./common/elements");
const _hooks = require("./hooks");
const BottomAccessory = Object.assign(_elements.NativeTabsBottomAccessory, {
    usePlacement: _hooks.usePlacement
});
const NativeTabs = Object.assign((props)=>{
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_NativeBottomTabsNavigator.NativeTabsNavigatorWrapper, {
        ...props
    });
}, {
    Trigger: _NativeTabTrigger.NativeTabTrigger,
    BottomAccessory
});

//# sourceMappingURL=NativeTabs.js.map
