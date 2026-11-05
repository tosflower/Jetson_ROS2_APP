/**
 * Navigators
 */ /**
 * @deprecated Reserved for libraries that ship a self-contained navigator, which the `Stack` layout
 * cannot express. There is no stable replacement yet, so expect this factory to change or be removed
 * in a future release. App code should use `Stack` from `expo-router`.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    NativeStackView: null,
    createNativeStackNavigator: null,
    useAnimatedHeaderHeight: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get NativeStackView () {
        return _NativeStackView.NativeStackView;
    },
    get createNativeStackNavigator () {
        return _createNativeStackNavigator.createNativeStackNavigator;
    },
    get useAnimatedHeaderHeight () {
        return _useAnimatedHeaderHeight.useAnimatedHeaderHeight;
    }
});
const _createNativeStackNavigator = require("./navigators/createNativeStackNavigator");
const _NativeStackView = require("./views/NativeStackView");
const _useAnimatedHeaderHeight = require("./utils/useAnimatedHeaderHeight");

//# sourceMappingURL=index.js.map
