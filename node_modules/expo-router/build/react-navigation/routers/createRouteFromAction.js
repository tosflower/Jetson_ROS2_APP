"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createRouteFromAction", {
    enumerable: true,
    get: function() {
        return createRouteFromAction;
    }
});
function createRouteFromAction({ action, key }) {
    const { name, params } = action.payload;
    return {
        key,
        name,
        params
    };
}

//# sourceMappingURL=createRouteFromAction.js.map
