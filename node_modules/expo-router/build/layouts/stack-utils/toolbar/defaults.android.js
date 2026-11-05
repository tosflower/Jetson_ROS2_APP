"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    DEFAULT_DESTRUCTIVE_COLOR: null,
    DEFAULT_TOOLBAR_BACKGROUND_COLOR: null,
    DEFAULT_TOOLBAR_TINT_COLOR: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get DEFAULT_DESTRUCTIVE_COLOR () {
        return DEFAULT_DESTRUCTIVE_COLOR;
    },
    get DEFAULT_TOOLBAR_BACKGROUND_COLOR () {
        return DEFAULT_TOOLBAR_BACKGROUND_COLOR;
    },
    get DEFAULT_TOOLBAR_TINT_COLOR () {
        return DEFAULT_TOOLBAR_TINT_COLOR;
    }
});
const _color = require("../../../color");
const DEFAULT_TOOLBAR_TINT_COLOR = ()=>_color.Color.android.dynamic.onSurface;
const DEFAULT_TOOLBAR_BACKGROUND_COLOR = ()=>_color.Color.android.dynamic.surfaceContainer;
const DEFAULT_DESTRUCTIVE_COLOR = ()=>_color.Color.android.material.error;

//# sourceMappingURL=defaults.android.js.map
