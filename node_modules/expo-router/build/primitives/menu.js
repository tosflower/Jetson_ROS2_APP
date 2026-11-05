'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    Menu: null,
    MenuAction: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get Menu () {
        return Menu;
    },
    get MenuAction () {
        return MenuAction;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _InternalLinkPreviewContext = require("../link/InternalLinkPreviewContext");
function MenuAction(props) {
    if ((0, _react().use)(_InternalLinkPreviewContext.InternalLinkPreviewContext)) {
        console.warn('<MenuAction> is currently not supported inside Link. Use Link.MenuAction instead.');
    }
    return null;
}
function Menu(props) {
    if ((0, _react().use)(_InternalLinkPreviewContext.InternalLinkPreviewContext)) {
        console.warn('Menu is currently not supported inside Link. Use Link.Menu instead.');
    }
    return null;
}

//# sourceMappingURL=menu.js.map
