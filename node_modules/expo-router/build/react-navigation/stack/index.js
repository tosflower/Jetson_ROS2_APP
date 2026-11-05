"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    CardAnimationContext: null,
    CardStyleInterpolators: null,
    GestureHandlerRefContext: null,
    Header: null,
    HeaderStyleInterpolators: null,
    StackView: null,
    TransitionPresets: null,
    TransitionSpecs: null,
    unstable_createStandardStackNavigator: null,
    useCardAnimation: null,
    useGestureHandlerRef: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get CardAnimationContext () {
        return _CardAnimationContext.CardAnimationContext;
    },
    get CardStyleInterpolators () {
        return _CardStyleInterpolators;
    },
    get GestureHandlerRefContext () {
        return _GestureHandlerRefContext.GestureHandlerRefContext;
    },
    get Header () {
        return _Header.Header;
    },
    get HeaderStyleInterpolators () {
        return _HeaderStyleInterpolators;
    },
    get StackView () {
        return _StackView.StackView;
    },
    get TransitionPresets () {
        return _TransitionPresets;
    },
    get TransitionSpecs () {
        return _TransitionSpecs;
    },
    get unstable_createStandardStackNavigator () {
        return _createStackNavigator.unstable_createStandardStackNavigator;
    },
    get useCardAnimation () {
        return _useCardAnimation.useCardAnimation;
    },
    get useGestureHandlerRef () {
        return _useGestureHandlerRef.useGestureHandlerRef;
    }
});
const _CardStyleInterpolators = /*#__PURE__*/ _interop_require_wildcard(require("./TransitionConfigs/CardStyleInterpolators"));
const _HeaderStyleInterpolators = /*#__PURE__*/ _interop_require_wildcard(require("./TransitionConfigs/HeaderStyleInterpolators"));
const _TransitionPresets = /*#__PURE__*/ _interop_require_wildcard(require("./TransitionConfigs/TransitionPresets"));
const _TransitionSpecs = /*#__PURE__*/ _interop_require_wildcard(require("./TransitionConfigs/TransitionSpecs"));
const _createStackNavigator = require("./navigators/createStackNavigator");
const _Header = require("./views/Header/Header");
const _StackView = require("./views/Stack/StackView");
const _CardAnimationContext = require("./utils/CardAnimationContext");
const _GestureHandlerRefContext = require("./utils/GestureHandlerRefContext");
const _useCardAnimation = require("./utils/useCardAnimation");
const _useGestureHandlerRef = require("./utils/useGestureHandlerRef");
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
