'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    Group: null,
    Screen: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get Group () {
        return Group;
    },
    get Screen () {
        return Screen;
    }
});
const _native = require("../react-navigation/native");
const { Screen, Group } = (0, _native.createNavigatorFactory)({})();

//# sourceMappingURL=navigation.js.map
