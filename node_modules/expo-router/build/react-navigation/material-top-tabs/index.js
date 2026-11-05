"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    MaterialTopTabBar: null,
    MaterialTopTabView: null,
    createStandardMaterialTopTabNavigator: null,
    useTabAnimation: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get MaterialTopTabBar () {
        return _MaterialTopTabBar.MaterialTopTabBar;
    },
    get MaterialTopTabView () {
        return _MaterialTopTabView.MaterialTopTabView;
    },
    get createStandardMaterialTopTabNavigator () {
        return _createMaterialTopTabNavigator.createStandardMaterialTopTabNavigator;
    },
    get useTabAnimation () {
        return _useTabAnimation.useTabAnimation;
    }
});
const _MaterialTopTabView = require("./views/MaterialTopTabView");
const _createMaterialTopTabNavigator = require("./navigators/createMaterialTopTabNavigator");
const _MaterialTopTabBar = require("./views/MaterialTopTabBar");
const _useTabAnimation = require("./utils/useTabAnimation");

//# sourceMappingURL=index.js.map
