"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DrawerContent", {
    enumerable: true,
    get: function() {
        return DrawerContent;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
const _DrawerContentScrollView = require("./DrawerContentScrollView");
const _DrawerItemList = require("./DrawerItemList");
function DrawerContent({ descriptors, state, ...rest }) {
    const focusedRoute = state.routes[state.index];
    const focusedDescriptor = descriptors[focusedRoute.key];
    const focusedOptions = focusedDescriptor.options;
    const { drawerContentStyle, drawerContentContainerStyle } = focusedOptions;
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_DrawerContentScrollView.DrawerContentScrollView, {
        ...rest,
        contentContainerStyle: drawerContentContainerStyle,
        style: drawerContentStyle,
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_DrawerItemList.DrawerItemList, {
            descriptors: descriptors,
            state: state,
            ...rest
        })
    });
}

//# sourceMappingURL=DrawerContent.js.map
