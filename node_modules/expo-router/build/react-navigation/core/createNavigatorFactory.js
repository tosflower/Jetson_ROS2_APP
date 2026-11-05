"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createNavigatorFactory", {
    enumerable: true,
    get: function() {
        return createNavigatorFactory;
    }
});
const _Group = require("./Group");
const _Screen = require("./Screen");
function createNavigatorFactory(Navigator) {
    function createNavigator() {
        return {
            Navigator,
            Screen: _Screen.Screen,
            Group: _Group.Group
        };
    }
    return createNavigator;
}

//# sourceMappingURL=createNavigatorFactory.js.map
