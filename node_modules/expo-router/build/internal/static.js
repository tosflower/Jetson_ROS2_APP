"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    InnerRoot: null,
    getRouteInfoForMatchedRoute: null,
    registerStaticRootComponent: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get InnerRoot () {
        return _html.InnerRoot;
    },
    get getRouteInfoForMatchedRoute () {
        return _getRouteInfoForMatchedRoute.getRouteInfoForMatchedRoute;
    },
    get registerStaticRootComponent () {
        return _registerRootComponent.registerStaticRootComponent;
    }
});
const _html = require("../static/html");
const _registerRootComponent = require("../static/registerRootComponent");
const _getRouteInfoForMatchedRoute = require("../static/getRouteInfoForMatchedRoute");

//# sourceMappingURL=static.js.map
