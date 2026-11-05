"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    Stack: null,
    default: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get Stack () {
        return _StackClient.default;
    },
    get default () {
        return _default;
    }
});
const _StackClient = /*#__PURE__*/ _interop_require_default(require("./StackClient"));
const _stackutils = require("./stack-utils");
const _StackToolbar = require("./stack-utils/toolbar/StackToolbar");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
_StackClient.default.Screen = _stackutils.StackScreen;
_StackClient.default.Header = _stackutils.StackHeader;
_StackClient.default.Title = _stackutils.StackTitle;
_StackClient.default.Toolbar = _StackToolbar.StackToolbar;
const _default = _StackClient.default;

//# sourceMappingURL=Stack.js.map
