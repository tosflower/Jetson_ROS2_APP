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
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
let Screens;
try {
    Screens = require('react-native-screens');
} catch (e) {
// Ignore
}
const MaybeScreenContainer = ({ enabled, ...rest })=>{
    if (Screens != null) {
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(Screens.ScreenContainer, {
            enabled: enabled,
            ...rest
        });
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
        ...rest
    });
};
const MaybeScreen = ({ enabled, active, ...rest })=>{
    if (Screens != null) {
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(Screens.Screen, {
            ...rest,
            enabled: enabled,
            activityState: active,
            freezeOnBlur: false
        });
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
        ...rest
    });
};

//# sourceMappingURL=Screens.js.map
