"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    BottomTabBar: null,
    BottomTabBarHeightCallbackContext: null,
    BottomTabBarHeightContext: null,
    BottomTabView: null,
    SceneStyleInterpolators: null,
    Tabs: null,
    TransitionPresets: null,
    TransitionSpecs: null,
    createJSTabsProps: null,
    createStandardBottomTabNavigator: null,
    default: null,
    useBottomTabBarHeight: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get BottomTabBar () {
        return _TabsClient.BottomTabBar;
    },
    get BottomTabBarHeightCallbackContext () {
        return _TabsClient.BottomTabBarHeightCallbackContext;
    },
    get BottomTabBarHeightContext () {
        return _TabsClient.BottomTabBarHeightContext;
    },
    get BottomTabView () {
        return _TabsClient.BottomTabView;
    },
    get SceneStyleInterpolators () {
        return _SceneStyleInterpolators;
    },
    get Tabs () {
        return _TabsClient.default;
    },
    get TransitionPresets () {
        return _TransitionPresets;
    },
    get TransitionSpecs () {
        return _TransitionSpecs;
    },
    get createJSTabsProps () {
        return _TabsClient.createJSTabsProps;
    },
    get createStandardBottomTabNavigator () {
        return _TabsClient.createStandardBottomTabNavigator;
    },
    get default () {
        return _default;
    },
    get useBottomTabBarHeight () {
        return _TabsClient.useBottomTabBarHeight;
    }
});
const _Protected = require("../views/Protected");
const _Screen = require("../views/Screen");
const _TabsClient = /*#__PURE__*/ _interop_require_wildcard(require("./TabsClient"));
const _SceneStyleInterpolators = /*#__PURE__*/ _interop_require_wildcard(require("../react-navigation/bottom-tabs/TransitionConfigs/SceneStyleInterpolators"));
const _TransitionPresets = /*#__PURE__*/ _interop_require_wildcard(require("../react-navigation/bottom-tabs/TransitionConfigs/TransitionPresets"));
const _TransitionSpecs = /*#__PURE__*/ _interop_require_wildcard(require("../react-navigation/bottom-tabs/TransitionConfigs/TransitionSpecs"));
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
_TabsClient.default.Screen = _Screen.Screen;
_TabsClient.default.Protected = _Protected.Protected;
const _default = _TabsClient.default;

//# sourceMappingURL=Tabs.js.map
