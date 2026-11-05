"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    MaybeScreen: null,
    MaybeScreenContainer: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get MaybeScreen () {
        return MaybeScreen;
    },
    get MaybeScreenContainer () {
        return MaybeScreenContainer;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
function _react() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
const _elements = require("../../elements");
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
let Screens;
try {
    Screens = require('react-native-screens');
} catch (e) {
// Ignore
}
const MaybeScreenContainer = ({ enabled, ...rest })=>{
    if (Screens?.screensEnabled?.()) {
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(Screens.ScreenContainer, {
            enabled: enabled,
            ...rest
        });
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
        ...rest
    });
};
function MaybeScreen({ visible, children, ...rest }) {
    if (Screens?.screensEnabled?.()) {
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(Screens.Screen, {
            ...rest,
            activityState: visible ? 2 : 0,
            freezeOnBlur: false,
            children: children
        });
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_elements.ResourceSavingView, {
        visible: visible,
        ...rest,
        children: children
    });
}

//# sourceMappingURL=ScreenFallback.js.map
