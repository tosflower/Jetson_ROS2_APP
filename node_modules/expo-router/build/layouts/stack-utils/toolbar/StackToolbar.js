"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "StackToolbar", {
    enumerable: true,
    get: function() {
        return _StackToolbarClient.default;
    }
});
const _StackToolbarButton = require("./StackToolbarButton");
const _StackToolbarClient = /*#__PURE__*/ _interop_require_default(require("./StackToolbarClient"));
const _StackToolbarMenu = require("./StackToolbarMenu");
const _StackToolbarSearchBarSlot = require("./StackToolbarSearchBarSlot");
const _StackToolbarSpacer = require("./StackToolbarSpacer");
const _StackToolbarView = require("./StackToolbarView");
const _toolbarprimitives = require("./toolbar-primitives");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
_StackToolbarClient.default.Button = _StackToolbarButton.StackToolbarButton;
_StackToolbarClient.default.Menu = _StackToolbarMenu.StackToolbarMenu;
_StackToolbarClient.default.MenuAction = _StackToolbarMenu.StackToolbarMenuAction;
_StackToolbarClient.default.SearchBarSlot = _StackToolbarSearchBarSlot.StackToolbarSearchBarSlot;
_StackToolbarClient.default.Spacer = _StackToolbarSpacer.StackToolbarSpacer;
_StackToolbarClient.default.View = _StackToolbarView.StackToolbarView;
_StackToolbarClient.default.Label = _toolbarprimitives.StackToolbarLabel;
_StackToolbarClient.default.Icon = _toolbarprimitives.StackToolbarIcon;
_StackToolbarClient.default.Badge = _toolbarprimitives.StackToolbarBadge;

//# sourceMappingURL=StackToolbar.js.map
