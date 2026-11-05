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
    TransitionPresets: null,
    TransitionSpecs: null,
    createStandardBottomTabNavigator: null,
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
        return _BottomTabBar.BottomTabBar;
    },
    get BottomTabBarHeightCallbackContext () {
        return _BottomTabBarHeightCallbackContext.BottomTabBarHeightCallbackContext;
    },
    get BottomTabBarHeightContext () {
        return _BottomTabBarHeightContext.BottomTabBarHeightContext;
    },
    get BottomTabView () {
        return _BottomTabView.BottomTabView;
    },
    get SceneStyleInterpolators () {
        return _SceneStyleInterpolators;
    },
    get TransitionPresets () {
        return _TransitionPresets;
    },
    get TransitionSpecs () {
        return _TransitionSpecs;
    },
    get createStandardBottomTabNavigator () {
        return _createBottomTabNavigator.createStandardBottomTabNavigator;
    },
    get useBottomTabBarHeight () {
        return _useBottomTabBarHeight.useBottomTabBarHeight;
    }
});
const _SceneStyleInterpolators = /*#__PURE__*/ _interop_require_wildcard(require("./TransitionConfigs/SceneStyleInterpolators"));
const _TransitionPresets = /*#__PURE__*/ _interop_require_wildcard(require("./TransitionConfigs/TransitionPresets"));
const _TransitionSpecs = /*#__PURE__*/ _interop_require_wildcard(require("./TransitionConfigs/TransitionSpecs"));
const _BottomTabBar = require("./views/BottomTabBar");
const _BottomTabView = require("./views/BottomTabView");
const _BottomTabBarHeightCallbackContext = require("./utils/BottomTabBarHeightCallbackContext");
const _BottomTabBarHeightContext = require("./utils/BottomTabBarHeightContext");
const _useBottomTabBarHeight = require("./utils/useBottomTabBarHeight");
const _createBottomTabNavigator = require("./navigators/createBottomTabNavigator");
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

//# sourceMappingURL=index.js.map
