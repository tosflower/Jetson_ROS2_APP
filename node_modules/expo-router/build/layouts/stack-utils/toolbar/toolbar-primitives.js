"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    StackToolbarBadge: null,
    StackToolbarIcon: null,
    StackToolbarLabel: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get StackToolbarBadge () {
        return StackToolbarBadge;
    },
    get StackToolbarIcon () {
        return StackToolbarIcon;
    },
    get StackToolbarLabel () {
        return StackToolbarLabel;
    }
});
const _primitives = require("../../../primitives");
const StackToolbarLabel = _primitives.Label;
const StackToolbarIcon = _primitives.Icon;
const StackToolbarBadge = _primitives.Badge;

//# sourceMappingURL=toolbar-primitives.js.map
