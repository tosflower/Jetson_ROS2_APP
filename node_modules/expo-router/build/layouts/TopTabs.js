"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    MaterialTopTabBar: null,
    MaterialTopTabView: null,
    TopTabs: null,
    createJSTopTabsProps: null,
    createStandardMaterialTopTabNavigator: null,
    default: null,
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
        return _TopTabsClient.MaterialTopTabBar;
    },
    get MaterialTopTabView () {
        return _TopTabsClient.MaterialTopTabView;
    },
    get TopTabs () {
        return _TopTabsClient.default;
    },
    get createJSTopTabsProps () {
        return _TopTabsClient.createJSTopTabsProps;
    },
    get createStandardMaterialTopTabNavigator () {
        return _TopTabsClient.createStandardMaterialTopTabNavigator;
    },
    get default () {
        return _default;
    },
    get useTabAnimation () {
        return _TopTabsClient.useTabAnimation;
    }
});
const _Protected = require("../views/Protected");
const _Screen = require("../views/Screen");
const _TopTabsClient = /*#__PURE__*/ _interop_require_wildcard(require("./TopTabsClient"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
_TopTabsClient.default.Screen = _Screen.Screen;
_TopTabsClient.default.Protected = _Protected.Protected;
const _default = _TopTabsClient.default;

//# sourceMappingURL=TopTabs.js.map
